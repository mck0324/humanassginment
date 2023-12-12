import { Module } from '@nestjs/common';
import { UserResolver } from './resolver/resolver.resolver';
import { UserRepository } from './respository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserRepository,UserService]
})
export class UserModule {}
