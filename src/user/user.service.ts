// users.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis'
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { userPayload } from './user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}
  
  
  async create(createUserDto: CreateUserDto) {
    const userBody:userPayload = { id: uuidv4(), ...createUserDto };
    let users = await this.redis.get('users');
    if (users) {
      const parsedUsers:userPayload[] = JSON.parse(users);
      parsedUsers.push(userBody);
      await this.redis.set('users', JSON.stringify(parsedUsers));
    } else {
      const users:userPayload[] = [];
      users.push(userBody)
      await this.redis.set('users', JSON.stringify(users));
    }
    return `User ${createUserDto.username} successfully created`;
  }

  async findAll() {
    const users = await this.redis.get('users');
    return users ? JSON.parse(users) : [];
  }

  async findOne(id: string) {
    const users = await this.redis.get('users');
    if (!users) return null;
    const parsedUsers = JSON.parse(users);
    console.log(typeof parsedUsers)
    const user = parsedUsers.find((u:userPayload) => u.id === id);
    return user || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let users = await this.redis.get('users');
    if (!users) return `User with id ${id} not found`;
    const parsedUsers:userPayload[] = JSON.parse(users);
    const index = parsedUsers.findIndex((u:userPayload) => u.id === id);
    if (index === -1) return `User with id ${id} not found`;
    parsedUsers[index] = { id, ...updateUserDto };
    await this.redis.set('users', JSON.stringify(users));
    return `User ${updateUserDto.username} successfully updated`;
  }

  async remove(id: string) {
    let users = await this.redis.get('users');
    if (!users) return `User with id ${id} not found`;
    const parsedUsers:userPayload[] = JSON.parse(users);
    const index = parsedUsers.findIndex((u:userPayload) => u.id === id);
    if (index === -1) return `User with id ${id} not found`;
    parsedUsers.splice(index, 1);
    await this.redis.set('users', JSON.stringify(parsedUsers));
    return `User with id ${id} successfully deleted`;
  }
}
