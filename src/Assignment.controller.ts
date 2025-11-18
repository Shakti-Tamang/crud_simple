import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { Assignment } from "./assignment.entity";

@Controller('/assignment')
export class AssignmentController{

      constructor(private readonly appService: AppService) {
    
      }

      @Post('/save')
      async saveStudentAssignment(@Body()dto:Assignment){

        return this.appService.saveAssignment(dto);

      }

       @Get('/getAssignment/:id')
          async getAddress(@Param('id')id:number){
              return this.appService.getAssignmentOfGivenStduent(id);
    
          }
}