# c2app

A command and control application for Concept Development &amp; Experimentation.

## Installation

The application is a mono-repository, developed in TypeScript using [Nest.js](https://docs.nestjs.com) for the server, and [Mithril](https://mithril.js.org) for the GUI. It consists of the following packages:

- Server: Subscribes to Kafka topics and forwards them to the relevant clients
- GUI: The client part of the application. Connects with the server through the WebSocket protocol
- Shared: Type definitions and utility functions

The easiest way is to run the docker compose file in the `./docker` folder:

```bash
cd docker
docker-compose up -d
```

The GUI will then be available at [localhost:3000](http://localhost:3000/).  
Refer to the [README](./docker/README.md) file in the `docker` folder for more information on what all the different services do.

## Run integration tests

[Run test](run_test.md)

## Development

Before you can use the map, please create your `Mapbox` access token from [here](https://account.mapbox.com), and insert it into the `./packages/gui/.env` file (you can copy the `.env.example` to `.env`).

To run the node parts of this repository separately (i.e. without the Kafka infrastructure) you can run:

```bash
# If you don't have pnpm installed, you can install it using `npm i -g pnpm`
pnpm i
npm start
```

Or run the following in `packages/gui`, `packages/server`, and `packages/shared`

```bash
npm i
```

This installs the `npm` packages, their dependencies and then starts the server, gui and shared applications.

If you want to have the underlying Kafka infrastructure you need to run the `docker-compose` command above, **but first comment out the c2app service such that docker does not start it in parallel to `npm`**.
Otherwise the c2app is started twice (once as a docker image, once by `npm`) which creates port conflicts and confusing issues.

Assuming the project is running using `npm start`, you can access:

- The GUI at [http://localhost:1234](http://localhost:1234).
- OpenAPI (Swagger) interface at [http://localhost:3000/api](http://localhost:3000/api).
- OpenAPI configuration file at [http://localhost:3000/api-json](http://localhost:3000/api-json).
- The server at [http://localhost:3000](http://localhost:3000)
