import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Address } from './Address.entity';

@Controller('/address')
export class AddressController {
  constructor(private readonly appService: AppService) {}

  @Post('/save')
  async saveStudentddress(@Body() dto: Address) {
    return this.appService.saveAddress(dto);
  }

  @Get('/getAdress/:id')
  async getAddress(@Param('id') id: number) {
    return this.appService.getaddressOfGivenStduent(id);
  }

  @Get('/assignments/:city')
  async getAssignmentBycity(@Param('city') city: string) {
    return this.appService.getAssignmentByCity(city);
  }

  @Delete('deleteAssign/:id')
  async getAssigenmt(@Param('id') id: number) {
    return this.appService.deleteAddress(id);
  }

  @Patch('/updateAssignment/:id')
  async updateAssignmentById(@Body() dto: Address, id: number) {
    return this.appService.updateAddress(id, dto);
  }

  @Get('/getAllAddress')
  async getAllAddress(){
    return this.appService.getAllAddress();
  }
}
