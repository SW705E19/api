import * as sinon from 'sinon';
import CategoryController from '../controllers/categoryController';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import CategoryService from '../services/categoryService';

describe('Category controller tests', () => {
    it('list all categories', async () => {
        const mockCategories = [{
            id: 1,
            name: 'math',
            description: 'I am Math',
            services: [],
        }];
        const req = mockReq();
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const stubResult = sinon.stub(CategoryService, 'getAll').resolves(mockCategories);
        await CategoryController.listAll(req, res);
        expect(res.statusCode).to.equal(200);
    });
});