import { getRepository, Repository, DeleteResult } from 'typeorm';
import { Service } from '../entity/service';

class ServiceService {
	static getAll = async (): Promise<Service[]> => {
		//Get all categories from database
		const serviceRepository: Repository<Service> = getRepository(Service);
		const services: Service[] = await serviceRepository
			.createQueryBuilder('service')
			.innerJoin('service.tutorInfo', 'tutorInfo')
			.addSelect(['tutorInfo.id'])
			.innerJoin('tutorInfo.user', 'user')
			.addSelect(['user.firstName', 'user.lastName'])
			.getMany();
		return services;
	};

	static getById = async (id: string): Promise<Service> => {
		//Get category from database
		const serviceRepository: Repository<Service> = getRepository(Service);
		const service = await serviceRepository.findOneOrFail(id);

		return service;
	};

	static getDetailedById = async (id: string): Promise<Service> => {
		//Get category from database
		const serviceRepository: Repository<Service> = getRepository(Service);
		const service = await serviceRepository
			.createQueryBuilder('service')
			.innerJoinAndSelect('service.categories', 'category')
			.innerJoinAndSelect('service.tutorInfo', 'tutorInfo')
			.innerJoin('tutorInfo.user', 'user')
			.addSelect(['user.id', 'user.username', 'user.firstName', 'user.lastName'])
			.where('service.id = :serviceId', { serviceId: id })
			.getOne();

		return service;
	};

	static getByCategoryName = async (categoryName: string): Promise<Service[]> => {
		const serviceRepository = getRepository(Service);
		return await serviceRepository
			.createQueryBuilder('service')
			.innerJoinAndSelect('service.categories', 'category')
			.where('category.name = :category', { category: categoryName })
			.getMany();
	};

	static save = async (service: Service): Promise<Service> => {
		const serviceRepository: Repository<Service> = getRepository(Service);
		return await serviceRepository.save(service);
	};

	static deleteById = async (id: string): Promise<DeleteResult> => {
		//Get category from database
		const serviceRepository: Repository<Service> = getRepository(Service);
		const service = await serviceRepository.delete(id);

		return service;
	};
}
export default ServiceService;
