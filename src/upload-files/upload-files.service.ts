import { Injectable } from '@nestjs/common';
import { prisma } from 'src/users/auth/utils/prisma';
import * as fs from 'fs/promises'

@Injectable()
export class UploadFilesService {

    async addDataToDb(originalname: string) {
        const files = await prisma.templates.findMany()
        if (files.length === 0) {
            const result = await prisma.templates.create({
                data: {
                    name: originalname,
                    level: 1
                }
            })
        } else {
            await prisma.templates.create({
                data: {
                    name: originalname,
                    level: files[files.length - 1].level + 1
                }
            })
        }
    }

    async changeLevel(data: {uid: string, level: number}[]) {
        await prisma.$transaction(
            data.map(({ uid, level }) =>
                prisma.templates.update({
                    where: { uid: uid },
                    data: { level },
                })
            )
        );
    }

    async getFiles() {
        const files = await prisma.templates.findMany();
        const houses = await prisma.templatesHouse.findMany();

        const housesMap = houses.reduce((acc, house) => {
            if (!acc[house.template_id]) {
                acc[house.template_id] = [];
            }
            acc[house.template_id].push(house.house_id);
            return acc;
        }, {} as Record<string, string[]>);
        const result = files.map(file => ({
            ...file,
            houses: housesMap[file.uid] || [],
        }));
        console.log(result)
    
        return result;
    }

    async deleteFile(uid: string) {
        const result = await prisma.templates.delete({
            where: { uid }
        })
        if (!result) {
            return null
        }
        const delete_file = result.name
        const files = await fs.readdir('./uploads')
        for (let file of files) {
            if (file.includes(delete_file)) {
                await fs.unlink(`./uploads/${file}`)
            }
        }
    }

    async chooseHouses(data: {id: string, houses_id: string[] }) {
        const file = await prisma.templates.findFirst({
            where: { uid: data.id }
        })
        await prisma.templatesHouse.deleteMany({
            where: { template_id: file.uid }
        })
        const result = await prisma.templatesHouse.createMany({
            data: data.houses_id.map((house_id ) => ({
                template_id: file.uid,
                house_id
            })),
        })
        return result
    }
}
