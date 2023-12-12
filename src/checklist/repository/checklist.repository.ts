import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CheckListEntity } from "../entities/checklist.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CheckListRepository {
    constructor(
        @InjectRepository(CheckListEntity)
        private readonly repository: Repository<CheckListEntity>
    ){}
    
    async findData() {
        return await this.repository.find();
    }

    async makeCheckList(checkListData: Partial<CheckListEntity>): Promise<CheckListEntity> {
        const createData = this.repository.create(checkListData);
        return await this.repository.save(createData);
    }
}