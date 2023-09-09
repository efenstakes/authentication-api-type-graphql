# Authentication API

The code in this repo is fully functioning authentication API using graphql apollo, type-graphql, typegoose, nodejs, typescript, javascript, jwt tokens, express and mongodb.

## 🚀 Start

To start this project, first clone the code using git:

```sh
git clone https://github.com/efenstakes/authentication-api-type-graphql api
```

Navigate to the project directory:

```sh
cd api
```

Install dependencies:

```sh
yarn install
```

Create .env in the src/ directory with below keys:

```sh
touch src/.env
```

DB_URL=<your-value>
PORT=<your-value>
ACCESS_TOKEN_SECRET=<your-value>
REFRESH_TOKEN_SECRET=<your-value>



To start the API run:

```sh
yarn dev
```


To build the API run:

```sh
yarn build
```

To deploy the API to AWS Lambda, ensure you install serverless and run:

```sh
yarn build && serverless deploy
```

### Alternatively, you can use docker to run the api.

Build the Docker image:

```sh
docker build -t auth-api .
```

Start the Docker container:

```sh
docker run -p 8080:8080 auth-api
```


## Note For SQL users
Typegoose can easily be replaced by an SQL ORM like TypeORM and this API will work perfectly with MySQL, Postgres or any other MYSQL database.


## Contact
Contact me through.
efenstakes101@gmail.com
