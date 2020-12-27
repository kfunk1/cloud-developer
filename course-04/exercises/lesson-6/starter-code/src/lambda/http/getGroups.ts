import * as express from "express";
import * as awsServerlessExpress from "aws-serverless-express";
import "source-map-support/register";
import { getAllGroups } from "../../businessLogic/groups";

const app = express();

app.get("/groups", async (_req, res) => {
  const groups = await getAllGroups();

  res.append('Access-Control-Allow-Origin', ['*']);
  res.json({
    items: groups,
  });
});

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

