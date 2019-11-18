import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Service } from '../entity/service';
import serviceLogger from '../logging/services/serviceLogger';
import ServiceService from '../services/serviceService';

class ServiceController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const services = await ServiceService.getAll();

		return res.send(services);
	};

	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		const id: string = req.params.id;
		let service: Service;

		try {
			service = await ServiceService.getById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Service not found');
		}
		return res.send(service);
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
		return res.send(services);
	};

	static newService = async (req: Request, res: Response): Promise<Response> => {
		const { description, tutorInfo, name, categories } = req.body;
		const service = new Service();
		service.description = description;
		service.tutorInfo = tutorInfo;
		service.name = name;
		service.categories = categories;

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			return res.status(400).send(errors);
		}

		try {
			await ServiceService.save(service);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(400).send('Could not create service');
		}

		const serviceInfoForLog: string = 'Created: ' + service.name + ', ' + service.description;
		serviceLogger.info(serviceInfoForLog);
		return res.status(201).send('Service created');
	};

	static editService = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id;
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

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			return res.status(400).send(errors);
		}

		try {
			await ServiceService.save(service);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(500).send('Could not save service');
		}
		return res.status(204).send();
	};

	static deleteService = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id;
		let service: Service;

		try {
			service = await ServiceService.getDetailedById(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('Could not find service');
		}

		if (service == null) {
			return res.status(404).send(`A service with id ${id} does not exist`);
		}

		await ServiceService.deleteById(id);
		const deletedInfoForLog: string =
			'Deletion: Tutor "' + service.tutorInfo.user.username + '"\'s service "' + service.name + '" was deleted';

		serviceLogger.info(deletedInfoForLog);

		return res.status(204).send();
	};
}

export default ServiceController;
