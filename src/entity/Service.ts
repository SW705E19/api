import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { User } from './User';
import { tsConstructorType } from '@babel/types';

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    description: string

    @Column()
    @Length(4, 140)
    name: string

    @Column()
    // @ManyToOne(type => User, tutor => tutor.)
    tutor: User

}