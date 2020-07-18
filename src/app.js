import express from "express";
import http from "http";
import bodyParser from "body-parser";
import config from './config';

import routes from "./routes";

const app = express();

app.use(bodyParser.json({ limit: config.bodyLimit }));
app.use("/v1", routes);

app.server = http.createServer(app);
module.exports = { app };
