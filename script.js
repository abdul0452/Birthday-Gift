// Game state management
let currentScreen = 'loading';
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app');
    showScreen('loading');
    simulateLoading();
    initializeTetris();
    setupModalListeners();
}

// ========== SCREEN TRANSITIONS ==========
window.showScreen = function (screenName) {
    console.log('Showing screen:', screenName);

    // Pause Tetris if leaving tetris screen
    if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning) {
        tetrisGame.gamePaused = true;
    }

    const currentActive = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(screenName + '-screen');

    if (!targetScreen) {
        console.error('Screen not found:', screenName);
        return;
    }

    if (currentActive) {
        currentActive.classList.add('fade-out');

        setTimeout(() => {
            currentActive.classList.remove('active', 'fade-out');
            targetScreen.classList.add('active');
            currentScreen = screenName;

            switch (screenName) {
                case 'message':
                    setTimeout(() => startTypewriter(), 300);
                    break;
                case 'gallery':
                    setTimeout(() => initializeGallery(), 100);
                    break;
                case 'music':
                    setTimeout(() => initializeMusicPlayer(), 100);
                    break;
                case 'tetris':
                    setTimeout(() => {
                        if (tetrisGame) {
                            if (!tetrisGame.gameRunning) {
                                startTetrisGame();
                            } else {
                                tetrisGame.gamePaused = false;
                                drawTetrisBoard();
                                tetrisGameLoop();
                            }
                        }
                    }, 100);
                    break;
            }
        }, 400);
    } else {
        targetScreen.classList.add('active');
        currentScreen = screenName;
    }
};

// Enhanced loading simulation dengan tema biru
function simulateLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const statusText = document.querySelector('.status-text');
    
    let progress = 0;
    const loadingMessages = [
        'INITIALIZING SYSTEM...',
        'LOADING MEMORY BANK...',
        'CHECKING CARTRIDGE...',
        'ESTABLISHING CONNECTION...',
        'PREPARING SURPRISE...',
        'ALMOST READY...',
        'SYSTEM READY!'
    ];

    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 8 + 3;
        if (progress > 100) progress = 100;

        // Update progress bar
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(progress) + '%';

        // Update status message
        const newMessageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
        if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
            messageIndex = newMessageIndex;
            if (statusText) {
                statusText.style.opacity = '0';
                setTimeout(() => {
                    statusText.textContent = loadingMessages[messageIndex];
                    statusText.style.opacity = '1';
                }, 200);
            }
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showScreen('main');
            }, 800);
        }
    }, 180);
}

// ========== MESSAGE SCREEN ==========
window.startTypewriter = function () {
    const messageContent = document.getElementById('message-content');
    if (!messageContent) return;

    if (typewriterInterval) clearInterval(typewriterInterval);

    const fullMessage = `Hi,

Happy Birthday!

Semoga ortumu panjang umur, kakakmu sehat selalu, rezeki ngalir terus, hidup penuh berkah, dijauhkan dari masalah, dan didekatkan dengan keberuntungan.

Pokoknya doa terbaik untuk tetanggamu  💐`;

    messageContent.innerHTML = '';
    let charIndex = 0;
    isTyping = true;

    typewriterInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            const char = fullMessage[charIndex];
            if (char === '\n') {
                messageContent.innerHTML += '<br>';
            } else {
                messageContent.innerHTML += char;
            }
            charIndex++;
            messageContent.scrollTop = messageContent.scrollHeight;
        } else {
            clearInterval(typewriterInterval);
            isTyping = false;
        }
    }, 50);
};

window.skipTypewriter = function () {
    if (isTyping && typewriterInterval) {
        clearInterval(typewriterInterval);
        const messageContent = document.getElementById('message-content');
        if (messageContent) {
            const fullMessage = `Hi,<br><br>Happy Birthday!<br><br>Semoga ortumu panjang umur, kakakmu sehat selalu, rezeki ngalir terus, hidup penuh berkah, dijauhkan dari masalah, dan didekatkan dengan keberuntungan.
.<br><br>Pokoknya doa terbaik untuk tetanggamu  💐`;
            messageContent.innerHTML = fullMessage;
            isTyping = false;
        }
    }
};

