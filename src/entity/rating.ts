import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Between } from 'typeorm';
import { User } from './user';
import { Service } from './service';
import { Equals, Length } from 'class-validator';

@Entity()
export class Rating {
	@PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @Equals(1 || 2 || 3 || 4 || 5)
    rating: number;
    
    @Column()
	@Length(2, 200)
	description: string;

	@ManyToOne(type => User, user => user.id)
	user: User;

	@ManyToOne(type => Service, service => service.id)
	service: Service;
}
