import * as sinon from 'sinon';
import { User } from '../entity/user';
import { mockReq, mockRes } from 'sinon-express-mock';
import UserService from '../services/userService';
import UserController from '../controllers/userController';
import { expect } from 'chai';
import { TutorInfo } from '../entity/tutorInfo';
import { Service } from '../entity/service';

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
});
