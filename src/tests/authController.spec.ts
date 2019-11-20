import * as sinon from 'sinon';
import AuthController from '../controllers/authController';
import { mockReq, mockRes } from 'sinon-express-mock';
import userService from '../services/userService';
import { User } from '../entity/user';

describe('auth controller', function() {
	it('calls service get with admin as username', async function() {
		const mockUser = {
			id: 1,
			email: 'john@bob.dk',
			firstName: 'john',
			lastName: 'bob',
			password: 'admin',
			roles: ['ADMIN'],
			phoneNumber: '44556677',
			education: 'Math',
			address: 'adminvej 2',
			languages: ['Danish'],
			subjectsOfInterest: ['Math'],
			

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
				email: mockUser.email,
				password: mockUser.password,
			},
		};
		const req = mockReq(request);
		const res = mockRes();

		const stubResult = sinon.stub(userService, 'getByEmail').resolves(mockUser);
		AuthController.login(req, res);

		sinon.assert.calledWith(stubResult, mockUser.email);
	});
});
