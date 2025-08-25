Before we write the Dockerfile for the backend, we have made a few changes
to the project that will simplify our work later on. Please take a look at them.

### Backend changes
- `database.sqlite` file was moved from the backend root directory to the `backend/data` directory.
- Updated `storage` path in the [dbConfig.js][dbConfig] file.
- Added `/health` route in the [index.js][index] file.
- The `.env` file was moved outside the backend directory.

### Dockerfile
Now it's time to create a Dockerfile in the project directory. 
A Dockerfile is essentially a set of instructions for building an image, 
which is a blueprint for our container to run from. 
Let's go over this line by line of the backend [Dockerfile][Dockerfile]: 

```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

- The line `FROM node:20-alpine` uses the Node.js 20 image from [Docker Hub](https://hub.docker.com/_/node/) as our base image. This ensures we have Node.js and all its dependencies in the container.
- Using `WORKDIR /app` ensures that the next commands will be executed in that directory.
- We `COPY package*.json ./`, which makes the file available in our Docker image.
- Then, we install dependencies using `RUN npm install`.
- We then copy the rest of our source code into a subdirectory `COPY . .`.
- The `EXPOSE 8000` instruction informs Docker that the container listens on port `8000` at runtime. We specified this port in [index.js][index]. The `EXPOSE` instruction doesn't publish the port to your host machine; it simply declares that this port is intended to be published.
- Finally, we state the command to run the application, which is `CMD ["npm", "start"]`.

We will run backend container later after frontend updates.

[dbConfig]: course://Deploy/Containerization/backend_dockerfile/backend/src/data/dbConfig.js
[index]: course://Deploy/Containerization/backend_dockerfile/backend/src/index.js
[Dockerfile]: course://Deploy/Containerization/backend_dockerfile/backend/Dockerfile
