import { Resolver, Query, Mutation, Args, Int, GraphQLExecutionContext, Context } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import { UseGuards } from '@nestjs/common';
import { UserGuard } from '../guard/user.guard';


@UseGuards(UserGuard)
@Resolver(of => UserEntity)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(returns => UserEntity)
    async getUser(
        @Context() context: { req: { headers: { userseq: number } } },
    ): Promise<UserEntity> {
        try {
            const userSeq = context.req.headers.userseq;
            const user = await this.userService.findOne(userSeq);
            if (user) {
                user.pregnancyWeek = this.userService.calculatePregnancyWeek(user.dueDate);
                return user;
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.error('error',error);
            throw new InternalServerErrorException(error.message);
        }
    }
    @Mutation(returns => UserEntity)
    async updateUser(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('nickname', { nullable: true }) nickname: string,
        @Args('dueDate', { nullable: true }) dueDate: string,
    ): Promise<UserEntity> {
        try {
            const userSeq = context.req.headers.userseq;
            const updatedUser = await this.userService.update(userSeq, { nickname, dueDate });
            if (updatedUser && updatedUser.dueDate) {
                updatedUser.pregnancyWeek = this.userService.calculatePregnancyWeek(updatedUser.dueDate);
            }
            return updatedUser;
            
        } catch (error) {
            console.error('error',error);
            throw new InternalServerErrorException(error.message);
        }
    }
}