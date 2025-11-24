import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './shakti.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: 'title' })
  @Column()
  title: string;

  @ApiProperty({ name: 'description' })
  @Column()
  description: string;

  @ApiProperty({ name: 'studentId' })
  studentId: number;

  @ManyToOne(() => Student, (student) => student.assignment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
