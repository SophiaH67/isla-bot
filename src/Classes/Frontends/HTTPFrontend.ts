import BaseFrontend from "./BaseFrontend";
import express from "express";
import bodyParser from "body-parser";
import HTTPMessageContext from "../Contexts/HTTPMessageContext";
import CommandHandler from "../CommandHandler";

export default class HTTPFrontend extends BaseFrontend {
  private buffer: string[] = [];
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
        this,
        (message: string) => {
          if (!message) {
            res.status(404).send("Command not found").end();
            return;
          }
          res.send(message);
          res.end();
        }
      );
      ctx.bufferedMessage = this.buffer.pop() || "";
      await this.commandHandler.handleMessage(ctx);
    });
  }

  public async start() {
    this.app.listen(this.port, () => {
      console.log(`Listening on 0.0.0.0:${this.port}`);
    });
  }

  public async broadcast(message: string) {
    this.buffer.push(message);
  }
}
