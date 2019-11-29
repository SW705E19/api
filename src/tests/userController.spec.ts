import * as sinon from 'sinon';
import { User } from '../entity/user';
import { mockReq, mockRes } from 'sinon-express-mock';
import UserService from '../services/userService';
import UserController from '../controllers/userController';
import { expect } from 'chai';
import { TutorInfo } from '../entity/tutorInfo';
import { Service } from '../entity/service';
import { ValidationError } from 'class-validator';
import * as validator from 'class-validator';
import { DeleteResult } from 'typeorm';

describe('User controller tests', () => {
	const mockUsers: User[] = [
		{
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
		},
		{
			id: 2,
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
		},
	];

	const mockTutorInfo: TutorInfo = {
		id: 1,
		description: 'i am a tutor',
		acceptedPayments: ['', ''],
		services: [new Service(), new Service()],
		user: mockUsers[0],
	};

	afterEach(() => {
		sinon.restore();
	});

	it('list all services returns status 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getAll').resolves(mockUsers);
		await UserController.listAll(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should get user by id and return status 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		await UserController.getOneById(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should fail to get user by id and return status 404', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').throws();
		await UserController.getOneById(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should get tutor info by userid and return status 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getTutorByUserId').resolves(mockTutorInfo);
		await UserController.getOneTutorInfoByUserId(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should get tutor info by userid and return status 404', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getTutorByUserId').throws();
		await UserController.getOneTutorInfoByUserId(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should edit the user and return status 200', async () => {
		const req = mockReq({
			body: mockUsers[0],
			params: {
				id: 1,
			},
		});

		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(UserService, 'save').resolvesArg(0);
		await UserController.editUser(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should fail to edit the user and return status 404 because the user is not found', async () => {
		const req = mockReq({
			body: mockUsers[0],
			params: {
				id: 1,
			},
		});

		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').throws();
		await UserController.editUser(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should fail to edit the user and return status 400 because the body request contains errors', async () => {
		const req = mockReq({
			body: mockUsers[0],
			params: {
				id: 1,
			},
		});

		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await UserController.editUser(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should fail to edit the user and return status 400 because it failed to save to db', async () => {
		const req = mockReq({
			body: mockUsers[0],
			params: {
				id: 1,
			},
		});

		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(UserService, 'save').throws();
		await UserController.editUser(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should delete user and return status 204', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(UserService, 'deleteById').resolves(new DeleteResult());
		await UserController.deleteUser(req, res);
		expect(res.statusCode).to.equal(204);
	});

	it('should fail to delete user and return status 404', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').throws();
		await UserController.deleteUser(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should create a new tutor and return status 201', async () => {
		const req = mockReq({
			body: mockTutorInfo,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(UserService, 'saveTutor').resolves(mockTutorInfo);
		await UserController.newTutor(req, res);
		expect(res.statusCode).to.equal(201);
	});

	it('should fail to create a new tutor and return status 404 because user is not found', async () => {
		const req = mockReq({
			body: mockTutorInfo,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').throws();
		sinon.stub(UserService, 'saveTutor').resolvesArg(0);
		await UserController.newTutor(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('should fail to create a new tutor and return status 400 because of validation error', async () => {
		const req = mockReq({
			body: mockTutorInfo,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await UserController.newTutor(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should fail to create a new tutor and return status 400 of failing to save', async () => {
		const req = mockReq({
			body: mockTutorInfo,
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: any) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(UserService, 'getById').resolves(mockUsers[0]);
		sinon.stub(UserService, 'save').throws();
		await UserController.newTutor(req, res);
		expect(res.statusCode).to.equal(400);
	});
});
