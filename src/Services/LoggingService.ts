import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import MqttService from "./MqttService";
import { MqttClient } from "mqtt/*";
import ProtocolService, { Protocol } from "./ProtocolService";
import JoinFrontend from "../Classes/Frontends/JoinFrontend";

enum Severity {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogMessage {
  message: string;
  context?: string;
}

const minimumLogLevelPerProtocol: Record<Protocol, Severity> = {
  [Protocol.LINK_TO_PILOT]: Severity.INFO,
  [Protocol.UPHOLD_THE_MISSION]: Severity.DEBUG,
  [Protocol.PROTECT_THE_PILOT]: Severity.WARN,
};

function isSeverityAtLeast(
  severity: Severity,
  minimumSeverity: Severity
): boolean {
  return (
    Object.values(Severity).indexOf(severity) >=
    Object.values(Severity).indexOf(minimumSeverity)
  );
}

export class Logger {
  constructor(
    private readonly mqttClient: MqttClient,
    private readonly protocolService: ProtocolService,
    private readonly joinFrontend: JoinFrontend,
    private readonly context?: string
  ) {}

  private async _log(message: string, severity: Severity) {
    const logMessage: LogMessage = {
      message,
      context: this.context,
    };

    const currentProtocol = this.protocolService.getProtocol();
    const minimumLogLevel = minimumLogLevelPerProtocol[currentProtocol];

    // Always log to console and MQTT
    console.log(`[${this.context}/${severity}] ${message}`);

    await this.mqttClient.publishAsync(
      `isla/log/${severity}`,
      JSON.stringify(logMessage)
    );

    if (isSeverityAtLeast(severity, minimumLogLevel)) {
      this.joinFrontend.broadcast(message);
    }
  }

  public debug(message: string) {
    return this._log(message, Severity.DEBUG);
  }

  public info(message: string) {
    return this._log(message, Severity.INFO);
  }

  public warn(message: string) {
    return this._log(message, Severity.WARN);
  }

  public error(message: string) {
    return this._log(message, Severity.ERROR);
  }
}

export default class LoggingService extends BaseService {
  private mqttClient!: MqttClient;
  private isla!: Isla;

  onReady(isla: Isla): Promise<void> {
    this.isla = isla;
    this.mqttClient = isla.getService(MqttService).mqttClient;
    return Promise.resolve();
  }

  public getLogger(context?: string) {
    const protocolService = this.isla.getService(ProtocolService);
    const joinFrontend = this.isla.getService(JoinFrontend);
    return new Logger(this.mqttClient, protocolService, joinFrontend, context);
  }
}
