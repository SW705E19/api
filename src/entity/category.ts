import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';
import { Length } from 'class-validator';
import { Service } from './service';

@Entity()
@Unique(['name'])
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(2, 40)
	name: string;

	@Column()
	@Length(2, 200)
	description: string;

	@ManyToMany(type => Service, service => service.categories)
	@JoinTable()
	services: Service[];
}
