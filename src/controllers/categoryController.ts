
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Category } from "../entity/category";

class CategoryController{

    static listAll = async (req: Request, res: Response) => {
        const categoryRepository = getRepository(Category);
        const categorys = await categoryRepository.find();
        res.send(categorys);  
    }
};

export default CategoryController;
