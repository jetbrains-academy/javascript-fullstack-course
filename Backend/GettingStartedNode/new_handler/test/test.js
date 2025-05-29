import request from 'supertest';
// const {httpServer} = require('../src/index.js');
import { httpServer } from '../src/index.js';

import {customizeError} from '#utils/utils.js'

beforeAll(() => {

});

afterAll((done) => {
    httpServer.close(done);
})


test('Test / route', async () => {
    try {
        const response = await request(httpServer).get('/')
            .timeout(4000);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, World!")
    } catch (e){
        customizeError(e, 'Wrong response from the route /', true)
        throw e
    }
});

test('Test /sum route', async () => {
    try {
        const response = await request(httpServer).get('/sum')
            .timeout(4000);
        expect(response.status).toBe(501);
        expect(response.text).toBe("TODO in the next lesson")
    } catch (e){
        customizeError(e, 'Wrong response from the route /sum', true)
        throw e
    }
});

test('Test /wrong_url route', async () => {
    try {
        const response = await request(httpServer).get('/wrong_url')
            .timeout(4000);
        expect(response.status).toBe(404);
        expect(response.text).toBe("Page Not Found")
    } catch (e){
        customizeError(e, 'Wrong response for the route /wrong_url', true)
        throw e
    }
});