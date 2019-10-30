import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Service } from "../entity/Service";
import serviceLogger from "../logging/services/serviceLogger";

class ServiceController{

    listAll = async (req: Request, res: Response) => {
        const serviceRepository = getRepository(Service);
        const services = await serviceRepository.find();

        res.send(services);
    };

    getOneByID = async (req: Request, res: Response) => {
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

    newService = async (req: Request, res: Response) => {
        const {description, tutor, name} = req.body;
        const service = new Service();
        service.description = description;
        service.tutor = tutor;
        service.name = name;

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
            res.status(400).send('Could not create service');
			return;
        }
    };

    editService = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {description, tutor, name} = req.body;
        let service = new Service();

        const serviceRepository = getRepository(Service);

        try {
            service = await serviceRepository.findOne(id);
        } catch (error) {
            serviceLogger.error(error);
            res.status(404).send('Service was not found');
        }

        service.description = description;
        service.tutor = tutor;
        service.name = name;
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
    
}

export default ServiceController;