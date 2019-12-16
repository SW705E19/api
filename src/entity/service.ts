import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Category } from './category';
import { TutorInfo } from './tutorInfo';
import { Rating } from './rating';
import { Recommendation } from './recommendation';

@Entity()
export class Service {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	description: string;

	@Column()
	@Length(2, 140)
	name: string;

	@ManyToOne(type => TutorInfo, tutorInfo => tutorInfo.services, { onDelete: 'CASCADE'})
	tutorInfo: TutorInfo;

	@ManyToMany(type => Category, category => category.services)
	@IsNotEmpty()
	categories: Category[];

	@OneToMany(type => Rating, rating => rating.service)
	ratings: Rating[];

	@OneToMany(type => Recommendation, recommendation => recommendation.service)
	recommendations: Recommendation[];

	@Column({
		default: 'https://source.unsplash.com/random/200x200'
	})
	image: string;
}
