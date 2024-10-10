import type { Request, Response } from "express";
import bodyParser from "body-parser";
import express from "express";
import admin from "./lib/firebaseadmin";
import registerTokenForAddress from "./routes/registerTokenForAddress";
import processWebHook from "./routes/processWebhook";

const app = express();

const PORT = 8080;

app.use(express.json());

app.post("/", processWebHook);

app.post("/registerTokenForAddress", registerTokenForAddress);

app.listen(PORT, () => {
  console.log(`Notification Server is running on port ${PORT}`);
});
