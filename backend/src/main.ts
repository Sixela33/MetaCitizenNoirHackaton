import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('HTTP');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Log every request
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    res.on('finish', () => {
      const { statusCode } = res;
      logger.log(
        `${method} ${originalUrl} ${statusCode} - ${userAgent} \n ${JSON.stringify(req.body)}`
      );
    });
    
    next();
  });
  

  await app.listen(3000);
}
bootstrap();
