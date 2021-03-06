import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	OneToMany,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { TutorInfo } from './tutorInfo';
import { Rating } from './rating';
import { Recommendation } from './recommendation';

@Entity()
@Unique(['email'])

export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	phoneNumber: string;

	@Column()
	education: string;

	@Column()
	address: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
	dateOfBirth: Date;

	@Column({
		default: 'https://source.unsplash.com/random/200x200'
	})
	avatarUrl: string;

	@Column('text', { array: true })
	@IsNotEmpty()
	languages: string[];

	@Column('text', { array: true })
	subjectsOfInterest: string[];

	@Column()
	@IsEmail()
	email: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	@Length(4, 100)
	password: string;

	@Column('text', { array: true })
	@IsNotEmpty()
	roles: string[];

	@Column()
	@CreateDateColumn()
	createdAt: Date;

	@Column()
	@UpdateDateColumn()
	updatedAt: Date;

	@OneToOne(type => TutorInfo, tutorInfo => tutorInfo.user)
	tutorInfo: TutorInfo;

	@OneToMany(type => Rating, rating => rating.user)
	ratings: Rating[];

	@OneToMany(type => Recommendation, recommendation => recommendation.user)
	recommendations: Recommendation[];
}
