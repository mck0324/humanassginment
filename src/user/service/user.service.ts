import { Injectable } from "@nestjs/common";
import { UserRepository } from "../respository/user.repository";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async findOne(userSeq: number): Promise<UserEntity | undefined> {
        return this.userRepository.findOneBySeq(userSeq);
    }

    async update(seq: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
        return this.userRepository.updateUserInfo(seq, updateData);
    }


    calculatePregnancyWeek(dueDate: string): number {
        const due = new Date(dueDate);
        const now = new Date();
        const diff = due.getTime() - now.getTime();
        const diffWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        return Math.max(0, Math.min(40, 40 - diffWeeks));
    }

    async seedData(): Promise<UserEntity> {
        return this.userRepository.create({ 'seq':1,'nickname':'user1','dueDate':'2023-05-01' });
    }
}