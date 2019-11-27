import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Service } from './service';

@Entity()
export class Rating {
	@PrimaryGeneratedColumn()
    id: number;
    
    @Column()
	rating: number;

	@ManyToOne(type => User, user => user.id)
	userId: number;

	@ManyToOne(type => Service, service => service.id)
	serviceId: number;
}
