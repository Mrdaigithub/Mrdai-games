((document,window)=>{
    const DOC = document,
        WIN = window;

    let that = null,
        canvas = DOC.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        startBtn = DOC.getElementById('startBtn'),
        aboutBtn=  DOC.getElementById('aboutBtn'),
        welcome = DOC.getElementById('welcome'),
        pause = DOC.getElementById('pause'),
        pauseStatus = true;

    canvas.width = DOC.body.clientWidth;
    canvas.height = DOC.body.clientHeight;
    WIN.onresize = ()=>{
        canvas.width = DOC.body.clientWidth;
        canvas.height = DOC.body.clientHeight;
    };

    aboutBtn.addEventListener('touchstart', ()=>{
        alert('Mrdai倾情制作~');
    },false);
    startBtn.addEventListener('touchstart',  ()=>{
        welcome.style.display = 'none';
        canvas.style.display = 'block';
        pause.style.display = 'block';
    },false);
    pause.addEventListener('touchend',  ()=>{
        if(pauseStatus){
            pause.style.backgroundImage = 'url("img/Fav_Voice_Play-hd.png")';
            pauseStatus = false;
        }else{
            pause.style.backgroundImage = 'url("img/Fav_Voice_Pause-hd.png")';
            pauseStatus = true;
        }
    },false);



    class Plains{
        constructor(canvas,ctx){
            this.canvas = canvas;
            this.ctx = ctx;
            this.fraction = 0;
            this.gameStatus = false;
            this.bg = {
                bg1:{img:new Image(), x:0, y:0, ready:false},
                bg2:{img:new Image(), x:0, y:-568, ready:false},
                speed:2
            };
            this.hero = {img:new Image(), x:this.canvas.width/2-33, y:this.canvas.height-88, ready:false, speed:5};
            this.bg.bg1.img.src = '../img/gameArts.png';
            this.bg.bg2.img.src = '../img/gameArts.png';
            this.hero.img.src = '../img/hero.gif';
            that = this;
        }


        //处理用户输入
        processUserInput(){
            WIN.addEventListener('deviceorientation',(event)=>{
                let e = WIN.event || event;
                console.log(e);
            },false)
        }


        loadBg(){
            this.bg.bg1.img.onload = ()=> this.bg.bg1.ready = true;
            this.bg.bg2.img.onload = ()=> this.bg.bg2.ready = true;
        }


        loadHero(){
            this.hero.img.onload = ()=> this.hero.ready = true;
        }


        update(){

            //变化背景数据
            if(this.bg.bg1.y >= 568){
                this.bg.bg1.y = -568;
            }
            if(this.bg.bg2.y >= 568){
                this.bg.bg2.y = -568;
            }
            this.bg.bg1.y += this.bg.speed;
            this.bg.bg2.y += this.bg.speed;
        }


        render(){
            this.ctx.clearRect(0,0,320,568);
            //背景动画
            if(this.bg.bg1.ready){
                this.ctx.drawImage(this.bg.bg1.img,
                    0, 0, 320,568,
                    this.bg.bg1.x,this.bg.bg1.y,
                    this.canvas.width,this.canvas.height);
            }
            if(this.bg.bg2.ready){
                this.ctx.drawImage(this.bg.bg2.img,
                    0, 0, 320,568,
                    this.bg.bg2.x,this.bg.bg2.y,
                    this.canvas.width,this.canvas.height);
            }

            //My plain
            if(this.hero.ready){
                this.ctx.drawImage(this.hero.img,this.hero.x,this.hero.y,66,80);
            }
        }


        main(){
            that.update();
            that.render();
            requestAnimationFrame(function () {
                that.main();
            });
        }


        //开始
        start(){
            this.processUserInput();
            this.loadBg();
            this.loadHero();
            this.main();
        }
    }
    let plains = (canvas,ctx) => new Plains(canvas,ctx);


    let xx = plains(canvas,ctx);
    xx.start();
})(document,window);