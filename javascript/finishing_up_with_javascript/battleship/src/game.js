import { Player } from "./player.js";

export const FLEET = [
  [5, "Carrier"], [4, "Battleship"], [3, "Cruiser"], [3, "Submarine"], [2, "Destroyer"],
];

export class BattleshipGame {
  constructor(random = Math.random) {
    this.random = random;
    this.player = new Player("You");
    this.computer = new Player("Computer", "computer");
    this.currentPlayer = this.player;
    this.winner = null;
    this.populateBoards();
  }

  populateBoards() {
    [this.player, this.computer].forEach((player) => this.placeFleetRandomly(player));
  }

  placeFleetRandomly(player) {
    FLEET.forEach(([length, name]) => {
      let placed = false;
      while (!placed) {
        const direction = this.random() < 0.5 ? "horizontal" : "vertical";
        const coordinate = {
          row: Math.floor(this.random() * player.gameboard.size),
          column: Math.floor(this.random() * player.gameboard.size),
        };
        try {
          player.gameboard.placeShip(length, coordinate, direction, name);
          placed = true;
        } catch (error) {
          // Try another legal coordinate.
        }
      }
    });
  }

  playHumanTurn(coordinate) {
    if (this.winner || this.currentPlayer !== this.player) return null;
    const outcome = this.player.attack(this.computer, coordinate);
    if (outcome.result === "already-attacked") return outcome;
    if (this.computer.gameboard.allShipsSunk()) {
      this.winner = this.player;
      return outcome;
    }
    this.currentPlayer = this.computer;
    return outcome;
  }

  playComputerTurn() {
    if (this.winner || this.currentPlayer !== this.computer) return null;
    const outcome = this.computer.randomAttack(this.player, this.random);
    if (this.player.gameboard.allShipsSunk()) this.winner = this.computer;
    else this.currentPlayer = this.player;
    return outcome;
  }
}
