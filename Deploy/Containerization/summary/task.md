Let’s summarize briefly. To deploy our application using Docker, you need:

1. A Dockerfile where we define the environment for our service, install dependencies, and configure the application build process.
2. A Compose file where we describe how our services should be run, what data should be stored in persistent storage, which ports to expose, and more.
3. Store secret keys in a `.env` file, avoid committing it to the repository, and do not set sensitive environment variables in the Dockerfile or Compose file.

Now you can deploy your application on any server with almost a single command.

Good luck!
