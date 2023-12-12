import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckListRepository } from "src/checklist/repository/checklist.repository";
import { UserRepository } from "src/user/respository/user.repository";
import { UserCheckListStatusRepository } from "../repository/usercheckliststatus.repository";
import { CheckListEntity } from "src/checklist/entities/checklist.entity";
import { UserCheckListStatusEntity } from "../entities/usercheckliststatus.entity";
import { PaginationDto } from "src/pagination/dto/pagination.dto";


@Injectable()
export class UserCheckListStatusService {
        constructor(
            private checkListRepository: CheckListRepository,
            private userRepository: UserRepository,
            private userCheckListStatusRepository: UserCheckListStatusRepository,
        ){}
        
        async makeData() {
            const checkListData = await this.checkListRepository.findData();
            const userData = await this.userRepository.findOneBySeq(1);

            if (!userData) {
                throw new Error("User not found");
            }
            for(const item of checkListData) {
                const isDuplicate = await this.userCheckListStatusRepository.preventDuplicate(userData, item);
                if (!isDuplicate) {
                    await this.userCheckListStatusRepository.createUserCheckListStatus({
                        user: userData,
                        checklist: item,
                        isCompleted: false,
                        isDeleted: false
                    });
                }
            }
            
        }

        async findByUserIdAndWeek(userSeq: number, week: number,paginationDto: PaginationDto): Promise<UserCheckListStatusEntity[]> {
            return this.userCheckListStatusRepository.findByUserIdAndWeek(userSeq, week, paginationDto);
        }
        
        async completeStatus(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
            return this.userCheckListStatusRepository.completeCheckListByUserIdAndChecklistId(userId, checklistId);
        }
        async incompleteStatus(userId: number, checklistId: number): Promise<UserCheckListStatusEntity> {
            return this.userCheckListStatusRepository.incompleteCheckListByUserIdAndChecklistId(userId, checklistId);
        }
        
        async makeUserCheckList(userId: number, week: number, content: string): Promise<UserCheckListStatusEntity>  {
            const user = await this.userRepository.findOneBySeq(userId);
            if (!user) {
                throw new NotFoundException('Invalid User');
            }

            const newCheckList = new CheckListEntity();
            newCheckList.weekNumber = week;
            newCheckList.content = content;
            const checkListData = await this.checkListRepository.makeCheckList(newCheckList);
            
            const newUserCheckListStatusEntity = new UserCheckListStatusEntity();
            newUserCheckListStatusEntity.user = user;
            newUserCheckListStatusEntity.checklist = checkListData;
            newUserCheckListStatusEntity.isCompleted = false;
            newUserCheckListStatusEntity.isDeleted = false;

            const result = await this.userCheckListStatusRepository.makeUserCheckListStatus(newUserCheckListStatusEntity);
            return result;
        }
        
        async isDelete(userId: number,checkList: number): Promise<UserCheckListStatusEntity>{
            return this.userCheckListStatusRepository.deleteCheckListByUserIdAndChecklistId(userId,checkList);
        }
        async cancelDelete(userId: number,checkList: number): Promise<UserCheckListStatusEntity>{
            return this.userCheckListStatusRepository.cancelDeleteCheckListByUserIdAndChecklistId(userId,checkList);
        }

        async updateCheckList(userId: number, week: number, checkListId: number,content: string): Promise<UserCheckListStatusEntity> {
            const user = await this.userRepository.findOneBySeq(userId);
            if (!user) {
                throw new NotFoundException('Invalid User');
            }

            const newCheckList = new CheckListEntity();
            newCheckList.weekNumber = week;
            newCheckList.content = content;
            const checkListData = await this.checkListRepository.makeCheckList(newCheckList);
            
            const userCheckListStatus = await this.userCheckListStatusRepository.findOneByUserIdAndChecklistId(userId,checkListId,checkListData);
        
            return userCheckListStatus;
        }


}