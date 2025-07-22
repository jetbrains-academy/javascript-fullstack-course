From the very beginning of our course, you have been working with pre-created projects, 
so you could immediately dive into the tasks without being distracted by boring configuration files.
Now it's time to talk about how to create a Node.js + React project from scratch 
just like the one you started this course with.

### Create a project folder
We will assume that all further actions will be started from the project directory.
So, create it for the beginning.

### Creating backend
Create the `backend` directory and navigate into it.
Then run the initialization command:
```shell
npm init -y
```
You can also install Express right away:
```shell
npm install express
```

Next create a backend main file `src/index.js` with some simple content:
```js
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Hello, World!');
});

const PORT = 8000;

httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});

export { httpServer, app };
```
Next add `"type": "module"` property and `"start": "node src/index.js"` script to the `package.json` file.

At this moment you should be able to run the backend with the `npm start` command from the `backend` folder.

### Creating frontend
The frontend is much easier to create thanks to Vite. You don't even need to create `frontend` directory manually.
Run the following command from your **project directory**:
```shell
npm create vite@latest
```
and Vite will ask you a few questions.
- Enter the `frontend` as a project name.
- Choose `React` as the framework.
- Select `JavaScript`.

Next navigate to the created `frontend` directory and run the `npm install` command.

At this moment you should be able to run the frontend with the `npm run dev` command from the `frontend` folder.

<div style="text-align: center; max-width: 500px; margin: 0 auto;">
<img src="images/vite_react.gif" alt="Vite + React">
</div>

### Top-level config
And now all we have to do is create a common `package.json` in the project directory:
```json
{
  "name": "my-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "concurrently \"cd backend && npm start\" \"cd frontend && npm run dev\""
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

Run `npm install` command to install dependencies like `concurrently` and 
after you can run both backend and frontend with one command:
```shell
npm start
```
