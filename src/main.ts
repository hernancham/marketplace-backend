import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar prefijo global para las rutas de la API
  app.setGlobalPrefix("api/v1");

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  
  // Habilitar CORS de forma abierta
  app.enableCors({
    origin: '*', // Permitir cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Habilita autenticación con tokens si es necesario
  });

  // Iniciar servidor en el puerto especificado
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
