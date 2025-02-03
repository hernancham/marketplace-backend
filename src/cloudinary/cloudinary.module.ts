import { Module, Global } from '@nestjs/common';
import { CloudinaryConfig } from '../config/cloudinary.config';

@Global()
@Module({
  providers: [CloudinaryConfig],
  exports: [CloudinaryConfig],
})
export class CloudinaryModule {}

