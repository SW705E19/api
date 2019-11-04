import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Length } from 'class-validator';

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