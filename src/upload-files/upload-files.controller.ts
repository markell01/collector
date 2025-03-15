import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { join } from 'path';
import * as iconv from 'iconv-lite';

@Controller('upload')
export class UploadFilesController {
    constructor(private readonly uploadFiles: UploadFilesService){}

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8');
                cb(null, uniqueSuffix);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file)
        await this.uploadFiles.addDataToDb(file.filename)
        return { filename: file.filename, path: `/uploads/${file.filename}` };
    }

    @Get()
    async getFiles() {
        const files = await this.uploadFiles.getFiles()
        return files
    }

    @Post('update-level')
    async updateLevel(@Body() data: {uid: string, level: number}[]) {
        await this.uploadFiles.changeLevel(data)
    }

    @Delete('delete-file/:uid')
    async deleteFile(@Param('uid') uid: string) {
        const result = await this.uploadFiles.deleteFile(uid)
        return result
    }

    @Get('download/:uid')
    async download(@Param('uid') filename: string, @Res() res: Response) {
        console.log(filename)
        const filePath = join(__dirname, '..', '..', 'uploads', filename);
        return res.sendFile(filePath);
    }

    @Post('choose-houses')
    async chooseHouses(@Body() data: {id: string, houses_id: string[] }) {
        const result = await this.uploadFiles.chooseHouses(data)
        return result
    }
}