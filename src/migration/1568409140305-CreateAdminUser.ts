import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../entity/user';

export class CreateAdminUser1547919837483 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		const user = new User();
		user.username = 'admin';
		user.password = 'admin';
		user.hashPassword();
		user.roles = ['ADMIN'];
		const userRepository = getRepository(User);
		await userRepository.save(user);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {}
}
