# Mutant Backend Developer Test

# Tools and Technologies

-   Bootstrap
-   NodeJS
-   ExpressJS
-   SQLite

# Features

1. Users can signup and login and log out into the application 
2. Used JWT as authorization and hashed and salted users' password including refresh tokens in the database
3. Users can view all products
4. Users can view more details of a product with a product page
5. Users can view their user details in the profile page
6. Admin users can view admin dashboard to add, update and delete products
7. Only admin users can access and perform admin related actions 

## Installation

1. Clone the project to local device
2. In the terminal, start the node server by running the following:

```
    npm run dev
```

3. On a browser, open `http://localhost:8000/login`
4. For admin user, you can use the following credentials:

```
    email: admin@email.com
    password: 12345678
```
4. For normal user, you can use the following credentials:

```
    email: john@doe.com
    password: 12345678
```