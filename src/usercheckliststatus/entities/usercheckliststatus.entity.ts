import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CheckListEntity } from "src/checklist/entities/checklist.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class UserCheckListStatusEntity {
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => UserEntity)
    @ManyToOne(() => UserEntity, user => user.checklists)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Field(type => CheckListEntity)
    @ManyToOne(() => CheckListEntity, checklist => checklist.userchecklists)
    @JoinColumn({ name: 'checklistId' })
    checklist: CheckListEntity;

    @Field()
    @Column({ default: false })
    isCompleted: boolean;

    @Field()
    @Column({ default: false })
    isDeleted: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
  
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}