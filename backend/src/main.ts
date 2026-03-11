import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { APP_PREFIX, BOOTSTRAP_CONTEXT, DEFAULTS, ENV_KEYS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>(ENV_KEYS.PORT) ?? DEFAULTS.PORT;
  const corsOrigin = configService.get<string>(ENV_KEYS.CORS_ORIGIN) ?? DEFAULTS.CORS_ORIGIN;

  app.setGlobalPrefix(APP_PREFIX);

  app.enableCors({ origin: corsOrigin });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transform: true enables default values on DTO fields (e.g. page=1, limit=10)
      // all numeric fields use explicit @Type(() => Number) — enableImplicitConversion is intentionally omitted
      transform: true,
    }),
  );

  const logger = new Logger(BOOTSTRAP_CONTEXT);
  await app.listen(port);
  logger.log(`Backend running on http://localhost:${port}`);
}

bootstrap().catch((err: unknown) => {
  new Logger(BOOTSTRAP_CONTEXT).error('Failed to start', err);
  process.exit(1);
});
