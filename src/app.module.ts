import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './shakti.entity';
import { Address } from './Address.entity';
import { Assignment } from './assignment.entity';
import { AssignmentController } from './Assignment.controller';
import { AddressController } from './Address.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([Student, Address, Assignment]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }, 
    }),
  ],
  controllers: [AppController, AssignmentController, AddressController],
  providers: [AppService, JwtStrategy, RolesGuard, JwtAuthGuard],
})
export class AppModule {}