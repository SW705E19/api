import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

	@ManyToOne(type => User, user => user.ratings, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'userId'})
	user: User;

	@Column({type: 'int'})
	userId: number;

	@ManyToOne(type => Service, service => service.ratings, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'serviceId'})
	service: Service;

	@Column({type: 'int'})
	serviceId: number;
}

