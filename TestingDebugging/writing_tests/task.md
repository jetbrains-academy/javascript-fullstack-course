Any material is better memorized after a little practice.

### Task
You are given a new `/concat` route in the file `backend/src/index.js` and 
the file `backend/__tests__/concat.test.js` which should contain tests for this route.

Now `concat.test.js` intentionally contains incorrect expressions and the tests fail. 
Similar to `sum.test.js`, implement three tests for `/concat` route:

1. Check that the two strings are indeed concatenated.
2. Check that concatenation, not addition of numbers, is performed for two strings consisting of digits. 
   - For example, for a query `/concat?str1=123&str2=456`, the answer should be `"result": "123456"`.
3. Check error handling in a situation where one or both arguments were not passed.

Remember to check the return code too, not just the result.

You can also play with the `/concat` route using frontend.

