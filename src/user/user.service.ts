import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  UpdateUserDto,
  FindUserDto,
  DeleteUserDto,
} from './dto';
import { UserDocument, UserDatabaseName } from './entities';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDatabaseName) private userModel: Model<UserDocument>, // @InjectRedis() private readonly redis: Redis,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll(payload: FindUserDto) {
    //check cache for availability of data
    const checkCacheValue = await this.checkCacheValue(JSON.stringify(payload));

    if (checkCacheValue) {
      //if value is present in cache return value from cache
      return checkCacheValue;
    }
    const users = await this.userModel.find(payload);
    //insert into cach and return user response
    this.cacheService.set(JSON.stringify(payload), users);
    return users;
  }

  async findOne(id: string) {
    const checkCacheValue = await this.checkCacheValue(
      JSON.stringify({ _id: id }),
    );
    if (checkCacheValue) {
      return checkCacheValue;
    }
    return this.userModel.findOne({ id });
  }

  async update(updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findByIdAndUpdate(
      updateUserDto.id,
      updateUserDto.data,
    );
    const checkCacheValue = await this.checkCacheValue(
      JSON.stringify({ _id: updateUserDto.id }),
    );
    if (checkCacheValue) {
      this.updateCacheValue(
        JSON.stringify({ _id: updateUserDto.id }),
        updateUser,
      );
    }
    return updateUser;
  }

  async remove(payload: DeleteUserDto) {
    const deleteUser = await this.userModel.remove(payload.id);
    await this.deleteCacheValue(JSON.stringify({ _id: payload.id }));
    return deleteUser;
  }

  checkCacheValue = async (key) => {
    return await this.cacheService.get(key);
  };
  updateCacheValue = async (key, data) => {
    return await this.cacheService.set(key, data);
  };
  deleteCacheValue = async (key) => {
    return await this.cacheService.delete(key);
  };
}
