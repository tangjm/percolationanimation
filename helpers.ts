/**
 * Wait a specified number of seconds before resolving to 'null'.
 * @param seconds to wait
 * @returns
 */
export function wait(seconds: number): Promise<null> {
  return new Promise((resolve, reject) => {
    return setTimeout(() => resolve(null), seconds * 1000);
  });
}

/**
 * Return only key-value pairs where the value is a number.
 * @param obj Object with key-value pairs.
 * @returns
 */
export function getNumericEntries(obj: object): [string, number][] {
  return Object.entries(obj).filter((entry) => typeof entry[1] === "number");
}

/**
 * Return a random integer in the interval [min, max] with equal probability.
 * @param min Lower bound
 * @param max Upper bound
 * @returns
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
