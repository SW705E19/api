import { Rating } from '../entity/rating';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import { Service } from '../entity/service';
import { User } from '../entity/user';
import RatingService from '../services/ratingService';
import RatingController from '../controllers/ratingController';
import * as validator from 'class-validator';
import { ValidationError } from 'class-validator';

describe('Rating controller tests', () => {
	const mockRatings: Rating[] = [
		{
			id: 1,
			rating: 2,
			description: 'I am 2 rating',
			service: new Service(),
			user: new User(),
		},
		{
			id: 2,
			rating: 4,
			description: 'I am 4 rating',
			service: new Service(),
			user: new User(),
		},
	];

	afterEach(() => {
		sinon.restore();
	});

	it('list all ratings returns 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RatingService, 'getAll').resolves(mockRatings);
		await RatingController.listAll(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('should create a new rating, return 201', async () => {
		const rating = {
			rating: 3,
			description: 'I am a 3 rating',
			service: new User(),
			user: new User(),
		};
		const req = mockReq({
			body: rating,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RatingService, 'save').resolves(mockRatings[0]);
		await RatingController.newRating(req, res);
		expect(res.statusCode).to.equal(201);
	});

	it('should fail to create a new rating and return status 400', async () => {
		const rating = {
			rating: '3',
			description: 'I am a 3 rating',
			service: new Service(),
			user: new User(),
		};
		const req = mockReq({
			body: rating,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(validator, 'validate').resolves([new ValidationError(), new ValidationError()]);
		await RatingController.newRating(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('should fail to create a new rating and return status 400', async () => {
		const rating = {
			rating: '3',
			description: 'I am a 3 rating',
			service: new Service(),
			user: new User(),
		};
		const req = mockReq({
			body: rating,
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RatingService, 'save').throws();
		await RatingController.newRating(req, res);
		expect(res.statusCode).to.equal(400);
	});
});
