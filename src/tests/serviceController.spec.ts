import * as sinon from 'sinon';
import { Service } from '../entity/service';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import ServiceController from '../controllers/serviceController';
import ServiceService from '../services/serviceService';
import { ValidationError } from 'class-validator';
import * as validator from 'class-validator';
import { DeleteResult } from 'typeorm';
import { Rating } from '../entity/rating';
import { Category } from '../entity/category';
import { Recommendation } from '../entity/recommendation';

describe('Service controller tests', () => {
	const mockServices: Service[] = [
		{
			id: 1,
			name: 'service1',
			description: 'I am a service',
			categories: [
				{
					id: 1,
					name: 'math',
					description: 'I am Math',
					services: [],
				},
				{
					id: 2,
					name: 'programming',
					description: 'I am coder',
					services: [],
				},
			],
			tutorInfo: {
				id: 1,
				description: 'I am a tutor',
				userId: 1,
				user: {
					id: 1,
					email: 'john@bob.dk',
					firstName: 'john',
					lastName: 'bob',
					password: 'admin',
					roles: ['ADMIN'],
					createdAt: new Date(),
					updatedAt: new Date(),
					tutorInfo: null,
					phoneNumber: '11223344',
					education: '',
					address: '',
					dateOfBirth: new Date(),
					avatarUrl: '',
					languages: ['', ''],
					subjectsOfInterest: ['', ''],
					ratings: [new Rating(), new Rating()],
					recommendations: [new Recommendation(), new Recommendation()],
				},
				services: [],
				acceptedPayments: ['', ''],
			},
			ratings: [new Rating(), new Rating()],
			recommendations: [new Recommendation(), new Recommendation()],
			image: '',
		},
		{
			id: 2,
			name: 'service2',
			description: 'I am a service',
			categories: [
				{
					id: 1,
					name: 'math',
					description: 'I am Math',
					services: [],
				},
				{
					id: 2,
					name: 'programming',
					description: 'I am coder',
					services: [],
				},
			],
			tutorInfo: {
				id: 1,
				description: 'I am a tutor',
				userId: 1,
				user: {
					id: 1,
					email: 'john@bob.dk',
					firstName: 'john',
					lastName: 'bob',
					password: 'admin',
					roles: ['ADMIN'],
					createdAt: new Date(),
					updatedAt: new Date(),
					tutorInfo: null,
					phoneNumber: '11223344',
					education: '',
					address: '',
					dateOfBirth: new Date(),
					avatarUrl: '',
					languages: ['', ''],
					subjectsOfInterest: ['', ''],
					ratings: [new Rating(), new Rating()],
					recommendations: [new Recommendation(), new Recommendation()],
				},
				services: [],
				acceptedPayments: ['', ''],
			},
			ratings: [new Rating(), new Rating()],
			recommendations: [new Recommendation(), new Recommendation()],
			image: '',
		},
	];

	afterEach(() => {
		sinon.restore();
	});

	it('list all services returns status 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getAll').resolves(mockServices);
		await ServiceController.listAll(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('get service by id returns status 200', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getById').resolves(mockServices.find(x => x.id === req.params.id));
		await ServiceController.getOneById(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('get detailed service by id returns status 200', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getDetailedById').resolves(mockServices.find(x => x.id === req.params.id));
		await ServiceController.getDetailedById(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should return status 404 on get service by id service not found', async () => {
		const req = mockReq({
			params: {
				id: 3,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getById').throws();
		await ServiceController.getOneById(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should return status 404 on get detailed service by id service not found', async () => {
		const req = mockReq({
			params: {
				id: 3,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getDetailedById').throws();
		await ServiceController.getDetailedById(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should return status 200 on get service by category', async () => {
		const req = mockReq({
			params: {
				category: 'math',
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getByCategoryName').resolves(mockServices);
		await ServiceController.getByCategory(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should return status 404 on get service by category with wrong category', async () => {
		const req = mockReq({
			params: {
				category: 'not a category name',
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getByCategoryName').throws();
		await ServiceController.getByCategory(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should create a new service and return 201', async () => {
		const service = {
			name: 'new service',
			description: 'new service description',
			categories: [new Category(), new Category()],
			tutorInfo: {
				id: 1,
			},
		};

		const req = mockReq({
			body: service,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'save').resolves(mockServices[0]);
		await ServiceController.newService(req, res);
		expect(res.statusCode).to.equal(201);
	});

	it('should fail to create a new service and return 400', async () => {
		const service = {
			name: 'new service',
			description: 'new service description',
			tutorInfo: {
				id: 1,
			},
		};

		const req = mockReq({
			body: service,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'save').throws();
		await ServiceController.newService(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should fail to create a new service and return 400', async () => {
		const service = {
			name: '',
			description: '',
			tutorInfo: {
				id: 1,
			},
		};

		const req = mockReq({
			body: service,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await ServiceController.newService(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should edit service and return status 200', async () => {
		const service = {
			name: 'edit service',
			description: 'edit service description',
			tutorInfo: {
				id: 1,
			},
			categories: [new Category(), new Category()],
		};

		const req = mockReq({
			body: service,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getById').resolves(mockServices.find(x => x.id === req.params.id));
		sinon.stub(ServiceService, 'save').resolvesArg(0);
		await ServiceController.editService(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should fail to edit service and return status 400', async () => {
		const service = {
			name: '',
		};

		const req = mockReq({
			body: service,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getById').resolves(mockServices.find(x => x.id === req.params.id));
		sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await ServiceController.editService(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should fail to edit service and return status 400', async () => {
		const service = {
			name: 'edit service',
			description: 'edit service',
			tutorInfo: {
				id: 1,
			},
		};

		const req = mockReq({
			body: service,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getById').resolves(mockServices.find(x => x.id === req.params.id));
		sinon.stub(ServiceService, 'save').throws();
		await ServiceController.editService(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should delete service and return status 200', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getDetailedById').resolves(mockServices.find(x => x.id === req.params.id));
		sinon.stub(ServiceService, 'deleteById').resolves(new DeleteResult());
		await ServiceController.deleteService(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should fail to delete service and return status 404', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(ServiceService, 'getDetailedById').throws();
		await ServiceController.deleteService(req, res);
		expect(res.statusCode).to.equal(404);
	});
});
