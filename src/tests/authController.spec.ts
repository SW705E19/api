import * as sinon from 'sinon';
import AuthController from '../controllers/authController';
import { mockReq, mockRes } from 'sinon-express-mock';
import userService from '../services/userService';
import { expect } from 'chai';
import * as bcrypt from 'bcryptjs';
import * as validator from 'class-validator';
import { ValidationError } from 'class-validator';
import { Rating } from '../entity/rating';
import { Recommendation } from '../entity/recommendation';

describe('auth controller login', function() {
	/* Default user for connection testing */
	const mockUser = {
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
	};

	it('calls service get with correct email', async function() {
		const request = {
			body: {
				email: mockUser.email,
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes();

		const stubResult = sinon.stub(userService, 'getByEmail').resolves(mockUser);
		await AuthController.login(req, res);

		sinon.assert.calledWith(stubResult, mockUser.email);
		stubResult.restore();
	});

	it('returns status 400 if service throws exception', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);

		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		const stubResult = sinon.stub(userService, 'getByEmail').throws('exception');

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);
		stubResult.restore();
	});

	it('returns error message if service throws exception', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);

		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const stubResult = sinon.stub(userService, 'getByEmail').throws('exception');

		const authRes = await AuthController.login(req, res);
		expect(authRes).to.not.be.null;
		stubResult.restore();
	});

	it('returns status 400 with no email specified for login', async () => {
		const request = {
			body: {
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns error message with no email specified for login', async () => {
		const request = {
			body: {
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.login(req, res);
		expect(authRes).to.equal('Email or password is not specified.');
	});

	it('returns status 400 with no password specified for login', async () => {
		const request = {
			body: {
				email: mockUser.email,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns error message with no password specified for login', async () => {
		const request = {
			body: {
				email: mockUser.email,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.login(req, res);
		expect(authRes).to.equal('Email or password is not specified.');
	});

	it('returns status 401 if unencrypted pasword is invalid', async () => {
		const request = {
			body: {
				email: mockUser.email,
				password: mockUser.password,
			},
		};

		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);

		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(401);
		compareSyncStub.restore();
	});
	it('returns error if unencrypted pasword is invalid', async () => {
		const request = {
			body: {
				email: mockUser.email,
				password: mockUser.password,
			},
		};

		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);
		const getByEmailStub = sinon.stub(userService, 'getByEmail').resolves(mockUser);

		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.login(req, res);
		expect(authRes).to.equal('Wrong password.');
		compareSyncStub.restore();
		getByEmailStub.restore();
	});

	it('returns status 200 if login details are valid', async () => {
		const request = {
			body: {
				email: mockUser.email,
				password: mockUser.password,
			},
		};

		const getByEmailStub = sinon.stub(userService, 'getByEmail').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);

		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(200);
		compareSyncStub.restore();
		getByEmailStub.restore();
	});

	it('returns token if login details are valid', async () => {
		const request = {
			body: {
				email: mockUser.email,
				password: mockUser.password,
			},
		};

		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const getByEmailStub = sinon.stub(userService, 'getByEmail').resolves(mockUser);

		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.login(req, res);
		expect(authRes).to.not.be.null;
		compareSyncStub.restore();
		getByEmailStub.restore();
	});
});

describe('auth controller changePassword', function() {
	/* Default user for connection testing */
	const mockUser = {
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
	};

	it('calls service getById with right id', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
		});

		const stubResult = sinon.stub(userService, 'getById').resolves(mockUser);
		await AuthController.changePassword(req, res);

		sinon.assert.calledWith(stubResult, mockUser.id);
		stubResult.restore();
	});

	it('returns status 400 if no old password is specified', async function() {
		const request = {
			body: {
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.changePassword(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns error message if no old password is specified', async function() {
		const request = {
			body: {
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.changePassword(req, res);
		expect(authRes).to.equal('Old or new password is not specified.');
	});

	it('returns status 400 if no new password is specified', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.changePassword(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns error message if no new password is specified', async function() {
		const request = {
			body: {
				oldPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.changePassword(req, res);
		expect(authRes).to.equal('Old or new password is not specified.');
	});

	it('returns status 400 if no new or old password is specified', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		await AuthController.changePassword(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns error message if no new or old password is specified', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const authRes = await AuthController.changePassword(req, res);
		expect(authRes).to.equal('Old or new password is not specified.');
	});

	it('returns status 503 if userService get fails', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').throws('exception');
		await AuthController.changePassword(req, res);
		getByIdStub.restore();

		expect(res.statusCode).to.equal(503);
	});

	it('returns error message if userService get fails', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').throws('exception');
		const authRes = await AuthController.changePassword(req, res);

		expect(authRes).to.not.be.null;
		getByIdStub.restore();
	});

	it('returns 401 error new password is same as old', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();

		expect(res.statusCode).to.equal(401);
	});

	it('returns error message if new password is same as old', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);
		const authRes = await AuthController.changePassword(req, res);
		expect(authRes).to.equal('New password is the same as old.');
		getByIdStub.restore();
		compareSyncStub.restore();
	});

	it('returns 400 error if new model is not valid', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const validateStub = sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();
		validateStub.restore();

		expect(res.statusCode).to.equal(400);
	});

	it('returns 204 success if model is valid', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);
		const userSaveStub = sinon.stub(userService, 'save').resolves(mockUser);
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();
		validateStub.restore();
		hashSyncStub.restore();
		userSaveStub.restore();
		expect(res.statusCode).to.equal(204);
	});

	it('returns user success if model is valid', async function() {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: mockUser.id,
				},
			},
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);
		const userSaveStub = sinon.stub(userService, 'save').resolves(mockUser);

		const authRes = await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();
		validateStub.restore();
		hashSyncStub.restore();
		userSaveStub.restore();
		expect(authRes).to.equal(mockUser);
	});
});

describe('auth controller register', function() {
	/* Default user for connection testing */
	const mockUser = {
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
	};

	it('returns error if new model is not valid', async function() {
		const request = {
			body: {},
		};

		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		const authRes = await AuthController.register(req, res);
		validateStub.restore();

		expect(authRes).to.not.be.null;
	});

	it('returns 400 error if new model is not valid', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await AuthController.register(req, res);
		validateStub.restore();

		expect(res.statusCode).to.equal(400);
	});

	it('returns 409 error if userService save fails', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const saveStub = sinon.stub(userService, 'save').throws('exception');
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);

		await AuthController.register(req, res);
		validateStub.restore();
		saveStub.restore();
		hashSyncStub.restore();

		expect(res.statusCode).to.equal(409);
	});

	it('returns error message if userService save fails', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const saveStub = sinon.stub(userService, 'save').throws('exception');
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);

		const authRes = await AuthController.register(req, res);
		validateStub.restore();
		saveStub.restore();
		hashSyncStub.restore();

		expect(authRes).to.not.be.null;
	});

	it('returns 201 error if input is valid', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const saveStub = sinon.stub(userService, 'save').resolves(mockUser);
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);

		await AuthController.register(req, res);
		validateStub.restore();
		saveStub.restore();
		hashSyncStub.restore();

		expect(res.statusCode).to.equal(201);
	});

	it('returns user if input is valid', async function() {
		const request = {
			body: {},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function() {
				return {
					send: (e: string): string => {
						return e;
					},
				};
			},
		});

		const validateStub = sinon.stub(validator, 'validate').resolves([]);
		const saveStub = sinon.stub(userService, 'save').resolves(mockUser);
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);

		const authRes = await AuthController.register(req, res);
		validateStub.restore();
		saveStub.restore();
		hashSyncStub.restore();

		expect(authRes).to.equal(mockUser);
	});
});
