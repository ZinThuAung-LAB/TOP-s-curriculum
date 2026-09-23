export class Ship {
  constructor(length, name = "Ship") {
    if (!Number.isInteger(length) || length < 1) {
      throw new TypeError("A ship length must be a positive integer.");
    }

    this.length = length;
    this.name = name;
    this.hits = 0;
  }

  hit() {
    if (!this.isSunk()) this.hits += 1;
    return this.hits;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
