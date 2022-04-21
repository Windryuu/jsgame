import { Player } from './player.js';
import { InputHandler } from './input.js';


window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler();
        }

        //run for every animation frame and trigger all calculation that need to happen
        update(){
            this.player.update(this.input.keys);
        }

        //will draw our images, score and so on
        draw(context){
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width,canvas.height);
    console.log(game);

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();

});