'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (document, window) {
    var DOC = document,
        WIN = window;

    var that = null,
        canvas = DOC.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        startBtn = DOC.getElementById('startBtn'),
        aboutBtn = DOC.getElementById('aboutBtn'),
        welcome = DOC.getElementById('welcome'),
        pause = DOC.getElementById('pause'),
        pauseStatus = true;

    canvas.width = DOC.body.clientWidth;
    canvas.height = DOC.body.clientHeight;
    WIN.onresize = function () {
        canvas.width = DOC.body.clientWidth;
        canvas.height = DOC.body.clientHeight;
    };

    aboutBtn.addEventListener('touchstart', function () {
        alert('Mrdai倾情制作~');
    }, false);

    pause.addEventListener('touchend', function () {
        if (pauseStatus) {
            pause.style.backgroundImage = 'url("img/Fav_Voice_Play-hd.png")';
            pauseStatus = false;
        } else {
            pause.style.backgroundImage = 'url("img/Fav_Voice_Pause-hd.png")';
            pauseStatus = true;
        }
    }, false);

    var Plains = function () {
        function Plains(canvas, ctx) {
            var _this = this;

            _classCallCheck(this, Plains);

            this.canvas = canvas;
            this.ctx = ctx;
            this.allScore = 0;
            this.gameStatus = false;
            this.gravityMode = false;
            this.img = new Image();
            this.img.src = '../img/gameArts.png';

            this.bg = {
                speed: 2,
                ready: false,
                bg1: { x: 0, y: 0 },
                bg2: { x: 0, y: -568 }
            };

            this.player = {
                x: this.canvas.width / 2,
                y: this.canvas.height - 88,
                normalPos: [{ x: 432, y: 332 }, { x: 432, y: 0 }],
                diePos: [{ x: 432, y: 250 }, { x: 432, y: 85 }, { x: 432, y: 168 }],
                sX: null,
                sY: null,
                count: 0,
                dieCount: 0,
                dieStatus: false,
                animationTime: 200,
                animation: function animation() {
                    if (!_this.dieStatus) {
                        //正常动画
                        setTimeout(function () {
                            if (that.player.count === 1) {
                                that.player.count = 0;
                                that.player.sX = that.player.normalPos[0].x;
                                that.player.sY = that.player.normalPos[0].y;
                            } else {
                                that.player.sX = that.player.normalPos[1].x;
                                that.player.sY = that.player.normalPos[1].y;
                                that.player.count++;
                            }
                            that.player.animation();
                        }, that.player.animationTime);
                    } else {
                        //死亡爆炸动画
                        setTimeout(function () {
                            switch (that.player.dieCount) {
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
                                default:
                                    //gameOver!
                                    //还没写
                                    break;
                            }
                            that.player.animation();
                        }, that.player.animationTime);
                    }
                }
            };

            this.pos = {
                x: this.canvas.width / 2,
                y: this.canvas.height - 33
            };

            //子弹
            this.bullet = {
                speed: 10,
                interval: 100,
                power: 10,
                //子弹对象池
                dataPound: [{ x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }, { x: this.player.x, y: this.player.y, status: false }],

                //找到第一个未启用的子弹
                useBullet: function useBullet() {
                    for (var i = 0; i < this.dataPound.length; i++) {
                        if (!this.dataPound[i].status) {
                            this.dataPound[i].status = true;
                            this.dataPound[i].x = that.player.x + 33;
                            setTimeout(function () {
                                that.bullet.useBullet();
                            }, that.bullet.interval);
                            return this.dataPound[i];
                        }
                    }
                },

                //移动子弹
                moveBullet: function moveBullet() {
                    //找到所有启动的子弹作位移
                    for (var i = 0; i < this.dataPound.length; i++) {
                        if (this.dataPound[i].status) {
                            this.dataPound[i].y -= this.speed;
                        }
                    }
                },

                //回收子弹
                resetBullet: function resetBullet(bullet) {
                    this.dataPound[bullet].status = false;
                    this.dataPound[bullet].y = that.player.y;
                    return this.dataPound[bullet];
                }
            };

            //敌军
            this.enemy = {
                simpleEnemy: {
                    speed: 6,
                    hp: 30,
                    score: 100,
                    dataPound: [{ x: 0, y: 0, status: false }],
                    diePos: [{ x: 50, y: 658 }, { x: 420, y: 760 }, { x: 470, y: 750 }],
                    sX: 82,
                    sY: 658,
                    dieCount: 0,
                    animationTime: 200,
                    animation: function animation() {
                        //死亡爆炸动画
                        setTimeout(function () {
                            switch (that.enemy.dieCount) {
                                case 0:
                                    that.enemy.dieCount++;
                                    break;
                                case 1:
                                    that.enemy.dieCount++;
                                    break;
                                case 2:
                                    that.enemy.dieCount++;
                                    break;
                                default:
                                    //gameOver!
                                    //还没写
                                    break;
                            }
                            that.enemy.animation();
                        }, that.enemy.animationTime);
                    }
                }
            };
            that = this;
        }

        //处理用户输入

        _createClass(Plains, [{
            key: 'processUserInput',
            value: function processUserInput() {
                var _this2 = this;

                //重力感应模式
                if (this.gravityMode) {
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
                } else {

                        //普通模式
                        addEventListener('touchmove', function (event) {
                            var e = WIN.event || event;
                            _this2.pos.x = e.targetTouches[0].clientX;
                            _this2.pos.y = e.targetTouches[0].clientY;
                        }, false);
                    }
            }

            //加载图片

        }, {
            key: 'loadImg',
            value: function loadImg() {
                var _this3 = this;

                this.img.onload = function () {
                    return _this3.bg.ready = true;
                };
            }
        }, {
            key: 'update',
            value: function update() {
                //变化背景数据
                if (this.bg.bg1.y >= 568) {
                    this.bg.bg1.y = -568;
                }
                if (this.bg.bg2.y >= 568) {
                    this.bg.bg2.y = -568;
                }
                this.bg.bg1.y += this.bg.speed;
                this.bg.bg2.y += this.bg.speed;

                //主角位移变化
                this.player.x = this.pos.x - 33;
                this.player.y = this.pos.y - 55;

                //子弹位移
                this.bullet.moveBullet();
            }
        }, {
            key: 'render',
            value: function render() {
                //成功加载素材
                if (this.bg.ready) {

                    //背景动画
                    this.ctx.drawImage(this.img, 0, 0, 320, 568, this.bg.bg1.x, this.bg.bg1.y, this.canvas.width, this.canvas.height);

                    this.ctx.drawImage(this.img, 0, 0, 320, 568, this.bg.bg2.x, this.bg.bg2.y, this.canvas.width, this.canvas.height);

                    //绘制主角
                    this.ctx.drawImage(this.img, this.player.sX, this.player.sY, 64, 80, this.player.x, this.player.y, 64, 80);

                    //绘制子弹
                    for (var i = 0; i < this.bullet.dataPound.length; i++) {
                        //判断子弹是否是启用状态
                        if (this.bullet.dataPound[i].status) {

                            //子弹打出屏幕外，回收子弹
                            if (this.bullet.dataPound[i].y <= 0) {
                                this.bullet.resetBullet(i);
                            } else {
                                this.ctx.drawImage(this.img, 0, 730, 10, 10, this.bullet.dataPound[i].x, this.bullet.dataPound[i].y, 7, 12);
                            }
                        }
                    }

                    //绘制敌机
                    this.ctx.drawImage(this.img, this.enemy.simpleEnemy.sX, this.enemy.simpleEnemy.sY, 32, 22, this.enemy.simpleEnemy.dataPound[0].x + 50, this.enemy.simpleEnemy.dataPound[0].y + 50, 30, 22);
                }
            }
        }, {
            key: 'main',
            value: function main() {
                that.update();
                that.render();
                requestAnimationFrame(function () {
                    that.main();
                });
            }

            //开始

        }, {
            key: 'start',
            value: function start() {
                this.processUserInput();
                this.loadImg();
                this.player.animation();
                this.bullet.useBullet();
                this.main();
            }
        }]);

        return Plains;
    }();

    var plains = function plains(canvas, ctx) {
        return new Plains(canvas, ctx);
    };

    startBtn.addEventListener('touchstart', function () {
        welcome.style.display = 'none';
        canvas.style.display = 'block';
        pause.style.display = 'block';
        var xx = plains(canvas, ctx);
        xx.start();
    }, false);
})(document, window);