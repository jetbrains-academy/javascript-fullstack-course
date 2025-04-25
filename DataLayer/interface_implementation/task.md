There are a lot of ways to store data: use data structure from the programming language, 
save data in the `.csv` file, use the database and more.

We've already talked about the concept of a technology stack in the [Web app architecture](course://Introduction/web_app_arch) lesson and noted the convenience when a project is made up of isolated and replaceable parts. 
The component responsible for storage should be one of such things.

Our application should not know how exactly the storage is organized, and all interaction will go through some abstraction, which we call _data layer_.

<div style="text-align: center; max-width: 900px; margin: 0 auto;">
<img src="images/save_fetch_message.png">
</div>

This allows us to simplify our application. No need to go into the details of exactly how to find the right message, for example.
You just need to use the relevant data layer method like "save this message to the storage".

This way, we can change the implementation of the data layer any way we want (and we will do so at the end of the course). 
But as long as the interface remains unchanged, no parts of the application will even be aware of these changes.

Now let's implement the data layer in the simplest way possible!