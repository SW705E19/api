import * as sinon from 'sinon';
import CategoryController from '../controllers/categoryController';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import CategoryService from '../services/categoryService';
import { error } from 'util';
import { Category } from '../entity/category';

describe('Category controller tests', () => {
    const mockCategories: Category[] = [
        {
            id: 1,
            name: 'math',
            description: 'I am Math',
            services: [],
        },
        {
            id: 2,
            name: 'programming',
            description: 'I am coder',
            services: [],
        }    
    ];
    function getFromArray(id: number) {
        return mockCategories[id];
    }
    afterEach(() => {
        sinon.restore();
    })

    it('list all categories return 200', async () => {

        const req = mockReq();
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        sinon.stub(CategoryService, 'getAll').resolves(mockCategories);
        await CategoryController.listAll(req, res);
        expect(res.statusCode).to.equal(200);
    });
    it('should get a category by id, return 200', async () => {
        const req = mockReq({
            params: {
                id: 1
            }
        });
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const getByIdStub= sinon.stub(CategoryService, 'getById').resolves(getFromArray(req.params.id));
        await CategoryController.getOneById(req, res);
        expect(res.statusCode).to.equal(200);
    });
    it('should fail get a category by id, return 404', async () => {
        const req = mockReq({
            params: {
                id: 200
            }
        });
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const stubResult = sinon.stub(CategoryService, 'getById').throws();
        await CategoryController.getOneById(req, res);
        expect(res.statusCode).to.equal(404);
    });
    it('should create a new category, return 201', async () => {
        const category = {
            name: 'newCat',
            description: 'new description',
            services: [],
        }
        const req = mockReq({
            body: category
        });
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const saveStub = sinon.stub(CategoryService, 'save').resolves(mockCategories[0]);
        await CategoryController.newCategory(req, res);
        expect(res.statusCode).to.equal(201);

    });
    it('should fail to create a new category because param is not a category, return 400', async () => {
        const notCategory = {
            notName: 'ayy',
            notDescrip: 'lmao'
        }
        const req = mockReq({
            body: notCategory
        });
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const saveStub = sinon.stub(CategoryService, 'save').resolves(mockCategories[0]);
        await CategoryController.newCategory(req, res);
        expect(res.statusCode).to.equal(400);
    });
    it('should fail to create a new category because name is already taken, return 409', async () => {
        const category = {
            name: 'newCat',
            description: 'new description',
            services: [],
        }
        const req = mockReq({
            body: category
        });
        const res = mockRes({
            status: function(s) {this.statusCode = s; return this;}
        });
        const saveStub = sinon.stub(CategoryService, 'save').throws();
        
        await CategoryController.newCategory(req, res);
        expect(res.statusCode).to.equal(409);
    });
    it('should edit category, return 204', async () => {
        const category = {
            name: 'editCat',
            description: 'edited description',
            services: [],
        }
        const req = mockReq({
            body: category,
            params: { id: 0}
        });
        const res = mockRes({
            status: function(s: any) {this.statusCode = s; return this;}
        });
        const getByIdStub = sinon.stub(CategoryService, 'getById').resolves(mockCategories[req.params.id]);
        const saveStub = sinon.stub(CategoryService, 'save').resolvesArg(0);
        await CategoryController.editCategory(req, res);
        expect(res.statusCode).to.equal(204);
    });
    it('should fail to edit category because it is not a category, return 400', async () => {
        const category = {
            name: 1,
            description: 123,
            services: 2,
        }
        const req = mockReq({
            body: category,
            params: { id: 0}
        });
        const res = mockRes({
            status: function(s: any) {this.statusCode = s; return this;}
        });
        const getByIdStub = sinon.stub(CategoryService, 'getById').resolves(mockCategories[req.params.id]);
        const saveStub = sinon.stub(CategoryService, 'save').resolvesArg(0);
        await CategoryController.editCategory(req, res);
        expect(res.statusCode).to.equal(400);
    });
});