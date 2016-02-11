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
        mask = DOC.getElementById('mask'),
        topRank = DOC.getElementById('topRank'),
        nowRank = DOC.getElementById('nowRank'),
        continueBtn = DOC.getElementById('continue'),
        pauseStatus = true,
        flag = false,
        stop = null;

    canvas.width = DOC.body.clientWidth;
    canvas.height = DOC.body.clientHeight;
    WIN.onresize = ()=>{
        canvas.width = DOC.body.clientWidth;
        canvas.height = DOC.body.clientHeight;
    };

    aboutBtn.addEventListener('touchstart', ()=>{
        alert('本作品由Mrdai独立完成');
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
            this.nowRank = 0;
            this.topRank = 0;
            this.gameStatus = true;
            this.gravityMode = false;
            this.img = new Image();
            this.img.src = 'img/gameArts.png';

            this.bg = {
                speed:2,
                ready:false,
                bg1:{x:0, y:0},
                bg2:{x:0, y:-568}
            };

            this.player = {
                x:this.canvas.width/2,
                y:this.canvas.height-88,
                normalPos:[{x:432,y:332}, {x:432,y:0}],
                diePos:[{x:432,y:250},{x:432,y:85},{x:432,y:168}],
                sX:null,
                sY:null,
                count:0,
                dieCount:0,
                dieStatus:false,
                animationTime:200,
                animation:()=>{
                    if(!this.player.dieStatus){
                        //正常动画
                        setTimeout(()=> {
                            if(that.player.count === 1){
                                that.player.count = 0;
                                that.player.sX = that.player.normalPos[0].x;
                                that.player.sY = that.player.normalPos[0].y;
                            }else{
                                that.player.sX = that.player.normalPos[1].x;
                                that.player.sY = that.player.normalPos[1].y;
                                that.player.count++;
                            }
                            that.player.animation();
                        },that.player.animationTime);
                    }else{
                        //死亡爆炸动画
                        setTimeout(()=> {
                            switch (that.player.dieCount){
                                case 0:
                                    that.player.sX = that.player.diePos[0].x;
                                    that.player.sY = that.player.diePos[0].y;
                                    that.player.dieCount++;
                                    break;
                                case 1:
                                    that.player.sX = that.player.diePos[1].x;
                                    that.player.sY = that.player.diePos[1].y;
                                    that.player.dieCount++;
                                    break;
                                case 2:
                                    that.player.sX = that.player.diePos[2].x;
                                    that.player.sY = that.player.diePos[2].y;
                                    that.player.dieCount++;
                                    break;
                                case 3:
                                    WIN.cancelAnimationFrame(stop);
                                    that.player.dieCount++;
                                    break;
                                default :
                                    mask.style.display = 'block';
                                    return 0;
                            }
                            that.player.animation();
                        },that.player.animationTime);
                    }
                }
            };

            this.pos = {
                x:this.canvas.width/2,
                y:this.canvas.height-33
            };

            //子弹
            this.bullet = {
                speed:15,
                interval:100,
                power:10,
                //子弹对象池
                dataPound:[
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false},
                    {x:this.player.x,y:this.player.y,status:false}
                ],

                //找到第一个未启用的子弹
                useBullet(){
                    for(let i=0; i<this.dataPound.length; i++){
                        if(!this.dataPound[i].status){
                            this.dataPound[i].status = true;
                            this.dataPound[i].x = that.player.x+33;
                            setTimeout(()=>{
                                that.bullet.useBullet();
                            },that.bullet.interval);
                            return this.dataPound[i];
                        }
                    }
                },

                //移动子弹.
                moveBullet(){
                    //找到所有启动的子弹作位移
                    for(let i=0; i<this.dataPound.length; i++){
                        if(this.dataPound[i].status){
                            this.dataPound[i].y -= this.speed;
                        }
                    }
                },

                //回收子弹
                resetBullet(bullet){
                    this.dataPound[bullet].status = false;
                    this.dataPound[bullet].y = that.player.y;
                    return this.dataPound[bullet];
                }
            };

            //敌军
            this.enemy = {
                animationTime:150,
                //简单的敌人
                simpleEnemy:{
                    speed:4,
                    score:50,
                    dataPound:[
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width+40)-40,y:-2,sX:82,sY:658,hp:50,displayStatus:false,dieStatus:false}
                    ],
                    diePos:[{x:50,y:658},{x:420,y:734},{x:475,y:723}],
                    dieCount:0
                },
                //中等难度的敌人
                middleEnemy:{
                    speed:2,
                    score:200,
                    dataPound:[
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-45),y:-60,sX:0,sY:570,hp:100,displayStatus:false,dieStatus:false}
                    ],
                    diePos:[{x:430,y:540},{x:430,y:600},{x:430,y:480}],
                    dieCount:0
                },
                //困难的敌人
                hardEnemy:{
                    speed:1,
                    score:500,
                    dataPound:[
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false},
                        {x:Math.random()*(this.canvas.width-110),y:-165,sX:220,sY:850,hp:300,displayStatus:false,dieStatus:false}
                    ],
                    diePos:[{x:0,y:750},{x:320,y:340},{x:320,y:0}],
                    dieCount:0
                },

                //死亡爆炸动画
                animation:(i,level)=>{
                    let levelEnemy = 'simpleEnemy';
                    switch (level){
                        case 0:
                            levelEnemy = 'simpleEnemy';
                            break;
                        case 1:
                            levelEnemy = 'middleEnemy';
                            break;
                        case 2:
                            levelEnemy = 'hardEnemy';
                            break;
                    }
                    setTimeout(()=> {
                        switch (that.enemy[levelEnemy].dieCount){
                            case 0:
                                that.enemy[levelEnemy].dataPound[i].dieStatus = false;
                                that.enemy[levelEnemy].dataPound[i].sX = that.enemy[levelEnemy].diePos[0].x;
                                that.enemy[levelEnemy].dataPound[i].sY = that.enemy[levelEnemy].diePos[0].y;
                                that.enemy[levelEnemy].dieCount++;
                                break;
                            case 1:
                                that.enemy[levelEnemy].dataPound[i].sX = that.enemy[levelEnemy].diePos[1].x;
                                that.enemy[levelEnemy].dataPound[i].sY = that.enemy[levelEnemy].diePos[1].y;
                                that.enemy[levelEnemy].dieCount++;
                                break;
                            case 2:
                                that.enemy[levelEnemy].dataPound[i].sX = that.enemy[levelEnemy].diePos[2].x;
                                that.enemy[levelEnemy].dataPound[i].sY = that.enemy[levelEnemy].diePos[2].y;
                                that.enemy[levelEnemy].dieCount++;
                                break;
                            default :
                                that.enemy.resetEnemy(i,level);
                                return 0;
                        }
                        that.enemy.animation(i,level);
                    },that.enemy.animationTime);
                },
                createEnemy:()=>{
                    console.log(this.gameStatus);
                    if(!this.gameStatus){
                        return 0;
                    }
                    let num = Math.floor(Math.random()*10);
                    if(num===0 || num===1 || num===2 || num===3 || num===4 || num===5 ||num===6){
                        //出现简单敌人
                        for(let i=0; i<this.enemy.simpleEnemy.dataPound.length; i++){
                            if(!this.enemy.simpleEnemy.dataPound[i].displayStatus){
                                this.enemy.simpleEnemy.dataPound[i].displayStatus = true;
                                this.enemy.simpleEnemy.dataPound[i].dieStatus = true;
                                break;
                            }
                        }
                    }else if(num===7 || num===8){
                        //出现中等敌人
                        for(let i=0; i<this.enemy.middleEnemy.dataPound.length; i++){
                            if(!this.enemy.middleEnemy.dataPound[i].displayStatus){
                                this.enemy.middleEnemy.dataPound[i].displayStatus = true;
                                this.enemy.middleEnemy.dataPound[i].dieStatus = true;
                                break;
                            }
                        }
                    }else if(num === 9){
                        //出现困难敌人
                        for(let i=0; i<this.enemy.hardEnemy.dataPound.length; i++){
                            if(!this.enemy.hardEnemy.dataPound[i].displayStatus){
                                this.enemy.hardEnemy.dataPound[i].displayStatus = true;
                                this.enemy.hardEnemy.dataPound[i].dieStatus = true;
                                break;
                            }
                        }
                    }
                    setTimeout(function () {
                        that.enemy.createEnemy();
                    },800)
                },
                moveEnemy:()=>{
                    for(let i=0; i<this.enemy.simpleEnemy.dataPound.length; i++){
                        if(this.enemy.simpleEnemy.dataPound[i].dieStatus){
                            this.enemy.simpleEnemy.dataPound[i].y += this.enemy.simpleEnemy.speed;
                        }
                    }
                    for(let i=0; i<this.enemy.middleEnemy.dataPound.length; i++){
                        if(this.enemy.middleEnemy.dataPound[i].dieStatus){
                            this.enemy.middleEnemy.dataPound[i].y += this.enemy.middleEnemy.speed;
                        }
                    }
                    for(let i=0; i<this.enemy.hardEnemy.dataPound.length; i++){
                        if(this.enemy.hardEnemy.dataPound[i].dieStatus){
                            this.enemy.hardEnemy.dataPound[i].y += this.enemy.hardEnemy.speed;
                        }
                    }
                },
                resetEnemy:(count,level)=>{
                    let levelEnemy = null;
                    switch (level){
                        case 0:
                            levelEnemy = 'simpleEnemy';
                            this.enemy[levelEnemy].dataPound[count].x = Math.random()*(this.canvas.width-32);
                            this.enemy[levelEnemy].dataPound[count].y = -20;
                            this.enemy[levelEnemy].dataPound[count].sX = 82;
                            this.enemy[levelEnemy].dataPound[count].sY = 658;
                            this.enemy[levelEnemy].dataPound[count].hp = 50;
                            break;
                        case 1:
                            levelEnemy = 'middleEnemy';
                            this.enemy[levelEnemy].dataPound[count].x = Math.random()*(this.canvas.width-45);
                            this.enemy[levelEnemy].dataPound[count].y = -60;
                            this.enemy[levelEnemy].dataPound[count].sX = 0;
                            this.enemy[levelEnemy].dataPound[count].sY = 570;
                            this.enemy[levelEnemy].dataPound[count].hp = 100;
                            break;
                        case 2:
                            levelEnemy = 'hardEnemy';
                            this.enemy[levelEnemy].dataPound[count].x = Math.random()*(this.canvas.width-110);
                            this.enemy[levelEnemy].dataPound[count].y = -165;
                            this.enemy[levelEnemy].dataPound[count].sX = 220;
                            this.enemy[levelEnemy].dataPound[count].sY = 850;
                            this.enemy[levelEnemy].dataPound[count].hp = 300;
                            break;
                    }
                    this.enemy[levelEnemy].dieCount = 0;
                    this.enemy[levelEnemy].dataPound[count].dieStatus = false;
                    this.enemy[levelEnemy].dataPound[count].displayStatus = false;
                }
            };
            that = this;
        }


        //处理用户输入
        processUserInput(){

            //重力感应模式
            if(this.gravityMode){
                //addEventListener('deviceorientation',(event)=>{
                //    let e = WIN.event || event,
                //        angle = parseInt(e.alpha);
                //    if(angle < 360 && angle < 90){
                //        angle = 360;
                //    }else if(angle < 180 && angle > 90){
                //        angle = 180;
                //    }
                //    this.pos.x = angle;
                //},false);
            }else{

                //普通模式
                addEventListener('touchstart',(event)=>{
                    let e = WIN.event || event;
                    e.preventDefault();
                },false);
                addEventListener('touchmove',(event)=>{
                    let e = WIN.event || event;
                    this.pos.x = e.targetTouches[0].clientX;
                    this.pos.y = e.targetTouches[0].clientY;
                    if(this.pos.x < 32){
                        this.pos.x = 32;
                    }
                    if(this.pos.y < 55){
                        this.pos.y = 55;
                    }
                    if(this.pos.x > this.canvas.width-32){
                        this.pos.x = this.canvas.width-32;
                    }
                    if(this.pos.y > this.canvas.height-25){
                        this.pos.y = this.canvas.height-25;
                    }
                },false)
            }
        }


        //加载图片
        loadImg(){
            this.img.onload = ()=> this.bg.ready = true;
        }


        //碰撞检测

        //检测player是否撞到敌机
        isPlayerDie(){
            for(let i=0; i<this.enemy.simpleEnemy.dataPound.length; i++){
                if(this.enemy.simpleEnemy.dataPound[i].dieStatus){
                    if(this.player.x <= this.enemy.simpleEnemy.dataPound[i].x+30 &&
                        this.player.x+64 >= this.enemy.simpleEnemy.dataPound[i].x &&
                        this.player.y <= this.enemy.simpleEnemy.dataPound[i].y+22 &&
                        this.player.y+80 >= this.enemy.simpleEnemy.dataPound[i].y){
                        return true;
                    }
                }
            }
            for(let i=0; i<this.enemy.middleEnemy.dataPound.length; i++){
                if(this.enemy.middleEnemy.dataPound[i].dieStatus){
                    if(this.player.x <= this.enemy.middleEnemy.dataPound[i].x+45 &&
                        this.player.x+64 >= this.enemy.middleEnemy.dataPound[i].x &&
                        this.player.y <= this.enemy.middleEnemy.dataPound[i].y+57 &&
                        this.player.y+80 >= this.enemy.middleEnemy.dataPound[i].y){
                        return true;
                    }
                }
            }
            for(let i=0; i<this.enemy.hardEnemy.dataPound.length; i++){
                if(this.enemy.hardEnemy.dataPound[i].dieStatus){
                    if(this.player.x <= this.enemy.hardEnemy.dataPound[i].x+110 &&
                        this.player.x+64 >= this.enemy.hardEnemy.dataPound[i].x &&
                        this.player.y <= this.enemy.hardEnemy.dataPound[i].y+170 &&
                        this.player.y+80 >= this.enemy.hardEnemy.dataPound[i].y){
                        return true;
                    }
                }
            }
            return false;
        }

        //检测子弹是否打中敌机
        isEnemyDie(){
            let max = {count:null, maxPosY: 10000},
                obj = {bool:false, count:null, levelEnemy:null};

            //找到最前方的子弹
            for(let i=0; i<this.bullet.dataPound.length; i++){
                if(this.bullet.dataPound[i].status && (this.bullet.dataPound[i].y<max.maxPosY)){
                    max.maxPosY = this.bullet.dataPound[i].y;
                    max.count = i;
                }
            }

            //检测子弹和敌机的碰撞
            if(!max.count){
                max.count = 0;
            }
            for(let i=0; i<this.enemy.simpleEnemy.dataPound.length; i++){
                if(this.enemy.simpleEnemy.dataPound[i].dieStatus){
                    if(this.bullet.dataPound[max.count].x+7 > this.enemy.simpleEnemy.dataPound[i].x &&
                        this.bullet.dataPound[max.count].x < this.enemy.simpleEnemy.dataPound[i].x+30 &&
                        this.bullet.dataPound[max.count].y < this.enemy.simpleEnemy.dataPound[i].y+22){
                        this.bullet.resetBullet(max.count);
                        obj.bool = true;
                        obj.count = i;
                        obj.levelEnemy = 'simpleEnemy';
                        return obj;
                    }
                }
            }
            for(let i=0; i<this.enemy.middleEnemy.dataPound.length; i++){
                if(this.enemy.middleEnemy.dataPound[i].dieStatus){
                    if(this.bullet.dataPound[max.count].x+7 > this.enemy.middleEnemy.dataPound[i].x &&
                        this.bullet.dataPound[max.count].x < this.enemy.middleEnemy.dataPound[i].x+45 &&
                        this.bullet.dataPound[max.count].y < this.enemy.middleEnemy.dataPound[i].y+57){
                        this.bullet.resetBullet(max.count);
                        obj.bool = true;
                        obj.count = i;
                        obj.levelEnemy = 'middleEnemy';
                        return obj;
                    }
                }
            }
            for(let i=0; i<this.enemy.hardEnemy.dataPound.length; i++){
                if(this.enemy.hardEnemy.dataPound[i].dieStatus){
                    if(this.bullet.dataPound[max.count].x+7 > this.enemy.hardEnemy.dataPound[i].x &&
                        this.bullet.dataPound[max.count].x < this.enemy.hardEnemy.dataPound[i].x+110 &&
                        this.bullet.dataPound[max.count].y < this.enemy.hardEnemy.dataPound[i].y+170){
                        this.bullet.resetBullet(max.count);
                        obj.bool = true;
                        obj.count = i;
                        obj.levelEnemy = 'hardEnemy';
                        return obj;
                    }
                }
            }
            return obj;
        }


        //数据变化
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

            //主角位移变化
            this.player.x = this.pos.x-33;
            this.player.y = this.pos.y-55;

            ////如果撞到敌机爆炸gameOver
            if(this.isPlayerDie()){
                this.player.dieStatus = true;
                this.player.animation();
                this.gameStatus = false;
                if(!localStorage.getItem('topRank')){
                    localStorage.setItem('topRank',0);
                }
                this.topRank = localStorage.getItem('topRank');
                if(this.topRank < this.nowRank){
                    this.topRank = this.nowRank;
                }
                topRank.innerHTML = this.topRank;
                nowRank.innerHTML = this.nowRank;
                localStorage.setItem('topRank',this.topRank);
            }

            //子弹位移
            this.bullet.moveBullet();
            //敌机位移
            this.enemy.moveEnemy();
            //判断子弹打到敌机
            let obj = this.isEnemyDie();
            if(obj.bool){
                //敌机扣血
                this.enemy[obj.levelEnemy].dataPound[obj.count].hp -= this.bullet.power;
                //如果血量小于等于0，敌机爆炸
                if(this.enemy[obj.levelEnemy].dataPound[obj.count].hp <= 0){
                    //加分数
                    this.nowRank += this.enemy[obj.levelEnemy].score;
                    this.enemy[obj.levelEnemy].dataPound[obj.count].dieStatus = false;
                    let num = null;
                    switch (obj.levelEnemy){
                        case 'simpleEnemy':
                            num = 0;
                            break;
                        case 'middleEnemy':
                            num = 1;
                            break;
                        case 'hardEnemy':
                            num = 2;
                            break;
                    }
                    this.enemy.animation(obj.count,num);
                }
            }
        }


        //重绘操作
        render(){
            //成功加载素材
            if(this.bg.ready){

                //背景动画
                this.ctx.drawImage(this.img,
                    0, 0, 320,568,
                    this.bg.bg1.x,this.bg.bg1.y,
                    this.canvas.width,this.canvas.height);

                this.ctx.drawImage(this.img,
                    0, 0, 320,568,
                    this.bg.bg2.x,this.bg.bg2.y,
                    this.canvas.width,this.canvas.height);

                //绘制主角
                this.ctx.drawImage(this.img,
                    this.player.sX,this.player.sY,64,80,
                    this.player.x,this.player.y,64,80);

                //绘制子弹
                for(let i=0; i<this.bullet.dataPound.length; i++){
                    //判断子弹是否是启用状态
                    if(this.bullet.dataPound[i].status){

                        //子弹打出屏幕外，回收子弹
                        if(this.bullet.dataPound[i].y <= 0){
                            this.bullet.resetBullet(i);
                        }else{
                            this.ctx.drawImage(this.img,
                                0, 730, 10,10,
                                this.bullet.dataPound[i].x,this.bullet.dataPound[i].y,
                                7,12);
                        }
                    }
                }

                //绘制简单敌机
                for(let i=0; i<this.enemy.simpleEnemy.dataPound.length; i++){
                    if(this.enemy.simpleEnemy.dataPound[i].displayStatus){
                        //敌机飞出屏幕外回收
                        if(this.enemy.simpleEnemy.dataPound[i].y > this.canvas.height){
                            this.enemy.resetEnemy(i,0);
                        }else{
                            this.ctx.drawImage(this.img,
                                this.enemy.simpleEnemy.dataPound[i].sX,
                                this.enemy.simpleEnemy.dataPound[i].sY, 32,25,
                                this.enemy.simpleEnemy.dataPound[i].x,
                                this.enemy.simpleEnemy.dataPound[i].y, 32,25);
                        }
                    }
                }
                //绘制中等敌机
                for(let i=0; i<this.enemy.middleEnemy.dataPound.length; i++){
                    if(this.enemy.middleEnemy.dataPound[i].displayStatus){
                        //敌机飞出屏幕外回收
                        if(this.enemy.middleEnemy.dataPound[i].y > this.canvas.height){
                            this.enemy.resetEnemy(i,1);
                        }else{
                            this.ctx.drawImage(this.img,
                                this.enemy.middleEnemy.dataPound[i].sX,
                                this.enemy.middleEnemy.dataPound[i].sY, 45,57,
                                this.enemy.middleEnemy.dataPound[i].x,
                                this.enemy.middleEnemy.dataPound[i].y, 45,57);
                        }
                    }
                }
                //绘制困难敌机
                for(let i=0; i<this.enemy.hardEnemy.dataPound.length; i++){
                    if(this.enemy.hardEnemy.dataPound[i].displayStatus){
                        //敌机飞出屏幕外回收
                        if(this.enemy.hardEnemy.dataPound[i].y > this.canvas.height){
                            this.enemy.resetEnemy(i,2);
                        }else{
                            this.ctx.drawImage(this.img,
                                this.enemy.hardEnemy.dataPound[i].sX,
                                this.enemy.hardEnemy.dataPound[i].sY, 110,170,
                                this.enemy.hardEnemy.dataPound[i].x,
                                this.enemy.hardEnemy.dataPound[i].y, 110,170);
                        }
                    }
                }

                //绘制分数信息
                this.ctx.fillStyle = "rgb(250, 250, 250)";
                this.ctx.font = "20px Helvetica";
                this.ctx.textAlign = "left";
                this.ctx.textBaseline = "top";
                this.ctx.fillText("score: " + this.nowRank, 60, 20);
            }

        }

        main(){
            that.update();
            that.render();
            stop = requestAnimationFrame(function () {
                that.main();
            });
        }


        //开始
        start(){
            this.processUserInput();
            this.loadImg();
            this.player.animation();
            this.bullet.useBullet();
            this.enemy.createEnemy();
            this.main();
        }
    }
    let plains = (canvas,ctx) => new Plains(canvas,ctx),
        gameInfo = null,
        startGame = ()=>{
        welcome.style.display = 'none';
        canvas.style.display = 'block';
        pause.style.display = 'block';
        let xx = plains(canvas,ctx);
        xx.start();
        return xx;
    },
        toContinue = ()=>{
            mask.style.display = 'none';
            canvas.style.display = 'none';
            pause.style.display = 'none';
            welcome.style.display = 'block';
        },
        stopGame = ()=>{
        if(!flag){
            //暂停游戏
            WIN.cancelAnimationFrame(stop);
            flag = true;
        }else{
            //继续游戏
            gameInfo.start();
            flag = false;
        }
    };

    //开始游戏
    startBtn.addEventListener('touchstart',()=>{
        gameInfo = startGame();
    },false);
    //返回主菜单
    continueBtn.addEventListener('touchstart',toContinue,false);
    //暂停游戏
    pause.addEventListener('touchstart',stopGame,false);

})(document,window);