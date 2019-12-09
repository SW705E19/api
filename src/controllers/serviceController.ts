import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Service } from '../entity/service';
import serviceLogger from '../logging/services/serviceLogger';
import ServiceService from '../services/serviceService';
import { recommender } from '../recommender/recommender';

class ServiceController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const services = await ServiceService.getAll();
		return res.status(200).send(services);
	};

	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;
		let service: Service;

		try {
			service = await ServiceService.getById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Service not found');
		}
		return res.status(200).send(service);
	};

	static getDetailedById = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;
		let service: Service;

		try {
			service = await ServiceService.getDetailedById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Service not found');
		}
		return res.status(200).send(service);
	};

	static getByCategory = async (req: Request, res: Response): Promise<Response> => {
		const category: string = req.params.category;
		let services: Service[];

		try {
			services = await ServiceService.getByCategoryName(category);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Could not find services');
		}
		return res.status(200).send(services);
	};

	static newService = async (req: Request, res: Response): Promise<Response> => {
		const { description, tutorInfo, name, categories } = req.body;
		const service = new Service();
		service.description = description;
		service.tutorInfo = tutorInfo;
		service.name = name;
		service.categories = categories;

		if (categories === undefined || categories.length === 0) {
			return res.status(400).send('Service must include atleast one category');
		}

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			return res.status(400).send(errors);
		}

		let createdService;
		try {
			createdService = await ServiceService.save(service);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(400).send('Could not create service');
		}

		const serviceInfoForLog: string = 'Created: ' + service.name + ', ' + service.description;
		serviceLogger.info(serviceInfoForLog);
		return res.status(201).send(createdService);
	};

	static editService = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;
		const { description, tutorInfo, name, categories } = req.body;
		let service = new Service();

		try {
			service = await ServiceService.getById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Service was not found');
		}

		service.description = description;
		service.tutorInfo = tutorInfo;
		service.name = name;
		service.categories = categories;

		if (categories === undefined || categories.length === 0) {
			return res.status(400).send('Service must include atleast one category');
		}

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			return res.status(400).send(errors);
		}

		let editedService;
		try {
			editedService = await ServiceService.save(service);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(400).send('Could not save service');
		}
		return res.status(200).send(editedService);
	};

	static deleteService = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;
		let service: Service;

		try {
			service = await ServiceService.getDetailedById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Could not find service');
		}

		await ServiceService.deleteById(id);
		const deletedInfoForLog: string = 'Deletion: service "' + service.name + '" was deleted';

		serviceLogger.info(deletedInfoForLog);

		return res.status(200).send();
	};

	static doRecommender = async (req: Request, res: Response): Promise<Response> => {
		const recommendations = await recommender();
		return res.status(200).send(recommendations);
	};
}

export default ServiceController;
