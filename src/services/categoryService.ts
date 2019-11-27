import { getRepository, Repository, DeleteResult } from 'typeorm';
import { Category } from '../entity/category';

class CategoryService {
	static getAll = async (): Promise<Category[]> => {
		//Get all categories from database
		const categoryRepository: Repository<Category> = getRepository(Category);
		const categories: Category[] = await categoryRepository.find();

		return categories;
	};

	static getById = async (id: number): Promise<Category> => {
		//Get category from database
		const categoryRepository: Repository<Category> = getRepository(Category);
		const category = await categoryRepository.findOneOrFail(id);

		return category;
	};

	static save = async (category: Category): Promise<Category> => {
		const categoryRepository: Repository<Category> = getRepository(Category);
		return await categoryRepository.save(category);
	};

	static deleteById = async (id: number): Promise<DeleteResult> => {
		//Get category from database
		const categoryRepository: Repository<Category> = getRepository(Category);
		const category = await categoryRepository.delete(id);

		return category;
	};
}
export default CategoryService;
