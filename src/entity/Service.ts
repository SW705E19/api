import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { User } from './user';
import { tsConstructorType } from '@babel/types';
import { Category } from './category';
import { TutorInfo } from './tutorInfo';

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    description: string

    @Column()
    @Length(4, 140)
    name: string

    @ManyToOne(type => TutorInfo, tutorInfo => tutorInfo.services)
    tutorInfo: TutorInfo

    @ManyToMany(type => Category, category => category.services)
    categories: Category[]

}