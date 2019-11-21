import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { TutorInfo } from './tutorInfo';

@Entity()
@Unique(['email', 'username'])

export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: '22334455'
	})
	phoneNumber: string;

	@Column()
	@Length(4,20)
	username: string;

	@Column({
		default: 'Software engineer'
	})
	education: string;

	@Column({
		default: 'tutorvej'
	})
	address: string;

	@Column({
		default: '21-11-2000'
	})
	dateOfBirth: string

	@Column({
		default: 'https://source.unsplash.com/random/200x200'
	})
	avatarUrl: string;

	@Column('text', { array: true, default: "{English}"})
	@IsNotEmpty()
	languages: string[];

	@Column('text', { array: true, default: "{English}"})
	@IsNotEmpty()
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

	hashPassword() {
		this.password = bcrypt.hashSync(this.password, 8);
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}
