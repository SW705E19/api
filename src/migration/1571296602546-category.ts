import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { Category } from '../entity/category';

export class Category1571296602546 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		const cat = new Category();
		cat.name = 'testcat';
		cat.description = 'test cat';

		const catRepo = getRepository(Category);
		await catRepo.save(cat);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {}
}
