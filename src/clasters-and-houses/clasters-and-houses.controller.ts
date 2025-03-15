import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClastersService } from './clasters-and-houses.service';
import { getCur, getId } from './dto/clastres.dto';
import { AbonInfo } from './abons/interfaces/interfaces';
import { resourceLimits } from 'worker_threads';

@Controller('clasters')
@UseGuards()
export class ClastersController {
    constructor(private readonly clastersService: ClastersService){}

    @Get('get-all')
    async getAll() {
        const result = await this.clastersService.getClasters();
        if (!result) {
            console.log('((')
        }
        return result
    }

    @Post('get-current')
    async Houses(@Body() data: {id: string}): Promise<boolean | getCur[]> {
        const result = await this.clastersService.getHousesFromCluster(data.id);
        if (!result) {
            return false
        }
        return result
    }

    @Post('search-claster')
    async search(@Body() str: { str: string}) {
        const result = await this.clastersService.search(str.str)
        if (!result) {
            return false
        }
        return result
    }

    @Post('search-house')
    async searchHouse(@Body() str: { str: string }) {
        const result = await this.clastersService.searchHouses(str.str)
        if (!result) {
            return false
        }
        return result
    }

    @Post('print-houses')
    async printHouse(@Body() data: { intercom_id: number | null, tv_id: number | null }) {
        console.log('Получен запрос на печать домов:', data);
        const result = await this.clastersService.printHouse(data.intercom_id, data.tv_id)
        return result
    }

    @Get('check-status/:id')
    async checkStatus(@Param('id') uid: string) {
        const result = await this.clastersService.checkStatus(uid)
        return result
    }

    @Post('insert-data')
    async insertData(@Body() data: { uid: string, abons: AbonInfo[], claster_id: string}) {
        console.log(data)
        const result = await this.clastersService.insertData(data.uid, data.abons, data.claster_id)
        return result
    }

    @Get('get-houses')
    async getHouses() {
        const result = await this.clastersService.getHouses()
        return result
    }


    @Get('get-abons/:id')
    async getDocs(@Param('id') id: string) {
        const result = await this.clastersService.getAbons(id)
        return result
    }

    @Get('print-claster/:id')
    async printClaster(@Param('id') uid: string) {
        console.log(uid)
        const result = await this.clastersService.printClaster(uid)
        return result
    }

    @Get('check-docs/:id')
    async checkDoc(@Param('id') id: string) {
        const result = await this.clastersService.checkDocs(id)
        return result
    }

    @Get('get-abons/:id')
    async getAbons(@Param('id') id: string) {
        const result = await this.clastersService.getAbons(id)
        return result
    }
}
