import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { pool, tvpool } from '../utils/db.conn';
import { prisma } from 'src/users/auth/utils/prisma';
import axios from 'axios';
import { AbonInfo, HouseInfo } from './interfaces/interfaces';
import { join } from 'path';

@Injectable()
export class AbonsService {

    async takeFromTvInter(id: string) {
        const results = await prisma.house.findFirst({
            where: { id },
        })
        const name = await prisma.clasters.findFirst({
            where: { id: results.claster_id }
        })
        console.log(results)
        if (results.intercom_id == null) {
            const [tv] = await tvpool.query(`
                select
                    *
                from
                    users u
                join account_tariff_link atl ON
                    atl.account_id = u.id
                where
                    u.house_id = ?
                    AND u.login NOT REGEXP '^z|test|s'
	                AND u.full_name NOT REGEXP '^@'
	                AND u.login != '0000000'
                    and u.is_deleted = 0
                    and atl.is_deleted = 0
            `, [results.tv_id])
            return { tv, id_tv: results.tv_id, claster_id: results.claster_id, name: name.name }
        } else if (results.tv_id == null) {
            const [intercom] = await pool.query(`
                select
                    *
                from
                    users u
                join account_tariff_link atl ON
                    atl.account_id = u.id
                where
                    u.house_id = ?
                    AND u.login NOT REGEXP '^z|test|s'
	                AND u.full_name NOT REGEXP '^@'
	                AND u.login != '0000000'
                    and u.is_deleted = 0
                    and atl.is_deleted = 0
                `, [results.intercom_id])
            return { intercom, id_intercom: results.intercom_id, claster_id: results.claster_id, name: name.name } 
        } else {
            const [intercom] = await pool.query(`
                select
                    *
                from
                    users u
                join account_tariff_link atl ON
                    atl.account_id = u.id
                where
                    u.house_id = ?
                    AND u.login NOT REGEXP '^z|test|s'
	                AND u.full_name NOT REGEXP '^@'
	                AND u.login != '0000000'
                    and u.is_deleted = 0
                    and atl.is_deleted = 0
                `, [results.intercom_id])
            const [tv] = await tvpool.query(`
                select
                    *
                from
                    users u
                join account_tariff_link atl ON
                    atl.account_id = u.id
                where
                    u.house_id = ?
                    AND u.login NOT REGEXP '^z|test|s'
	                AND u.full_name NOT REGEXP '^@'
	                AND u.login != '0000000'
                    and u.is_deleted = 0
                    and atl.is_deleted = 0
                `, [results.tv_id])
            return { intercom, tv, id_tv: results.tv_id, id_intercom: results.intercom_id, claster_id: results.claster_id, name: name.name } 
        }
    }

    private async GenerateHouseSelectSQL (utm_type:number) {
        const houses = await prisma.house.findMany()
        let sql = "(";
        for ( let house of houses )
            sql += ` OR u.house_id=${(utm_type==0)? house.tv_id : house.intercom_id}`
        sql += ')'
        return sql.replace('( OR ', '(')
    }

    async getAbonCount (substr: string) {
        let sql_tv = "SELECT count (*) as col FROM users u WHERE is_deleted=0 AND " + await this.GenerateHouseSelectSQL(0) + `${substr && `AND u.full_name LIKE '%${substr}%' `}`;
        let sql_intercom = "SELECT count (*) as col FROM users u WHERE is_deleted=0 AND " + await this.GenerateHouseSelectSQL(1) + `${substr && `AND u.full_name LIKE '%${substr}%' `}`;
        const [tv] = await tvpool.query(sql_tv);
        const [intercom] = await pool.query(sql_intercom);
        return (tv[0].col >= intercom[0].col)? tv[0].col : intercom[0].col
    }

    async getAll(page = 1, pageSize = 10, substr: string = '') {
        const limit = Math.floor(pageSize/2);
        const total = await this.getAbonCount(substr)
        const offset = (page - 1) * limit;
        
        const [intercom] = await pool.query(`
            SELECT
                u.basic_account,
                u.full_name,
                u.actual_address,
                a.id as account_id
            FROM
                users u
            JOIN accounts a ON
                a.id = u.basic_account
            AND ${ await this.GenerateHouseSelectSQL(1)}
            WHERE
                a.is_deleted = 0
                AND u.login NOT REGEXP '^z|test|s'
	            AND u.full_name NOT REGEXP '^@'
	            AND u.login != '0000000'
                and u.is_deleted = 0 
                ${substr && `AND u.full_name LIKE '%${substr}%' `}
            LIMIT ${limit} OFFSET ${offset}`)

        const [tv] = await tvpool.query(`
            SELECT
                u.basic_account,
                u.full_name,
                u.actual_address,
                a.id as account_id
            FROM
                users u
            JOIN accounts a ON
                u.basic_account = a.id
            AND ${ await this.GenerateHouseSelectSQL(0) }
            WHERE
                a.is_deleted = 0 
                and u.is_deleted = 0 
                AND u.login NOT REGEXP '^z|test|s'
	            AND u.full_name NOT REGEXP '^@'
	            AND u.login != '0000000'
                ${substr && `AND u.full_name LIKE '%${substr}%' `}
            LIMIT ${limit} OFFSET ${offset}`)
            
        return {intercom, tv, total, page, pageSize}
    }

