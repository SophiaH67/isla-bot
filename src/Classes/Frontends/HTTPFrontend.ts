import BaseFrontend from "./BaseFrontend";
import express from "express";
import bodyParser from "body-parser";
import HTTPMessageContext from "../Contexts/HTTPMessageContext";
import CommandHandler from "../CommandHandler";

export default class HTTPFrontend extends BaseFrontend {
  private port = 9123;
  private app: express.Application;

  constructor(commandHandler: CommandHandler) {
    super(commandHandler);
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post("/", async (req, res) => {
      if (!req.body.message || typeof req.body.message !== "string") {
        res.status(400).send("No message provided");
        return;
      }
      const ctx = new HTTPMessageContext(
        req.body.message,
        req.ip,
        (message: string) => {
          res.send(message);
          res.end();
        }
      );
      this.commandHandler.handleMessage(ctx);
    });
  }

  public async start() {
    this.app.listen(this.port, () => {
      console.log(`Listening on 0.0.0.0:${this.port}`);
    });
  }
}
