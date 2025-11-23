import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Student } from './shakti.entity';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { LogInDto } from './login.dto';
import { AuthRequest } from './auth-request.interface';

@Controller('/student')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async saveDetails(@Body() dto: Student) {
    return this.appService.saveUser(dto);
  }

  @Post('register')
  async register(@Body() registerData: Student) {
    return this.appService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: LogInDto) {
    const user = await this.appService.validateUser(
      loginData.email,
      loginData.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.appService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Get('getAdmin/admin')
  adminOnly() {
    return { message: 'Admin access' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getLoggedInUser')
  async getLoggedInAllUser(@Req() req:AuthRequest){

    const userid=req.user.sub;

    const oneuser=this.appService.getOneUser(userid);

    return oneuser;

  }

  @Get('/alluser')
  async getUsers() {
    return this.appService.getAll();
  }

  @Get('/oneUser/:id')
  async getStudentById(@Param('id') id: number) {
    return this.appService.getOneUser(id);
  }

  @Delete('/deleteUser/:id')
  async deleteOneUser(@Param('id') id: number) {
    return this.appService.deleteUser(id);
  }

  @Patch('/updateStudent/:id')
  async updateALl(@Param('id') id: number, @Body() dto: Student) {
    return this.appService.updateUser(id, dto);
  }

  @Get('/search')
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'name must be included',
  })
  async getByName(@Query('name') name: string) {
    return this.appService.getByUserName(name);
  }
}
