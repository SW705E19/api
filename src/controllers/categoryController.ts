import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import categoryLogger from '../logging/categories/categoryLogger';
import { Category } from '../entity/category';

class CategoryController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const categoryRepository: Repository<Category> = getRepository(Category);
		const categories: Category[] = await categoryRepository.find();
		return res.send(categories);
	};
	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		//Get ID from the url
		const id: string = req.params.id;

		// Get the category from the database
		const categoryRepository: Repository<Category> = getRepository(Category);
		let category: Category;
		try {
			category = await categoryRepository.findOneOrFail(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(404).send('Category not found');
		}
		return res.send(category);
	};
	static newCategory = async (req: Request, res: Response): Promise<Response> => {
		//Get parameters from body
		const { name, description } = req.body;
		const category: Category = new Category();
		category.name = name;
		category.description = description;

		//Validate the parameters
		const errors: ValidationError[] = await validate(category);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		// Try to save to db. if fails the name is already in use
		const categoryRepository: Repository<Category> = getRepository(Category);
		try {
			await categoryRepository.save(category);
		} catch (error) {
			return res.status(409).send('Name already in use');
		}
		const categoryInfoForLog: string = 'Created: ' + Category.bind.toString() + ', ' + category.name;
		categoryLogger.info(categoryInfoForLog);
		return res.status(201).send(category);
	};

	static editCategory = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get values from the body
		const { name } = req.body;

		// Try to find category in db
		const categoryRepository: Repository<Category> = getRepository(Category);
		let category: Category;
		try {
			category = await categoryRepository.findOneOrFail(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(404).send('Category not found');
		}
		category.name = name;
		const errors: ValidationError[] = await validate(Category);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		//Try to save
		try {
			await categoryRepository.save(category);
		} catch (error) {
			return res.status(409).send('Name already in use');
		}

		return res.status(204).send(category);
	};
	static deleteCategory = async (req: Request, res: Response): Promise<Response> => {
		const id: string = req.params.id;

		const categoryRepository: Repository<Category> = getRepository(Category);
		let category: Category;
		try {
			category = await categoryRepository.findOneOrFail(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(404).send('Category not found');
		}
		categoryRepository.delete(id);

		const deletedInfoForLog: string = 'Deletion: ' + category.name;
		categoryLogger.info(deletedInfoForLog);
		return res.status(204).send();
	};
}

export default CategoryController;
