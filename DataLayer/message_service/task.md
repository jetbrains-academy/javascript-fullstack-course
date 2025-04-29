Great, now we know how to work with users. Let's add `messageService` for handling messages.
Use the already declared `store.messages` array for storage.

To make solving this task easier, look at the tests in `backend/__tests__/dataServices.test.js`.
They will help you better understand the expected result.

### Task
Implement `addMessage` and `getMessage` methods.
Messages should be stored in the `store.messages` array as objects with this format:


```js
{
    id: <unique_message_id>,
    username: <username>,
    content: <content>
}
```

#### addMessage
Method should add a new message object to the end of messages array and return it as the return value.

To ensure each message has a unique `id`,
use the built-in Node.js [method](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) `crypto.randomUUID()` to generate it. The id generated this way will look like:

```text
b0b2af55-41f4-4f9d-a6aa-0a91b31e93d7
```

#### getMessage
Method should return the `messages` array as the result.

<div class="hint">

For this task, the [slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method might be very helpful.
</div>

### Optional task
Implement the `deleteMessage` method. It should find and delete (with shift) a message with `id` equal to `messageId` from the `store.messages` array.
Note that the order of remaining messages in the array should not change.

Method should return `true` if a message was deleted and `false` otherwise (for example, no message with such id was found).

**This task is optional.**

It is not checked when clicking the `Check` button and does not affect course completion,
but if you want more practice, you'll find it helpful.

For testing this task, we prepared tests in `backend/__tests__/dataServices.test.js`.
These tests are declared with the `xit` keyword and don't run by default. 
Just replace `xit` with `it` like in all other test cases to make them work.
