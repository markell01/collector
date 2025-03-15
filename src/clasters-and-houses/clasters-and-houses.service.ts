import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { prisma } from 'src/users/auth/utils/prisma';
import { AbonInfo } from './abons/interfaces/interfaces';
import { pool, tvpool } from './utils/db.conn';
import { resourceUsage } from 'process';

@Injectable()
export class ClastersService {
    async getClasters() {
        const result = await prisma.clasters.findMany();
        return result
    }

    async getHousesFromCluster(id: string) {
        const claster_id = id
        const result = await prisma.house.findMany({
            where: { 
                claster_id,
                OR: [
                    { intercom_id: { not: null } },
                    { tv_id: { not: null } }
                ]
            }
        })
        return result
    }

    async getHouses() {
        return await prisma.house.findMany()
    }

    async search(substr: string) {
        const result = await prisma.clasters.findMany();
        substr = substr.toLowerCase()
        const arr = []
        result.forEach(el => {
            if(el.name.toLowerCase().includes(substr)) {
                arr.push(el)
            }
        })
        return arr;
    }

    async searchHouses(substr: string) {
        const result = await prisma.house.findMany();
        substr = substr.toLowerCase();
        const arr = [];
        result.forEach(el => {
            if(el.short_name.toLocaleLowerCase().includes(substr)) {
                arr.push(el)
            }
        })
        return arr;
    }

