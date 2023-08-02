import BaseFrontend from "./BaseFrontend";
import Isla from "../Isla";
import express from "express";
import bodyParser from "body-parser";
import { IslaUser } from "../interfaces/IslaUser";
import { IslaMessage } from "../interfaces/IslaMessage";
import { uuid } from "uuidv4";
import { IslaChannel } from "../interfaces/IslaChannel";

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
      // const message = new MockMessage(this.isla, command, (content) =>
      //   res.write(content)
      // );

      const user = new IslaUser(req.ip, req.ip);

      const message = new IslaMessage(
        this.isla,
        command,
        async (content) => {
          res.write(content);
        },
        async () => {
          res.status(400).send("Your message was deleted");
        },
        user,
        uuid(),
        new IslaChannel("http", this)
      );
      await this.isla.onMessage(message);

      res.end();
    });

    this.app.listen(1515);
  }
}
