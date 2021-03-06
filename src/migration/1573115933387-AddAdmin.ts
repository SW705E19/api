import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../entity/user';

export class AddAdmin1573115933387 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		const user = new User();
		user.password = 'admin';
		user.email = 'admin@admin.com';
		user.firstName = 'admin';
		user.lastName = 'adminsen';
		user.roles = ['ADMIN'];
		const userRepository = getRepository(User);
		await userRepository.save(user);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {}
}
