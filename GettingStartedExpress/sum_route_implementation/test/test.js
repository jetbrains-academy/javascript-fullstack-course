import request from 'supertest';
import { httpServer } from '../backend/src/index.js';

import {customizeError} from '#utils/utils'

beforeAll(() => {

});

afterAll((done) => {
    httpServer.close(done);
})


test('Test / route', async () => {
    try {
        const response = await request(httpServer).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, World!")
    } catch (e){
        customizeError(e, 'Wrong response (or status code) from the route /', true)
        throw e
    }
});

test('Test /sum route with valid parameters', async () => {
    try {
        const response = await request(httpServer).get('/sum?a=10&b=-20');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ sum: -10 });
    } catch (e){
        customizeError(e, 'Wrong response (or status code) from the route /sum with parameters a=10&b=-20', true)
        throw e
    }
});

test('Test /sum route with invalid parameters', async () => {
    try {
        const response = await request(httpServer).get('/sum?a=Hello&b=20');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid query parameters. Ensure "a" and "b" are numbers.' });
    } catch (e){
        customizeError(e, 'Wrong response (or status code) from the route /sum with parameters a=Hello&b=20', true)
        throw e
    }
});

test('Test /sum route with missing parameters', async () => {
    try {
        const response = await request(httpServer).get('/sum');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid query parameters. Ensure "a" and "b" are numbers.' });
    } catch (e){
        customizeError(e, 'Wrong response (or status code) from the route /sum with missing parameters', true)
        throw e
    }
});

test('Test /wrong_url route', async () => {
    try {
        const response = await request(httpServer).get('/wrong_url');
        expect(response.status).toBe(404);
        expect(response.text).toBe("Page Not Found")
    } catch (e){
        customizeError(e, 'Wrong response (or status code) for the route /wrong_url', true)
        throw e
    }
});
