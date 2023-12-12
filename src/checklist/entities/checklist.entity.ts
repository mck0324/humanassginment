import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserCheckListStatusEntity } from "src/usercheckliststatus/entities/usercheckliststatus.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class CheckListEntity {

    @Field(type => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => Int)
    @Column()
    weekNumber: number;

    @Field()
    @Column()
    content: string;

    @Field(type => UserCheckListStatusEntity)
    @OneToMany(() => UserCheckListStatusEntity, userchecklist => userchecklist.checklist)
    userchecklists: UserCheckListStatusEntity[];
}