import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';

const { env } = process;

const devOptions: TypeOrmModuleOptions = {
  type: env.DEV_DB_TYPE as any,
  host: env.DEV_DB_HOST,
  port: Number(env.DEV_DB_PORT),
  username: env.DEV_DB_USERNAME,
  password: env.DEV_DB_PASSWORD,
  database: env.DEV_DB_DATABASE,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true
  // migrations: ['migration/*.ts'],
  // cli: {
  //   migrationsDir: 'migration'
  // }
};

const prodOptions: TypeOrmModuleOptions = {
  type: env.DB_TYPE as any,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true
  // migrations: ['migration/*.ts'],
  // cli: {
  //   migrationsDir: 'migration'
  // }
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(env.MODE === 'development' ? devOptions : prodOptions),
    AuthModule,
    UserModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
