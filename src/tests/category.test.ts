import request from 'supertest';
const app = require('../index');

export function post(url, body) {
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.set('Origin', 'http://localhost:3000');
    return httpRequest;
}

describe('Category', () => {
	it('fails to get all with no credentials', async () => {
		const user = {};
		await post(`categories`, user).expect(401);
	});
});

