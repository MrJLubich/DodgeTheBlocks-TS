
class Game {
    running: boolean;
    score: number;
    player: Player;
    blocks: Block[];

    constructor(player: Player) {
        this.running = true;
        this.score = 0;
        this.player = player;
        this.blocks = [];
    }

    addBlock(block: Block) :void {
        this.blocks.push(block);
    }

    update() {
        input.onButtonPressed(Button.A, function() {
            // Left Wall Detection
            if (this.player.xpos > 1) {
                // Move Left
                this.player.xpos -= 1;
            }
        })
        input.onButtonPressed(Button.B, function () {
            // Right Wall Detection
            if (this.player.xpos < 5){
                // Move Right
                this.player.xpos += 1;
            }
        })

        // Delete block if it falls past
        if (this.blocks[0].ypos <= 0 && this.blocks[0].xpos != this.player.xpos){
            this.blocks.shift();
            this.score++;
        }

        for (let b of this.blocks) {
            if (b.checkCollision()) {
                this.running = false;
            }
        }
    }

    resetScreen() {
        // Reset Screen
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                led.unplot(x, y)
            }
        }
    }

    render() {
        this.resetScreen();
        // Draw Player Pixel to Screen
        this.player.draw();
        for (let b of this.blocks) {
            b.draw();
        }
    }
}


class Player {

    xpos: number;
    ypos: number;
    xpix: number;
    ypix: number;
    constructor() {
        this.xpos = 1;
        this.ypos = 1;
    }

    draw() :void {
        this.xpix = this.xpos - 1;
        this.ypix = 5 - this.ypos;
        led.plot(this.xpix, this.ypix);
    }
}

class Block {
    
    xpos: number;
    ypos: number;
    xpix: number;
    ypix: number;

    game: Game;

    constructor(game: Game, xpos: number) {
        this.ypos = 6;
        this.xpos = xpos;
        // this.xpos = randint(1, 5);
        // this.xpos = game.player.xpos;
        
        this.game = game;
        this.game.addBlock(this);
    }

    checkCollision() :boolean {
        if (this.xpos == this.game.player.xpos && this.ypos == 1) {
            return true;
        } else {
            return false;
        }
    }

    draw() :void {
        this.xpix = this.xpos - 1;
        this.ypix = 5 - this.ypos;
        led.plot(this.xpix, this.ypix);
    }
}

// Init
let myPlayer = new Player();
let myGame = new Game(myPlayer);

// INIT: Countdown
for (let i = 3; i >= 1; i--){
    basic.showNumber(i);
}

// Game Clock
let interval: number = 600;
loops.everyInterval(interval, function () {
    for(let b of myGame.blocks){
        b.ypos -= 1;
    }
})

loops.everyInterval(interval*2.5, function () {
    let newB1 = new Block(myGame, myGame.player.xpos);
    let newB2 = new Block(myGame, randint(1, 5));
})

// Loop
basic.forever(function() {
    if (myGame.running) {
        myGame.update();
        myGame.render();
    } else {
        basic.showNumber(myGame.score);
    }
})
