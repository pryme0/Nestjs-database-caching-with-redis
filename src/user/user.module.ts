import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserDatabaseName } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDatabaseName, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
