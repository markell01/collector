import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
    @IsNotEmpty()
    @IsInt()
    id: number

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    url: string
}