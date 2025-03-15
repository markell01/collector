import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AbonsService } from './abons.service';
import axios from 'axios';
import { HouseInfo } from './interfaces/interfaces';

@Controller('abons')
export class AbonsController {
    constructor(private readonly abonsService: AbonsService){}

    @Get('intercom-and-tv/:id')
    async intercomAndTv(@Param() id: { id: string }) {
        const result = await this.abonsService.takeFromTvInter(id.id)
        return result
    }

    @Get('get-all')
    async getAbons(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('search') search?: string) {
        const result = await this.abonsService.getAll(page, pageSize, search)
        return result
    }

    @Post('generate-doc')
    async generate(@Body() data: {id: number, type: number}) {
        const result = await this.abonsService.generate(data.id, data.type)
        return result
    }

    @Post('abon-info')
    async abon(@Body() data: { abon_id: number, abon_type: string }) {
        const result = await this.abonsService.abonInfo(data.abon_id, data.abon_type);
        return result
    }

    @Get('check-status/:id')
    async checkStatus(@Param('id') id: string) {
        console.log(id)
        const result = await axios.get(`http://${process.env.BACKEND_PRINTER}/api/check-status/${id}`)
        return result.data
    }

    @Post('/insert-doc-data')
    async isReady(@Body() data: { abon_id: number, abon_type: string, file_name: string, id: number }) {
        const result = await this.abonsService.insertData(data)
        return result
    }

    @Post('check-doc')
    async checkDoc(@Body() data: { abon_id: number, abon_type: string }) {
        const result = await this.abonsService.searchData(data.abon_id, data.abon_type)
        return result
    }

    @Post('check-doc-house')
    async checkDocHouse(@Body() data: HouseInfo[]) {
        console.log (data);
        const result = await this.abonsService.searchHouseData(data)
        return result
    }
}