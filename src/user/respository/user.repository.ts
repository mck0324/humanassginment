import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ) {}

    async findOneBySeq(seq: number): Promise<UserEntity | undefined> {
        return this.repository.findOne({ where : { seq } });
    }

    async updateUserInfo(seq: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
        await this.repository.update({ seq }, updateData);
        return this.findOneBySeq(seq);
    }

    async create(userData: Partial<UserEntity>): Promise<UserEntity> {
        const seedData = this.repository.create(userData);
        return await this.repository.save(seedData);
    }
    
}