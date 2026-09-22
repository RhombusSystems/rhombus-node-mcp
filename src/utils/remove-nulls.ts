/**
 * Remove all null values from an object.
 * @param obj - The object to remove null values from.
 * @returns A new object with all null values removed.
 */
export function removeNulls<T extends object>(obj: T): Partial<T> {
  // Create a shallow copy to avoid modifying the original object
  const copy = { ...obj };

  for (const key in copy) {
    if (Object.prototype.hasOwnProperty.call(copy, key)) {
      const value = (copy as any)[key];

      if (value === null) {
        delete (copy as any)[key];
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Recursively clean nested objects
        const cleaned = removeNulls(value);
        if (Object.keys(cleaned).length === 0) {
          delete (copy as any)[key];
        } else {
          (copy as any)[key] = cleaned;
        }
      }
    }
  }

  return copy as Partial<T>;
}
