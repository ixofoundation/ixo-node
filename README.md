# ixo_node

The project to setup an ixo node.  It runs Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

Install [MongoDB](https://docs.mongodb.com/manual/installation/) and set the following environment variable by exporting the variable with the `<...>` sections replaced for your local database

```sh
export MONGOLAB_URI="mongodb://<username>:<password>@<host>:<port>/ixo"
```


```sh
git clone https://github.com/ixofoundation/ixo_node.git # or clone your own fork
cd ixo_node
npm install
cp .env-example .env
npm run build
npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Development
The system is setup to use `ts-node` and `nodemon` to streamline development. bur running the `dev` script all `src` files are watched and the server will restart on any changes

```sh
npm run dev
```

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)