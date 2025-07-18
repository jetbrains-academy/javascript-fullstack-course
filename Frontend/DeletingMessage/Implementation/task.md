Before starting to implement message deletion, let's break it into the steps.  
Since we will use WebSockets, we need to:

- Create a `handleDelete` method that emits a `deleteMessage` event when a message is deleted.
- Add an interface element for each message to trigger the `handleDelete` method.
- Add a handler for the `messageDeleted` event to remove messages from the list once deletion is confirmed from the backend.

Sounds simple, right? Let’s implement our plan.
In this task, we will also modify only the [Chat.jsx][Chat] file.

### Task
#### A `handleDelete` method
Since we need the message ID to delete it, the `handleDelete` function takes the corresponding parameter.
You only need to emit a `deleteMessage` event, passing `messageId` as an argument:
```jsx
socket?.emit('deleteMessage', { messageId });
```

#### Delete button
The most convenient way for users to delete a message is by clicking a button.
We suggest using the ![](frontend/src/assets/delete.svg) icon,
located at `'frontend/src/assets/delete.svg'`. 

To do this, add this icon to the `<div>` block for the message. 
When clicked, it will trigger the `handleDelete` method with the message's ID:
```jsx
<img
    src="/src/assets/delete.svg"
    alt="Delete"
    onClick={() => handleDelete(message.id)}
    className="delete-button"
/>
```

#### A `messageDeleted` event
Finally, we need to handle the `messageDeleted` event.
Here, you should remove a message from the `messages` array where the `id` field matches `data.messageId`.
Try implementing this deletion using the `'message'` event handler as an example. Or, you can use a hint:

<div class="hint">

  ```jsx
  setMessages(prev => prev.filter(message => message.id !== data.messageId));
  ```
</div>

### Check yourself
Use the updated tests in the `frontend/__tests__/chat_test.jsx` file to better understand the task and verify your work.

Next, run the application and try deleting a message!

<div style="text-align: center; max-width: 600px; margin: 0 auto;">
<img src="images/deleting.gif" alt="Deleting messages">
</div>

[Chat]: course://Frontend/MessageDeleting/Implementation/frontend/src/pages/Chat.jsx
<style>
img {
  display: inline !important;
}
</style>
