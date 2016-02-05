'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document) {
    var WIN = window,
        DOC = document;

    //创建canvas节点
    var canvas = DOC.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        that = null;
    DOC.body.appendChild(canvas);
    canvas.width = 512;
    canvas.height = 480;

    var Games = function () {
        function Games(canvas, ctx) {
            _classCallCheck(this, Games);

            this.canvas = canvas;
            this.ctx = ctx;
            this.bgImg = new Image();
            this.heroImg = new Image();
            this.monsterImg = new Image();
            this.bgImgReady = false;
            this.heroImgReady = false;
            this.monsterImgReady = false;
            this.hero = { x: 0, y: 0, speed: 100 };
            this.monster = { x: 0, y: 0 };
            this.killCount = 0;
            this.keyDown = {};
            that = this;
        }

        //创建图片

        _createClass(Games, [{
            key: 'createImg',
            value: function createImg() {
                var _this = this;

                this.bgImg.src = 'img/bg.png';
                this.heroImg.src = 'img/hero.png';
                this.monsterImg.src = 'img/monster.png';
                this.bgImg.onload = function () {
                    return _this.bgImgReady = true;
                };
                this.heroImg.onload = function () {
                    return _this.heroImgReady = true;
                };
                this.monsterImg.onload = function () {
                    return _this.monsterImgReady = true;
                };
                return this;
            }

            //处理用户输入

        }, {
            key: 'processUserInput',
            value: function processUserInput() {
                var _this2 = this;

                addEventListener('keydown', function (event) {
                    var e = window.event || event;
                    _this2.keyDown[e.keyCode] = true;
                }, false);

                addEventListener('keyup', function (event) {
                    var e = window.event || event;
                    delete _this2.keyDown[e.keyCode];
                }, false);
                return this;
            }

            //开始一轮游戏

        }, {
            key: 'reset',
            value: function reset() {
                this.hero.x = this.canvas.width / 2;
                this.hero.y = this.canvas.height / 2;
                this.monster.x = parseInt(Math.random() * 480);
                this.monster.y = parseInt(Math.random() * 448);
                return this;
            }

            //更新对象

        }, {
            key: 'update',
            value: function update() {
                if (37 in this.keyDown) {
                    this.hero.x -= 5;
                }
                if (38 in this.keyDown) {
                    this.hero.y -= 5;
                }
                if (39 in this.keyDown) {
                    this.hero.x += 5;
                }
                if (40 in this.keyDown) {
                    this.hero.y += 5;
                }

                //如果抓到怪物，重置
                if (this.hero.x + 32 >= this.monster.x && this.hero.x <= this.monster.x + 32 && this.hero.y + 32 >= this.monster.y && this.hero.y <= this.monster.y + 32) {
                    this.killCount++;
                    this.reset();
                }

                if (this.hero.x < 0) {
                    this.hero.x = 512 - 32;
                }
                if (this.hero.x + 32 > 512) {
                    this.hero.x = 0;
                }
                if (this.hero.y < 0) {
                    this.hero.y = 480 - 32;
                }
                if (this.hero.y + 32 > 480) {
                    this.hero.y = 0;
                }
                return this;
            }
        }, {
            key: 'render',
            value: function render() {
                if (this.heroImgReady) {
                    this.ctx.drawImage(this.bgImg, 0, 0);
                }
                if (this.heroImgReady) {
                    this.ctx.drawImage(this.heroImg, this.hero.x, this.hero.y);
                }
                if (this.monsterImgReady) {
                    this.ctx.drawImage(this.monsterImg, this.monster.x, this.monster.y);
                }
                // 计分
                this.ctx.fillStyle = "rgb(250, 250, 250)";
                this.ctx.font = "18px Helvetica";
                this.ctx.textAlign = "left";
                this.ctx.textBaseline = "top";
                this.ctx.fillText("killCount: " + this.killCount, 32, 32);
                return this;
            }
        }, {
            key: 'main',
            value: function main() {
                that.update().render();
                requestAnimationFrame(that.main);
            }

            //开始

        }, {
            key: 'start',
            value: function start() {
                this.createImg().processUserInput().reset().main();
            }
        }]);

        return Games;
    }();

    var games = function games(canvas, ctx) {
        return new Games(canvas, ctx);
    };

    var xx = games(canvas, ctx);
    xx.start();
})(window, document);