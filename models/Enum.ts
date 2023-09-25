export function getKeyByValue<T>(
  enumObject: T,
  value: string,
): keyof T | undefined {
  return Object.keys(enumObject).find(
    (key) => enumObject[key] === value,
  ) as keyof T;
}
