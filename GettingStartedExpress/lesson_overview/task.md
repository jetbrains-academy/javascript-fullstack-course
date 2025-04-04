We're continuing our journey as beginner web developers.  

In this lesson, you will learn how to:  
- Use Express.js in your applications and understand why it's useful.
- Handle requests with arguments and make your backend more interactive.
- Run an already built frontend together with a backend for better experience.


### Why do we need Express.js?
In the previous lesson, while adding support for the `/sum` route, we noticed that it wasn't too hard, but it was very inconvenient.  
For example, if you add support for five routes like that, the code will become a mess with a long chain of `if-else` statements in one file. That's why real projects never do things this way.  

<div style="text-align: center; max-width:200px; margin: 0 auto; ">
<img src="images/express.svg">
</div>

A simple and fast way to make your life easier in Node.js is _Express_. 
Express.js is a framework that helps simplify building web servers and APIs.
It provides tools and features to handle HTTP routes, middleware, request/response handling, and more, 
enabling developers to create robust web applications with less boilerplate code.

### Backend folder
You may also notice that a **backend** directory has appeared in our project structure. 
This will come in handy at the end of this lesson.