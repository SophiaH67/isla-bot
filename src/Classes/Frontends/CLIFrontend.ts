import BaseFrontend from "./BaseFrontend";

export default class CLIFrontend extends BaseFrontend {
  public async broadcast(message: string) {
    console.log(`Broadcast: ${message}`);
  }
}