// ========== GALLERY SCREEN ==========
function initializeGallery() {
    console.log('Initializing gallery');
    const galleryContent = document.getElementById('gallery-content');
    if (!galleryContent) {
        console.error('Gallery content not found');
        return;
    }

    galleryContent.innerHTML = `
        <div class="photobox-header">
            <div class="photobox-dot red"></div>
            <span class="photobox-title">PHOTOBOX</span>
            <div class="photobox-dot green"></div>
        </div>
        <div class="photobox-progress" id="photobox-progress">READY TO PRINT</div>
        <div class="photo-display" id="photo-display">
            <div class="photo-placeholder">Press MULAI CETAK to start photo session</div>
        </div>
        <div class="photobox-controls">
            <button class="photo-btn" id="start-photo-btn" onclick="startPhotoShow()">MULAI CETAK</button>
        </div>
    `;
    console.log('Gallery initialized with button');
}

window.startPhotoShow = function () {
    console.log('Starting photo show');

    const photoBtn = document.getElementById('start-photo-btn');
    const photoDisplay = document.getElementById('photo-display');
    const progressDiv = document.getElementById('photobox-progress');

    if (!photoBtn || !photoDisplay || !progressDiv) {
        console.error('Elements not found:', { photoBtn, photoDisplay, progressDiv });
        return;
    }

    // Array photos dengan path gambar REAL
    const photos = [
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo1.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo2.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo3.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo4.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo5.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo6.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo7.jpg'
        },
        {
            text: 'Happy Birthday 🥳🥳🥳',
            image: 'images/photo8.jpg'
        }
    ];

    photoBtn.textContent = 'MENCETAK...';
    photoBtn.disabled = true;
    photoBtn.onclick = null;
    progressDiv.textContent = 'INITIALIZING CAMERA...';

    let framesHTML = '';
    for (let i = 0; i < photos.length; i++) {
        framesHTML += `
            <div class="photo-frame" id="frame-${i + 1}">
                <div class="photo-content">READY</div>
            </div>
        `;
    }

    const photoStripHTML = `
        <div class="photo-strip">
            <div class="photo-strip-header">PHOTOSTRIP SESSION</div>
            <div class="photo-frames-container">
                ${framesHTML}
            </div>
            <div class="photo-strip-footer">💕 BIRTHDAY MEMORIES 💕</div>
        </div>
    `;

    photoDisplay.innerHTML = photoStripHTML;
    currentPhotoIndex = 0;

    let countdown = 3;
    progressDiv.textContent = `GET READY... ${countdown}`;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            progressDiv.textContent = `GET READY... ${countdown}`;
        } else {
            clearInterval(countdownInterval);
            progressDiv.textContent = 'SMILE! 📸';
            startPhotoCapture(photos);
        }
    }, 1000);
};

function startPhotoCapture(photos) {
    const progressDiv = document.getElementById('photobox-progress');
    const photoBtn = document.getElementById('start-photo-btn');

    const captureInterval = setInterval(() => {
        if (currentPhotoIndex < photos.length) {
            const frameId = `frame-${currentPhotoIndex + 1}`;
            const frame = document.getElementById(frameId);

            if (frame) {
                progressDiv.textContent = '✨ FLASH! ✨';

                setTimeout(() => {
                    frame.classList.add('filled');

                    // Tampilkan gambar dengan onerror handler untuk placeholder
                    frame.innerHTML = `
                        <img src="${photos[currentPhotoIndex].image}" 
                             class="photo-image" 
                             alt="${photos[currentPhotoIndex].text}"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/200x150/ff6b9d/ffffff?text=Photo+${currentPhotoIndex + 1}';">
                        <div class="photo-overlay">
                            <div class="photo-content">${photos[currentPhotoIndex].text}</div>
                        </div>
                    `;

                    progressDiv.textContent = `CAPTURED ${currentPhotoIndex + 1}/${photos.length}`;
                    currentPhotoIndex++;
                }, 300);
            } else {
                currentPhotoIndex++;
            }
        } else {
            clearInterval(captureInterval);

            setTimeout(() => {
                progressDiv.textContent = '🎉 PHOTO STRIP COMPLETE! 🎉';
                photoBtn.textContent = 'CETAK LAGI';
                photoBtn.disabled = false;
                photoBtn.onclick = startNewSession;
            }, 1000);
        }
    }, 1500);
}

function startNewSession() {
    const photoBtn = document.getElementById('start-photo-btn');
    const progressDiv = document.getElementById('photobox-progress');
    const photoDisplay = document.getElementById('photo-display');

    if (progressDiv) progressDiv.textContent = 'READY TO PRINT';
    if (photoBtn) {
        photoBtn.textContent = 'MULAI CETAK';
        photoBtn.onclick = startPhotoShow;
    }

    if (photoDisplay) {
        photoDisplay.innerHTML = '<div class="photo-placeholder">Press MULAI CETAK to start photo session</div>';
    }

    currentPhotoIndex = 0;
}

