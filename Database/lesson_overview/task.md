## Database
We have already finished developing the app. It supports sending and receiving messages through REST API, 
 supports real-time communication with WebSockets, and protected with authorization.

Now, the final step is to change how data is stored so it persists even after restarting the app. 
For this, we need to switch from in-memory storage to a database. Thanks to the app's architecture, this will be easy.

In this lesson, you will learn how to:
- Change the data layer without touching other parts of the app.
- Connect the _SQLite_ database to the Node.js project.
- Use a simple _Object-Relational Mapping_ (ORM) library to work with the database.

### Database
Databases are a vast topic, but we’ll keep things simple. Instead of covering different types of databases,
we’ll only focus on a basic example to give you a starting point.

As an example, our app will use [SQLite](https://www.sqlite.org/) — a simple, file-based SQL database.
SQL databases store, retrieve, and manage organized structured data using SQL (Structured Query Language), working with tables that have rows and columns.

Although SQL is logical in some ways, it's not the easiest thing for a beginner to start with:

```SQL
SELECT * FROM Users WHERE username = 'TestUser';
```

So, we won’t work directly with SQL. Instead, we’ll use a helper library to simplify the process.

### ORM
Since we don’t want to dive deeply into SQL right now, we’ll use [Sequelize](https://sequelize.org/), 
a simple ORM library for Node.js with SQLite support.
An ORM allows you to interact with a database using JavaScript methods instead of writing SQL queries:

```js
const user = await Users.findByPk('TestUser');
```

This is a much more convenient way, especially for those who already know JavaScript but haven't figured out SQL yet.
