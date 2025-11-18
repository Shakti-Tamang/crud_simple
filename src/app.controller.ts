import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Student } from './shakti.entity';

@Controller("/student")
export class AppController {
  constructor(private readonly appService: AppService) {

  }

  @Post()
  async saveDetails(@Body( ) dto:Student){
    return this.appService.saveUser(dto);

  }

  @Get('/alluser')
  async getUsers(){
   return  this.appService.getAll();
  }

  @Get('/oneUser/:id')

  async getStudentById(@Param('id') id:number){

    return this.appService.getOneUser(id);

  }

  @Delete('/deleteUser/:id')

  async deleteOneUser(@Param('id') id:number){

    return this.appService.deleteUser(id);

  }

  @Patch('/updateStudent/:id')
  async updateALl(@Param('id')id:number,@Body() dto:Student){
    return this.appService.updateUser(id,dto);
  }

}
