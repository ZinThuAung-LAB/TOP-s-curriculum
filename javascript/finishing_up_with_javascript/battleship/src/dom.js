import { BattleshipGame } from "./game.js";

let game = new BattleshipGame();
const status = document.querySelector("#status");
const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");

function renderBoard(element, board, revealShips, interactive = false) {
  element.replaceChildren();
  for (let row = 0; row < board.size; row += 1) {
    for (let column = 0; column < board.size; column += 1) {
      const coordinate = { row, column };
      const state = board.cellState(coordinate, revealShips);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `cell ${state}`;
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.disabled = !interactive || board.wasAttacked(coordinate) || Boolean(game.winner);
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}${state === "empty" ? "" : `, ${state}`}`);
      element.append(cell);
    }
  }
}

function render() {
  renderBoard(playerBoard, game.player.gameboard, true);
  renderBoard(computerBoard, game.computer.gameboard, false, game.currentPlayer === game.player);
}

function describe(outcome, attacker) {
  if (outcome.result === "miss") return `${attacker} missed.`;
  if (outcome.result === "sunk") return `${attacker} sank the ${outcome.ship.name}!`;
  return `${attacker} scored a hit!`;
}

computerBoard.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const humanOutcome = game.playHumanTurn({ row: Number(cell.dataset.row), column: Number(cell.dataset.column) });
  if (!humanOutcome || humanOutcome.result === "already-attacked") return;
  if (game.winner) status.textContent = "Victory! You sank the enemy fleet.";
  else {
    const computerOutcome = game.playComputerTurn();
    status.textContent = `${describe(humanOutcome, "You")} ${describe(computerOutcome, "Computer")}`;
    if (game.winner) status.textContent += " Defeat — your fleet has sunk.";
  }
  render();
});

document.querySelector("#new-game").addEventListener("click", () => {
  game = new BattleshipGame();
  status.textContent = "Your turn — select a square on the enemy board.";
  render();
});

render();
