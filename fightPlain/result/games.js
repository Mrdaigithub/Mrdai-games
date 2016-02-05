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
    startBtn.addEventListener('touchstart', function () {
        welcome.style.display = 'none';
        canvas.style.display = 'block';
        pause.style.display = 'block';
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
            _classCallCheck(this, Plains);

            this.canvas = canvas;
            this.ctx = ctx;
            this.fraction = 0;
            this.gameStatus = false;
            this.bg = {
                bg1: { img: new Image(), x: 0, y: 0, ready: false },
                bg2: { img: new Image(), x: 0, y: -568, ready: false },
                speed: 2
            };
            this.hero = { img: new Image(), x: this.canvas.width / 2 - 33, y: this.canvas.height - 88, ready: false, speed: 5 };
            this.bg.bg1.img.src = '../img/gameArts.png';
            this.bg.bg2.img.src = '../img/gameArts.png';
            this.hero.img.src = '../img/hero.gif';
            that = this;
        }

        //处理用户输入

        _createClass(Plains, [{
            key: 'processUserInput',
            value: function processUserInput() {
                WIN.addEventListener('deviceorientation', function (event) {
                    var e = WIN.event || event;
                    console.log(e);
                }, false);
            }
        }, {
            key: 'loadBg',
            value: function loadBg() {
                var _this = this;

                this.bg.bg1.img.onload = function () {
                    return _this.bg.bg1.ready = true;
                };
                this.bg.bg2.img.onload = function () {
                    return _this.bg.bg2.ready = true;
                };
            }
        }, {
            key: 'loadHero',
            value: function loadHero() {
                var _this2 = this;

                this.hero.img.onload = function () {
                    return _this2.hero.ready = true;
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
            }
        }, {
            key: 'render',
            value: function render() {
                this.ctx.clearRect(0, 0, 320, 568);
                //背景动画
                if (this.bg.bg1.ready) {
                    this.ctx.drawImage(this.bg.bg1.img, 0, 0, 320, 568, this.bg.bg1.x, this.bg.bg1.y, this.canvas.width, this.canvas.height);
                }
                if (this.bg.bg2.ready) {
                    this.ctx.drawImage(this.bg.bg2.img, 0, 0, 320, 568, this.bg.bg2.x, this.bg.bg2.y, this.canvas.width, this.canvas.height);
                }

                //My plain
                if (this.hero.ready) {
                    this.ctx.drawImage(this.hero.img, this.hero.x, this.hero.y, 66, 80);
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
                this.loadBg();
                this.loadHero();
                this.main();
            }
        }]);

        return Plains;
    }();

    var plains = function plains(canvas, ctx) {
        return new Plains(canvas, ctx);
    };

    var xx = plains(canvas, ctx);
    xx.start();
})(document, window);