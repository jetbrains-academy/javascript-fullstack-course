So far, we have been running our project locally, and that was enough for testing.

In this lesson, we’ll discuss how to adapt our application 
before deploying it to a server and making it accessible to users.

You could manually copy the application to a server, install all dependencies, 
and run the application, but this approach is unstable. 
For example, migrating the application to a different hosting service could take a long time.

We can avoid these issues by deploying and running the application in a **Docker container**.

From this lesson, you will learn:
- How to write a Dockerfile.
- How to create a Docker Compose file for the project.
- Run your application in a Docker containers in one command.
