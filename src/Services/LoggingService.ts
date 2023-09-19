import Isla from "src/Classes/Isla";
import { BaseService } from "./BaseService";
import MqttService from "./MqttService";
import { MqttClient } from "mqtt/*";

enum Severity {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

interface LogMessage {
  message: string;
  context?: string;
}

class Logger {
  constructor(
    private readonly mqttClient: MqttClient,
    private readonly context?: string
  ) {}

  private _log(message: string, severity: Severity) {
    const logMessage: LogMessage = {
      message,
      context: this.context,
    };

    console.log(`[${this.context}/${Severity[severity]}] ${message}`);

    this.mqttClient.publish(
      `isla/log/${severity.toString().toLowerCase()}`,
      JSON.stringify(logMessage)
    );
  }

  public debug(message: string) {
    this._log(message, Severity.DEBUG);
  }

  public info(message: string) {
    this._log(message, Severity.INFO);
  }

  public warn(message: string) {
    this._log(message, Severity.WARN);
  }

  public error(message: string) {
    this._log(message, Severity.ERROR);
  }
}

export default class LoggingService extends BaseService {
  private mqttClient!: MqttClient;

  onReady(isla: Isla): Promise<void> {
    this.mqttClient = isla.getService(MqttService).mqttClient;
    return Promise.resolve();
  }

  public getLogger(context?: string) {
    return new Logger(this.mqttClient, context);
  }
}
