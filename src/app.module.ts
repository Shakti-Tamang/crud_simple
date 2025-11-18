import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './shakti.entity';
import { configDotenv } from 'dotenv';
import { Address } from './Address.entity';
import { Assignment } from './assignment.entity';
import { AssignmentController } from './Assignment.controller';
import { AddressController } from './Address.controller';

configDotenv()
@Module({
  imports: [
TypeOrmModule.forRoot({
type:'postgres',
host:process.env.DB_HOST,
port:Number(process.env.DB_PORT),
username:process.env.DB_USERNAME,
password:process.env.DB_PASSWORD,
database:process.env.DB_NAME,
entities:[Student,Address,Assignment],
synchronize:true
}),

TypeOrmModule.forFeature([Student,Address,Assignment])

  ],
  controllers: [AppController,AssignmentController,AddressController],
  providers: [AppService],
})
export class AppModule {}
