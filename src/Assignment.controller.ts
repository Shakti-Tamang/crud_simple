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
import { Assignment } from './assignment.entity';

@Controller('/assignment')
export class AssignmentController {
  constructor(private readonly appService: AppService) {}

  @Post('/save')
  async saveStudentAssignment(@Body() dto: Assignment) {
    return this.appService.saveAssignment(dto);
  }

  @Get('/getAssignment/:id')
  async getAddress(@Param('id') id: number) {
    return this.appService.getAssignmentOfGivenStduent(id);
  }

  @Delete('assignmentUpdate/:id')
  async DeleteQuery(@Param('id') id: number) {
    return this.appService.deleteAssignment(id);
  }

  @Patch('assignmentDelete/:id')
  async updateAssognment(@Body() dto: Assignment, @Param('id') id: number) {
    return this.appService.updateAssggignment(id, dto);
  }
}
