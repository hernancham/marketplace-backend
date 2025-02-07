import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {
    // Configuramos Cloudinary con las credenciales de las variables de entorno
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads', // Opcional: carpeta en Cloudinary donde se almacenarán las imágenes
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        // Enviamos el buffer del archivo al stream de Cloudinary
        uploadStream.end(file.buffer);
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al subir la imagen a Cloudinary',
      );
    }
  }
}
