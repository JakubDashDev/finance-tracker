export function notZero(n: number) {
  n = +n; // Coerce to number.
  if (!n) {
    // Matches +0, -0, NaN
    throw new Error("Invalid dividend " + n);
  }
  return n;
}
