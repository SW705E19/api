import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Service } from './service';
import { IsInt, Min, Max } from 'class-validator';

@Entity()
export class Rating {
	@PrimaryGeneratedColumn()
    id: number;
    
	@Column()
	@IsInt()
	@Min(1)
	@Max(5)
    rating: number;
    
    @Column({
		default: 'No comment'
	})
	description: string;

	@ManyToOne(type => User, user => user.ratings)
	user: User;

	@ManyToOne(type => Service, service => service.ratings, { onDelete: 'CASCADE'})
	service: Service;
}
