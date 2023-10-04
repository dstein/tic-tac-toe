/**
 * TODO
 * - Refactor win conditions - checkGameOver method
 * - Better ui for players
 * - Add a simple AI for players to compete against
 * 
 * BUGS
 * - Winning on final square results in tie
 */

const Player = function(name, marker) {

    let atts = {
        name: name,
        marker: marker
    };

    const _checkMarker = function(name, marker) {
        let pMark = marker.toLowerCase();

        console.log( pMark );
    
        if ( ( pMark !== 'x' ) && ( pMark !== 'o' ) ) {
            marker = prompt(`${name}: Invalid marker! Choose X or O`);
            _checkMarker(name, marker);
        } else {
            atts.marker = pMark;
        }
    };

    const playerSetup = function(name, marker) {

        if ( ! name ) {
            name = prompt('Please enter your name');
            atts.name = name;
        }
    
        if ( ! marker ) {
            marker = prompt(`${name}: Please choose your marker. X or O.`);
            _checkMarker(name, marker);
        }
    }

    playerSetup(atts.name, atts.marker);

    return atts;
}

const Gameboard = ( function() {

    const domBoard          = document.getElementById('gameboard');
    const boardQuadrants    = document.querySelectorAll('.quadrant');
    const gameBoard         = ["", "", "", "", "", "", "", "", ""];
    
    //Visualized
    // const gameBoard =   [
    //                         {0}'x', {1}'o', {2}'o', 
    //                         {3}'o', {4}'x', {5}'x', 
    //                         {6}'o', {7}'x', {8}'o'
    //                     ];

    const _initQuadrantAtts = function(quadrants, board) {

        if ( quadrants.length === board.length ) {

            let i = 0;
            
            for ( let quad of quadrants ) {
                quad.setAttribute('data-marker', '');
                quad.setAttribute('data-index', i);
                i++;
            }

        } else {
            console.log('Lengths don\'t match!');
        }

        console.log( board );
    };

    const _checkQuadrant = function(quadrant) {
        //console.log("CHECKING!!!");
        //console.log(quadrant);

        if ( ! quadrant.getAttribute('data-marker') ) {
            return true;
        } else {
            return false;
        }
    }

    const boardSetup = function() {
        _initQuadrantAtts(boardQuadrants, gameBoard);
    }

    const addMarker = function(quadrant, player = {}) {

        const canAddMarker = _checkQuadrant(quadrant);
        //console.log(canAddMarker);
        // console.log('GAMEBOARD - Adding Marker');

        console.log(quadrant);
        // console.log(player);

        if ( canAddMarker ) {
            quadrant.setAttribute('data-marker', player.marker);
            return true;
        } else {
            console.log('GAMEBOARD: addMarker() - Marker already in place!!!');
            return false;
        }
    }

    return {
        gameBoard,
        boardQuadrants,
        boardSetup: boardSetup,
        addMarker: addMarker
    }
})();

