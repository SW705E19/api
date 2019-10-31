# api

You should run npm install to get all node modules.

You should have sqlite installed to see the database file.

npm start to start the server - listen on localhost:3000

npx jest to run tests.

We are using jwt for authentication so you will need postman to get the token.

Create a Post request to localhost:3000/auth/login with username: admin and password: admin
The JWT will be in the response

![Get JWT](markdownpictures/PostmanLogin.PNG)

Use the JWT to access other end points like this:

![Using the JWT](markdownpictures/PostmanGetUsers.PNG)


Links:

setup of api:
https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

tests:
https://basarat.gitbooks.io/typescript/docs/testing/jest.html
