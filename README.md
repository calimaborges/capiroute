# capiroute

[![Build Status](https://www.travis-ci.org/calimaborges/capiroute.svg?branch=master)](https://www.travis-ci.org/calimaborges/capiroute)
[![Coverage Status](https://coveralls.io/repos/github/calimaborges/capiroute/badge.svg?branch=master)](https://coveralls.io/github/calimaborges/capiroute?branch=master)

## Installation

```
npm install capiroute --save
```

---
## router

### Example using React

```javascript
// index.js
import ReactDOM from 'react-dom';
import React from 'react';

import { router } from 'capiroute';

import App from './src/App';
import { createNewTask, editTask } from './src/task';

const render = () => ReactDOM.render(<App />, document.getElementById('root'));

// Subscribe to do something on every route change: 
router.subscribe(render);

router.subscribe( () => {
    
    // match routes
    if (router.isRoot()) {
        router.goto('/tasks');
    } else if (router.match(/^\/tasks\/new$/)) {
        dispatch(createNewTask());
    } else if (router.match(/^\/tasks\/edit\/([^/]+)$/)){
        dispatch(editTask(router.matchedParams()[1]));
    }

    // manage query strings
    if (!router.hasQuery()) {
        router.setQuery({ type: 'inbox' });
    }
    
});
```

### API

* **subscribe(function)**: call function on every route change.
    
    ```javascript
    const unsubscribe = router.subscribe( () => console.log('Route changed!') );
    ```
    
* **goto(string)**: go to route defined by string argument
 
    ```javascript
    router.goto('/tasks');
    ```

* **back()**: go back to previous route

    ```javascript
    router.back();
    ```
    
* **match(regex)**: check if current route matches regex
 
    ```javascript
    // considering route: /tasks
    console.log(router.match(/\/tasks/));
    // output: true
    console.log(router.match(/\/task$/));
    // output: false
    ```
        
* **isRoot()**: alias to `match(/^$/)`

    ```javascript
    // considering route: /
    console.log(router.isRoot());
    // output: true
    // considering route: /match
    console.log(router.isRoot());
    // output: false
    ```
    
        
* **getMatchedParams()**: return the last matched params array
 
    ```javascript
    // considering route: /tasks/342
    router.match(/\/tasks/(\d+)/);
    console.log(router.getMatchedParams());
    // output: [ '/tasks/342', 342 ]
    ```

* **getQueryString()**: return current route's query string
 
    ```javascript
    // considering route /tasks/342?type=completed
    console.log(router.getQueryString());
    // output: { type: 'completed' }
    ```

* **hasQueryString()**: returns if query string exists or not

    ```javascript
    // considering route /tasks?type=completed
    console.log(router.hasQueryString());
    // output: true
    // considering route /tasks
    console.log(router.hasQueryString());
    // output: false
    ```
* **setQueryString(newQueryString)**: set query string

    ```javascript
    // considering route /tasks
    router.setQueryString({ type: 'completed' });
    // will go to /tasks?type=completed
    ```
    
* **dispatch()**: force call to subscribed functions
  
    ```javascript
    router.dispatch();
    ```
    
## Link

### Example

```javascript
import React from 'react';
import { Link } from 'capiroute';

// Element create a link to /tasks?type=archived and log to console on click
const MyLink = () => (
    <Link to="/tasks" queryTo={{ type: 'archived' }} onClick={{console.log('clicked')}} />
);

export default MyLink;
```

### props

* **to**: define which route to goto

```javascript
// link to /tasks
<Link to="/tasks" />
```

* **queryTo**: add queryString to URL

```javascript
// link to current route appended with ?type=archived
<Link queryTo={{ type: 'archived' }} />
```

* **onClick**: append click event

```javascript
// will log to console on click
<Link onClick={{ console.log("clicked") }} />
```

* **keepQuery**: keep current queryString on route change
```javascript
// considering current URL /?type=archived
// should link to /tasks?type=archived
<Link to="/tasks" keepQuery />
```