import {customizeError} from '#utils/utils.js'
import fs from 'fs';
import path from 'path';


test('Check if .env contains JWT_SECRET with a 64-byte key', () => {
    try {
        const courseCreationMode = path.resolve('Backend/Authentication/secret_key/backend/.env');
        const educatorMode = path.resolve( 'Backend/Authentication/task/backend/.env');
        const envPath = fs.existsSync(courseCreationMode) ? courseCreationMode : educatorMode;

        const envContent = fs.readFileSync(envPath, { encoding: 'utf-8' });

        console.log(envContent)
        // Extract the value of JWT_SECRET from the .env contents
        const jwtSecretMatch = envContent.match(/^JWT_SECRET=(.+)$/m);
        expect(jwtSecretMatch).not.toBeNull(); // Ensure JWT_SECRET exists

        const jwtSecret = jwtSecretMatch[1];
        const buffer = Buffer.from(jwtSecret, 'base64');
        expect(buffer.length).toBe(64); // Validate the key size in bytes
    } catch (e) {
        customizeError(e, 'JWT_SECRET in the .env file doesn\'t have 64-bytes key as a value', true)
        throw e;
    }
});
