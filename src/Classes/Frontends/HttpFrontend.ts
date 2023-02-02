import BaseFrontend from "./BaseFrontend";
import Isla from "../Isla";
import MockMessage from "../Utils/MockMessage";
import express from "express";
import bodyParser from "body-parser";

export default class HttpFrontend extends BaseFrontend {
  private app!: express.Application;

  constructor(private readonly isla: Isla) {
    super();
  }

  public async start() {
    this.app = express();

    this.app.use(bodyParser.raw({ type: "*/*" }));

    this.app.post("/command", async (req, res) => {
      const commandBuffer = req.body as Buffer;
      const command = commandBuffer.toString();

      if (!command) {
        res.status(400).send("No command provided");
        return;
      }
      const message = new MockMessage(this.isla, command, (content) =>
        res.write(content)
      );
      await this.isla.onMessage(message);

      res.end();
    });

    this.app.listen(1515);
  }
}
