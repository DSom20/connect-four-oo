/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color, number) {
    this.color = color;
    this.number = number;
  }
}

 class Game {
   constructor(height, width) {
      //properties
      this.height = height;
      this.width = width;
      let startButton = document.querySelector("#start");
      startButton.addEventListener("click", this.startGame.bind(this));
   }

   //Methods
   
   startGame(){
      this.gameOver = false;
      this.player1 = new Player(this.getColor("#p1"), 1);
      this.player2 = new Player(this.getColor("#p2"), 2);
      this.currPlayer = this.player1;

      this.updateCssColors();

      const board = document.getElementById('board');
      board.innerHTML = '';
      this.board = this.makeBoard();
      this.makeHtmlBoard();
   }

   updateCssColors() {
     const root = document.documentElement;
     root.style.setProperty('--player1-color', this.player1.color);
     root.style.setProperty('--player2-color', this.player2.color);
   }

   getColor(id) {
      const inputElement = document.querySelector(id);
      return inputElement.value;
   }

   makeBoard() {
      let board = [];
      for (let y = 0; y < this.height; y++) {
        board.push(Array.from({ length: this.width }));
      }
      return board;
   }

   makeHtmlBoard() {
      const board = document.getElementById('board');
    
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this.handleClick.bind(this));
    
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
    
      board.append(top);
    
      // make main part of board
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
    
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
    
        board.append(row);
      }
  }

  findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
  }

  placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.classList.add(`p${this.currPlayer.number}`);
      piece.style.top = -50 * (y + 2);

      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
  }

  endGame(msg) {
      alert(msg);
  }

  handleClick(evt) {
      // get x from ID of clicked cell
      if (this.gameOver){
        return;
      }
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer.number;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer.number} won!`);
      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      // switch players
      this.currPlayer = this.currPlayer.number === 1 ? this.player2 : this.player1;
  }

  checkForWin() {
      var _win = (cells) => {
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer.number
        );
      }
      // OG Method
      // function _win(cells) {
      //   // Check four cells to see if they're all color of current player
      //   //  - cells: list of four (y, x) cells
      //   //  - returns true if all are legal coordinates & all match currPlayer

      //   return cells.every(
      //     ([y, x]) =>
      //       y >= 0 &&
      //       y < this.height &&
      //       x >= 0 &&
      //       x < this.width &&
      //       this.board[y][x] === this.currPlayer
      //   );
      // }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

          // OG Method
          // // find winner (only checking each win-possibility as needed)
          // if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
          //   return true;
          // }

          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            this.gameOver = true;
            return true;
          }
        }
      }
    }

 }

new Game(6, 7);