# Comp426 Backend Server

This template is a simple out of the box solution for a backend server that uses [Express](https://www.npmjs.com/package/express) and [data-store](https://www.npmjs.com/package/data-store) to act as a somewhat "restful" API. You should fork this into your own repository so you can a team can work together using Git. 

## Setup / Installation

1. Obtain the code in whatever way you want. This could either be by cloning this repository, downloading a zip, or forking then cloning that new repository.
2. Open a new shell in the root directory of the project.
3. Run `npm install`
4. Start the server with one of the following commands

```bash
npm run dev-live-reload
npm run dev-static
npm run prod
```

- *dev-live-reload* runs the server with full logging and will quick restart everytime a file is changed.
- *dev-static* runs the server with full logging but without quick reload.
- *prod* runs the server with limited logging.

## Structure

### Data

The server is separated into two main directories. The first thing to understand is how the data is stored.

The server uses an NPM module called [data-store](https://www.npmjs.com/package/data-store) to maintain a simple object-store. Datastores are automatically created and exported by the `DataStore.js` file. To add a new data object, drop a valid JSON file into the `/data/` directory.

For example, the `public.json` file holds all the data that is public to any user that access the server. When the server loads, `DataStore` will export this as an object called `publicStore`. This can then be imported from anywhere else in the project. This object is a store object from the data-store NPM module. 

```javascript
const {publicStore} = require('../data/DataStore');
```

### Routes
Routes are a standard in the backend server world. They are how [express](https://www.npmjs.com/package/express) knows which code needs to be executed given a certain URI. Routes are automatically loaded when the server starts. If you wanted to make a new route that responds to requests at `/example/...` you would make a new file called `example.js` in the `/routes/` directory. This file could techincally be named anything. The code for that might look like this:


```javascript
import express from "express";  
  
export const router = express.Router();  
export const prefix = '/example';  
  
router.get('/hello', function (req, res) {  
  res.send({message: "Hello from example!"})  
});
```
```bash
$ curl http://localhost:3000/example/hello
{"message":"Hello from example!"}
```


## API
The below details the out-of-the-box functionality of the server. It is encouraged to add custom routes if you wish to implement a more traditional API.

By default, the server is separated into four separate routes: *account*, *public*, *private*, and *user*. The first of these that you will need to interact with are the `/account/` routes. These deal with creating new users, signing in, and verifying your current status.  The *public*, *private*, and *user* routes, on the other hand, are all simple object stores but with the following caveats.
  - `/public/` is an object store where **any** user can perform CRUD operations.
  - `/private/` is an object store where only **logged-in users** can perform CRUD operations
  - `/user/` is an object store where every logged-in user has their own private subtree where other users cannot access.

> Notice that each of these four routes has a corresponding `.json` file in the `/data/` directory where their respective data is stored.

We will first go over the routes that are related to *account* because they are in the format of a traditional API.

### `/account/`

<details>
	<summary><strong>POST <code>/create</code></strong></summary>
<p>

- Body requires: `name`, `pass`
- Body optional: `data` which can be anything.

## example:
```
http://localhost:3000/account/create
```
Body contents:
```json
{
  "name": "chris",
  "pass": "pass123",
  "data": {
    "role": 2,
    "description": "Lazy..."
  }
}
```
Response:
```json
{
    "data": {
        "data": {
            "role": 2,
            "description": "Lazy..."
        }
    },
    "status": "Successfully made account"
}
```
</p>
</details>


<details>
	
  <summary><strong>POST <code>/login</code></strong></summary>
  
<p>

- Body requires: `name`, `pass`

## example:
```
http://localhost:3000/account/login
```
Body contents:
```json
{
	"name": "chris",
	"pass": "pass123"
}
```
Response:
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2hyaXMiLCJkYXRhIjp7InJvbGUiOjIsImRlc2NyaXB0aW9uIjoiTGF6eS4uLiJ9LCJpYXQiOjE1Njk5MDE4OTcsImV4cCI6MTU3MjQ5Mzg5N30.DRZZQw2Hfex7Z7E_SAcgtUfRk1C-wVmauyMXqG3SrB0",
    "data": {
        "role": 2,
        "description": "Lazy..."
    },
    "name": "chris"
}
```
</p>
</details>

<details>
	<summary><strong>GET <code>/status</code></strong></summary>
<p>

- Authorization header is required with a value of the JWT token that was generated for you on a successful login. The server is expecting a [bearer token](https://oauth.net/2/bearer-tokens/) with the JWT.

## example:
```
http://localhost:3000/account/status
```
Authorization header:
```json
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2hyaXMiLCJkYXRhIjp7InJvbGUiOjIsImRlc2NyaXB0aW9uIjoiTGF6eS4uLiJ9LCJpYXQiOjE1Njk5MDE4OTcsImV4cCI6MTU3MjQ5Mzg5N30.DRZZQw2Hfex7Z7E_SAcgtUfRk1C-wVmauyMXqG3SrB0
```
Response:
```json
{
    "user": {
        "name": "chris",
        "data": {
            "role": 2,
            "description": "Lazy..."
        }
    }
}
```
</p>
</details>

Remember that the other routes that come with the out-of-the-box configuration are simple object stores. This quick walkthrough of using the API is only going to cover using the `/public/` endpoints. The same will apply for `/private/` and `/user/` as well. 

### Post
Let's start by adding some data to the `publicStore`. Whenever we want to add data to one of these object stores we are going to use the HTTP POST method. The body of the POST should always have a `data` key which is the JSON content you want to POST to a given route. 

Let's add some authors to our public datastore.
Request and body:
```json
http://localhost:3000/public/authors/
{
  "data": {
    "Pierce Brown": {},
    "Brandon Sanderson": {},
    "Michael J. Sullivan": {}
  }
}
```
But we forgot someone!

```json
http://localhost:3000/public/authors/Tolkien
{
  "data": {
    "books": ["The Lord of the Rings"]
  }
}
```
Notice how here we can use a path that might not exist yet and it will automatically create the data structure. There are multiple ways to do the same thing!



This will result in `public.json` looking like the following:
```json
{
  "authors": {
    "Pierce Brown": {},
    "Brandon Sanderson": {},
    "Michael J. Sullivan": {},
    "Tolkien": {
      "books": [
        "The Lord of the Rings"
      ]
    }
  }
}
```
If we wanted to add some books to Pierce Brown and an age we could do the following:
```json
http://localhost:3000/public/authors/Pierce Brown
{
  "data": {
    "books": ["Red Rising", "Golden Son"],
    "age": 31
  }
}
```
#### "type": "merge"
Now for the last step lets add "The Hobbit" to the list of books for Tolkien. You have probably realized that we will run into a problem. How can we append to the books array? One option is to make a GET request, add the book to the client side object, and make a new POST request with the modified data. The problem with this approach is that we find ourselves with a critical section problem. So we need to use the API method post as below with the **`type`** set to "merge":
```json
http://localhost:3000/public/authors/Tolkien/books
{
  "data": ["The Hobbit"],
  "type": "merge"
}
```
The final `public.json` looks like the following:
```json
{
  "authors": {
    "Pierce Brown": {
      "books": [
        "Red Rising",
        "Golden Son"
      ],
      "age": 31
    },
    "Brandon Sanderson": {},
    "Michael J. Sullivan": {},
    "Tolkien": {
      "books": [
        "The Lord of the Rings",
        "The Hobbit"
      ]
    }
  }
}
```
### Get

Now let's explore the GET method for our simple object stores. The way GET works is each key at each level of the object in the JSON is used in the URI to access data. 

#### To `/` or not to `/`

When making GET requests to this backend API we had to make some decisions on how to represent the object-store. There are some instances where you want to retrieve an object and all its descendants, and for performance reasons, there are a lot of cases where you simply want the keys at a given level. To solve this problem you will see some funny notation that is not a standard in... anything.

- To get the keys at a certain path, add a `/` at the end of your request.
- To get the actual objects and all children at a certain path, leave out the `/` at the end. 

You will see some examples below as we explore our author data. 

```json
http://localhost:3000/public/
{
    "result": [
        "authors"
    ]
}
```
```json
http://localhost:3000/public/authors/
{
    "result": [
        "Pierce Brown",
        "Brandon Sanderson",
        "Michael J. Sullivan",
        "Tolkien"
    ]
}
```
Notice now when we leave out the `/` at the end of authors we get **all** the data. 
```json
http://localhost:3000/public/authors
{
    "result": {
        "Pierce Brown": {
            "books": [
                "Red Rising",
                "Golden Son"
            ],
            "age": 31
        },
        "Brandon Sanderson": {},
        "Michael J. Sullivan": {},
        "Tolkien": {
            "books": [
                "The Lord of the Rings",
                "The Hobbit"
            ]
        }
    }
}
```

### DELETE

Delete requests are not special in any way. Simply specify the location of the object you want to delete. For example, if we want to delete Tolkien:

```json
http://localhost:3000/public/authors/Tolkien
{
    "result": {
        "path": "authors.Tolkien",
        "status": "delete successful"
    }
}
```

## Axios Demo
```javascript
import axios from 'axios';

const pubRoot = new axios.create({
  baseURL: "http://localhost:3000/public"
});

async function createAuthor({first = 'John', last = 'Doe', numBooks = 0}) {
  return await pubRoot.post(`/authors/`, {
    data: {first, last, numBooks}
  })
}

async function getAllAuthors() {
  return await pubRoot.get('/authors');
}

(async () => {
  await createAuthor({
    first: "chris",
    numBooks: 4
  });

  let {data} = await getAllAuthors();
  console.log(data)
})();
```

