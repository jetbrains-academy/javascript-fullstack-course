import {store, userService} from '../backend/src/data/dataServices.js';

import {customizeError} from '#utils/utils.js'

beforeEach(() => {
    store.users.clear()
})


test('Test new user creation', async () => {
    try {
        await userService.createUser('John', '1234567890')
            .then(user => {
                console.log(user)
                expect(user.username).toBe('John')
            })
    } catch (e) {
        customizeError(e, 'Failed to create new user: ', true);
        throw e;
    }
});

test('Test existing user creation', async () => {
    try {
        await userService.createUser('John', '1234567890');
        await userService.createUser('John', '0987654321')
            .then(user => {
                throw new Error('No error was thrown')
            })
            .catch(error => {
                expect(error.message).toBe('Username already exists')
            })
    } catch (e) {
        customizeError(e, 'Failed to test existing user creation: ', true)
        throw e
    }
});

test('Test get existing user', async () => {
    try {
        await userService.createUser('John', '1234567890');
        await userService.getUser('John')
            .then(user => {
                expect(user).toBeDefined()
                expect(user.username).toBe('John')
                expect(user.password).toBe('1234567890')
            })
    } catch (e) {
        customizeError(e, 'Failed to get existing user: ', true)
        throw e
    }
});

test('Test get non-existing user', async () => {
    try {
        await userService.getUser('NonExistentUser')
            .then(user => {
                expect(user).toBeUndefined()
            })
    } catch (e) {
        customizeError(e, 'Failed to test non-existing user: ', true)
        throw e
    }
});
