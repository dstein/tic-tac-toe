/**
 * TODO
 * - Better ui for players
 * - Add a simple AI for players to compete against
 * 
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

    const winQuadHorizTop     = { winPosition: [], winCondition: 'Horizontal: top', winIndex: "", winMarker: "" };
    const winQuadHorizMid     = { winPosition: [], winCondition: 'Horizontal: mid', winIndex: "", winMarker: "" };
    const winQuadHorizBtm     = { winPosition: [], winCondition: 'Horizontal: btm', winIndex: "", winMarker: "" };

    const winQuadVertLeft     = { winPosition: [], winCondition: 'Vertical: left', winIndex: "", winMarker: "" };
    const winQuadVertMid      = { winPosition: [], winCondition: 'Vertical: mid', winIndex: "", winMarker: "" };
    const winQuadVertRight    = { winPosition: [], winCondition: 'Vertical: right', winIndex: "", winMarker: "" };

    const winQuadDiagLeft     = { winPosition: [], winCondition: 'Diagonal: left', winIndex: "", winMarker: "" };
    const winQuadDiagRight    = { winPosition: [], winCondition: 'Diagonal: right', winIndex: "", winMarker: "" };

    const winMaster = [ winQuadHorizTop, winQuadHorizMid, winQuadHorizBtm, 
        winQuadVertLeft, winQuadVertMid, winQuadVertRight, winQuadDiagLeft, winQuadDiagRight ];

    const winStateX = [ "x", "x", "x" ];
    const winStateO = [ "o", "o", "o" ];

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

            gameState.splice( quadrant.getAttribute('data-index'), 1, player.marker );

            checkGameOver(gameState);

        } else {
            throw 'ERROR: Choose a different quadrant!';
        }
    }

    const _gameOver = function( winningPlayer ) {
        isGameOver = true;

        for ( let winReset of winMaster ) {
            winReset.winPosition = [];
            winReset.winMarker = "";
            winReset.winIndex = "";
        }

        console.log('Game Over man!');
        console.log(winningPlayer);
        console.log(winMaster);
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
        let playerWinMarker;

        if ( state.length !== 0 ) {
            
            console.log('CONTROLLER: CHECKING GAME OVER');
            console.log(state);

            //TESTING CONDITIONS
            //stateWinX = [ "x", "o", "x", "x", "o", "o", "x", "x", "o" ];
            //stateWinO = [ "o", "x", "x", "x", "o", "x", "x", "o", "o" ]
            //stateTie = [ "x", "o", "x", "x", "o", "o", "o", "x", "x" ];
            //state = stateWinX;

            winQuadHorizTop.winPosition = [ state[0], state[1], state[2] ];
            winQuadHorizMid.winPosition = [ state[3], state[4], state[5] ];
            winQuadHorizBtm.winPosition = [ state[6], state[7], state[8] ];

            winQuadVertLeft.winPosition = [ state[0], state[3], state[6] ];
            winQuadVertMid.winPosition  = [ state[1], state[4], state[7] ];
            winQuadVertRight.winPosition = [ state[2], state[5], state[8] ];

            winQuadDiagLeft.winPosition = [ state[0], state[4], state[8] ];
            winQuadDiagRight.winPosition = [ state[2], state[4], state[6] ];

            const winParse = winMaster.filter( (val, index) => {

                console.log(val);
                console.log(index);

                val.winIndex = index;

                let winX = val.winPosition.every( (e, i) => {

                    if ( e === winStateX[i] ) {
                        val.winMarker = 'x';
                        return true;
                    }
                });

                let winO = val.winPosition.every( (e, i) => {

                    if ( e === winStateO[i] ) {
                        val.winMarker = 'o';
                        return true;
                    }
                });

                if ( winX || winO ) {
                    return val;
                }
            });

            console.log(winParse);
            console.log(winMaster);

            if ( winParse.length === 1 ) {
                playerWinMarker = winParse[0].winMarker;

                if ( player1.marker === playerWinMarker ) {
                    winner = player1;
                } else if ( player2.marker === playerWinMarker ) {
                    winner = player2;
                }

                winner.winCondition = winParse[0].winCondition;

            } else if ( winParse.length === 0 && state.every( (e) => e === 'o' || e === 'x' ) ) {
                console.log('we have a tie!');
                winner = {};
                winner.winCondition = 'tie';
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