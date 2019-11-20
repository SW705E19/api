import * as sinon from 'sinon';
import AuthController from '../controllers/authController';
import { mockReq, mockRes } from 'sinon-express-mock';
import userService from '../services/userService';
import { User } from '../entity/user';
import { should, expect } from 'chai';
import { doesNotThrow } from 'assert';
import * as bcrypt from 'bcryptjs';

describe('auth controller', function () {
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
