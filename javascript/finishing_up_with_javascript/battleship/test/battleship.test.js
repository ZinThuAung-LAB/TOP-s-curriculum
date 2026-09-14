import test from "node:test";
import assert from "node:assert/strict";
import { Ship } from "../src/ship.js";
import { Gameboard } from "../src/gameboard.js";
import { Player } from "../src/player.js";

test("a ship records hits and sinks at its length", () => {
  const ship = new Ship(2);
  ship.hit();
  assert.equal(ship.isSunk(), false);
  ship.hit();
  assert.equal(ship.hits, 2);
  assert.equal(ship.isSunk(), true);
});

test("a board places ships, records hits and misses", () => {
  const board = new Gameboard();
  board.placeShip(2, { row: 1, column: 2 });
  assert.equal(board.receiveAttack({ row: 1, column: 2 }).result, "hit");
  assert.equal(board.receiveAttack({ row: 9, column: 9 }).result, "miss");
  assert.deepEqual(board.missedAttacks, [{ row: 9, column: 9 }]);
  assert.equal(board.receiveAttack({ row: 1, column: 2 }).result, "already-attacked");
});

test("a board rejects overlap and reports when all ships sink", () => {
  const board = new Gameboard();
  board.placeShip(1, { row: 0, column: 0 });
  assert.throws(() => board.placeShip(2, { row: 0, column: 0 }));
  assert.equal(board.allShipsSunk(), false);
  board.receiveAttack({ row: 0, column: 0 });
  assert.equal(board.allShipsSunk(), true);
});

test("the computer chooses only an untried legal coordinate", () => {
  const computer = new Player("Computer", "computer");
  const opponent = new Player("Opponent");
  opponent.gameboard.placeShip(1, { row: 0, column: 0 });
  const result = computer.randomAttack(opponent, () => 0);
  assert.equal(result.result, "sunk");
  assert.equal(opponent.gameboard.attacks.length, 1);
});
