In this lesson, you will learn how to:
- Create an application with multiple pages and routing between them.
- Implement this routing based on the internal state.

### What's the routing for?
In our application, we need at least three different views: a login page, register page, and of course, a chat page.
A logged-in user should go straight to the chat view instead of the login page. 
Similarly, if someone who isn’t logged in tries to access the chat, they should be redirected to the login page.

_Routing_ lets you handle it based on user interaction and authentication state.
It can also allow you to create [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application) (SPAs) 
where users access different sections without reloading the entire page.

### CSS
In the code examples, we will use different CSS styles to make our application look nice.
For it, we will update the `frontend/src/index.css` file from task to task,
so if you want to know more about how this or that visual was achieved,
look into this file.
