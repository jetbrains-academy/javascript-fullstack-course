We decided to implement our data layer in the simplest way – storing data in memory using JavaScript data structures.

Our data layer implementation will be in the file `backend/src/data/dataServices.js`, look at it carefully.

There is already a `store` object that works as our storage and `userService` that provides interface for working with users.

For now, we only need two methods: one for creating a user and one for finding an existing user. 
We will store user information in a Map data structure, where the username is the key, and the value is an object containing username and password. 
The `createUser` method is already implemented for you.


<div class="hint" title="Map data structure">

  You can refresh your knowledge about Map data structure and its methods in the [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
</div>

<div class="hint" title="Hashed passwords">

  Cryptography is a complex topic that deserves its own course. 
  We won't focus on it now, but note that sensitive data like passwords should never be stored as plain text. 
  Later we will use a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) for password encryption.
  Now let's just note that the `createUser` method already accepts hashed password.
</div>

### Task
Implement the `getUser` method so that:
- If user exists in `store.users`, return an object with `username` and `password` fields
- If user doesn't exist, return `undefined`

Remember that you can use the tests in file `backend/__tests__/dataServices.test.js` for self-checking.


