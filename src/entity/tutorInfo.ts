import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user';
import { Service } from './service';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class TutorInfo {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(type => User, user => user.tutorInfo, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'userId'})
	user: User;

	@Column('int')
	userId: number;

	@OneToMany(type => Service, service => service.tutorInfo)
	services: Service[];

	@Column()
	description: string;

	@Column('text', { array: true })
	@IsNotEmpty()
	acceptedPayments: string[];
}
