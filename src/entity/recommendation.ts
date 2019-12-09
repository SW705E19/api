import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from './user';
import { Service } from './service';

@Unique(['user', 'service'])
@Entity()
export class Recommendation {
	@PrimaryGeneratedColumn()
    id: number;
    
	@Column()
    value: number;

	@ManyToOne(type => User, user => user.recommendations)
	user: User;

	@ManyToOne(type => Service, service => service.recommendations, { onDelete: 'CASCADE'})
	service: Service;
}
