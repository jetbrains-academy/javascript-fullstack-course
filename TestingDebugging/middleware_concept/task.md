Processing a request on the server is usually a chain of actions: 
parsing request bodies, handling authentication/authorization, logging requests/responses, error handling, ...

Such functions that execute during the lifecycle of a request to a server in Express.js are called middleware. 
And we already used it before: 

```js
app.use((req, res) => {
    res.status(404).type('text/plain').send('Page Not Found');
});
```

Middleware is executed in the order they are defined in code and can be global (applied to all routes) or 
specific (applied only to certain routes).


Typically, the middleware function takes three parameters:
```js
function (req, res, next) { ... }
```
The `next` argument is a function used to pass control to the next middleware in the stack. 
Without calling `next()`, the request processing cycle will be terminated. 
But sometimes it may be necessary, for example, when we send a `Page Not Found` response in our handler above, no further action is required. 

You can add different middleware as a constructor to your application, but pay attention to the following points:
- The order in which middleware is declared in the code affects the order in which they are processed. 
- Use Express built-in or third-party middleware for common goals to solve the task easier.
- Avoid overuse middleware, excessive middleware can slow down your application.

### Some built-in middleware examples
Look at the `backend/src/index.js`. We have added some useful middleware to our project:
- `app.use(cors());` – Cross-Origin Resource Sharing (CORS). Allows the server to handle requests coming from another domain. 
  For example, when the frontend is deployed separately from the backend.
- `app.use(express.json());` – parses incoming JSON bodies in requests and makes them accessible via `req.body`.
  Without it, we would need to manually handle and parse the received data in future tasks.

### Error handling middleware
There is also a special middleware to handle errors defined with four parameters. You can also find it in the `index.js`.

```js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
```

This makes it easy to handle any errors that occur when processing other queries.
Launch the application and try using `/echo` route: http://localhost:8000/echo.

We intentionally broke it, leaving only a line `throw new Error('Error');` in its handler for the sake of clarity.

### Logging
Another task where middleware comes in handy is logging! 
For debugging purposes, it can be especially useful for us to see which requests were sent to which routes.

This can be done by adding middleware at the beginning with the handler printing the time, a request type (GET, POST, ...) and URL:

```js
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}. Re`);
    next();
});
```

But the same can be done with [morgan](https://expressjs.com/en/resources/middleware/morgan.html) middleware in one line: 

```js
app.use(morgan('tiny'));
```

Here `'tiny'` means to keep logging as short as possible, but morgan allows you to customize the output as you may want.