// ========== MUSIC SCREEN ==========
function initializeMusicPlayer() {
    const musicContent = document.getElementById('music-content');
    if (!musicContent) return;

    const playlists = [
        { id: '2LRwfuGemepTkAaqv38BeP', name: 'Happy Birthday' },
        { id: '7l17n1355cPt14myva89We', name: 'Mood Booster' },
        { id: '6WaEqsIHbEYG1DIhIpvYoY', name: 'calm vibes 🌻🍃🌊' },
        { id: '4cThCHGglwgL2XfwqXinzX', name: 'naikin mood🎧🩶' }
    ];

    let playlistButtons = '';
    playlists.forEach((playlist) => {
        playlistButtons += `
            <button class="playlist-btn" onclick="loadPlaylist('${playlist.id}', this)">
                ▶ ${playlist.name}
            </button>
        `;
    });

    musicContent.innerHTML = `
        <div class="spotify-container">
            <div class="spotify-header">
                <div class="spotify-logo">♪ SPOTIFY PLAYER</div>
            </div>
            
            <div class="spotify-embed-container" id="spotify-embed-container">
                <iframe id="spotify-iframe" 
                        style="border-radius:12px" 
                        src="https://open.spotify.com/embed/playlist/2LRwfuGemepTkAaqv38BeP?utm_source=generator" 
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"></iframe>
            </div>
            
            <div class="now-playing" id="now-playing">
                🎵 Now Playing: Today's Top Hits
            </div>
            
            <div class="playlist-buttons">
                ${playlistButtons}
            </div>
            
            <div style="color: #0f0; font-size: 7px; text-align: center; margin-top: 10px; padding: 5px; border-top: 1px solid #0ff;">
                ↑↓ SCROLL | KLIK PLAYLIST UNTUK MENDENGARKAN
            </div>
        </div>
    `;

    setTimeout(() => {
        const firstBtn = document.querySelector('.playlist-btn');
        if (firstBtn) {
            firstBtn.classList.add('active');
        }
    }, 200);
}

window.loadPlaylist = function (playlistId, buttonElement) {
    const iframe = document.getElementById('spotify-iframe');
    const nowPlaying = document.getElementById('now-playing');

    if (iframe && nowPlaying) {
        document.querySelectorAll('.playlist-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (buttonElement) {
            buttonElement.classList.add('active');
        }

        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;

        const playlistName = buttonElement ? buttonElement.textContent.replace('▶ ', '') : 'Playlist';
        nowPlaying.innerHTML = `🎵 Now Playing: ${playlistName}`;

        buttonElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            buttonElement.style.transform = '';
        }, 150);
    }
};

// ========== TETRIS GAME ==========
function initializeTetris() {
    console.log('Initializing Tetris');
    const canvas = document.getElementById('tetris-canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    canvas.width = 240;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');

    tetrisGame = {
        canvas: canvas,
        ctx: ctx,
        board: createEmptyBoard(10, 20),
        currentPiece: null,
        gameRunning: false,
        gamePaused: false,
        dropTime: 0,
        lastTime: 0,
        dropInterval: 500,
        blockWidth: 24,
        blockHeight: 20,
        boardWidth: 10,
        boardHeight: 20,
        animationFrame: null,
        gameOver: false
    };

    // Reset stats
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;

    updateTetrisStats();
    drawTetrisBoard();

    // Setup event listeners untuk tombol
    setupTetrisButtons();

    console.log('Tetris initialized');
}

