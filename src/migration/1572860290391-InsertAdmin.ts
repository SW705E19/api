import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { User } from "../entity/user";

export class InsertAdmin1572860290391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const user = new User();
		user.username = 'admin';
		user.password = 'admin';
		user.email = 'admin@admin.com'
		user.firstName = 'admin';
		user.lastName = 'adminsen';
		user.hashPassword();
		user.roles = ['ADMIN'];
		const userRepository = getRepository(User);
		await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