const Controller = ( function(board) {

    const startBtn      = document.getElementById('start');
    const restartBtn    = document.getElementById('restart');
    let gameState       = board.gameBoard;
    let isGameOver      = false;
    let opMarker        = '';
    let player1         = {};
    let player2         = {};
    let currPlayer      = {};

    const _mapBoardQuadrants = function(quadrants) {

        for ( let quad of quadrants ) {

            quad.addEventListener('click', (e) => {
                const currQuad = e.target;

                if ( ! isGameOver ) {
                    _updateBoard(currQuad, currPlayer);
                }
                
            });
        }
    }

    const _updateBoard = function(quadrant, player) {
        
        console.log(`CONTROLLER: My player: ${player.name} - My marker: ${player.marker}`);

        //Add marker to board and change turn
        const markerAdded = board.addMarker(quadrant, player);

        //console.log(`CONTROLLER: _updateBoard() - Has the marker been added? ${markerAdded}`);

        if ( markerAdded ) {
            playerChangeTurn(currPlayer);

            //TESTING
            //TODO: replace gameState value with prod game board array
            gameState.splice( quadrant.getAttribute('data-index'), 1, player.marker );

            checkGameOver(gameState);

        } else {
            throw 'ERROR: Choose a different quadrant!';
        }
    }

    const _processGameOver = function( quadrants = [], condition ) {

        if ( quadrants.length ===  0 ) {
            return false;
        }

        let gameOverX;
        let gameOverO;
        let gameOverTie;
        let winningMarker;
        let winningPlayer;

        if ( condition === 'tie' ) {
            gameOverTie = quadrants.every( (el) => {
                return el === "x" || el === "o";
            });
        }

        gameOverX = quadrants.every( (val) => {
            return val === 'x';
        });

        gameOverO = quadrants.every( (val) => {
            return val === 'o';
        });

        if ( gameOverX ) {
            winningMarker = 'x';
        } else if ( gameOverO ) {
            winningMarker = 'o';
        } else if ( gameOverTie ) {
            winningMarker = 'Tie!';
            winningPlayer = winningMarker;
        }

        console.log(winningMarker);

        if ( player1.marker === winningMarker ) {
            winningPlayer = player1;
        } else if ( player2.marker === winningMarker ) {
            winningPlayer = player2;
        }

        return winningPlayer
    }

    const _gameOver = function(winningPlayer) {
        isGameOver = true;

        console.log('Game Over man!');
        console.log(winningPlayer);
    }

    const _init = function() {
        _mapBoardQuadrants(board.boardQuadrants);
    }

    const playerChangeTurn = function(player) {

        if ( player === player1 ) {
            currPlayer = player2;
        } else {
            currPlayer = player1;
        }
    }

    const checkGameOver = function(state = []) {

        let winner;
        let checkTie;
        let winCondition;

        if ( state.length !== 0 ) {
            
            console.log('CONTROLLER: CHECKING GAME OVER');
            console.log(state);

            checkTie = _processGameOver( state, 'tie' );

            if ( checkTie ) {
                winner = checkTie;
                console.log('Tie Game!!');

            } else {

                //horizontal
                if ( state[0] && state[1] && state[2] ) {
                    winner = _processGameOver( [ state[0], state[1], state[2] ] );

                    if ( winner ) {
                        winCondition = 'Game over: horizontal, top left to top right';
                        console.log(winCondition);
                    }
                }

                if ( state[3] && state[4] && state[5] ) {
                    winner = _processGameOver( [ state[3], state[4], state[5] ] );

                    if ( winner ) {
                        winCondition = 'Game over: horizontal, mid left to mid right';
                        console.log(winCondition);
                    }
                }

                if ( state[6] && state[7] && state[8] ) {
                    winner = _processGameOver( [ state[6], state[7], state[8] ] );

                    if ( winner ) {
                        winCondition = 'Game over: horizontal, bottom left to bottom right';
                        console.log(winCondition);
                    }
                }

                //vertical
                if ( state[0] && state[3] && state[6] ) {
                    winner = _processGameOver( [ state[0], state[3], state[6] ] );

                    if ( winner ) {
                        winCondition = 'Game over: vertical, top left to bottom left';
                        console.log(winCondition);
                    }
                }

                if ( state[1] && state[4] && state[7] ) {
                    winner = _processGameOver( [ state[1], state[4], state[7] ] );

                    if ( winner ) {
                        winCondition = 'Game over: vertical, mid top to mid bottom';
                        console.log(winCondition);
                    }
                }

                if ( state[2] && state[5] && state[8] ) {
                    winner = _processGameOver( [ state[2], state[5], state[8] ] );

                    if ( winner ) {
                        winCondition = 'Game over: vertical, top right to bottom right';
                        console.log(winCondition);
                    }
                }

                //diagonal
                if ( state[0] && state[4] && state[8] ) {
                    winner = _processGameOver( [ state[0], state[4], state[8] ] );
    
                    if ( winner ) {
                        winCondition = 'Game over: diagonal, top left to bottom right';
                        console.log(winCondition);
                    }
                }
    
                if ( state[2] && state[4] && state[6] ) {
                    winner = _processGameOver( [ state[2], state[4], state[6] ] );
    
                    if ( winner ) {
                        winCondition = 'Game over: diagonal, top right to bottom left';
                        console.log(winCondition);
                    }
                }
            }

            if ( winner ) {
                _gameOver(winner);
            }    

        } else {
            console.log('Please enter a game state array');
        }
    }

    const restartGame = function() {
        isGameOver          = false;
        board.gameBoard     = ['', '', '', '', '', '', '', '', '' ];
        gameState           = board.gameBoard;
        startGame();
    }

    const startGame = function() {

        //PLAYER SETUP
        //player1 = Player();
        player1 = Player('p1', 'x');

        if ( player1.marker === 'x' ) {
            opMarker = 'o';
        } else if ( player1.marker === 'o' ) {
            opMarker = 'x';
        }

        //player2 = Player('', opMarker);
        player2 = Player('p2', 'o');

        //GAME SETUP
        currPlayer = player1;
        board.boardSetup(currPlayer);
    }

    startBtn.addEventListener( 'click', (e) => {
        const strbtn = e.target;
        strbtn.classList.add('disable');
        restartBtn.classList.add('show');

        startGame();
        _init();

    }, { once: true });

    restartBtn.addEventListener( 'click', restartGame);

    return {
        playerChangeTurn: playerChangeTurn,
        checkGameOver: checkGameOver
    }

})(Gameboard);