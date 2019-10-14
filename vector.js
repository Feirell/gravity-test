export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unitVector() {
    const length = this.length();

    if (length == 0)
      return new Vector(0, 0);

    return this.multiplyByN(1 / length);
  }

  multiplyByN(n) {
    return new Vector(
      this.x * n,
      this.y * n
    )
  }
}