import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../entity/user';

export class NewMigration1572860112053 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {}

	public async down(queryRunner: QueryRunner): Promise<any> {}
}
