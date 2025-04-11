As you may have noticed, often nothing works for the first time.
And this is true whether you are a beginner or an expert with decades of experience.

That's why it's important to learn how to test and debug your applications while they are still small.

In this lesson, you will learn how to:
- Write tests for the routes
- Use tests as a self-checker
- Add logging to look over the requests/responses coming through the server

### Small component — small test
Applications are built from small parts that can be modified and reused. 
Sometimes we are modifying your code and to ensure everything still works correctly, testing each part is important.
Tests help keep the application reliable and functional, giving confidence that nothing was broken.

In our course, we will have one or more tests for each route.
Most of them will be given to you already, but you can practice writing your own tests in this lesson.

### Tests for the AI generated code
We are well aware that in today's world, most of the tasks can be easily solved with AI-generated code.
Moreover, we even recommend it to you, especially test generation. Modern IDEs such as WebStorm [can generate tests](https://www.jetbrains.com/help/webstorm/generate-tests.html) in one click!

Now you may be wondering why you need tests if the code can be generated anyway.

The generated code+tests pair determines the consistent state of your program: whether the actual behavior of the program matches the expected behavior.
AI models also use tests for self-checking when generating code.

The generated AI code may contain errors that tests can find.
Tests may also contain errors, in theory, matching to code errors, but this is where you, the developer, come into the picture. Your role now is to make sure
that the achieved consistent state (code + running tests) provides the program behavior you wanted.
