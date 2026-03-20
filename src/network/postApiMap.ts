import { UUID } from "../types.js";

export default function createUuidMap<T>(data: T[], uuidKey: keyof T): Map<UUID, T> {
  const map = new Map<UUID, T>();
  for (const item of data) {
    map.set(item[uuidKey] as UUID, item);
  }
  
  return map;
}