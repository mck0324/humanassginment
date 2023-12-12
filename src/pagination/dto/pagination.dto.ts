import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationDto {
  @Field(type => Int, { defaultValue: 1 })
  page: number;

  @Field(type => Int, { defaultValue: 10 })
  perPage: number;
}