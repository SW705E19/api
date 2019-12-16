import { expect } from 'chai';
import {
	dotMatrices,
	initUserFactorMatrix,
	initServiceFactorMatrix,
	populateUserServiceMatrix,
	initUserServiceMatrix,
} from '../recommender/recommender';
import sinon = require('sinon');
import { Rating } from '../entity/rating';
import { Recommendation } from '../entity/recommendation';
import { User } from '../entity/user';
import { Service } from '../entity/service';

describe('Recommender dot matrices', function() {
	it('calculates correct dot product', async function() {
		const matrix1: number[][] = [];
		matrix1.push([1, 2, 3]);
		matrix1.push([4, 5, 6]);

		const matrix2: number[][] = [];
		matrix2.push([7, 8]);
		matrix2.push([9, 10]);
		matrix2.push([11, 12]);

		const constmatrix: number[][] = [];
		constmatrix.push([58, 64]);
		constmatrix.push([139, 154]);

		const res = dotMatrices(2, 2, 3, matrix1, matrix2);

		expect(JSON.stringify(res)).to.equal(JSON.stringify(constmatrix));
	});

	it('inserts null for unavailable spots when calculating dot product', async function() {
		const matrix1: number[][] = [];
		matrix1.push([1, 2, 3]);
		matrix1.push([4, 5, 6]);

		const matrix2: number[][] = [];
		matrix2.push([7, 8]);
		matrix2.push([9, 10]);
		matrix2.push([11, 12]);

		const constmatrix: number[][] = [];
		constmatrix.push([58, 64]);
		constmatrix.push([139, 154]);

		const res = dotMatrices(1, 6, 3, matrix1, matrix2);

		expect(JSON.stringify(res)).to.contain('null');
	});
});

describe('Recommender init user factor matrix', function() {
	it('inserts random values into each field of the array', async function() {
		const constmatrix: number[][] = [];
		constmatrix.push([999, 999]);
		constmatrix.push([999, 999]);
		constmatrix.push([999, 999]);

		sinon.stub(Math, 'random').returns(999);
		const res = initUserFactorMatrix(3, 2, []);

		expect(JSON.stringify(res)).to.equal(JSON.stringify(constmatrix));
		sinon.restore();
	});
});

describe('Recommender init service factor matrix', function() {
	it('inserts random values into each field of the array', async function() {
		const constmatrix: number[][] = [];
		constmatrix.push([999, 999]);
		constmatrix.push([999, 999]);
		constmatrix.push([999, 999]);

		sinon.stub(Math, 'random').returns(999);
		const res = initServiceFactorMatrix(2, 3, []);

		expect(JSON.stringify(res)).to.equal(JSON.stringify(constmatrix));
		sinon.restore();
	});
});