    async getTemplate(houseID: number, serviceType:number) {
        if (!houseID)
            throw new HttpException ('UID дома пуста - капуста!', HttpStatus.NOT_FOUND);
        const { id } = await prisma.house.findFirst ({
            where: (serviceType == 0)? {
                intercom_id: houseID
            } : {
                tv_id: houseID
            }
        });
        const template = await prisma.templates.findFirst({
            where: {
                templatesHouse: {
                    some: {
                        house_id: id
                    }
                }
            },
            orderBy: {
                level: 'asc',
            }
        });
        console.log ('Это template', template);
        if (!template)
            return undefined;
        return template.uid;
    }

    async generate(id: number, type: number) {
        const result = await axios.post(`http://${process.env.BACKEND_ABONS}/${(type == 0)? 'generateAbonIntercom' : 'generateAbonTv'}`, {number: id})
        let sendArrayDatas = []
        for (let abonentData of result.data) {
            const uuidTemplate = await this.getTemplate(result.data[0]['ID Дома'], type);
            abonentData.template = uuidTemplate;
            sendArrayDatas.push (abonentData);
            console.log ('Абонент дата: ', abonentData);
        }
        const dataToPdf = await axios.post(`http://${process.env.BACKEND_PRINTER}/api/convert-odt`, sendArrayDatas)
        return dataToPdf.data;
    }

    async abonInfo(abon_id: number, abon_type: string) {
        console.log(abon_id, abon_type)
        if (abon_type === 'tv') {
            const [house_id] = await tvpool.query(`select house_id from users where basic_account = ${abon_id}`)
            const house_abon = await prisma.house.findFirst({
                where: {
                    tv_id: house_id[0].house_id
                }
            })
            const abon_info = await axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonTv`, { number: abon_id })
            return { abon: abon_info.data, house_id, house_abon }
        }
        if (abon_type === 'intercom') {
            const [house_id] = await pool.query(`select house_id from users where basic_account = ${abon_id}`)
            const house_abon = await prisma.house.findFirst({
                where: {
                    intercom_id: house_id[0].house_id
                }
            })
            console.log(house_id)
            const abon_info = await axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonIntercom`, { number: abon_id })
            return { abon: abon_info.data, house_id, house_abon }
        }
    }

    async insertData(data: { abon_id: number, abon_type: string, file_name: string, id: number } ) {
        console.log(data)
        const { claster_id } = await prisma.house.findFirst({
            where: {
                OR: [
                    { intercom_id: data.id },
                    { tv_id: data.id }
                ]
            }
        })
        console.log(claster_id)
        const result = await prisma.docs.create({
            data: {
                abon_id: data.abon_id,
                abon_type: data.abon_type,
                file_name: data.file_name,
                claster_id
            }
        })
        const page = await axios.get(`http://${process.env.BACKEND_PRINTER}/api/page/${result.file_name}`)
        return {url: page.config.url, created_at: result.createdAt}
    }

    async searchData(abon_id: number, abon_type: string) {
        console.log(abon_id, abon_type)
        const result = await prisma.docs.findFirst({
            where: {
                abon_id,
                abon_type
            },
            orderBy: [
                { createdAt: 'desc' }
            ]
        })
        if(result === null) 
            return null

        const page = await axios.get(`http://${process.env.BACKEND_PRINTER}/api/page/${result.file_name}`)
        return { abon_id: result.abon_id, abon_type: result.abon_type, file_name: page.config.url, created_at: result.createdAt }
    }

    async searchHouseData(data: HouseInfo[]) {
        let arr = []
        for (let el of data) {
            const [tv, intercom] = await prisma.$transaction([
                prisma.docs.findFirst({
                    where: {
                        abon_id: el['idTV'],
                        abon_type: 'tv'
                    },
                    orderBy: [
                        { createdAt: 'desc' }
                    ]
                }),
                prisma.docs.findFirst({
                    where: {
                        abon_id: el['idIntercom'],
                        abon_type: 'intercom'
                    },
                    orderBy: [
                        { createdAt: 'desc' }
                    ]
                })
            ])
            if (el.hasTv && tv)
                arr.push({ auto: arr.length, full_name: el.full_name, apartment:el.flat_number, abonent_id: tv.abon_id, abon_type: tv.abon_type, file_name: `http://${process.env.BACKEND_PRINTER}/api/page/${tv.file_name}` })

            if (el.hasIntercom && intercom)
                arr.push ({ auto: arr.length, full_name: el.full_name, apartment:el.flat_number, abonent_id: intercom.abon_id, abon_type: intercom.abon_type, file_name: `http://${process.env.BACKEND_PRINTER}/api/page/${intercom.file_name}` })
        }
        return arr
    }
}