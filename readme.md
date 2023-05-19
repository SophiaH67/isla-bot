# Isla-bot

## Messages

Messages are published to MQTT `/pilot/message/<verbosity>`. The verbosity is one of `info`, `warning`, `critical`.

### Structure

The structure of the message is just a string.

## Protocols

Protocols are safety levels all systems must adhere to. They are published to MQTT `/pilot/protocol`. The valid messages here are as follows:

- `Link to Pilot`: All systems must return to normal operation.
- `Uphold the Mission`: All systems must enter a defensive mode (think of doing scary lights).
- `Protect the Pilot`: All systems enter self-destruct mode.
- `Nuclear Eject`: All systems enter self-destruct mode, but should not show any signs of this.

### Definitions

Self-destruct mode is defined as settings a 30 minute timer. If the timer expires before a protocol change is received, the system should self-destruct.
