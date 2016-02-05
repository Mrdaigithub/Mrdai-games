(function (window,document) {
    const WIN = window,
        DOC = document;

    //创建canvas节点
    let canvas = DOC.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        that = null;
    DOC.body.appendChild(canvas);
    canvas.width = 512;
    canvas.height = 480;



    class Games{
        constructor(canvas,ctx){
            this.canvas = canvas;
            this.ctx = ctx;
            this.bgImg = new Image();
            this.heroImg = new Image();
            this.monsterImg = new Image();
            this.bgImgReady = false;
            this.heroImgReady = false;
            this.monsterImgReady = false;
            this.hero = {x:0, y:0, speed:100};
            this.monster = {x:0, y:0};
            this.killCount = 0;
            this.keyDown = {};
            that = this;
        }


        //创建图片
        createImg(){
            this.bgImg.src = 'img/bg.png';
            this.heroImg.src = 'img/hero.png';
            this.monsterImg.src = 'img/monster.png';
            this.bgImg.onload = () => this.bgImgReady = true;
            this.heroImg.onload = () => this.heroImgReady = true;
            this.monsterImg.onload = () => this.monsterImgReady = true;
            return this;
        }


        //处理用户输入
        processUserInput(){
            addEventListener('keydown',(event)=>{
                let e = window.event || event;
                this.keyDown[e.keyCode] = true;
            },false);

            addEventListener('keyup',(event)=>{
                let e = window.event || event;
                delete this.keyDown[e.keyCode];
            },false);
            return this;
        }


        //开始一轮游戏
        reset(){
            this.hero.x = this.canvas.width/2;
            this.hero.y = this.canvas.height/2;
            this.monster.x = parseInt(Math.random()*480);
            this.monster.y = parseInt(Math.random()*448);
            return this;
        }


        //更新对象
        update(){
            if(37 in this.keyDown){
                this.hero.x -= 5;
            }
            if(38 in  this.keyDown){
                this.hero.y -= 5;
            }
            if(39 in  this.keyDown){
                this.hero.x += 5;
            }
            if(40 in  this.keyDown){
                this.hero.y += 5;
            }

            //如果抓到怪物，重置
            if(this.hero.x+32 >= this.monster.x &&
                this.hero.x <= this.monster.x+32 &&
                this.hero.y+32 >= this.monster.y &&
                this.hero.y <= this.monster.y+32
            ){
                this.killCount++;
                this.reset();
            }

            if(this.hero.x < 0){
                this.hero.x = 512-32;
            }
            if(this.hero.x+32 > 512){
                this.hero.x = 0;
            }
            if(this.hero.y < 0){
                this.hero.y = 480-32;
            }
            if(this.hero.y+32 > 480){
                this.hero.y = 0;
            }
            return this;
        }

        render(){
            if(this.heroImgReady){
                this.ctx.drawImage(this.bgImg,0,0);
            }
            if(this.heroImgReady){
                this.ctx.drawImage(this.heroImg,this.hero.x,this.hero.y);
            }
            if(this.monsterImgReady){
                this.ctx.drawImage(this.monsterImg,this.monster.x,this.monster.y);
            }
            // 计分
            this.ctx.fillStyle = "rgb(250, 250, 250)";
            this.ctx.font = "18px Helvetica";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "top";
            this.ctx.fillText("killCount: " + this.killCount, 32, 32);
            return this;
        }

        main(){
            that.update().render();
            requestAnimationFrame(that.main);
        }

        //开始
        start(){
            this.createImg().processUserInput().reset().main();
        }
    }
    let games = (canvas,ctx) => new Games(canvas,ctx);


    let xx = games(canvas,ctx);
    xx.start();
})(window,document);