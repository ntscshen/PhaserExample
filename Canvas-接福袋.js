var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
var countDown = 20; // 分数
var score = 0;
// 定义场景
var states = {
    // 加载场景
    preload: function () {
        // 每个场景都有自己的生命周期、常用的生命周期(preload(加载)、create(准备就绪)、update(跟新周期)、render(渲染完成)) stage:舞台
        // 如果存在preload方法,则会在加载完毕后执行此方法、否则将在进入该场景时直接执行此方法
        this.preload = function () {
            game.stage.backgroundColor = '#000';
            game.add.text(32, 32, "这是预加载部分...", {
                fontSize: '32px',
                fill: '#efe0ce'
            });
            // 加载需要的资源
            game.load.crossOrigin = 'anonymous'; // 设置跨域
            game.load.image('bgTest', 'http://occeqxmsk.bkt.clouddn.com/cover.png');
            game.load.image('bg1Test', 'http://occeqxmsk.bkt.clouddn.com/resultBg.jpg');
            game.load.image('goldTest', 'http://occeqxmsk.bkt.clouddn.com/gold.png');
            game.load.image('fudaiTest', 'http://occeqxmsk.bkt.clouddn.com/fudai.png');
            game.load.image('gameBgTest', 'http://occeqxmsk.bkt.clouddn.com/gameBg.jpg');
            game.load.image('MainMenuTest', 'http://occeqxmsk.bkt.clouddn.com/MainMenu.jpg');
            game.load.image('icoTest', 'http://occeqxmsk.bkt.clouddn.com/ico.png');
            game.load.image('btnTest', 'http://occeqxmsk.bkt.clouddn.com/btn.png');
            game.load.image('btn2Test', 'http://occeqxmsk.bkt.clouddn.com/OneMoreGame.png');
            game.load.image('perosnTest', 'http://occeqxmsk.bkt.clouddn.com/perosn.png');
            game.load.audio('bgMusicTest', 'http://occeqxmsk.bkt.clouddn.com/img/music.mp3');
            game.load.image('bg1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bg.png');
            game.load.image('dude1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/dude.png');
            game.load.image('green1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/green.png');
            game.load.image('red1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/red.png');
            game.load.image('yellow1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/yellow.png');
            game.load.image('bomb1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bomb.png');
            game.load.image('five1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/five.png');
            game.load.image('three1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/three.png');
            game.load.image('one1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/one.png');
            game.load.audio('bgMusic1Test', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/bgMusic.mp3');
            // 一般需要添加反馈加载进度条或者百分比数字
            // 添加进度文字
            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fotnSize: '60px',
                fill: '#fff'
            });

            progressText.anchor.setTo(0.5, 0.5); // 设置锚点，用于居中
            // 监听加载一个文件的事件
            game.load.onFileComplete.add(function (progress) {
                progressText.text = progress + '%';
            });
            // 监听加载完毕事件
            game.load.onLoadComplete.add(onLoad);
            // 仔仔时间低于2S、则等到2S后进入下一个场景。
            var deadLine = false;
            setTimeout(function () {
                deadLine = true;
            }, 2000);

            /**
             * Add tow numbers
             * @returns {null} null
             */
            function onLoad() {
                if (deadLine) {
                    game.state.start('created'); // 场景切换到开始场景
                } else {
                    setTimeout(onLoad, 1000);
                }
            }
            // 添加加载页的最小展示时间(H5小游戏一般会在loading页添加一个LOGO、起到展示宣传)、那么加载的资源体积太小的话、可能加载的界面会一闪而过。会设置一个最小展示时间，在最小的展示时间前,即便资源已经加载完毕,也不会离开加载场景
        };
    }, // 开始场景
    created: function () {
        this.create = function () {
            // 添加背景
            var bg = game.add.image(0, 0, 'MainMenu');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 设置按钮
            var button = game.add.button(game.world.centerX, game.world.centerY * 1.5, 'btn', actionOnClick, this, 1, 1, 0);
            button.anchor.setTo(0.5, 0.5);
            button.scale.setTo(0.5, 0.5);

            function actionOnClick() {
                game.state.start('play'); // 场景切换到游戏中...
            }
        };
    }, // 游戏场景
    play: function () {
        /**
         * 1、物理引擎
         * 2、碰撞检测(组和精)
         * 总结遇到的坑、下次避免
         * 1、gulp dist目录
         * 2、Physics的碰撞检测
         */
        var redPacket; // 红包组
        var mainPerson; // 主角
        this.create = function () {
            // 开启物理引擎
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 300;
            // 添加背景
            var bg = game.add.image(0, 0, 'gameBg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加主角
            // mainPerson = game.add.image(game.world.centerX, game.world.centerY * 1.5, 'perosn');
            mainPerson = game.add.sprite(game.world.centerX, game.world.centerY * 1.5, 'perosn');
            mainPerson.anchor.setTo(0.5, 0.5);
            mainPerson.scale.setTo(0.4, 0.4);
            // 如果想触发碰撞检测、必须添加物理运动
            // game.physics.enable(mainPerson); // 加入物理运动
            // mainPerson.body.allowGravity = false; // 清除重力影响
            // 监听猪脚滑动事件

            // 是否正在触摸
            var touching = false;
            // 监听按下事件
            game.input.onDown.add(function (pointer) {
                // 要判断是否点住主角，避免瞬移
                if (Math.abs(pointer.x - mainPerson.x) < mainPerson.width / 2) {
                    touching = true;
                }
            });
            // 监听离开事件
            game.input.onUp.add(function () {
                touching = false;
            });
            // 监听滑动事件
            game.input.addMoveCallback(function (pointer, x, y, isTap) {
                if (!isTap && touching) {
                    mainPerson.x = x;
                }
            });

            // 倒计时
            var timerText = game.add.text(game.world.centerX, 100, "00:" + countDown, { font: "24px Arial", fill: "#ec3d39" });
            timerText.anchor.set(0.5, 0);

            var gameTimer = game.time.create(true);
            gameTimer.loop(1000, function () {
                console.log('123');
                countDown -= 1;
                if (countDown <= 0) {
                    game.state.start('over');
                } else if (countDown < 10) {
                    timerText.setText('00:0' + countDown);
                } else if (countDown <= 99) {
                    timerText.setText('00:' + countDown);
                }
            }, this);
            gameTimer.start();
            // 建立红包组
            redPacket = game.add.group();
            var redPacketTimer = game.time.create(true);
            var RED_SEC = 800;
            redPacketTimer.loop(RED_SEC, function () {
                // 创建红包
                var redRandowm = Math.random() * game.world.width;
                console.log('随机数' + redRandowm);
                // console.log('随机数' + redRandowm);

                if (redRandowm < 0) {
                    redRandowm = redPacket.width;
                    console.warn('随机值小于零');
                } else if (redRandowm > game.world.width - 50) {
                    redRandowm = game.world.width - 50;
                    console.warn('随机值大于.......');
                }

                var redPacketEl = redPacket.create(redRandowm, 0, 'fudai');
                // 设置红包加入物理运动
                game.physics.enable(redPacketEl);
                // 设置红包 大小
                var redImage = game.cache.getImage('fudai');
                redPacketEl.width = redImage.width / 2;
                redPacketEl.height = redImage.height / 2;
                // 设置红包与游戏边缘碰撞
                // redPacketEl.body.collideWorldBounds = true;
                // redPacketEl.body.onWorldBounds = new Phaser.Signal();
                // redPacketEl.body.onWorldBounds.add(function (redPacketEl, up, down, lef, right) {
                //     if (down) {
                //         redPacketEl.kill();
                //     }
                // });
            });
            redPacketTimer.start();
        };
        this.update = function () {
            // 监听触摸事件
            game.physics.arcade.overlap(mainPerson, redPacket, function (main, red) {
                red.kill();
                // 添加得分图片
                var goal = game.add.image(red.x, red.y, 'gold');

                // var goalImg = game.cache.getImage('gold');
                goal.width = red.width;
                goal.height = red.height;
                goal.alpha = 0;
                // 添加过渡效果
                var showTween = game.add.tween(goal)
                    .to({
                        alpha: 1,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
                showTween.onComplete.add(function () {
                    var hideTween = game.add.tween(goal)
                        .to({
                            alpha: 0,
                            y: goal.y - 20
                        }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                    hideTween.onComplete.add(function () {
                        goal.kill();
                    });
                });
                // 更新分数
                score++;
            }, null, this);
        };
        // 触摸事件触发后的回调
    }, // 结束
    over: function () {
        this.create = function () {
            // 添加背景
            var bg = game.add.image(0, 0, 'bg1');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加总分数
            var scoreStr = '您的得分是：' + score + '分';
            var scoreText = game.add.text(game.world.centerX, game.world.height * 0.3, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            // 再来一次

            // 设置按钮
            var button = game.add.button(game.world.centerX, game.world.centerY * 0.85, 'btn2', actionOnClick, this, 1, 1, 0);
            button.anchor.setTo(0.5, 0.5);
            button.scale.setTo(0.5, 0.5);

            /**
             * 按钮提交
             * @return {number} 返回空
             */
            function actionOnClick() {
                game.state.start('play'); // 场景切换到游戏中...
                countDown = 20;
                score = 0;
            }
        };
    }
};
// 添加场景到游戏中...
Object.keys(states)
    .forEach(function (key) {
        game.state.add(key, states[key]);
    });
// 启动游戏
game.state.start('preload');

/**
 * 一个完成的游戏分场景(游戏的生命周期)
 * 加载 loading
 * 开始 开始按钮
 * 游戏 游戏主逻辑
 * 结束 得分、排名
 *
 * 每个场景有自己对应的(生命周期)
 * 加载preload：尽管有预加载场景、如果希望能缩短进入页面时加载的时间,可以分摊到其他的场景中,只需要在其他场景加入preload方法即可
 * 创建create：如果存在preload方法、则会在加载完毕后执行此方法;否则将在进入该场景时直接执行此方法
 * 更新update： 更新周期自动执行方法。例如：在play场景的update方法中可以去检测2个物体是否有接触
 * 渲染完成render：渲染完毕后执行的方法。例如：在此方法中勾勒出物体的边缘，来方便观察物体的碰撞区域
 * 游戏完成后使用ES6改造
 * */