import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import { Recommendation } from '../entity/recommendation';
import { User } from '../entity/user';
import { Service } from '../entity/service';
import RecommendationService from '../services/recommendationService';
import RecommendationController from '../controllers/recommendationController';
import Recommender from '../recommender/recommender';

describe('Recommendation controller tests', () => {
	const mockRecommendations: Recommendation[] = [
		{
			id: 1,
			value: 4,
			userId: 1,
			serviceId: 8,
			user: new User(),
			service: new Service(),
		},
		{
			id: 2,
			value: 3,
			userId: 2,
			serviceId: 10,
			user: new User(),
			service: new Service(),
		},
	];

	const mockMatrix: number[][] = [];

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
		sinon.stub(RecommendationService, 'getAll').resolves(mockRecommendations);
		await RecommendationController.listAll(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('Calculates recommendations and saves to db returning status 201', async () => {
		const req = mockReq({});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(Recommender, 'calculateRecommendations').resolves(mockMatrix);
		sinon.stub(RecommendationService, 'clearRecommendations').returns(null);
		sinon.stub(RecommendationService, 'save').resolves(mockRecommendations);
		await RecommendationController.calculateRecommendations(req, res);
		expect(res.statusCode).to.equal(201);
	});

	it('Calculates recommendations and fails to save to db returning status 400', async () => {
		const req = mockReq({});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(Recommender, 'calculateRecommendations').resolves(mockMatrix);
		sinon.stub(RecommendationService, 'clearRecommendations').returns(null);
		sinon.stub(RecommendationService, 'save').throws();
		await RecommendationController.calculateRecommendations(req, res);
		expect(res.statusCode).to.equal(400);
	});

	it('Gets recommendations by user id and returns status 200', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getRecommendationsByUserId').resolves(mockRecommendations);
		await RecommendationController.getRecommendationsByUserId(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('Fails to get recommendations by user id and returns status 404', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getRecommendationsByUserId').throws();
		await RecommendationController.getRecommendationsByUserId(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('Gets top recommendations by user id and returns status 200', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getTopRecommendationsByUserId').resolves(mockRecommendations);
		await RecommendationController.getTopRecommendationsById(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('Fails to get top recommendations by user id and returns status 404', async () => {
		const req = mockReq({
			params: {
				id: 1,
			},
		});
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getTopRecommendationsByUserId').throws();
		await RecommendationController.getTopRecommendationsById(req, res);
		expect(res.statusCode).to.equal(404);
	});

	it('Gets own top recommendations and returns status 200', async () => {
		const req = mockReq({});
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: 1,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getTopRecommendationsByUserId').resolves(mockRecommendations);
		await RecommendationController.getOwnTopRecommendations(req, res);
		expect(res.statusCode).to.equal(200);
	});

	it('Fails to get top recommendations by user id and returns status 404', async () => {
		const req = mockReq({});
		const res = mockRes({
			locals: {
				jwtPayload: {
					userId: 1,
				},
			},
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});
		sinon.stub(RecommendationService, 'getTopRecommendationsByUserId').throws();
		await RecommendationController.getOwnTopRecommendations(req, res);
		expect(res.statusCode).to.equal(404);
	});
});