function setupTetrisButtons() {
    console.log('Setting up Tetris buttons');

    // Hapus semua event listener lama dengan replace
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const downBtn = document.getElementById('down-btn');
    const dropBtn = document.getElementById('drop-btn');
    const pauseBtn = document.getElementById('pause-btn');

    if (leftBtn) {
        leftBtn.replaceWith(leftBtn.cloneNode(true));
        document.getElementById('left-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Left button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
                movePieceLeft();
                addButtonFeedback(this);
            }
        });
    }

    if (rightBtn) {
        rightBtn.replaceWith(rightBtn.cloneNode(true));
        document.getElementById('right-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Right button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
                movePieceRight();
                addButtonFeedback(this);
            }
        });
    }

    if (rotateBtn) {
        rotateBtn.replaceWith(rotateBtn.cloneNode(true));
        document.getElementById('rotate-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Rotate button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
                rotatePiece();
                addButtonFeedback(this);
            }
        });
    }

    if (downBtn) {
        downBtn.replaceWith(downBtn.cloneNode(true));
        document.getElementById('down-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Down button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
                movePieceDown();
                addButtonFeedback(this);
            }
        });
    }

    if (dropBtn) {
        dropBtn.replaceWith(dropBtn.cloneNode(true));
        document.getElementById('drop-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hard drop button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
                hardDrop();
                addButtonFeedback(this);
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.replaceWith(pauseBtn.cloneNode(true));
        document.getElementById('pause-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Pause button clicked');
            if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning) {
                togglePause();
            }
        });
    }

    // Keyboard controls
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);

    console.log('Tetris buttons setup complete');
}

function addButtonFeedback(button) {
    button.style.transform = 'translateY(4px) scale(0.97)';
    button.style.filter = 'brightness(0.85)';
    setTimeout(() => {
        button.style.transform = '';
        button.style.filter = '';
    }, 100);
}

function handleKeyDown(e) {
    if (currentScreen !== 'tetris' || !tetrisGame || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    const key = e.key;

    // Prevent default scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        e.preventDefault();
    }

    switch (key) {
        case 'ArrowLeft':
            movePieceLeft();
            break;
        case 'ArrowRight':
            movePieceRight();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case 'ArrowDown':
            movePieceDown();
            break;
        case ' ':
            hardDrop();
            break;
    }
}

function togglePause() {
    if (!tetrisGame) return;

    tetrisGame.gamePaused = !tetrisGame.gamePaused;
    console.log('Game paused:', tetrisGame.gamePaused);

    // Update pause button text
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        if (tetrisGame.gamePaused) {
            pauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>RESUME</span>';
            pauseBtn.classList.add('is-paused');
        } else {
            pauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>PAUSE</span>';
            pauseBtn.classList.remove('is-paused');
        }
    }

    if (!tetrisGame.gamePaused) {
        // Resume game loop
        tetrisGame.lastTime = performance.now();
        tetrisGameLoop();
    }
}

function createEmptyBoard(width, height) {
    const board = [];
    for (let y = 0; y < height; y++) {
        board[y] = Array(width).fill(0);
    }
    return board;
}

function drawTetrisBoard() {
    if (!tetrisGame) return;

    const { ctx, canvas, board, blockWidth, blockHeight, boardWidth, boardHeight } = tetrisGame;

    ctx.fillStyle = '#0f380f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a4a1a';
    ctx.lineWidth = 1;

    for (let x = 0; x <= boardWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * blockWidth, 0);
        ctx.lineTo(x * blockWidth, canvas.height);
        ctx.strokeStyle = '#1a4a1a';
        ctx.stroke();
    }

    for (let y = 0; y <= boardHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * blockHeight);
        ctx.lineTo(canvas.width, y * blockHeight);
        ctx.strokeStyle = '#1a4a1a';
        ctx.stroke();
    }

    // Draw blocks
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] !== 0) {
                drawBlock(x, y, getBlockColor(board[y][x]));
            }
        }
    }

    // Draw current piece
    if (tetrisGame.currentPiece && tetrisGame.gameRunning && !tetrisGame.gameOver) {
        drawPiece(tetrisGame.currentPiece);
    }

    // Draw border
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Draw pause overlay
    if (tetrisGame.gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0ff';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

function drawBlock(x, y, color) {
    if (!tetrisGame) return;

    const { ctx, blockWidth, blockHeight } = tetrisGame;
    const padding = 2;
    const blockX = x * blockWidth;
    const blockY = y * blockHeight;

    ctx.fillStyle = color;
    ctx.fillRect(
        blockX + padding,
        blockY + padding,
        blockWidth - padding * 2,
        blockHeight - padding * 2
    );

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(
        blockX + padding,
        blockY + padding,
        blockWidth - padding * 2,
        3
    );
    ctx.fillRect(
        blockX + padding,
        blockY + padding,
        3,
        blockHeight - padding * 2
    );

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(
        blockX + padding,
        blockY + blockHeight - padding - 3,
        blockWidth - padding * 2,
        3
    );
    ctx.fillRect(
        blockX + blockWidth - padding - 3,
        blockY + padding,
        3,
        blockHeight - padding * 2
    );
}

function drawPiece(piece) {
    if (!piece || !piece.shape) return;

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(piece.x + x, piece.y + y, getBlockColor(piece.type));
            }
        });
    });
}

