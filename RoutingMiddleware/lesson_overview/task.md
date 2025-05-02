So, we're finally ready to add the necessary routes to our app.

Although using Express has already made it easier for us to create an application, 
we can make programming even more convenient and the structure of large applications even clearer.
To do this, we use [express.Router middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.router).

In this lesson, you will learn how to:
- Create a _router_ to organize the code by grouping related route handlers.
- Implement logic for handling meaningful requests.
- Connect routes handlers with the data layer.
- Store passwords in a hashed way and compare them properly.

### Routing middleware 

Earlier in the course we already used routing methods when, for example, we added routes using the `app.get` method.
However, in a large application, we can still end up with a mess of different route handlers in one file that is extremely difficult to maintain.

It would be much better if we could group the routes logically and assign an entity to each group that is responsible for it.
Such an entity in Express.js is called _router_.


<div style="text-align: center; max-width: 900px; margin: 0 auto;">
<img src="images/routers.png">
</div>

This request redirection logic is very similar to [routing in data networks](https://en.wikipedia.org/wiki/Routing).