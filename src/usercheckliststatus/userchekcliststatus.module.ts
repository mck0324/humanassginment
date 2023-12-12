import { Module } from '@nestjs/common';
import { UserCheckListStatusEntity } from './entities/usercheckliststatus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChekcliststatusResolver } from './resolver/userchekcliststatus.resolver';
import { UserCheckListStatusService } from './service/usercheckliststatus.service';
import { UserCheckListStatusRepository } from './repository/usercheckliststatus.repository';
import { ChecklistModule } from 'src/checklist/checklist.module';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [TypeOrmModule.forFeature([UserCheckListStatusEntity]),ChecklistModule,UserModule],
    providers: [UserChekcliststatusResolver, UserCheckListStatusService, UserCheckListStatusRepository],
})
export class UserCheckListStatusModule {}