function getBlockColor(type) {
    const colors = {
        1: '#00ffff', // I - Cyan
        2: '#ffff00', // O - Yellow
        3: '#ff00ff', // T - Magenta
        4: '#00ff00', // S - Green
        5: '#ff0000', // Z - Red
        6: '#0000ff', // J - Blue
        7: '#ff8800'  // L - Orange
    };
    return colors[type] || '#ffffff';
}

function createTetrisPiece() {
    const pieces = [
        { shape: [[1, 1, 1, 1]], type: 1 }, // I
        { shape: [[2, 2], [2, 2]], type: 2 }, // O
        { shape: [[0, 3, 0], [3, 3, 3]], type: 3 }, // T
        { shape: [[0, 4, 4], [4, 4, 0]], type: 4 }, // S
        { shape: [[5, 5, 0], [0, 5, 5]], type: 5 }, // Z
        { shape: [[6, 0, 0], [6, 6, 6]], type: 6 }, // J
        { shape: [[0, 0, 7], [7, 7, 7]], type: 7 } // L
    ];

    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    const startX = Math.floor((tetrisGame.boardWidth - piece.shape[0].length) / 2);

    return {
        shape: JSON.parse(JSON.stringify(piece.shape)),
        type: piece.type,
        x: startX,
        y: 0
    };
}

function startTetrisGame() {
    if (!tetrisGame) return;

    console.log('Starting Tetris game');

    // Reset game state
    tetrisGame.gameRunning = true;
    tetrisGame.gamePaused = false;
    tetrisGame.gameOver = false;
    tetrisGame.board = createEmptyBoard(tetrisGame.boardWidth, tetrisGame.boardHeight);
    tetrisGame.currentPiece = createTetrisPiece();

    // Reset stats
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;
    tetrisGame.dropInterval = 500;

    // Reset pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>PAUSE</span>';
        pauseBtn.classList.remove('is-paused');
    }

    updateTetrisStats();
    tetrisGame.lastTime = performance.now();
    tetrisGame.dropTime = 0;

    drawTetrisBoard();

    // Cancel existing animation frame
    if (tetrisGame.animationFrame) {
        cancelAnimationFrame(tetrisGame.animationFrame);
    }

    tetrisGameLoop();
}

function tetrisGameLoop(time = 0) {
    if (!tetrisGame || !tetrisGame.gameRunning || tetrisGame.gamePaused) {
        if (tetrisGame && tetrisGame.gameRunning && !tetrisGame.gamePaused) {
            tetrisGame.animationFrame = requestAnimationFrame(tetrisGameLoop);
        }
        return;
    }

    const deltaTime = time - tetrisGame.lastTime;
    tetrisGame.dropTime += deltaTime;

    if (tetrisGame.dropTime > tetrisGame.dropInterval) {
        movePieceDown();
        tetrisGame.dropTime = 0;
    }

    tetrisGame.lastTime = time;
    drawTetrisBoard();

    tetrisGame.animationFrame = requestAnimationFrame(tetrisGameLoop);
}

