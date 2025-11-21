import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { Address } from "./Address.entity";

@Controller('/address')
export class AddressController{
    constructor(private readonly appService: AppService) {
  
    }

    @Post('/save')

    async saveStudentddress(@Body()dto:Address){

        return this.appService.saveAddress(dto);

    }

    @Get('/getAdress/:id')
    async getAddress(@Param('id')id:number){
        return this.appService.getaddressOfGivenStduent(id);

    }

       @Get('/assignments/:city')
          async getAssignmentBycity(@Param('city') city:string){

           return this.appService.getAssignmentByCity(city);

          }
}