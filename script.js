class PachinkoGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.ballsElement = document.getElementById('balls-remaining');
        this.fireButtons = [
            document.getElementById('fire-button-0'),
            document.getElementById('fire-button-1'),
            document.getElementById('fire-button-2')
        ];
        this.resetButton = document.getElementById('reset-button');
        
        // Game state
        this.score = 0;
        this.ballsRemaining = 10;
        this.balls = [];
        this.pegs = [];
        this.scorePockets = [];
        this.ballsInPlay = [false, false, false]; // Track balls per board
        
        // Board dimensions
        this.boardWidth = this.canvas.width / 3;
        this.boardCount = 3;
        
        // Physics constants
        this.gravity = 0.3;
        this.bounce = 0.7;
        this.friction = 0.99;
        
        this.initializeGame();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    initializeGame() {
        this.createPegs();
        this.createScorePockets();
        this.updateDisplay();
    }
    
    createPegs() {
        const pegRadius = 8;
        const rows = 12;
        const pegSpacing = 35;
        const startY = 80;
        
        // Create pegs for each of the 3 boards
        for (let board = 0; board < this.boardCount; board++) {
            const boardOffsetX = board * this.boardWidth;
            
            // Create a diamond/triangle pattern of pegs for this board
            for (let row = 0; row < rows; row++) {
                const pegsInRow = Math.floor(row / 2) + 4;
                const boardCenterX = boardOffsetX + this.boardWidth / 2;
                const startX = boardCenterX - (pegsInRow - 1) * pegSpacing / 2;
                
                for (let col = 0; col < pegsInRow; col++) {
                    if (row % 2 === 0 || col < pegsInRow - 1) {
                        const x = startX + col * pegSpacing + (row % 2 === 1 ? pegSpacing / 2 : 0);
                        const y = startY + row * 40;
                        
                        // Only add pegs that are within this board's boundaries
                        if (x > boardOffsetX + pegRadius && x < boardOffsetX + this.boardWidth - pegRadius) {
                            this.pegs.push({
                                x: x,
                                y: y,
                                radius: pegRadius,
                                color: '#ffd700',
                                board: board
                            });
                        }
                    }
                }
            }
        }
    }
    
    createScorePockets() {
        const pocketsPerBoard = 7;
        const y = this.canvas.height - 40;
        
        const scores = [100, 50, 20, 500, 20, 50, 100];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#45b7d1', '#4ecdc4', '#ff6b6b'];
        
        // Create score pockets for each of the 3 boards
        for (let board = 0; board < this.boardCount; board++) {
            const boardOffsetX = board * this.boardWidth;
            const pocketWidth = this.boardWidth / pocketsPerBoard;
            
            for (let i = 0; i < pocketsPerBoard; i++) {
                this.scorePockets.push({
                    x: boardOffsetX + i * pocketWidth,
                    y: y,
                    width: pocketWidth,
                    height: 30,
                    score: scores[i],
                    color: colors[i],
                    board: board
                });
            }
        }
    }
    
    setupEventListeners() {
        this.fireButtons.forEach((button, boardIndex) => {
            button.addEventListener('click', () => this.fireBall(boardIndex));
        });
        this.resetButton.addEventListener('click', () => this.resetGame());
    }
    
    fireBall(boardIndex) {
        if (this.ballsRemaining > 0 && !this.ballsInPlay[boardIndex]) {
            const boardOffsetX = boardIndex * this.boardWidth;
            const boardCenterX = boardOffsetX + this.boardWidth / 2;
            
            const ball = {
                x: boardCenterX + (Math.random() - 0.5) * 40,
                y: 20,
                vx: (Math.random() - 0.5) * 2,
                vy: 1,
                radius: 6,
                color: '#ff4757',
                trail: [],
                board: boardIndex
            };
            
            this.balls.push(ball);
            this.ballsRemaining--;
            this.ballsInPlay[boardIndex] = true;
            this.updateDisplay();
            
            // Disable fire button for this board while ball is in play
            this.fireButtons[boardIndex].disabled = true;
        }
    }
    
    updateBalls() {
        this.balls = this.balls.filter(ball => {
            // Add to trail for visual effect
            ball.trail.push({x: ball.x, y: ball.y});
            if (ball.trail.length > 8) ball.trail.shift();
            
            // Apply gravity
            ball.vy += this.gravity;
            
            // Apply friction
            ball.vx *= this.friction;
            ball.vy *= this.friction;
            
            // Update position
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // Check collision with pegs
            for (let peg of this.pegs) {
                const dx = ball.x - peg.x;
                const dy = ball.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < ball.radius + peg.radius) {
                    // Collision detected
                    const angle = Math.atan2(dy, dx);
                    const targetX = peg.x + Math.cos(angle) * (peg.radius + ball.radius);
                    const targetY = peg.y + Math.sin(angle) * (peg.radius + ball.radius);
                    
                    ball.x = targetX;
                    ball.y = targetY;
                    
                    // Bounce
                    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                    ball.vx = Math.cos(angle) * speed * this.bounce;
                    ball.vy = Math.sin(angle) * speed * this.bounce;
                    
                    // Add some randomness
                    ball.vx += (Math.random() - 0.5) * 1;
                    
                    // Visual effect for peg hit
                    peg.hit = true;
                    setTimeout(() => peg.hit = false, 200);
                }
            }
            
            // Check collision with board walls (keep balls within their board)
            const boardOffsetX = ball.board * this.boardWidth;
            const boardLeftWall = boardOffsetX + ball.radius;
            const boardRightWall = boardOffsetX + this.boardWidth - ball.radius;
            
            if (ball.x < boardLeftWall || ball.x > boardRightWall) {
                ball.vx *= -this.bounce;
                ball.x = ball.x < boardLeftWall ? boardLeftWall : boardRightWall;
            }
            
            // Check collision with score pockets (only pockets on the same board)
            for (let pocket of this.scorePockets) {
                if (pocket.board === ball.board && 
                    ball.x > pocket.x && ball.x < pocket.x + pocket.width &&
                    ball.y > pocket.y && ball.y < pocket.y + pocket.height) {
                    // Ball scored!
                    this.score += pocket.score;
                    this.updateDisplay();
                    
                    // Visual effect for scoring
                    pocket.scored = true;
                    setTimeout(() => pocket.scored = false, 500);
                    
                    // Remove ball and enable next fire for this board
                    this.ballsInPlay[ball.board] = false;
                    this.fireButtons[ball.board].disabled = false;
                    return false; // Remove ball from array
                }
            }
            
            // Since score boxes now cover the entire bottom, balls will always score
            // Remove ball if it somehow gets way off screen as a failsafe
            if (ball.y > this.canvas.height + 100) {
                this.ballsInPlay[ball.board] = false;
                this.fireButtons[ball.board].disabled = false;
                return false;
            }
            
            return true;
        });
    }
    
    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pegs
        for (let peg of this.pegs) {
            this.ctx.beginPath();
            this.ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = peg.hit ? '#fff' : peg.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#b8860b';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Add shine effect
            this.ctx.beginPath();
            this.ctx.arc(peg.x - 2, peg.y - 2, peg.radius / 3, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.fill();
        }
        
        // Draw score pockets
        for (let pocket of this.scorePockets) {
            this.ctx.fillStyle = pocket.scored ? '#fff' : pocket.color;
            this.ctx.fillRect(pocket.x, pocket.y, pocket.width, pocket.height);
            
            // Draw score text
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                pocket.score.toString(),
                pocket.x + pocket.width / 2,
                pocket.y + pocket.height / 2 + 4
            );
            
            // Draw border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pocket.x, pocket.y, pocket.width, pocket.height);
        }
        
        // Draw balls with trail effect
        for (let ball of this.balls) {
            // Draw trail
            for (let i = 0; i < ball.trail.length; i++) {
                const trailBall = ball.trail[i];
                const alpha = (i + 1) / ball.trail.length * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(trailBall.x, trailBall.y, ball.radius * (i + 1) / ball.trail.length, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 71, 87, ${alpha})`;
                this.ctx.fill();
            }
            
            // Draw main ball
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#c0392b';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Add shine effect
            this.ctx.beginPath();
            this.ctx.arc(ball.x - 2, ball.y - 2, ball.radius / 3, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();
        }
        
        // Draw board separators
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        for (let i = 1; i < this.boardCount; i++) {
            const x = i * this.boardWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw launcher areas for each board
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 3;
        for (let board = 0; board < this.boardCount; board++) {
            const boardCenterX = board * this.boardWidth + this.boardWidth / 2;
            this.ctx.beginPath();
            this.ctx.rect(boardCenterX - 25, 5, 50, 30);
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            const boardNames = ['LEFT', 'CENTER', 'RIGHT'];
            this.ctx.fillText(boardNames[board], boardCenterX, 25);
        }
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.ballsElement.textContent = this.ballsRemaining;
        
        const gameOver = this.ballsRemaining === 0 && !this.ballsInPlay.some(inPlay => inPlay);
        const boardNames = ['LEFT', 'CENTER', 'RIGHT'];
        
        for (let i = 0; i < this.fireButtons.length; i++) {
            if (gameOver) {
                this.fireButtons[i].textContent = '🎌 GAME OVER';
                this.fireButtons[i].disabled = true;
            } else if (this.ballsInPlay[i]) {
                this.fireButtons[i].textContent = `⚪ ${boardNames[i]} PLAYING`;
            } else if (this.ballsRemaining > 0) {
                this.fireButtons[i].textContent = `🔴 FIRE ${boardNames[i]}`;
                this.fireButtons[i].disabled = false;
            } else {
                this.fireButtons[i].textContent = `🔴 FIRE ${boardNames[i]}`;
                this.fireButtons[i].disabled = true;
            }
        }
    }
    
    resetGame() {
        this.score = 0;
        this.ballsRemaining = 10;
        this.balls = [];
        this.ballsInPlay = [false, false, false];
        this.updateDisplay();
        
        // Reset peg and pocket effects
        for (let peg of this.pegs) {
            peg.hit = false;
        }
        for (let pocket of this.scorePockets) {
            pocket.scored = false;
        }
    }
    
    gameLoop() {
        this.updateBalls();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PachinkoGame();
});
