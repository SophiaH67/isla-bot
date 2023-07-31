import BaseFrontend from "./BaseFrontend";
import { Server } from "socket.io";
import Isla from "../Isla";
import { createServer } from "http";
import Protocol from "../protocol/Protocol";
import { IslaUser } from "../interfaces/IslaUser";
import { IslaMessage } from "../interfaces/IslaMessage";
import { uuid } from "uuidv4";
import { IslaChannel } from "../interfaces/IslaChannel";

interface ServerToClientEvents {
  broadcast: (message: string) => void;
  protocolChange: (protocol: Protocol) => void;
}

interface ClientToServerEvents {
  command: (command: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export default class WebsocketFrontend extends BaseFrontend {
  private io!: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  constructor(private readonly isla: Isla) {
    super();
  }

  public async broadcast(message: string) {
    this.io.sockets.emit("broadcast", message);
  }

  async start() {
    const server = createServer();
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server);

    server.listen(1514);

    this.io.on("connection", (socket) => {
      const userAuthor = new IslaUser("websocket-" + socket.id, socket.id);

      socket.on("command", async (command) => {
        const message: IslaMessage = new IslaMessage(
          this.isla,
          command,
          async (content) => {
            socket.emit("broadcast", content);
          },
          userAuthor,
          uuid(),
          new IslaChannel(socket.id, this)
        );
        await this.isla.onMessage(message);
      });
    });
  }

  public async setProtocol(protocol: Protocol) {
    this.io.sockets.emit("protocolChange", protocol);
  }
}
