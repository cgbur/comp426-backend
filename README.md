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

## API
The below details the out-of-the-box functionality of the server. It is encouraged to add custom routes if you wish to implement a more traditional API.

By default, the server is separated into four separate routes: *account*, *public*, *private*, and *user*. The first of these that you will need to interact with are the `/account/` routes. These deal with creating new users, signing in, and verifying your current status.  The *public*, *private*, and *user* routes, on the other hand, are all simple object stores but with the following caveats.
  - `/public/` is an object store where **any** user can perform CRUD operations.
  - `/private/` is an object store where only **logged-in users** can perform CRUD operations
  - `/user/` is an object store where every logged-in user has their own private subtree where other users cannot access.

We will first go over the routes that are related to *account* because they are in the format of a traditional API.

> Notice that each of these four routes has a corresponding `.json` file in the `/data/` directory where their respective data is stored.

### `/account/`

#### GET `/status`

not implemented

<details>
  <summary>**POST `/create`**</summary>
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
  <summary>**POST `/login`**</summary>
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
  <summary>**GET `/status`**</summary>
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
