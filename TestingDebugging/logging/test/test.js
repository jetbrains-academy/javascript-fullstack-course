import {app, httpServer} from '../backend/src/index.js';

import {customizeError} from '#utils/utils'

beforeAll(() => {

});

afterAll((done) => {
    httpServer.close(done);
})

const listMiddlewares = (app) => {
     // Gets middleware names
    return app._router.stack
        .filter((layer) => layer.route === undefined) // Filters out route handlers
        .map((layer) => layer.name || '(anonymous middleware)');
};



test('Test / route', async () => {
    try {
        let middlewareList = listMiddlewares(app)
        expect(middlewareList).toContain('logger')

    } catch (e){
        customizeError(e, 'Make sure you add morgan. Logger not found in the list of middleware: ', true)
        throw e
    }
});
