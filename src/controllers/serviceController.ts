import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { Service } from '../entity/service';
import serviceLogger from '../logging/services/serviceLogger';

class ServiceController {
	static listAll = async (req: Request, res: Response) => {
		const serviceRepository = getRepository(Service);
		const services = await serviceRepository.find();

		res.send(services);
	};

	static getOneById = async (req: Request, res: Response) => {
		const id: string = req.params.id;
		const serviceRepository = getRepository(Service);
		let service: Service;

		try {
			service = await serviceRepository.findOne(id);
		} catch (error) {
			serviceLogger.error(error);
			res.status(404).send('Service not found');
		}
		res.send(service);
	};

	static getByCategory = async (req: Request, res: Response) => {
		const category: string = req.params.category;
		const serviceRepository = getRepository(Service);
		let services: Service[];

		try {
			services = await serviceRepository
				.createQueryBuilder('service')
				.innerJoinAndSelect('service.categories', 'category')
				.where('category.name = :category', { category: category })
				.getMany();
		} catch (error) {
			serviceLogger.error(error);
			res.status(404).send('Could not find services');
			return;
		}
		res.send(services);
	};

	static newService = async (req: Request, res: Response) => {
		const { description, tutorInfo, name, categories } = req.body;
		const service = new Service();
		service.description = description;
		service.tutorInfo = tutorInfo;
		service.name = name;
		service.categories = categories;

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			res.status(400).send(errors);
			return;
		}

		const serviceRepository = getRepository(Service);

		try {
			await serviceRepository.save(service);
		} catch (error) {
			serviceLogger.error(error);
			res.status(400).send('Could not create service');
			return;
		}

		const serviceInfoForLog: string = 'Created: ' + service.name + ', ' + service.description;
		serviceLogger.info(serviceInfoForLog);
		res.status(201).send('Service created');
	};

	static editService = async (req: Request, res: Response) => {
		const id = req.params.id;
		const { description, tutorInfo, name, categories } = req.body;
		let service = new Service();

		const serviceRepository = getRepository(Service);

		try {
			service = await serviceRepository.findOne(id);
		} catch (error) {
			serviceLogger.error(error);
			res.status(404).send('Service was not found');
			return;
		}

		service.description = description;
		service.tutorInfo = tutorInfo;
		service.name = name;
		service.categories = categories;

		const errors = await validate(service);
		if (errors.length > 0) {
			serviceLogger.error(errors);
			res.status(400).send(errors);
			return;
		}

		try {
			await serviceRepository.save(service);
		} catch (error) {
			serviceLogger.error(error);
			res.status(500).send('Could not save service');
			return;
		}
		res.status(204).send();
	};

	static deleteService = async (req: Request, res: Response) => {
		const id = req.params.id;

		const serviceRepository = getRepository(Service);
		let service: Service;

		try {
			service = await serviceRepository
				.createQueryBuilder('service')
				.innerJoinAndSelect('service.categories', 'category')
				.innerJoinAndSelect('service.tutorInfo', 'tutorInfo')
				.innerJoin('tutorInfo.user', 'user')
				.addSelect(['user.id', 'user.username', 'user.firstName', 'user.lastName'])
				.where('service.id = :serviceId', { serviceId: id })
				.getOne();
		} catch (error) {
			serviceLogger.error(error);
			res.status(404).send('Could not find service');
			return;
		}

		if (service == null) {
			res.status(404).send(`A service with id ${id} does not exist`);
			return;
		}

		await serviceRepository.delete(service);
		const deletedInfoForLog: string =
			'Deletion: Tutor "' + service.tutorInfo.user.username + '"\'s service "' + service.name + '" was deleted';

		serviceLogger.info(deletedInfoForLog);

		res.status(204).send();
	};
}

export default ServiceController;
