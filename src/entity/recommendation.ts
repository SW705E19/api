import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from './user';
import { Service } from './service';

@Entity()
export class Recommendation {
	@PrimaryGeneratedColumn()
    id: number;
    
	@Column({type: 'float'})
	value: number;
	
	@Column('int')
	userId: number;

	@Column('int')
	serviceId: number;

	@ManyToOne(type => User, user => user.recommendations, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'userId'})
	user: User;

	@ManyToOne(type => Service, service => service.recommendations, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'serviceId'})
	service: Service;
}
