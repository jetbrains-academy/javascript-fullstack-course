Before we start, let's briefly discuss a typical web app architecture.

A web application consists of two main parts:
- Frontend (Client-Side): The part users interact with, usually built with tools like _HTML, CSS, and JavaScript frameworks_ (e.g., React).
- Backend (Server-Side): Provides logic and data management for the app. 
It handles API requests, data storage in databases, and communication between the client and server. Often built with tools like _Node.js_ and _Express_.

For our chat app:
- The frontend will display messages and offer an interface to send new ones.
- The backend will manage user authentication and real-time messages communication. 

## TODO: PICTURE!

These two parts communicate through **[RESTful](https://en.wikipedia.org/wiki/REST) API** to exchange data between the server and the client.

A RESTful API is a way to communicate using standard HTTP methods (GET, POST, ...) where data is accessed through URLs (endpoints), 
and responses are typically in JSON format. It’s simple, stateless, and widely used for building web services.

In our app, the _frontend_ will use RESTful API **endpoints** offered by the _backend_ to send and receive data. For example:
- Frontend Request: A user sends a message through the frontend.
- Backend Response: The backend processes the message and broadcasts it to all users.

### Technology stack
In web development, you may often hear such a concept as _technology stack_. Some of the most popular ones even have well-known acronyms such as MERN:
- **M**ongoDB is used as a database.
- **E**xpress.js is a framework for building RESTful APIs with Node.js.
- **R**eact is a front-end JavaScript library.
- **N**ode.js is a JavaScript runtime environment.

<div style="background-color: gray; text-align: center; width:50%; margin: 0 auto;">
<img src="images/mern.png">
</div>

Such a description conveniently demonstrates which technologies are used for which parts of the project.
Moreover, if technologies are independent of each other, we can replace, for example, MongoDB with another database or React with another frontend framework.

We will be paying little attention to the database in our course, so we can say that we will be using **ERN-stack**.

### From the backend to the frontend
In the first half of this course, we'll focus on building the backend. 
The educational frontend will be provided to simplify development and allow convenient testing, you are free to explore it. 

By the second half of the course, you’ll have a clear understanding of how the backend works, and you'll be ready for the frontend development.

# TODO: update this file before release

<style>
img {
  display: inline !important;
}
</style>