function movePieceDown() {
    if (!tetrisGame || !tetrisGame.currentPiece || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    tetrisGame.currentPiece.y++;

    if (checkCollision()) {
        tetrisGame.currentPiece.y--;
        mergePiece();
        clearLines();
        tetrisGame.currentPiece = createTetrisPiece();

        if (checkCollision()) {
            gameOver();
        }
    }

    drawTetrisBoard();
}

function movePieceLeft() {
    if (!tetrisGame || !tetrisGame.currentPiece || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    tetrisGame.currentPiece.x--;
    if (checkCollision()) {
        tetrisGame.currentPiece.x++;
    }
    drawTetrisBoard();
}

function movePieceRight() {
    if (!tetrisGame || !tetrisGame.currentPiece || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    tetrisGame.currentPiece.x++;
    if (checkCollision()) {
        tetrisGame.currentPiece.x--;
    }
    drawTetrisBoard();
}

function rotatePiece() {
    if (!tetrisGame || !tetrisGame.currentPiece || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    const piece = tetrisGame.currentPiece;
    const rotated = [];

    for (let i = 0; i < piece.shape[0].length; i++) {
        const row = [];
        for (let j = piece.shape.length - 1; j >= 0; j--) {
            row.push(piece.shape[j][i]);
        }
        rotated.push(row);
    }

    const previousShape = piece.shape;
    piece.shape = rotated;

    if (checkCollision()) {
        piece.x--;
        if (checkCollision()) {
            piece.x += 2;
            if (checkCollision()) {
                piece.x--;
                piece.shape = previousShape;
            }
        }
    }

    drawTetrisBoard();
}

function hardDrop() {
    if (!tetrisGame || !tetrisGame.currentPiece || !tetrisGame.gameRunning || tetrisGame.gamePaused) return;

    while (!checkCollision()) {
        tetrisGame.currentPiece.y++;
    }
    tetrisGame.currentPiece.y--;
    mergePiece();
    clearLines();
    tetrisGame.currentPiece = createTetrisPiece();

    if (checkCollision()) {
        gameOver();
    }

    drawTetrisBoard();
}

function checkCollision() {
    if (!tetrisGame || !tetrisGame.currentPiece) return true;

    const piece = tetrisGame.currentPiece;

    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== 0) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;

                if (boardX < 0 || boardX >= tetrisGame.boardWidth) return true;
                if (boardY >= tetrisGame.boardHeight) return true;
                if (boardY >= 0 && tetrisGame.board[boardY][boardX] !== 0) return true;
            }
        }
    }
    return false;
}

function mergePiece() {
    if (!tetrisGame || !tetrisGame.currentPiece) return;

    const piece = tetrisGame.currentPiece;

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = piece.y + y;
                const boardX = piece.x + x;

                if (boardY >= 0 && boardY < tetrisGame.boardHeight &&
                    boardX >= 0 && boardX < tetrisGame.boardWidth) {
                    tetrisGame.board[boardY][boardX] = piece.type;
                }
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;

    for (let y = tetrisGame.boardHeight - 1; y >= 0; y--) {
        if (tetrisGame.board[y].every(cell => cell !== 0)) {
            tetrisGame.board.splice(y, 1);
            tetrisGame.board.unshift(Array(tetrisGame.boardWidth).fill(0));
            linesCleared++;
            y++;
        }
    }

    if (linesCleared > 0) {
        gameLines += linesCleared;
        gameScore += linesCleared * 100 * gameLevel;
        gameLevel = Math.floor(gameLines / 10) + 1;
        tetrisGame.dropInterval = Math.max(100, 500 - (gameLevel - 1) * 30);
        updateTetrisStats();
    }
}

function gameOver() {
    if (!tetrisGame) return;

    console.log('Game Over');
    tetrisGame.gameRunning = false;
    tetrisGame.gameOver = true;

    if (tetrisGame.animationFrame) {
        cancelAnimationFrame(tetrisGame.animationFrame);
    }

    const finalScoreSpan = document.getElementById('final-score');
    if (finalScoreSpan) finalScoreSpan.textContent = gameScore;

    const modal = document.getElementById('game-over-modal');
    if (modal) modal.classList.add('active');
}

function updateTetrisStats() {
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');

    if (scoreEl) scoreEl.textContent = gameScore;
    if (levelEl) levelEl.textContent = gameLevel;
    if (linesEl) linesEl.textContent = gameLines;
}

window.restartTetris = function () {
    console.log('Restarting Tetris');

    const modal = document.getElementById('game-over-modal');
    if (modal) modal.classList.remove('active');

    const finalModal = document.getElementById('final-message-modal');
    if (finalModal) finalModal.classList.remove('active');

    if (tetrisGame) {
        startTetrisGame();
    }
};

// ========== MODAL LISTENERS ==========
function setupModalListeners() {
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            const gameOverModal = document.getElementById('game-over-modal');
            if (gameOverModal) gameOverModal.classList.remove('active');

            const finalModal = document.getElementById('final-message-modal');
            if (finalModal) finalModal.classList.add('active');
        });
    }

    const okBtn = document.getElementById('ok-btn');
    if (okBtn) {
        okBtn.addEventListener('click', function () {
            const finalModal = document.getElementById('final-message-modal');
            if (finalModal) finalModal.classList.remove('active');
            showScreen('main');
        });
    }
}

// ========== START BUTTON ==========
window.startBirthdayMessage = function () {
    console.log('START button pressed');
    showScreen('message');

    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            startBtn.style.transform = '';
        }, 200);
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
    if (tetrisGame && tetrisGame.animationFrame) {
        cancelAnimationFrame(tetrisGame.animationFrame);
    }
});