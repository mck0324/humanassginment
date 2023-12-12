import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserCheckListStatusEntity } from "src/usercheckliststatus/entities/usercheckliststatus.entity";

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class UserEntity {

    @Field(type => Int)
    @PrimaryGeneratedColumn()
    seq: number; // 고유번호

    @Field()
    @Column()
    nickname: string; // 이름

    @Field()
    @Column()
    dueDate: string; // 출산 예정일 (YYYY-MM-DD 형식)

    @Field(type => Int, { nullable: true })
    pregnancyWeek?: number;

    @Field(type => UserCheckListStatusEntity)
    @OneToMany(() => UserCheckListStatusEntity, userchecklist => userchecklist.user)
    checklists: UserCheckListStatusEntity[];
}