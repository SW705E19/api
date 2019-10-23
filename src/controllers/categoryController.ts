
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import categoryLogger from "../logging/categories/categoryLogger";

import { Category } from "../entity/category";
import { User } from "../entity/user";

class CategoryController{

    static listAll = async (req: Request, res: Response) => {
        const categoryRepository = getRepository(Category);
        const categorys = await categoryRepository.find();
        res.send(categorys);  
    }
    static getOneById = async (req: Request, res: Response) => {
        //Get ID from the url
        const id: string = req.params.id;

        // Get the category from the database
        const categoryRepository = getRepository(Category);
        let category: Category;
        try {
            category = await categoryRepository.findOneOrFail(id);
        } catch (error) {
            var infoForLog = "Category not found: " + id;
            categoryLogger.info(infoForLog);
            res.status(404).send("Category not found");
        }
        res.send(category);
    }
    static newCategory = async (req: Request, res: Response) => {
        //Get parameters from body
        let { name, description } = req.body;
        let category = new Category();
        category.name = name;
        category.description = description;

        //Validate the parameters
        const errors = await validate(category);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        // Try to save to db. if fails the name is already in use
        const categoryRepository = getRepository(Category);
        try {
            await categoryRepository.save(category);
        } catch (error) {
            res.status(409).send("Name already in use");
            return;
        }
        var categoryInfoForLog = "Created: " + Category.bind.toString() + ", " + category.name;
        categoryLogger.info(categoryInfoForLog);
        res.status(201).send("Category created");
    }

    static editCategory = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { name } = req.body;
        
        // Try to find category in db
        const categoryRepository = getRepository(Category);
        let category: Category;
        try {
            category = await categoryRepository.findOneOrFail(id);
        } catch (error) {
            var infoForLog = "Category not found: " + id;
            categoryLogger.info(infoForLog);
            res.status(404).send("Category not found");
            return;
        }
        
        //Try to save
        try {
            await categoryRepository.save(category);
        } catch (error) {
            res.status(409).send("Name already in use");
        }

        res.status(204).send();
    }
    static deleteCategory = async (req: Request, res: Response) => {
        const id = req.params.id;

        const categoryRepository = getRepository(Category);
        let category: Category;
        try {
            category = await categoryRepository.findOneOrFail(id);
        } catch (error) {
            var infoForLog = "Category not found: " + id;
            categoryLogger.info(infoForLog);
            res.status(404).send("Category not found");
            return;
        }
        categoryRepository.delete(id);

        var deletedInfoForLog = "Deletion: " + Category.name;
        categoryLogger.info(deletedInfoForLog);
        res.status(204).send();
    }
    
};


export default CategoryController;
