When developing the frontend, the main language we'll use will remain JavaScript, but we'll need a few other tools and libraries.

The main library we'll be working with is React.

### React
[React](https://react.dev/) has a component-driven architecture. Instead of focusing on static page elements, React is all about creating reusable, self-contained components that each handle a specific piece of your UI.
For example, a "Login Form" might be a single React component that you can reuse on multiple pages.
This modular approach simplifies code management and enables developers to easily test, update, or replace individual pieces without breaking the entire application.
Moreover, React’s declarative nature makes it intuitive: when you change the data, it knows how to update only the parts of the UI affected by that change.

React is using JSX. It's a syntax extension for JavaScript that allows developers to write HTML-like code within JavaScript files.
JSX makes it easy to write dynamic, interactive elements; hence you can develop applications much faster and more conveniently.

Pure JavaScript:
```js
const element = React.createElement('h1', null, 'Hello, World!');
```

JSX:
```jsx
const element = <h1>Hello, World!</h1>;
```


<div style="text-align: center; max-width:100px; margin: 0 auto; ">
<img src="images/react.svg">
</div>

### Vite
You can guess that a project developed in this way requires conversion to classic `html`, `js`, etc. files.
The build system is responsible for this, and we will use [Vite](https://vite.dev/) – 
a modern build tool and development server for React applications.
We won't need to perform any conversions ourselves.

<div style="text-align: center; max-width:100px; margin: 0 auto; ">
<img src="images/vite.svg">
</div>

### HTML and CSS
This course focuses on JavaScript and the technologies behind creating robust, interactive web applications.
While [HTML](https://en.wikipedia.org/wiki/HTML) and [CSS](https://en.wikipedia.org/wiki/CSS) form the foundation of every web project, we won’t dive deeply into their details here.

If you're already comfortable with HTML (Hypertext Markup Language) and CSS (Cascading Style Sheets), great!
Otherwise, we recommend brushing up on them through accessible resources, such as
Hyperskill’s [HTML](https://hyperskill.org/university/frontend/html-basics) and [CSS](https://hyperskill.org/university/frontend/css-basics) knowledge bases.
