import { exec } from 'child_process';
import {customizeError} from "#utils/utils.js";
import path from "path";
import fs from "fs";

const runJestFile = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`NODE_OPTIONS="--experimental-vm-modules" npx jest ${filePath} --silent`, (error, stdout, stderr) => {
            if (error) {
                reject(stdout+stderr);
            } else {
                resolve(stdout+stderr);
            }
        });
    });
};

let testFileContent;

beforeAll(() => {
    let testFilePath = path.join(process.cwd(), 'TestingDebugging', 'writing_tests', 'backend',
        '__tests__', 'concat.test.js');
    if (fs.existsSync(testFilePath)) {
        testFileContent = fs.readFileSync(testFilePath, 'utf8');
    } else {
        throw new Error(`Test file not found: ${testFilePath}`);
    }
});

test('Test file concat.test.js is pass', async () => {
    try {
        try{
            const result = await runJestFile('TestingDebugging/writing_tests/backend/__tests__/concat.test.js');
            expect(result).toContain('PASS');
        } catch (e){
            expect(e).not.toContain('FAIL');
        }
    } catch (e){
        customizeError(e, 'Ensure concat.test.js is PASS, not FAIL: \n\n', true)
        throw e
    }
});

test('Should check response.status in all tests', () => {
    try{
        expect(testFileContent.trim()).toContain("expect(response.status)");
    } catch (e){
        customizeError(e, 'Ensure response.status is checked in all tests: \n\n', true)
        throw e
    }
});

test('Should check response.body in all tests', () => {
    try{
        expect(testFileContent.trim()).toContain("expect(response.body)");
    } catch (e){
        customizeError(e, 'Ensure response.body is checked in all tests: \n\n', true)
        throw e
    }
});

test('Should check fails case', () => {
    try{
        expect(testFileContent.trim()).toContain("Invalid query parameters. Ensure \"str1\" and \"str2\" are provided.");
    } catch (e){
        customizeError(e, 'Ensure error message is checked in the last test case: \n\n', true)
        throw e
    }
});
