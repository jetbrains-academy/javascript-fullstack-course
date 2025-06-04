import {store, userService} from '../src/data/dataServices.js';

describe('Test data layer', () => {

    beforeEach(() => {
        store.users.clear()
    })

    describe('Test userService', () => {
        it('Test new user creation', async () => {
            return userService.createUser('John', '1234567890')
                .then(user => {
                    console.log(user)
                    expect(user.username).toBe('John')
                })
        });

        it('Test existing user creation', async () => {
            await userService.createUser('John', '1234567890');
            return userService.createUser('John', '0987654321')
                .then(user => {
                    throw new Error('No error was thrown')
                })
                .catch(error => {
                    expect(error.message).toBe('Username already exists')
                })
        });

        it('Test get existing user', async () => {
            await userService.createUser('John', '1234567890');
            return userService.getUser('John')
                .then(user => {
                    expect(user.username).toBe('John')
                    expect(user.password).toBe('1234567890')
                })
        });

        it('Test get non-existing user', async () => {
            return userService.getUser('NonExistentUser')
                .then(user => {
                    expect(user).toBeUndefined()
                })
        });


    });
});