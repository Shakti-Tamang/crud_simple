import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./Address.entity";
import { Assignment } from "./assignment.entity";

@Entity()
export class Student{

    @PrimaryGeneratedColumn()
    id:number;

    @ApiProperty({name:'name',example:'Shakti Tamang'})
    @Column()
    name:string;

    
   @ApiProperty({name:'email'})
    @Column({nullable:true})
    email:string;


  @ApiProperty({name:'password'})
  @Column({nullable:true})

   password:string

    @OneToOne(()=>Address,(address)=>address.student,
  {
    cascade:true,
    nullable:true,
    onDelete:'CASCADE'
  })
    address:Address;

    @OneToMany(()=>Assignment,(assignment)=>assignment.student,{
    cascade:true,
    nullable:true,
    onDelete:'CASCADE'

    })
    assignment:Assignment[];


}