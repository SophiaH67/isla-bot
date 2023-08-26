import BaseFrontend from "./BaseFrontend";
import { Server } from "socket.io";
import Isla from "../Isla";
import { createServer } from "http";
import { IslaUser } from "../interfaces/IslaUser";
import { IslaMessage } from "../interfaces/IslaMessage";
import { uuid } from "uuidv4";
import { IslaChannel } from "../interfaces/IslaChannel";

interface ServerToClientEvents {
  broadcast: (message: string) => void;
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
      const userAuthor = new IslaUser(
        "websocket-" + socket.id,
        socket.id,
        false
      );

      socket.on("command", async (command) => {
        const message: IslaMessage = new IslaMessage(
          this.isla,
          command,
          async (content) => {
            socket.emit("broadcast", content);
          },
          async () => {
            socket.emit("broadcast", "Message deleted");
          },
          userAuthor,
          uuid(),
          new IslaChannel(socket.id, this)
        );
        await this.isla.onMessage(message);
      });
    });
  }
}
