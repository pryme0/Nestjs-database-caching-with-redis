import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'


@Schema()
export class UserEntity {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  location: string;

  @Prop()
  password: string;
}

export const UserDatabaseName = 'users';

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

UserSchema.pre<UserDocument>('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});
