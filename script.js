// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Initialize the chessboard
    const game = new Chess(); // Create new Chess.js game instance
    const moveHistory = document.getElementById('move-history'); // Get move history container
    let moveCount = 1; // Initialize the move count
    let userColor = 'w'; // Initialize the user's color as white

    // Function to make a random move for the computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves(); // Get all possible moves for the current position

        if (game.game_over()) { // Check if the game is over
            alert("Checkmate!"); // Alert the user if the game is over
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length); // Select a random move index
            const move = possibleMoves[randomIdx]; // Get the random move
            game.move(move); // Make the move in the game
            board.position(game.fen()); // Update the board position
            recordMove(move, moveCount); // Record the move in the history
            moveCount++; // Increment the move count
        }
    };

    // Function to record and display a move in the move history
    const recordMove = (move, count) => {
        // Format the move for display based on whether it's the user's or computer's turn
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' '; // Append the formatted move to the move history
        moveHistory.scrollTop = moveHistory.scrollHeight; // Scroll to the bottom of the move history
    };

    // Function to handle the start of a drag position
    const onDragStart = (source, piece) => {
        // Allow the user to drag only their own pieces based on color
        return !game.game_over() && piece.search(userColor) === 0; // Check if the game is not over and the piece belongs to the user
    };

    // Function to handle a piece drop on the board
    const onDrop = (source, target) => {
        const move = game.move({ // Attempt to make the move
            from: source, // Source square
            to: target, // Target square
            promotion: 'q', // Promote to a queen if applicable
        });

        if (move === null) return 'snapback'; // If the move is invalid, snap the piece back to its original position
        
        window.setTimeout(makeRandomMove, 250); // Make a random move for the computer after a short delay
        recordMove(move.san, moveCount); // Record the move in the history
        moveCount++; // Increment the move count
    };

    // Function to handle the end of a piece snap animation
    const onSnapEnd = () => {
        board.position(game.fen()); // Update the board position after the snap animation
    };

    // Configuration options for the chessboard
    const boardConfig = {
        showNotation: true, // Show move notation on the board
        draggable: true, // Allow pieces to be dragged
        position: 'start', // Set the initial position of the board
        onDragStart, // Set the function to call on drag start
        onDrop, // Set the function to call on piece drop
        onSnapEnd, // Set the function to call at the end of the snap animation
        moveSpeed: 'fast', // Set the speed of piece movement
        snapBackSpeed: 500, // Set the speed of snapping back to the original position
        snapSpeed: 100, // Set the speed of snapping to the target position
    };

    // Initialize the chessboard
    board = Chessboard('board', boardConfig); // Create a new chessboard instance with the specified configuration

    // Event listener for the "Play Again" button
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset(); // Reset the game state
        board.start(); // Reset the board to the starting position
        moveHistory.textContent = ''; // Clear the move history
        moveCount = 1; // Reset the move count
        userColor = 'w'; // Reset the user's color to white
    });

    // Event listener for the "Set Position" button
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!"); // Prompt the user for FEN notation
        if (fen !== null) { // Проверяем, ввел ли пользователь значение
            if (game.load(fen)) { // Пытаемся загрузить позицию из FEN
                board.position(fen); // Устанавливаем позицию на доске
                moveHistory.textContent = ''; // Очищаем историю ходов
                moveCount = 1; // Сбрасываем счетчик ходов
                userColor = 'w'; // Сбрасываем цвет пользователя на белый
            } else {
                alert("Invalid FEN notation. Please try again."); // Если FEN недействителен, показываем сообщение об ошибке
            }
        }
    });

    // Event listener for the "Flip Board" button
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip(); // Переворачиваем доску
        makeRandomMove(); // Делаем случайный ход для компьютера
        // Переключаем цвет пользователя после переворота доски
        userColor = userColor === 'w' ? 'b' : 'w'; // Меняем цвет пользователя на противоположный
    });
});
