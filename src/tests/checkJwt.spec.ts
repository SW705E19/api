import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { checkJwt } from '../middlewares/checkJwt';

describe('Check jwt middleware', function() {

    afterEach(() => {
		sinon.restore();
    });
    it('returns status 401 if jwt isnt verified', async function() {
		const request = {
			headers: {
                authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYWRtaW4uZGsiLCJyb2xlcyI6WyJBRE1JTiIsIlRVVE9SIl0sImlhdCI6MTU3NDg5MzM0NSwiZXhwIjoxNTc0ODk2OTQ1fQ.J79OIIrwx2zhOH4fWZGS90b1RGNNMM3u5eHDr2Xqa0k'
            },
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		const mockGetBy = sinon.stub(jwt, 'verify').throws();
		const next = sinon.spy();
		const checkJWTCall = checkJwt;
		await checkJWTCall(req, res, next);

		expect(res.statusCode).to.equal(401);
    });
    it('returns error message if jwt is not verified', async function() {
		const request = {
			headers: {
                authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYWRtaW4uZGsiLCJyb2xlcyI6WyJBRE1JTiIsIlRVVE9SIl0sImlhdCI6MTU3NDg5MzM0NSwiZXhwIjoxNTc0ODk2OTQ1fQ.J79OIIrwx2zhOH4fWZGS90b1RGNNMM3u5eHDr2Xqa0k'
            },
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
			},
		});

		sinon.stub(jwt, 'verify').throws()
        const next = sinon.spy();
		const checkJWTCall = checkJwt;
		const checkJWTRes = await checkJWTCall(req, res, next);

		expect(checkJWTRes).to.not.be.null;
	});
    it('calls next if jwt is valid', async function() {
		const request = {
			headers: {
                authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYWRtaW4uZGsiLCJyb2xlcyI6WyJBRE1JTiIsIlRVVE9SIl0sImlhdCI6MTU3NDg5MzM0NSwiZXhwIjoxNTc0ODk2OTQ1fQ.J79OIIrwx2zhOH4fWZGS90b1RGNNMM3u5eHDr2Xqa0k'
            },
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
            },
            setHeader: function(s: string, x: string) {
                this.s = x;
                return this;
            }
		});

        const next = sinon.spy();
        sinon.stub(jwt, 'verify').resolves();
		const checkJWTCall = checkJwt;
		await checkJWTCall(req, res, next);

		expect(next.calledOnce).to.be.true;
    });
    it('returns error message if jwt example is not verified', async function() {
		const request = {
			headers: {
                authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYWRtaW4uZGsiLCJyb2xlcyI6WyJBRE1JTiIsIlRVVE9SIl0sImlhdCI6MTU3NDg5MzM0NSwiZXhwIjoxNTc0ODk2OTQ1fQ.J79OIIrwx2zhOH4fWZGS90b1RGNNMM3u5eHDr2Xqa0k'
            },
		};
		const req = mockReq(request);
		const res = mockRes({
			status: function(s: number) {
				this.statusCode = s;
				return this;
            },
            setHeader: function(s: string, x: string) {
                this.s = x;
                return this;
            }
		});

        const next = sinon.spy();
		const checkJWTCall = checkJwt;
		await checkJWTCall(req, res, next);

		expect(res.statusCode).to.equal(401);
	});
});
