export enum TempUnit {
  CELSIUS = "C",
  FAHRENHEIT = "F",
}

export function tempFunc(temp: number, tempUnit: TempUnit | null | undefined) {
  return tempUnit === TempUnit.FAHRENHEIT ? (temp * 9) / 5 + 32 : temp;
}
