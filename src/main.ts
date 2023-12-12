import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CheckListService } from './checklist/service/checklist.service';
import { UserService } from './user/service/user.service';
import { UserCheckListStatusService } from './usercheckliststatus/service/usercheckliststatus.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const checklistData = app.get(CheckListService);
  const userData = app.get(UserService);
  await checklistData.insertData();
  await userData.seedData();
  const userCheckList = app.get(UserCheckListStatusService);
  await userCheckList.makeData();
  await app.listen(3000);

}
bootstrap();
