Before we write the Dockerfile for the frontend, we have made a few changes
to the project that will simplify our work later on. Please take a look at them.

### Frontend changes
- Images (`academy.svg` and `delete.svg`) were moved to the `public/assets` folder. 
  This is a default folder for resources and built by a Vite project.
- Paths to the images in [Chat.jsx][Chat] and [index.html][index] files were updated.
- Added a `build` script to [package.json][package].
- Made changes in the [vite.config.js][vite.config] to take `backendUrl` from the environmental variables.
- Created [nginx.conf][nginx]. This is a default configuration file for Nginx where we made few changes like frontend port and backend URLs.

The built-in Vite web server is not intended for use in production.
However, we can use it to build the project and then host it with
a full-featured web server like [Nginx](https://nginx.org/).

You can read more about Nginx configuration in the [official documentation](https://nginx.org/en/docs/beginners_guide.html#conf_structure). 

### Dockerfile
Frontend [Dockerfile][Dockerfile] is a bit more complicated than the backend one. It includes 2 stages:

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
```

- A build stage is similar to the backend one. But the build artifacts are used in the next stage.
- For the production stage, we use a base image with Nginx already installed: `nginx:alpine`.
- Then, we copy the built frontend from the build stage into the Nginx directory: `COPY --from=build /app/dist /usr/share/nginx/html`.
- Next, we copy the configuration file into the image: `COPY nginx.conf /etc/nginx/conf.d/default.conf`.
- Finally, specify that the container listens on port `3000` at runtime.

You may have noticed that in [nginx.conf][nginx], URLs like `http://backend:8000/api/` are used without explicitly defining what "backend" is.
In the next step, we’ll explain why this is normal and how to run the backend and frontend together.

[Chat]: course://Deploy/Containerization/frontend_dockerfile/frontend/src/pages/Chat.jsx
[index]: course://Deploy/Containerization/frontend_dockerfile/frontend/index.html
[package]: course://Deploy/Containerization/frontend_dockerfile/frontend/package.json
[vite.config]: course://Deploy/Containerization/frontend_dockerfile/frontend/vite.config.js
[nginx]: course://Deploy/Containerization/frontend_dockerfile/frontend/nginx.conf
[Dockerfile]: course://Deploy/Containerization/frontend_dockerfile/frontend/Dockerfile
