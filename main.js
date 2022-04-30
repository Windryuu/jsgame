import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy} from './enemies.js';

window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    let score = 0;
    let gameOver = false;

    class Game{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 50;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler();
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
        }

        //run for every animation frame and trigger all calculation that need to happen
        update(deltaTime){
            this.background.update();
            this.player.update(this.input.keys,deltaTime);
            //handleEnemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer+= deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);

                //collision
        
                const dx = enemy.x - this.player.x;
                const dy = enemy.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < enemy.width/2 + this.player.width/2){
                    // this.score++;
                    // console.log(this.score);
                    gameOver = true;
                }
        
                
                if(enemy.markedForDeletion){
                    this.enemies.splice(this.enemies.indexOf(enemy),1);
                    score++;
                }
            })

        }

        //will draw our images, score and so on
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
        }

        addEnemy(){
            if(this.speed > 0 && Math.random()< 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0)this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
            console.log(this.enemies);
        }

        displayStatusText(context){
            context.fillStyle = 'black';
            context.font = '40px Helvetica';
            context.fillText('Score: ' + score, 20, 50)
        }
    }

    const game = new Game(canvas.width,canvas.height);
    //console.log(game);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //console.log(deltaTime);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        game.displayStatusText(ctx);
        if(!gameOver)requestAnimationFrame(animate);
        //console.log(this.score);
    }

    animate(0);

});