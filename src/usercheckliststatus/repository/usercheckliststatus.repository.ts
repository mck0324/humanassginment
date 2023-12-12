import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCheckListStatusEntity } from "../entities/usercheckliststatus.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { CheckListEntity } from "src/checklist/entities/checklist.entity";
import { PaginationDto } from "src/pagination/dto/pagination.dto";

@Injectable()
export class UserCheckListStatusRepository {
    constructor(
        @InjectRepository(UserCheckListStatusEntity)
        private readonly repository: Repository<UserCheckListStatusEntity>
    ) {}
    
    async createUserCheckListStatus(data: Partial<UserCheckListStatusEntity>): Promise<UserCheckListStatusEntity> {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }

    async findByUserIdAndWeek(userId: number, week: number, paginationDto: PaginationDto): Promise<UserCheckListStatusEntity[]>{
        const { page, perPage } = paginationDto;

        return this.repository
            .createQueryBuilder("status")
            .leftJoinAndSelect("status.user", "user")
            .leftJoinAndSelect("status.checklist", "checklist")
            .where("user.seq = :userId", { userId })
            .andWhere("checklist.weekNumber = :week", { week })
            .orderBy("status.createdAt", "DESC")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();
    }

    async preventDuplicate(user: UserEntity, checklist: CheckListEntity): Promise<boolean> {
        const existingRecord = await this.repository.findOne({
            where: { user: { seq: user.seq }, checklist: { id: checklist.id } }
        });
        return !!existingRecord; // Return true if a record exists, indicating a duplicate.
    }

    async completeCheckListByUserIdAndChecklistId(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
        const checkList = await this.repository.findOne({ where : { user: { seq: userId }, checklist: { id: checklistId} } });
        if (checkList) {
            checkList.isCompleted = true;
            await this.repository.save(checkList);
        }
        return checkList;
    }

    async incompleteCheckListByUserIdAndChecklistId(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
        const checkList = await this.repository.findOne({ where : { user: { seq: userId }, checklist: { id: checklistId} } });
        if (checkList) {
            checkList.isCompleted = false;
            await this.repository.save(checkList);
        }
        return checkList;
    }

    async makeUserCheckListStatus(newUserCheckListStatusEntity: Partial<UserCheckListStatusEntity>): Promise<UserCheckListStatusEntity> {
        const createEntity = this.repository.create(newUserCheckListStatusEntity);
        return await this.repository.save(createEntity);
    }
    
    async deleteCheckListByUserIdAndChecklistId(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
        const checkList = await this.repository.findOne({ where : { user: { seq: userId }, checklist: { id: checklistId} } });
        if (checkList) {
            checkList.isDeleted = true;
            await this.repository.save(checkList);
        }
        return checkList;
    }
    async cancelDeleteCheckListByUserIdAndChecklistId(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
        const checkList = await this.repository.findOne({ where : { user: { seq: userId }, checklist: { id: checklistId} } });
        if (checkList) {
            checkList.isDeleted = false;
            await this.repository.save(checkList);
        }
        return checkList;
    }

    async findOneByUserIdAndChecklistId(userId: number, checklistId: number,checkListData: CheckListEntity): Promise<UserCheckListStatusEntity> {
        const findUserCheckList =  await this.repository.findOne({
            where: { user: { seq: userId }, checklist: { id: checklistId } }
        });
        findUserCheckList.checklist = checkListData;
        return await this.repository.save(findUserCheckList);
    }
}