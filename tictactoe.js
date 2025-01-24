class Board {
    constructor(cells) {
        this.cells = cells
    }

    emptyCellCount() {
        let x = 0
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cells[i][j] == '') x++
            }
        }
        return x
    }

    getPlayer() {
        let x = 0
        let o = 0
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.cells[i][j] == 'X') {
                    x++;
                } else if (this.cells[i][j] == 'O') {
                    o++;
                }
            }
        }

        if (Math.abs(x - o) > 1) {
            return "ERRRORR"
        }
        if (o > x) {
            return "ERRRORR"
        }

        if (x > o) {
            return 'O';
        } else {
            return 'X';
        }
    }

    print() {
        for (let i = 0; i < 3; i++) {
            console.log(this.cells[i])
        }
        console.log("")
    }
    clone() {
        const newCells = JSON.parse(JSON.stringify(this.cells));
        return new Board(newCells);
    }

}

function actions(board) {
    let actionList = []
    let curr
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board.cells[i][j] == '') {
                curr = [i, j]
                actionList.push(curr)
            }
        }
    }
    return actionList
}

function utility(state) {
    let cells = state.cells
    let value = 0
    found = false
    for (var i = 0; i < 3; i++) {
        if (cells[i][0] == cells[i][1] && cells[i][1] == cells[i][2] && cells[i][0] != '') {
            value = (cells[i][0] == 'X' && !found) ? 1 : -1
            found = true
            break;
        }
        if (cells[0][i] == cells[1][i] && cells[1][i] == cells[2][i] && cells[0][i] != '') {
            value = (cells[0][i] == 'X' && !found) ? 1 : -1
            found = true
            break;
        }
    }

    if (cells[0][0] == cells[1][1] && cells[1][1] == cells[2][2] && cells[0][0] != '') {
        value = (cells[0][0] == 'X' && !found) ? 1 : -1
        found = true
    }
    if (cells[0][2] == cells[1][1] && cells[1][1] == cells[2][0] && cells[1][1] != '') {
        value = (cells[1][1] == 'X' && !found) ? 1 : -1
        found = true
    }
    return value
}

function terminal(state) {
    if (utility(state) != 0) {
        return true
    }
    return (state.emptyCellCount() <= 0)
}

function result(board, action) {
    let newBoard = board.clone()
    newBoard.cells[action[0]][action[1]] = board.getPlayer()
    return newBoard
}

function minimax(state) {
    let player = state.getPlayer();

    let bestAction = null;
    let bestValue = player === "X" ? -Infinity : Infinity;

    actions(state).forEach((action) => {
        const newState = result(state, action);
        const value = player === "X" ? min_value(newState) : max_value(newState);
        if (player === "X" && value > bestValue) {
            bestValue = value;
            bestAction = action;
        } else if (player === "O" && value < bestValue) {
            bestValue = value;
            bestAction = action;
        }
    });

    return bestAction;


    function max_value(board) {
        if (board == null) {
            return
        }
        if (terminal(board) == true) {
            return utility(board)
        }
        var value = 0
        actions(board).forEach((action) => {
            value += Math.max(value, min_value(result(board, action)));
        })
        return value
    }
    function min_value(board) {
        if (terminal(board)) {
            return utility(board)
        }
        var value = 0
        actions(board).forEach((action) => {
            value += Math.min(value, max_value(result(board, action)));
        })
        return value;
    }
}


function restart() {
    setTimeout(function() {
        location.reload()
    }, 1000)
}

document.addEventListener('DOMContentLoaded', () => {

    const cells = [['', '', ''], ['', '', ''], ['', '', '']];
    let board = new Board(cells)

    function nobodyWins() {
        const grid = document.getElementById('grid')
        const all_buttons = grid.getElementsByTagName('button')
        for (const button of all_buttons) {
            button.disabled = true
        }
        all_buttons[4].innerHTML = '<h4>NOBODY WINS</h4>'

        restart()
    }

    function winner(player) {
        console.log(player + "WINS!")
        const grid = document.getElementById('grid')
        const all_buttons = grid.getElementsByTagName('button')
        for (const button of all_buttons) {
            button.disabled = true
            button.classList.remove(player == 'X' ? 'O' : 'X')
            button.classList.add(player)
        }
        all_buttons[4].innerHTML = `<h4>${player} WINS!</h4>`

        restart()
    }

    const grid = document.getElementById('grid')
    const all_buttons = grid.getElementsByTagName('button')
    const button_array = [[], [], []]

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            button_array[i][j] = all_buttons[(i * 3) + j];
        }
    }

    for (const button of all_buttons) {
        button.addEventListener("click", () => {
            button.disabled = true
            button.innerHTML = board.getPlayer()
            button.classList.add(board.getPlayer())
            let action = [parseInt(button.id[0]), parseInt(button.id[1])]
            board = result(board, action)

            if (terminal(board)) {
                if (utility(board) === 1) {
                    return winner('X');
                } if (utility(board) === -1) {
                    return winner('O')
                } else {
                    return nobodyWins()
                }
            }

            const computer_action = minimax(board)
            id = "" + computer_action[0] + computer_action[1]
            const computer_button = document.getElementById(id)
            computer_button.disabled = true
            computer_button.innerHTML = board.getPlayer()
            computer_button.classList.add(board.getPlayer())
            board = result(board, computer_action)

            if (terminal(board)) {
                if (utility(board) === 1) {
                    return winner('X');
                } if (utility(board) === -1) {
                    return winner('O')
                } else {
                    return nobodyWins()
                }
            }
        });
    }



})
