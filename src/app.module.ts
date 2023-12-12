import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChecklistModule } from './checklist/checklist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CheckListEntity } from './checklist/entities/checklist.entity';
import { UserCheckListStatusEntity } from './usercheckliststatus/entities/usercheckliststatus.entity';
import { UserCheckListStatusModule } from './usercheckliststatus/userchekcliststatus.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(process.cwd(), 'src/user/graphql/user.schema.graphql'),
      autoSchemaFile: true,
      
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, CheckListEntity, UserCheckListStatusEntity],
      synchronize: true,
    }),
    UserModule, ChecklistModule, UserCheckListStatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
