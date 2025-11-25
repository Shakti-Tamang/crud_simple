import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './shakti.entity';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Address } from './Address.entity';
import { Role } from './role.enum';
import { JwtPayload } from './payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
      private jwtService: JwtService,
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
      // repo pattern
      relations: ['address', 'assignment'],

      select: {
        address: {
          city: true,
        },
        assignment: { description: true },
      },
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
      street: dto.street,
      student: student || undefined,
    });

    return this.addressRepo.save(saveUser);
  }

  async getAssignmentOfGivenStduent(id: number) {
    const getAssignments = this.assignmentRepo.find({
      where: {
        student: {
          id: id,
        },
      },
    });

    return getAssignments;
  }
  async getaddressOfGivenStduent(id: number) {
    // repo pattern
    const getaddres = this.addressRepo.find({
      where: {
        student: {
          id: id,
        },
      },
    });
    return getaddres;
  }

  async getByUserName(namePattern: string) {
    // query builder pattern
    const queryBuilder = this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.address', 'address')
      .leftJoinAndSelect('student.assignment', 'assignment')
      .orderBy('student.name', 'ASC')
      .skip(0)
      .take(3);

    if (namePattern && namePattern.trim() !== '') {
      queryBuilder.where('student.name ILIKE :name', {
        name: `%${namePattern}%`,
      });
    }

    const result = await queryBuilder.getMany();
    return result;
  }

  // query builder
  async getAssignmentByCity(city: string) {
    const students = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.assignment', 'assignment')
      .leftJoinAndSelect('student.address', 'address')
      .select(['student.id', 'assignment.id', 'assignment.title'])
      .where('address.city = :city', { city })
      .getMany();
    const assignments = students.flatMap((stud) => stud.assignment || []);
    return assignments;
  }

  async updateAssignment(id: number, dto: Assignment) {
    const assignments = await this.assignmentRepo.findOne({ where: { id } });

    if (!assignments) {
      throw new NotFoundException('assignment not found');
    }

    const update = this.assignmentRepo.merge(dto, assignments);

    const saveupdate = this.assignmentRepo.save(update);

    return {
      message: 'successfully updated',
      data: saveupdate,
    };
  }

  async deleteAssignment(id: number) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });

    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    const removes = this.assignmentRepo.remove(assignment);

    return {
      message: 'successfully removed',
      data: removes,
    };
  }

  async findAssignmnetById(id: number) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });

    if (!assignment) {
      throw new NotFoundException('assignment not found');
    }

    return {
      message: 'successfully get assignmnet',
      data: assignment,
    };
  }


    async validateUser(email: string, password: string): Promise<Student | null> {
    const user = await this.studentRepo.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

async login(user: Student) {
  const payload: JwtPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };


  const token = await Promise.resolve(this.jwtService.sign(payload));
  
  return {
    access_token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    const existingUser = await this.studentRepo.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = this.studentRepo.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || Role.User,
    });

    await this.studentRepo.save(user);
    return this.login(user);
  }

  async validateUserById(userId: number): Promise<Student | null> {
    return this.studentRepo.findOne({ where: { id: userId } });
  }

  async updateAssggignment(id:number,dto:Assignment){

    const getOneAssignment=await this.assignmentRepo.findOne({where:{id}});

    if(!getOneAssignment){
    return new NotFoundException("assignment not found")  
    }

    const updatedAssignment=this.assignmentRepo.merge(getOneAssignment,dto);


    return updatedAssignment;

  }

   async updateAddress(id:number,dto:Address){

    const getOneAddress=await this.assignmentRepo.findOne({where:{id}});

    if(!getOneAddress){
    return new NotFoundException("assignment not found")  
    }

    const updatedAssignment=this.assignmentRepo.merge(getOneAddress,dto);


    return updatedAssignment;

  }


    async deleteAddress(id: number) {
    const address = await this.addressRepo.findOne({ where: { id } });

    if (!address) {
      throw new NotFoundException('address not found');
    }

    const removes = this.addressRepo.remove(address);
    return {
      message: 'successfully removed',
      data: removes,
    };
  }


  async getAllAssignmnet(){
    const all = await this.assignmentRepo.find();

    return all;

  }

  async getAllAddress(){
    const alladdress=await this.addressRepo.find();

    return alladdress;
  }
  
}
