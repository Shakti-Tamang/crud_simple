import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './Address.entity';
import { Assignment } from './assignment.entity';
import { Role } from './role.enum';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ name: 'name', example: 'Shakti Tamang' })
  @Column()
  name!: string;

  @ApiProperty({ name: 'email' })
  @Column({ nullable: true })
  email!: string;

  @ApiProperty({ name: 'password' })
  @Column({ nullable: true })
  password!: string;

    @ApiProperty({ name: '  nickname' })
  @Column({ nullable: true })
  usernickname!: string;

  @ApiProperty({ name: 'role' })
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role!: Role;

  @ApiProperty({ name: 'caste', required: false })
  @Column({ nullable: true })
  caste!: string;

  @OneToOne(() => Address, (address) => address.student, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  address!: Address;

  @OneToMany(() => Assignment, (assignment) => assignment.student, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  assignment!: Assignment[];
}
