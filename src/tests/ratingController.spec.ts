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
import { Recommendation } from '../entity/recommendation';

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
	const mockAverageRatings: Rating[] = [
		{
			id: 3,
			rating: 4,
			description: 'I am 4 rating',
			service: {
				id: 2,
				description: 'Service that is good',
				name: 'Good service',
				tutorInfo: null,
				categories: null,
				ratings: null,
				recommendations: [new Recommendation(), new Recommendation()],
				image: '',
			},
			user: new User(),
		},
		{
			id: 4,
			rating: 2,
			description: 'I am 2 rating',
			service: {
				id: 2,
				description: 'Service that is bad',
				name: 'Bad service',
				tutorInfo: null,
				categories: null,
				ratings: null,
				recommendations: [new Recommendation(), new Recommendation()],
				image: '',
			},
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

	it('Get average rating returns 200', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RatingService, 'getAverageRatingByServiceId').resolves(mockAverageRatings);
		await RatingController.getAverageRatingByServiceId(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('Should properly call the average rating function', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function() {
				return {
					send: (e: Rating[]): Rating[] => {
						return e;
					},
				};
			},
		});
		sinon.stub(RatingService, 'getAverageRatingByServiceId').resolves(mockAverageRatings);
		const ratingAVG = await RatingController.getAverageRatingByServiceId(req, res);
		expect(ratingAVG).equals(mockAverageRatings);
	});

	it('should fail to get average by id and return status 404', async () => {
		const req = mockReq();
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(RatingService, 'getAverageRatingByServiceId').throws();
		await RatingController.getAverageRatingByServiceId(req, res);
		expect(res.statusCode).to.equal(404);
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
