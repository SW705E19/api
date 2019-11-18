import * as sinon from 'sinon';
import AuthController from '../controllers/authController';
import { mockReq, mockRes } from 'sinon-express-mock';
import authService from '../services/authService';
import { User } from '../entity/user';

describe('auth controller', function() {
	it('calls service get with admin as username', async function() {
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
			tutorInfo: null,
			hashPassword: () => {
				return '$2a$08$XhgejAH/gB9z9buss73hJOkZnpwN7W5/QLPtrvti5QbFPb6.kmQNa';
			},
			checkIfUnencryptedPasswordIsValid: () => {
				return true;
			},
		};

		const request = {
			body: {
				username: mockUser.username,
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes();

		const stubResult = sinon.stub(authService, 'getUserByUsername').resolves(mockUser);
		AuthController.login(req, res);

		sinon.assert.calledWith(stubResult, mockUser.username);
	});
});
