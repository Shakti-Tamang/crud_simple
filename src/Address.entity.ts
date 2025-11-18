import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './shakti.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: 'street' })
  @Column()
  street: string;

  @ApiProperty({ name: 'city' })
  @Column()
  city: string;

  @ApiProperty({ name: 'studentId' })
  studentId: number;

  @OneToOne(() => Student, (student) => student.address, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
