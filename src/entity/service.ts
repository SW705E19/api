import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';

import { Category } from './category';
import { TutorInfo } from './tutorInfo';
import { Rating } from './rating';

@Entity()
export class Service {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	description: string;

	@Column()
	@Length(4, 140)
	name: string;

	@ManyToOne(type => TutorInfo, tutorInfo => tutorInfo.services)
	tutorInfo: TutorInfo;

	@ManyToMany(type => Category, category => category.services)
	@IsNotEmpty()
	categories: Category[];

	@OneToMany(type => Rating, rating => rating.service)
	ratings: Rating[];
}
