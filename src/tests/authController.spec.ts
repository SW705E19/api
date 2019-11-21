import * as sinon from 'sinon';
import AuthController from '../controllers/authController';
import { mockReq, mockRes } from 'sinon-express-mock';
import userService from '../services/userService';
import { expect } from 'chai';
import * as bcrypt from 'bcryptjs';
import * as validator from 'class-validator';
import { ValidationError } from 'class-validator';

describe('auth controller login', function () {
	/* Default user for connection testing */
	const mockUser = {
		id: 1,
		username: 'admin',
		email: 'john@bob.dk',
		firstName: 'john',
		lastName: 'bob',
		password: 'admin',
		roles: ['ADMIN'],
		createdAt: new Date(),
		updatedAt: new Date(),
		tutorInfo: null
	};

	it('calls service get with admin as username', async function () {
		const request = {
			body: {
				username: mockUser.username,
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes();

		const stubResult = sinon.stub(userService, 'getByUsername').resolves(mockUser);
		await AuthController.login(req, res);

		sinon.assert.calledWith(stubResult, mockUser.username);
		stubResult.restore();
	});

	it('returns status 400 with no username specified for login', async () => {
		const request = {
			body: {
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns status 400 with no password specified for login', async () => {
		const request = {
			body: {
				username: mockUser.username,
			},
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns status 401 with if unencrypted pasword is invalid', async () => {
		const request = {
			body: {
				username: mockUser.username,
				password: mockUser.password
			},
		};

		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);

		const req = mockReq(request);
		const res = mockRes({
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(401);
		compareSyncStub.restore();

	});

	it('returns status 200 with if login details are valid', async () => {
		const request = {
			body: {
				username: mockUser.username,
				password: mockUser.password
			},
		};

		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);

		const req = mockReq(request);
		const res = mockRes({
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(401);
		compareSyncStub.restore();
	});

});

describe('auth controller changePassword', function () {
	/* Default user for connection testing */
	const mockUser = {
		id: 1,
		username: 'admin',
		email: 'john@bob.dk',
		firstName: 'john',
		lastName: 'bob',
		password: 'admin',
		roles: ['ADMIN'],
		createdAt: new Date(),
		updatedAt: new Date(),
		tutorInfo: null
	};

	it('calls service getById with right id', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			}
		});

		const stubResult = sinon.stub(userService, 'getById').resolves(mockUser);
		await AuthController.changePassword(req, res);

		sinon.assert.calledWith(stubResult, mockUser.id);
		stubResult.restore();
	});

	it('returns status 400 if no old password is specified', async function () {
		const request = {
			body: {
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.changePassword(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('returns status 400 if no new password is specified', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.changePassword(req, res);
		expect(res.statusCode).to.equal(400);

	});

	it('returns status 400 if no new or old password is specified', async function () {
		const request = {
			body: {
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		await AuthController.login(req, res);
		expect(res.statusCode).to.equal(400);

		await AuthController.changePassword(req, res);
	});

	it('returns 503 error if userService get fails', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: 'abc123fbc!',
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		const getByIdStub = sinon.stub(userService, 'getById').throws('exception');
		await AuthController.changePassword(req, res);
		getByIdStub.restore();

		expect(res.statusCode).to.equal(503);
	});

	it('returns 401 error new password is same as old', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();

		expect(res.statusCode).to.equal(401);
	});

	it('returns 400 error if new model is not valid', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const validateStub = sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError])
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();
		validateStub.restore();

		expect(res.statusCode).to.equal(400);
	});

	it('returns 204 success if model is valid', async function () {
		const request = {
			body: {
				oldPassword: mockUser.password,
				newPassword: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes( {
			locals: {
				jwtPayload: {
					userId: mockUser.id
				}
			},
			status: function (s) { this.statusCode = s; return this; }
		});

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);
		const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);
		const validateStub = sinon.stub(validator, 'validate').resolves([])
		const hashSyncStub = sinon.stub(bcrypt, 'hashSync').resolves(mockUser.password);
		const userSaveStub = sinon.stub(userService, 'save').resolves(mockUser);
		await AuthController.changePassword(req, res);
		getByIdStub.restore();
		compareSyncStub.restore();
		validateStub.restore();

		expect(res.statusCode).to.equal(204);
	});

});
