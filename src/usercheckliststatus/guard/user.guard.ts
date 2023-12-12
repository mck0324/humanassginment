import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      if(!request) {
        return false;
      }
      const checkHeader = request.headers.userseq;
      if(!checkHeader) {
        return false;
      }
      const user = await this.userService.findOne(checkHeader);
      if (!user) {
        return false;
      }
      request.user = user;
      return true;
  }
}
