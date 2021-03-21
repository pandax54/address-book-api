# Address Book API

## :computer: Project
An address Book API with Node.js, Express, Postgres and Firebase.
Register your contacts in web and mobile using this API.
</br>

</br>

## :rocket: Technologies

#### :us: This project was developed with the following technologies:

- [TypeScript](https://github.com/Microsoft/TypeScript)
- [Express](https://github.com/expressjs/express)
- [React](https://github.com/facebook/react)
- Firebase
- Postgres
- TypeORM
- Bcrypt
- JWT
- Celebrate (Joi)
- Prettier
- ESLint
- Jest
- Supertest

</br>


## Steps


### install - Back-End

First clone the repository.
```
$ yarn 
```

You can use docker to setup the database:
```
example:
$ docker run --name addressBook -e POSTGRES_PASSWORD=mysecretpassword -p 5433:5432 -d postgres

$ $ docker run --name [image-name] -e POSTGRES_PASSWORD=[set your password] -p [set your port]:5432 -d postgres

```

### Setting the ormconfig.json
In the root you must configure the ```ormconfig.json```with your informations:

```
----> do not forget to change for your settings
  {
    "type": "postgres",
    "host": "localhost",
    "port": [$PORT],
    "username": [$USERNAME],
    "password": [$PASSWORD], 
    "database": [$DATABASE],
    "synchronize": true,
    "logging": true,
    "migrations": [
      "./src/database/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/database/migrations/*.ts"
    },
    "entities": [
      " ./src/models/*.ts"
    ]
  }
```
Run the migrations using this command:
```
$ yarn orm migration:run
```

### ENV variables 
In the file ```.env.example``` you must fill your envinroment variables
Dont forget to remove the example in the name of the file, the file must be like this: ```.env```


### Starting the server

```
$ yarn dev
```