describe('Recommender populate user service matrix', function() {
	const mockUser1: User = {
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

	const mockUser2: User = {
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
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
	};

	const mockUser3: User = {
		id: 3,
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

	const service1: Service = {
		id: 1,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};
	const service2: Service = {
		id: 2,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};
	const service3: Service = {
		id: 3,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};

	const rating1: Rating = {
		id: 1,
		rating: 5,
		description: 'rating 1',
		user: mockUser1,
		service: service1,
	};
	const rating2: Rating = {
		id: 2,
		rating: 3,
		description: 'rating 2',
		user: mockUser2,
		service: service2,
	};
	const rating3: Rating = {
		id: 3,
		rating: 2,
		description: 'rating 2',
		user: mockUser3,
		service: service3,
	};

	it('populates the array', async function() {
		const allRatings: Rating[] = [];
		allRatings.push(rating1);
		allRatings.push(rating2);
		allRatings.push(rating3);

		const userServiceMatrix: number[][] = [];
		userServiceMatrix.push([null, 1, 2, 3]);
		userServiceMatrix.push([1, 999, 999, 999]);
		userServiceMatrix.push([2, 999, 999, 999]);
		userServiceMatrix.push([3, 999, 999, 999]);

		const res = populateUserServiceMatrix(allRatings, 3, 3, userServiceMatrix);

		expect(res[1][1]).to.not.equal(999);
		expect(res[2][2]).to.not.equal(999);
		expect(res[3][3]).to.not.equal(999);
	});

	it('only populates the diagonal', async function() {
		const allRatings: Rating[] = [];
		allRatings.push(rating1);
		allRatings.push(rating2);
		allRatings.push(rating3);

		const userServiceMatrix: number[][] = [];
		userServiceMatrix.push([null, 1, 2, 3]);
		userServiceMatrix.push([1, 999, 999, 999]);
		userServiceMatrix.push([2, 999, 999, 999]);
		userServiceMatrix.push([3, 999, 999, 999]);

		const res = populateUserServiceMatrix(allRatings, 3, 3, userServiceMatrix);

		expect(res[0][0]).to.be.null;
		expect(res[0][1]).to.equal(1);
		expect(res[0][2]).to.equal(2);
		expect(res[0][3]).to.equal(3);
		expect(res[1][0]).to.equal(1);
		expect(res[2][0]).to.equal(2);
		expect(res[3][0]).to.equal(3);

		expect(res[1][2]).to.equal(999);
		expect(res[1][3]).to.equal(999);
		expect(res[2][1]).to.equal(999);
		expect(res[2][3]).to.equal(999);
		expect(res[3][1]).to.equal(999);
		expect(res[3][2]).to.equal(999);
	});
});

describe('Recommender unit user service matrix', function() {
	const mockUser1: User = {
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

	const mockUser2: User = {
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
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
	};

	const mockUser3: User = {
		id: 3,
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

	const service1: Service = {
		id: 1,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};
	const service2: Service = {
		id: 2,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};
	const service3: Service = {
		id: 3,
		name: 'service1',
		description: 'I am a service',
		categories: null,
		tutorInfo: null,
		ratings: [new Rating(), new Rating()],
		recommendations: [new Recommendation(), new Recommendation()],
		image: '',
	};

	it('populates the matrix with zeroes', async function() {
		const allUsers: User[] = [];
		allUsers.push(mockUser1);
		allUsers.push(mockUser2);
		allUsers.push(mockUser3);

		const allServices: Service[] = [];
		allServices.push(service1);
		allServices.push(service2);
		allServices.push(service3);

		const userServiceMatrix: number[][] = [];
		userServiceMatrix.push([null, 1, 2, 3]);
		userServiceMatrix.push([1, 999, 999, 999]);
		userServiceMatrix.push([2, 999, 999, 999]);
		userServiceMatrix.push([3, 999, 999, 999]);

		const res = initUserServiceMatrix(3, 3, allUsers, allServices, userServiceMatrix);

		expect(res[1][1]).to.equal(0);
		expect(res[1][2]).to.equal(0);
		expect(res[1][3]).to.equal(0);
		expect(res[2][1]).to.equal(0);
		expect(res[2][2]).to.equal(0);
		expect(res[2][3]).to.equal(0);
		expect(res[3][1]).to.equal(0);
		expect(res[3][2]).to.equal(0);
		expect(res[3][3]).to.equal(0);
	});

	it('populates matrix with zeroes', async function() {
		const allUsers: User[] = [];
		allUsers.push(mockUser1);
		allUsers.push(mockUser2);
		allUsers.push(mockUser3);

		const allServices: Service[] = [];
		allServices.push(service1);
		allServices.push(service2);
		allServices.push(service3);

		const userServiceMatrix: number[][] = [];
		userServiceMatrix.push([null, 1, 2, 3]);
		userServiceMatrix.push([1, 999, 999, 999]);
		userServiceMatrix.push([2, 999, 999, 999]);
		userServiceMatrix.push([3, 999, 999, 999]);

		const res = initUserServiceMatrix(3, 3, allUsers, allServices, userServiceMatrix);

		expect(res[0][1]).to.equal(1);
		expect(res[0][2]).to.equal(2);
		expect(res[0][3]).to.equal(3);
		expect(res[1][0]).to.equal(1);
		expect(res[2][0]).to.equal(2);
		expect(res[3][0]).to.equal(3);

		expect(res[1][2]).to.equal(0);
		expect(res[1][3]).to.equal(0);
		expect(res[2][1]).to.equal(0);
		expect(res[2][3]).to.equal(0);
		expect(res[3][1]).to.equal(0);
		expect(res[3][2]).to.equal(0);
	});
});
