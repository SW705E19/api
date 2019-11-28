import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import userService from '../services/userService';
import { expect } from 'chai';
import { checkRole } from '../middlewares/checkRole';
import { Rating } from '../entity/rating';

describe('Check role middleware', function() {
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
	};

	it('returns status 401 if service fails', async function() {
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

		const mockGetBy = sinon.stub(userService, 'getById').throws();
		const next = sinon.spy();
		const checkRoleCall = checkRole(['ADMIN']);
		await checkRoleCall(req, res, next);

		expect(res.statusCode).to.equal(401);
		mockGetBy.restore();
	});

	it('returns error message if service fails', async function() {
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

		const mockGetByTest = sinon.stub(userService, 'getById').throws('exception');

		const checkRoleCall = checkRole(['ADMIN']);
		const checkRoleRes = await checkRoleCall(req, res, null);

		expect(checkRoleRes).to.not.be.null;
		mockGetByTest.restore();
	});

	it('calls next if role is found', async function() {
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
		});

		const next = sinon.spy();

		const getByIdStub = sinon.stub(userService, 'getById').resolves(mockUser);

		const checkRoleCall = checkRole(['ADMIN']);
		await checkRoleCall(req, res, next);

		expect(next.calledOnce).to.be.true;
		getByIdStub.restore();
	});

	it('returns status 401 if role is not found', async function() {
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
			sendStatus: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const mockGetBy401 = sinon.stub(userService, 'getById').resolves(mockUser);

		const checkRoleCall = checkRole(['FORBIDDEN']);
		await checkRoleCall(req, res, null);
		expect(res.statusCode).to.be.equal(401);
		mockGetBy401.restore();
	});
});
