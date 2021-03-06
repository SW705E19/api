import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import categoryLogger from '../logging/categories/categoryLogger';
import { Category } from '../entity/category';
import CategoryService from '../services/categoryService';

class CategoryController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const categories = await CategoryService.getAll();
		return res.status(200).send(categories);
	};
	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		//Get ID from the url
		const id = (req.params.id as unknown) as number;

		let category: Category;
		try {
			category = await CategoryService.getById(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(400).send('Category not found');
		}
		return res.status(200).send(category);
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
		try {
			await CategoryService.save(category);
		} catch (error) {
			return res.status(400).send('Saving failed');
		}
		const categoryInfoForLog: string = 'Created: ' + Category.bind.toString() + ', ' + category.name;
		categoryLogger.info(categoryInfoForLog);
		return res.status(201).send(category);
	};

	static editCategory = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id = (req.params.id as unknown) as number;

		//Get values from the body
		const { name, description, services } = req.body;

		// Try to find category in db
		let category: Category;
		try {
			category = await CategoryService.getById(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(404).send('Category not found');
		}
		category.name = name;
		category.description = description;
		category.services = services;

		const errors: ValidationError[] = await validate(category);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		//Try to save
		try {
			await CategoryService.save(category);
		} catch (error) {
			return res.status(409).send('Saving failed');
		}

		return res.status(200).send(category);
	};
	static deleteCategory = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;

		let category: Category;
		try {
			category = await CategoryService.getById(id);
		} catch (error) {
			const infoForLog: string = 'Category not found: ' + id;
			categoryLogger.info(infoForLog);
			return res.status(400).send('Category not found');
		}
		await CategoryService.deleteById(id);

		const deletedInfoForLog: string = 'Deletion: ' + category.name;
		categoryLogger.info(deletedInfoForLog);
		return res.status(200).send();
	};
}

export default CategoryController;
