import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class LogInDto{

  @ApiProperty({ name: 'name', example: 'Shakti Tamang' })
  @Column()
  password: string;

  @ApiProperty({ name: 'email' })
  @Column({ nullable: true })
  email: string;

}
