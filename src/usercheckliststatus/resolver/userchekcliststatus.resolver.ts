import { InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { UserCheckListStatusEntity } from '../entities/usercheckliststatus.entity';
import { UserCheckListStatusService } from '../service/usercheckliststatus.service';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import { CheckListService } from 'src/checklist/service/checklist.service';
import { DataSource } from 'typeorm';
import { UserGuard } from '../guard/user.guard';


@UseGuards(UserGuard)
@Resolver(of => UserCheckListStatusEntity)
export class UserChekcliststatusResolver {
    constructor(
        private readonly userCheckListService: UserCheckListStatusService,
        private readonly checkListService: CheckListService,
        private readonly dataSource: DataSource
        ) {}
    @Query(returns => [UserCheckListStatusEntity])
    async getWeeksCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('week', { type: () => Int}) week: number,
        @Args('pagination', { type: () => PaginationDto, nullable: true }) pagination: PaginationDto,
        ): Promise<UserCheckListStatusEntity[]> {
        try {
            const userSeq = context.req.headers.userseq;
            return await this.userCheckListService.findByUserIdAndWeek(userSeq, week, pagination);
        } catch (error) {
            console.error("error",error);
            throw new InternalServerErrorException(error.message);
        }
    }
    @Mutation(returns => UserCheckListStatusEntity)
    async updateIsCompleteCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('checklistId', { type: () => Int }) checklistId: number,
    ): Promise<UserCheckListStatusEntity> {
        try {
            const userSeq = context.req.headers.userseq;
            const updateStatus = await this.userCheckListService.completeStatus(userSeq, checklistId);
            return updateStatus;
        } catch (error) {
            console.error("error",error);
            throw new NotFoundException(error.message);
        }
    }
    @Mutation(returns => UserCheckListStatusEntity)
    async updateIsInCompleteCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('checklistId', { type: () => Int }) checklistId: number,
    ): Promise<UserCheckListStatusEntity> {
        try {
            const userId = context.req.headers.userseq;
            const updateStatus = await this.userCheckListService.incompleteStatus(userId, checklistId);
            return updateStatus;
        } catch (error) {
            console.error("error",error);
            throw new NotFoundException(error.message);
            
        }
    }
    @Mutation(returns => UserCheckListStatusEntity)
    async makeCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('week', { type: () => Int }) week: number,
        @Args('content') content: string,
    ): Promise<UserCheckListStatusEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const userSeq = context.req.headers.userseq;
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await this.userCheckListService.makeUserCheckList(userSeq,week,content);
            await queryRunner.commitTransaction();
            return result;
            
        } catch (error) {
            console.error("error",error);
            await queryRunner.rollbackTransaction(); // 롤백 처리
            throw error;
        } finally {
            // 트랜잭션 종료와 queryRunner 닫기
            await queryRunner.release();
        }
    }

    @Mutation(returns => UserCheckListStatusEntity)
    async updateIsDeleteCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('checklistId', { type: () => Int }) checklistId: number,
    ): Promise<UserCheckListStatusEntity> {
        try {
            const userSeq = context.req.headers.userseq;
            const updateDeleteStatus = await this.userCheckListService.isDelete(userSeq,checklistId);
            return updateDeleteStatus;
        } catch (error) {
            console.error("error",error);
            throw new NotFoundException(error.message);
        }
    }

    @Mutation(returns => UserCheckListStatusEntity)
    async updateCancelDeleteCheckList(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('checklistId', { type: () => Int }) checklistId: number,
    ): Promise<UserCheckListStatusEntity> {
        try {
            const userSeq = context.req.headers.userseq;
            const updateDeleteStatus = await this.userCheckListService.cancelDelete(userSeq,checklistId);
            return updateDeleteStatus;
        } catch (error) {
            console.error("error",error);
            throw new NotFoundException(error.message);
        }
    }
                                               
    @Mutation(returns => UserCheckListStatusEntity)
    async updateCheckListContent(
        @Context() context: { req: { headers: { userseq: number } } },
        @Args('week', { type: () => Int }) week: number,
        @Args('checklistId', { type: () => Int }) checklistId: number,
        @Args('content') content: string
    ): Promise<UserCheckListStatusEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const userSeq = context.req.headers.userseq;
            
            const result = await this.userCheckListService.updateCheckList(userSeq,week,checklistId,content);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            console.error("error",error);
            await queryRunner.rollbackTransaction(); // 롤백 처리
            throw error;
        } finally {
            // 트랜잭션 종료와 queryRunner 닫기
            await queryRunner.release();
        }
    }
}
