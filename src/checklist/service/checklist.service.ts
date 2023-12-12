import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckListEntity } from "../entities/checklist.entity";
import { Repository } from "typeorm";
import * as fs from 'fs';

@Injectable()
export class CheckListService {
    constructor(
        @InjectRepository(CheckListEntity)
        private readonly repository: Repository<CheckListEntity>
        // private checkListRepository: CheckListRepository,
    ) {}

    async insertData() {
        const rawData = fs.readFileSync('checklist_seeds.json', 'utf8');
        const jsonData = JSON.parse(rawData);

        for (const item of jsonData) {
            const existData = await this.repository.findOne({ where : { content: item.content } })
            if (!existData) {
                const makeEntity = this.repository.create(item);
                await this.repository.save(makeEntity);
            } else {
                continue;
            }
        }
    }

    
}