import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import MqttService from "./MqttService";
import { MqttClient } from "mqtt/*";
import JoinFrontend from "../Classes/Frontends/JoinFrontend";

enum Severity {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogMessage {
  message: string;
  reportToPilot: boolean;
  context?: string;
}

const MINIMUM_LOG_LEVEL = Severity.DEBUG;

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
    private readonly isla: Isla,
    private readonly context?: string
  ) {}

  private _joinFrontend?: JoinFrontend;

  get joinFrontend() {
    if (!this._joinFrontend) {
      this._joinFrontend = this.isla.getService(JoinFrontend);
    }

    return this._joinFrontend;
  }

  private async _log(message: string, severity: Severity) {
    const minimumLogLevel = MINIMUM_LOG_LEVEL;
    const reportToPilot = isSeverityAtLeast(severity, minimumLogLevel);

    const logMessage: LogMessage = {
      message,
      reportToPilot,
      context: this.context,
    };

    // Always log to console and MQTT
    console.log(`[${this.context}/${severity}] ${message}`);

    await this.mqttClient.publishAsync(
      `isla/log/${severity}`,
      JSON.stringify(logMessage)
    );

    if (reportToPilot) {
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

export default class LoggingService implements BaseService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly isla: Isla
  ) {}

  public getLogger(context?: string) {
    return new Logger(this.mqttService.mqttClient, this.isla, context);
  }
}
