/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ComentarioDto {

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsUUID()
    recetaId: string; 
}
