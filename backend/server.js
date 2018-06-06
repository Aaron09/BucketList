"use strict"

const express = require("express")
const http = require("http")
const path = require("path")
const bodyParser = require("body-parser")
const routes = require("./routes.js")
const mongoDB = require("./database/database.js")
const bucketSchema = require("./database/models/bucket.js")
const socket = require("./socket.js");
const connectionManager = require("./connection-manager.js");
const Websocket = require("ws");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "assets")))

app.use("", routes);

const server = http.createServer(app)

const wss = new Websocket.Server({server});
socket(wss, connectionManager);

server.listen(8080, () => {
  console.log('Express server listening on %d', server.address().port);
});
