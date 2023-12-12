import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckListEntity } from './entities/checklist.entity';
import { CheckListService } from './service/checklist.service';
import { CheckListRepository } from './repository/checklist.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CheckListEntity])],
    providers: [CheckListService, CheckListRepository],
    exports: [CheckListRepository,CheckListService]
})
export class ChecklistModule {}