    async getTemplate(houseID: number, serviceType:string) {
        if (!houseID)
            throw new HttpException ('UID дома пуста - капуста!', HttpStatus.NOT_FOUND);
        const { id } = await prisma.house.findFirst ({
            where: (serviceType != 'tv')? {
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
        if (!template)
            return undefined;
            //throw new HttpException ('Шаблон для данного дома не определён!', HttpStatus.NOT_FOUND);
        return template.uid;
    }

    async printHouse(intercom_id: number | null, tv_id: number | null) {
        try {
            const requests = [];
            if (tv_id !== null)
                requests.push(axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonsFromHouseTv`, { number: tv_id }));
            if (intercom_id !== null) 
                requests.push(axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonsFromHouseIntercom`, { number: intercom_id }));
            console.log('gugu')
            const results = await Promise.all(requests);
            const abons = results.flatMap(res => res.data);
            console.log('gugugaga',abons)
            let sendArrayDatas = []
            for (let abonentData of abons) {
                console.log(abonentData)
                const uuidTemplate = await this.getTemplate(abonentData['ID Дома'], abonentData['Услуга']);
                abonentData.template = uuidTemplate;
                sendArrayDatas.push (abonentData);
            }
            const print = await axios.post(`http://${process.env.BACKEND_PRINTER}/api/convert-odt`, sendArrayDatas);
            return { uid: print.data.uid, sendArrayDatas };
        } catch(err) {
            console.log(err)
        }
    }

    async checkStatus(uid: string) {
        console.log(uid)
        const result = await axios.get(`http://${process.env.BACKEND_PRINTER}/api/check-status/${uid}`)
        return result.data
    }

    async insertData(uid: string, abons: AbonInfo[], claster_id: string) {
        console.log(uid, abons, claster_id)
        const data = abons.map(item => ({
            abon_id: item['Номер договора'],
            abon_type: item['Услуга'],
            file_name: `${item['Номер договора']}_${uid}`,
            claster_id
        }))
        const result = await prisma.docs.createMany({
            data: data
        })
        return result
    }

    async getAbons(id: string) {
        const houses = await prisma.house.findMany({ where: { claster_id: id } });
    
        const requests = houses.flatMap(({ intercom_id, tv_id }) => {
            const queries = [];
            if (intercom_id) {
                queries.push(pool.query(`
                    SELECT basic_account, full_name, flat_number, actual_address FROM users u
                    JOIN account_tariff_link atl ON atl.account_id = u.id
                    WHERE u.house_id = ?
                        AND u.login NOT REGEXP '^z|test|s'
                        AND u.full_name NOT REGEXP '^@'
                        AND u.login != '0000000'
                        AND u.is_deleted = 0
                        AND atl.is_deleted = 0
                `, [intercom_id]));
            }
            if (tv_id) {
                queries.push(tvpool.query(`
                    SELECT basic_account, full_name, flat_number, actual_address FROM users u
                    JOIN account_tariff_link atl ON atl.account_id = u.id
                    WHERE u.house_id = ?
                        AND u.login NOT REGEXP '^z|test|s'
                        AND u.full_name NOT REGEXP '^@'
                        AND u.login != '0000000'
                        AND u.is_deleted = 0
                        AND atl.is_deleted = 0
                `, [tv_id]));
            }
            return queries;
        });
        const results = await Promise.all(requests);
    
        const abons = results.flatMap(([rows]) => rows);
        const arr = []
        
        const abonsId = abons.map(a => a.basic_account)

        const result = await prisma.docs.findMany({
            where: { abon_id: { in: abonsId } },
            orderBy: { createdAt: 'desc' },
            distinct: ['abon_id']
        })
        const fileNames = result.map(item => item.file_name)
        return fileNames;
    }

    async checkDocs(id: string) {
        const houses = await prisma.house.findMany({ where: { claster_id: id } });
    
        const requests = houses.flatMap(({ intercom_id, tv_id }) => {
            const queries = [];
            if (intercom_id) {
                queries.push(pool.query(`
                    SELECT basic_account FROM users u
                    JOIN account_tariff_link atl ON atl.account_id = u.id
                    WHERE u.house_id = ?
                        AND u.login NOT REGEXP '^z|test|s'
                        AND u.full_name NOT REGEXP '^@'
                        AND u.login != '0000000'
                        AND u.is_deleted = 0
                        AND atl.is_deleted = 0
                `, [intercom_id]));
            }
            if (tv_id) {
                queries.push(tvpool.query(`
                    SELECT basic_account FROM users u
                    JOIN account_tariff_link atl ON atl.account_id = u.id
                    WHERE u.house_id = ?
                        AND u.login NOT REGEXP '^z|test|s'
                        AND u.full_name NOT REGEXP '^@'
                        AND u.login != '0000000'
                        AND u.is_deleted = 0
                        AND atl.is_deleted = 0
                `, [tv_id]));
            }
            return queries;
        });
        const results = await Promise.all(requests);
    
        const abons = results.flatMap(([rows]) => rows);
        console.log(abons)
  
        
        for (let el of abons) {
            const abon_docs = await prisma.docs.findFirst({
                where: { abon_id: el.basic_account },
                orderBy: { createdAt: 'desc' }
            })
            if (!abon_docs) {
                return null
            }
        }
        return true
    }
    

    async printClaster(uid: string) {
        const result = await prisma.house.findMany({
            where: { claster_id: uid }
        })
        const print = await this.clasters(result)
        return print
    }

    async clasters(result) {
        const requests = [];
        for (let el of result) {
            if (el.tv_id !== null) {
                requests.push(axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonsFromHouseTv`, { number: el.tv_id }));
            }
            if (el.intercom_id !== null) {
                requests.push(axios.post(`http://${process.env.BACKEND_ABONS}/generateAbonsFromHouseIntercom`, { number: el.intercom_id }));
            } 
        };
        const results = await Promise.all(requests);
        const abons = results.flatMap(res => res.data);
        let sendArrayDatas = []
        for (let abonentData of abons) {
            console.log(abonentData)
            const uuidTemplate = await this.getTemplate(abonentData['ID Дома'], abonentData['Услуга']);
            abonentData.template = uuidTemplate;
            sendArrayDatas.push (abonentData);
        }
        const print = await axios.post('http://${process.env.BACKEND_PRINTER}/api/convert-odt', sendArrayDatas);
        return { uid: print.data.uid, sendArrayDatas };
    }

    async searchDocs(id: string) {
        const houses = await prisma.house.findMany({
            where: { claster_id: id }
        })
    }
}