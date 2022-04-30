import { Sitting, Running, Jumping, Falling } from './playerStates.js';

export class Player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 30;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this),new Running(this),new Jumping(this),new Falling(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    //move player around based on player input
    //cycle through the sprite frames
    update(input, deltaTime){
        
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if(input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if(this.x <0) this.x =0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //sprite animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        
    }

    //take the update value to draw the active frame 
    draw(context){
        //context.fillRect(this.x,this.y,this.width,this.height);
        context.beginPath();
        context.arc(this.x + this.width/2, this.y + this.height/2,this.width/2,0,Math.PI *2);
        context.stroke();
        context.drawImage(this.image,this.frameX * this.width,this.frameY * this.height,this.width,this.height,this.x,this.y,this.width,this.height)
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state,speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

}