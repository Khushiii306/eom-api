import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class UserService {
  private user : User[] = [];
  private idu = 1;

  create(createUserDto: CreateUserDto) {
    if(this.user.find(
      (x) =>createUserDto.username == x.username &&
      createUserDto.email == x.email,
    )    
    ){
      throw new BadRequestException('username and email already exist');
    }
    else if(this.user.find((x) => createUserDto.username == x.username)){
      throw new BadRequestException('username already exists');
    }else if(this.user.find((x)=> createUserDto.email == x.email)){
      throw new BadRequestException('Email already exists');
    }else{
      let user ={
        id: this.idu++,
        ...createUserDto
      };
      this.user.push(user);
      return user;
    }
  }
  
  

  findAll(): User[] {
    return this.user;
  }

  findOne(id: number) {
    return this.user.find((u1)=> u1.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userup = this.user.findIndex((obj)=> obj.id == id);
    console.log('before update:',userup);
    if(userup == -1)
    return 'user not found';
    console.log('before updates:',userup[userup]);
    this.user[userup].firstname = updateUserDto.firstname;
    this.user[userup].lastname = updateUserDto.lastname;
    this.user[userup].username = updateUserDto.username;
    this.user[userup].dob = updateUserDto.dob;
    this.user[userup].email = updateUserDto.email;
    this.user[userup].password = updateUserDto.password;  
    return this.user[userup];
  }

  remove(id: number) {
    const deldata = this.user.find((del) => del.id === id);
    if(!deldata){
      return 'user not found!';
    }else{
      this.user.splice(this.user.findIndex((a)=> a.id === id),
      1,
      );
    }
  }
}
