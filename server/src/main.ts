import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { HttpExceptionFilter } from './logger/exeption.logger.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true });
  app.use(cookieParser());

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT, () => console.log('PORT:', process.env.PORT));
}
bootstrap();
