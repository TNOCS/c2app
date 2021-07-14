# C2App: docker deployment - SIMULATION

This docker compose file is based on the example of running the Table-Top Infrastructure.

This `docker-compose.yml` will start the following services:

- OSRM Services: The routing services for the agent simulator.
- Zookeeper: [Apache Zookeeper](https://zookeeper.apache.org/), an internal service, required for managing the state of connected client (what group of clients have read what messages). In case a client crashes, it can continue processing messages where it crashed.
- Broker: [Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. All TTI messages are streamed over Kafka between different solutions.
- Schema registry: Each published message must adhere to a an [AVRO-based](https://avro.apache.org/) schema, so each connected client knows exactly what information it receives.
- Kafka REST: A REST client for getting information from Kafka.
- [Kafka topics UI](kafka-topics-ui): An optional service to easily inspect the Kafka topics, and the messages that were sent.
- [Kafka schema registry UI][schema-registry-ui]: An optional service to easily inspect the AVRO schemas that are used per topic (each topic is associated with one and only one schema, but a schema may have different versions).
- Bootstrapper: A service that runs on startup, registering all required schemas and topics. When creating new schema files, just add them to the `schemas` folder and add their name to the `PRODUCE_TOPICS` environment variable of the bootstrapper, so the producer can create them on start-up.
- [C2app][c2app-local]: A command and control application for First Responders

## Starting the simulation

To start all the services in the background (`-d` flag) run the following command in the current folder:

```bash
docker-compose up -d
```

Then, start Agent Smith Simulator. You can use VSCode's `run` tab, and run `launch simulation` (make sure to run `npm install` and `npm run build` in `docker/simulation/ass` before running the ASS)

## Inspecting the environment

If you have [nodejs](https://nodejs.org/en/) installed, you can try `dockly` (`npm i -g dockly`).  
Alternatively, if the [Docker plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) is installed in [VS code](https://code.visualstudio.com/), the logs can be shown by right clicking on the running image and pressing "Logs".

[kafka-topics-ui]: http://localhost:3600
[schema-registry-ui]: http://localhost:3601
[env-file]: https://docs.docker.com/compose/environment-variables/#the-env-file
[c2app-local]: http://localhost:3000
