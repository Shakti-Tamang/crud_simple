import 'reflect-metadata';
import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { Student } from './shakti.entity';
import { Address } from './Address.entity';
import { Assignment } from './assignment.entity';

configDotenv();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Student, Address, Assignment],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
