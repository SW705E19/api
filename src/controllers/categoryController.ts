import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import categoryLogger from '../logging/categories/categoryLogger';
import { Category } from '../entity/category';

class CategoryController {
	static listAll = async (req: Request, res: Response) => {
		const categoryRepository: Repository<Category> = getRepository(Category);
		const categories: Category[] = await categoryRepository.find();
		res.send(categories);
	};
	static getOneById = async (req: Request, res: Response) => {
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
			res.status(404).send('Category not found');
		}
		res.send(category);
	};
	static newCategory = async (req: Request, res: Response) => {
		//Get parameters from body
		const { name, description } = req.body;
		const category: Category = new Category();
		category.name = name;
		category.description = description;

		//Validate the parameters
		const errors: ValidationError[] = await validate(category);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}
		// Try to save to db. if fails the name is already in use
		const categoryRepository: Repository<Category> = getRepository(Category);
		try {
			await categoryRepository.save(category);
		} catch (error) {
			res.status(409).send('Name already in use');
			return;
		}
		const categoryInfoForLog: string = 'Created: ' + Category.bind.toString() + ', ' + category.name;
		categoryLogger.info(categoryInfoForLog);
		res.status(201).send(category);
	};

	static editCategory = async (req: Request, res: Response) => {
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
			res.status(404).send('Category not found');
			return;
		}
		category.name = name;
		const errors: ValidationError[] = await validate(Category);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}
		//Try to save
		try {
			await categoryRepository.save(category);
		} catch (error) {
			res.status(409).send('Name already in use');
		}

		res.status(204).send(category);
	};
	static deleteCategory = async (req: Request, res: Response) => {
		const id: string = req.params.id;

		const categoryRepository: Repository<Category> = getRepository(Category);
		let category: Category;
		try {
			category = await categoryRepository.findOneOrFail(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			res.status(404).send('Category not found');
			return;
		}
		categoryRepository.delete(id);

		const deletedInfoForLog: string = 'Deletion: ' + Category.name;
		categoryLogger.info(deletedInfoForLog);
		res.status(204).send();
	};
}

export default CategoryController;
