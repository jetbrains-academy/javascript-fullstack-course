Oh, it looks like we've lost something! We had the route `/sum` that we added in the [New route handler](course://GettingStartedNode/new_handler) task, remember? Let's add it again but using Express now.

### Task
Add support for a `GET` route `/sum`.

The handler should take parameters `a` and `b` (expected integers), calculate their sum and return JSON of the form:
```json
{ 'sum': <actual_sum> }
```

If at least one of the parameters does not exist or is not a number, the handler should return the following JSON with `400` status code:
```json
{ message: 'Invalid query parameters. Ensure "a" and "b" are numbers.' }
```

You can also always check manually how your program works with these examples or using your own:
- http://localhost:8000/sum?a=10&b=-20
- http://localhost:8000/sum?a=Hello&b=20
- http://localhost:8000/sum

<div class="hint" title="Converting a string into a number">

Since parameters are always strings, you may need the [parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) function to convert them to a number.
</div>
