export function SleepBypass(
  target: any,
  _propertyKey: string,
  _descriptor: PropertyDescriptor
) {
  target.sleepBypass = true;
}
