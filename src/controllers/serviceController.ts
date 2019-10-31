import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Service } from "../entity/service";
import serviceLogger from "../logging/services/serviceLogger";

class ServiceController{

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

    static newService = async (req: Request, res: Response) => {
        const {description, tutorInfo, name, categories} = req.body;
        const service = new Service();
        service.description = description;
        service.tutorInfo = tutorInfo;
        service.name = name;
        service.categories = categories;

        //Validade if the parameters are ok
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
            console.log(error);
            res.status(400).send('Could not create service');
			return;
        }
    };

    static editService = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {description, tutorInfo, name, categories} = req.body;
        let service = new Service();

        const serviceRepository = getRepository(Service);

        try {
            service = await serviceRepository.findOne(id);
        } catch (error) {
            serviceLogger.error(error);
            res.status(404).send('Service was not found');
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
    }

    static deleteService = async (req: Request, res: Response) => {
        const id = req.body.id;

        const serviceRepository = getRepository(Service);
        let service: Service;

        try {
            service = await serviceRepository.findOne(id);
        } catch (error) {
            serviceLogger.error(error);
            res.status(404).send('Could not find service');
            return
        }
        serviceRepository.delete(service);

        serviceRepository.delete(id);

		const deletedInfoForLog: string = 'Deletion: ' + service.name + ', ' + service.tutorInfo.user.username;
		serviceLogger.info(deletedInfoForLog);

		//After all send a 204 (no content, but accepted) response
		res.status(204).send();
    }
    
}

export default ServiceController;