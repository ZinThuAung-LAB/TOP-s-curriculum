import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(name, type = "human") {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(opponent, coordinate) {
    return opponent.gameboard.receiveAttack(coordinate);
  }

  randomAttack(opponent, random = Math.random) {
    const options = [];
    for (let row = 0; row < opponent.gameboard.size; row += 1) {
      for (let column = 0; column < opponent.gameboard.size; column += 1) {
        const coordinate = { row, column };
        if (!opponent.gameboard.wasAttacked(coordinate)) options.push(coordinate);
      }
    }
    if (options.length === 0) return null;
    return this.attack(opponent, options[Math.floor(random() * options.length)]);
  }
}
