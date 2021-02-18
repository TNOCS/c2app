# c2app
A command and control application for Concept Development &amp; Experimentation.

## Prerequisites for Traccar to work

- Ports 8084 (TCP), 8083 (TCP), 5000-5150 (TCP & UDP) forwarded on the router
- Firewall configured to allow incoming connections port 8084 (TCP), 8083 (TCP), 5000-5150 (TCP & UDP)

## Installation

The application is a mono-repository, developed in TypeScript using [Nest.js](https://docs.nestjs.com) for the server, and [Mithril](https://mithril.js.org) for the GUI. It consists of the following packages:

- Server:
- GUI:
- Shared:

The easiest way is to run the docker compose file in the `./docker` folder:

```bash
cd docker
docker-compose up -d
```

The GUI will then be available at [localhost:3000](http://localhost:3000/).  
Refer to the [README](./docker/README.md) file in the `docker` folder for more information on what all the different services do.

## Development

To run the node parts of this repository separately (i.e. without the Kafka and Traccar infrastructure) you can run:

```bash
# If you don't have pnpm installed, you can install it using `npm i -g pnpm`
pnpm multi install
npm start
```

This installs the npm packages, their dependencies and then starts the server, gui and shared applications.

If you want to have the underlying Kafka infrastructure you need to run the `docker-compose` command above, **but first comment out the c2app service such that docker does not start it in parallel to npm**.
Otherwise the c2app is started twice (once as a docker image, once by `npm`) which creates port conflicts and confusing issues.

Assuming the project is running using `npm start`, you can access:

- The GUI at [http://localhost:1234](http://localhost:1234).
- OpenAPI (Swagger) interface at [http://localhost:3000/api](http://localhost:3000/api).
- OpenAPI configuration file at [http://localhost:3000/api-json](http://localhost:3000/api-json).
- The server at [http://localhost:3000](http://localhost:3000)
