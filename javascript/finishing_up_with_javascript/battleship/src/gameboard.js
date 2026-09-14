import { Ship } from "./ship.js";

export const BOARD_SIZE = 10;

const keyFor = ({ row, column }) => `${row},${column}`;
const sameCoordinate = (a, b) => a.row === b.row && a.column === b.column;

export class Gameboard {
  constructor(size = BOARD_SIZE) {
    this.size = size;
    this.ships = [];
    this.missedAttacks = [];
    this.attacks = [];
  }

  isInBounds({ row, column }) {
    return Number.isInteger(row) && Number.isInteger(column)
      && row >= 0 && row < this.size && column >= 0 && column < this.size;
  }

  getShipAt(coordinate) {
    return this.ships.find(({ coordinates }) =>
      coordinates.some((position) => sameCoordinate(position, coordinate)),
    );
  }

  placeShip(shipOrLength, start, direction = "horizontal", name) {
    const ship = shipOrLength instanceof Ship ? shipOrLength : new Ship(shipOrLength, name);
    const step = direction === "vertical" ? { row: 1, column: 0 } : { row: 0, column: 1 };
    if (!["horizontal", "vertical"].includes(direction)) {
      throw new TypeError("Direction must be horizontal or vertical.");
    }

    const coordinates = Array.from({ length: ship.length }, (_, index) => ({
      row: start.row + step.row * index,
      column: start.column + step.column * index,
    }));

    if (!coordinates.every((coordinate) => this.isInBounds(coordinate))) {
      throw new RangeError("Ship placement is outside the board.");
    }
    if (coordinates.some((coordinate) => this.getShipAt(coordinate))) {
      throw new Error("Ships cannot overlap.");
    }

    this.ships.push({ ship, coordinates });
    return ship;
  }

  receiveAttack(coordinate) {
    if (!this.isInBounds(coordinate)) throw new RangeError("Attack is outside the board.");
    if (this.attacks.some((attack) => sameCoordinate(attack, coordinate))) {
      return { result: "already-attacked", coordinate };
    }

    this.attacks.push({ ...coordinate });
    const target = this.getShipAt(coordinate);
    if (!target) {
      this.missedAttacks.push({ ...coordinate });
      return { result: "miss", coordinate };
    }

    target.ship.hit();
    return {
      result: target.ship.isSunk() ? "sunk" : "hit",
      coordinate,
      ship: target.ship,
    };
  }

  allShipsSunk() {
    return this.ships.length > 0 && this.ships.every(({ ship }) => ship.isSunk());
  }

  wasAttacked(coordinate) {
    return this.attacks.some((attack) => sameCoordinate(attack, coordinate));
  }

  cellState(coordinate, revealShips = false) {
    const shipEntry = this.getShipAt(coordinate);
    if (this.wasAttacked(coordinate)) return shipEntry ? "hit" : "miss";
    return shipEntry && revealShips ? "ship" : "empty";
  }

  coordinateKey(coordinate) {
    return keyFor(coordinate);
  }
}
