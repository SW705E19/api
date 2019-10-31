import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { Service } from "./service";
import { Length, IsNotEmpty } from 'class-validator';

@Entity()
export class TutorInfo {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(type => TutorInfo, tutorInfo => tutorInfo.user)
    @JoinColumn()
    user: User

    @OneToMany(type => Service, service => service.tutorInfo)
    services: Service[]

    @Column()
    description: string

    @Column('text', { array: true })
	@IsNotEmpty()
    acceptedPayments: string[]
}