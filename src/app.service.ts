import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './shakti.entity';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Address } from './Address.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async saveUser(dto: Student) {
    await this.studentRepo.save(dto);

    return 'successfully saved';
  }

  async getOneUser(userId: number) {
    return this.studentRepo.findOne({ where: { id: userId } });
  }

  async getAll() {
    return this.studentRepo.find({
      relations:['address','assignment'],

      select:{
        address:{
          city:true
        },
        assignment:{description:true}
      }
    });
  }

  async deleteUser(id: number) {
    return this.studentRepo.delete(id);
  }
  async updateUser(id: number, dto: Student) {
    const updatedUser = this.studentRepo.update(id, dto);
    return updatedUser;
  }

  async saveAssignment(dto: Assignment) {
    const student = await this.studentRepo.findOne({
      where: { id: dto.studentId },
    });

    const saveUser = this.assignmentRepo.create({
      description: dto.description,
      title: dto.title,
      student: student || undefined,
    });

    return this.assignmentRepo.save(saveUser);
  }



  async saveAddress(dto: Address) {
    const student = await this.studentRepo.findOne({
      where: { id: dto.studentId },
    });

    const saveUser = this.addressRepo.create({
      city: dto.city,
      street:dto.street,
      student:student||undefined
    });

    return this.addressRepo.save(saveUser);
  }

  async getAssignmentOfGivenStduent(id:number){

    const getAssignments=this.assignmentRepo.find({
      where:{
        student:{
          id:id
        }
      },
    });

    return getAssignments;

  }
    async getaddressOfGivenStduent(id:number){

    const getaddres=this.addressRepo.find({
      where:{
        student:{
          id:id
        },
         

      }
    });
    return getaddres;

  }

async getByUserName(namePattern: string) {
  const queryBuilder = this.studentRepo.createQueryBuilder('student')
    .leftJoinAndSelect('student.address', 'address')
    .leftJoinAndSelect('student.assignment', 'assignment')
    .orderBy('student.name', 'ASC')
    .skip(0).
    take(3)
    ;

  if (namePattern && namePattern.trim() !== '') {
    queryBuilder.where('student.name ILIKE :name', { name: `%${namePattern}%` });
  }

  const result = await queryBuilder.getMany();
  return result;
}

  async getAssignmentByCity(city:string){

    const students = await this.studentRepo.createQueryBuilder('student')
    .leftJoinAndSelect('student.assignment', 'assignment')
    .leftJoinAndSelect('student.address', 'address')
    .where('address.city = :city', { city })
    .getMany();
  const assignments = students.flatMap(student => student.assignment || []);
  return assignments;

  }
  

}
