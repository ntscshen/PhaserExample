/**
 * 创建游戏实例、定义倒计时、定义分数
 * 创建四个维度从应用场景
 * 主流程为 - 游戏play场景(背景、物理、随机掉落、倒计时、点击次数)
 * 背景、物理引擎(随机速度大小掉落、边缘优化)、碰撞检测、倒计时、点击次数
 * 0、开始倒计时
 * 1、速度随机、大小随机
 * 2、点击碰撞检测
 * */
// var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');
var lovers; // 情侣
var score = 0;
var titleScore; // 总分数
var time = 25; // 倒计时
var countDownText;
// 定义场景
game.states = {
    // 加载进度条
    boot: function () {
        this.preload = function () {
            if (!game.device.desktop) { // desktop：Is running on a desktop 在桌面上运行
                game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            }
            game.load.image('preloader', 'http://occeqxmsk.bkt.clouddn.com/preloader.gif');
        };
        this.create = function () {
            game.state.start('preload');
        }
    },
    // 加载场景
    preload: function () {
        // 每个场景都有自己的生命周期、常用的生命周期(preload(加载)、create(准备就绪)、update(跟新周期)、render(渲染完成)) stage:舞台
        this.preload = function () {

            // 在preload中很少去创建精灵、但是有一个特殊情况、我们需要制作加载的进度条
            var preloadSprite = game.add.sprite(game.width / 2 - 110, game.height / 2 + 30, 'preloader');
            // preloadSprite.anchor.setTo(0.5, 0.5);
            // preloadSprite.scale.setTo(2, 1);
            game.load.setPreloadSprite(preloadSprite); // 根据下面的家在情况、映射到宽度上做对应的变化
            console.log('加载场景');
            // 设置资源跨域
            game.load.crossOrigin = 'anonymous';
            // 资源加载
            game.load.image('bg', 'http://occeqxmsk.bkt.clouddn.com/bg.png');
            // 已经拆散
            game.load.image('breakUp', 'http://occeqxmsk.bkt.clouddn.com/breakUp.png');
            // 倒计时
            game.load.image('countDown', 'http://occeqxmsk.bkt.clouddn.com/countDown.png');
            game.load.spritesheet('countDownNumber', 'http://occeqxmsk.bkt.clouddn.com/countDownNumber.png', 200, 200);

            game.load.image('dog', 'http://occeqxmsk.bkt.clouddn.com/dog.png');
            game.load.image('loversPerson1', 'http://occeqxmsk.bkt.clouddn.com/lovers.png');
            game.load.image('loversPerson2', 'http://occeqxmsk.bkt.clouddn.com/small-lovers.png');
            game.load.image('loversPerson3', 'http://occeqxmsk.bkt.clouddn.com/big-lovers.png');

            game.load.image('loversAndDog', 'http://occeqxmsk.bkt.clouddn.com/loversAndDog.png');
            game.load.image('number', 'http://occeqxmsk.bkt.clouddn.com/number.png');
            game.load.image('mainBtn', 'http://occeqxmsk.bkt.clouddn.com/btn.png');
            // 重新开始
            game.load.image('OneMoreGame', 'http://occeqxmsk.bkt.clouddn.com/OneMoreGame.png');

            // 测试资源加载
            game.load.image('bgTest', 'http://occeqxmsk.bkt.clouddn.com/cover.png');
            game.load.image('bg1Test', 'http://occeqxmsk.bkt.clouddn.com/resultBg.jpg');
            game.load.image('goldTest', 'http://occeqxmsk.bkt.clouddn.com/gold.png');
            game.load.image('fudaiTest', 'http://occeqxmsk.bkt.clouddn.com/fudai.png');
            game.load.image('gameBgTest', 'http://occeqxmsk.bkt.clouddn.com/gameBg.jpg');
            game.load.image('icoTest', 'http://occeqxmsk.bkt.clouddn.com/ico.png');
            game.load.image('btnTest', 'http://occeqxmsk.bkt.clouddn.com/btn.png');
            game.load.image('btn2Test', 'http://occeqxmsk.bkt.clouddn.com/OneMoreGame.png');
            game.load.image('perosnTest', 'http://occeqxmsk.bkt.clouddn.com/perosn.png');
            game.load.audio('bgMusicTest', 'http://occeqxmsk.bkt.clouddn.com/img/music.mp3');
            // 进度条 || 百分比
            var progressTxt = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#efe0ce'
            });
            progressTxt.anchor.setTo(0.5, 0.5); // 锚点居中
            // 监听加载文件事件
            game.load.onFileComplete.add(function (progress) {
                progressTxt.text = progress + '%';
            });
            // 监听加载完成
            game.load.onLoadComplete.add(Loaded);
            // 延迟 - 最小加载时间2S
            var deadLine = false;
            setTimeout(function () {
                deadLine = true;
            }, 2000);
            /**
             * loaded 加载完毕后执行的方法
             * @returns {undefined} undefined
             */
            function Loaded() {
                if (deadLine) {
                    game.state.start('created');
                } else {
                    setTimeout(Loaded, 1000);
                }
            }
        };
    },
    // 开始场景
    created: function () {
        this.create = function () {
            console.log('开始场景');
            // 背景
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 开始按钮
            var buttonStart = game.add.button(game.world.centerX, game.world.centerY * 1.5, 'mainBtn', function () {
                buttonStart.visible = false; // btn隐藏
                // 开始游戏倒计时
                var countDownPlay = game.add.sprite(game.world.centerX, game.world.centerY, 'countDownNumber');
                countDownPlay.anchor.setTo(0.5, 0.5);
                // countDownPlay.scale.setTo(0.5, 0.5);
                var shen = countDownPlay.animations.add('number');
                countDownPlay.animations.play('number', 1, false);
                shen.onComplete.add(function () {
                    game.state.start('play');
                    countDownPlay.visible = false; // 3S倒计时 - 隐藏
                }, this, countDownPlay);
            }, this, 1, 1, 0);
            buttonStart.anchor.setTo(0.5, 0.5);
            buttonStart.scale.setTo(0.5, 0.5);
        };
    },
    // 游戏场景
    play: function () {
        this.create = function () {
            score = 0;
            // 剩余时间
            // time = time;
            // console.log(time);
            // 开启物理引擎
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 300;
            console.log('游戏场景');
            // 背景
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;

            // 倒计时 - 背景图 - 定位
            var countDown = game.add.sprite(0, 0, 'countDown');
            countDown.fixedToCamera = true;
            countDown.scale.setTo(0.7, 0.7);
            countDown.cameraOffset.setTo(game.camera.width - game.width * 0.35, game.camera.height - game.height * 0.15);
            // 倒计时 - 数字 - 定位
            countDownText = game.add.text(0, 0, '00:' + time, {
                font: "16px Arial",
                fill: "#93502a"
            });
            countDownText.fixedToCamera = true;
            countDownText.cameraOffset.setTo(game.camera.width - game.width * 0.15, game.camera.height - game.height * 0.15);

            // 拆散数 - 背景图 - position
            var breakUp = game.add.sprite(0, 0, 'breakUp');
            breakUp.fixedToCamera = true;
            breakUp.scale.setTo(0.7, 0.7);
            breakUp.cameraOffset.setTo(game.camera.width - game.width * 0.35, game.camera.height - game.height * 0.1);
            // 拆散数 - 数字 - position
            this.breakUp = game.add.text(0, 0, score + score, {
                font: "16px Arial",
                fill: "#93502a"
            });
            this.breakUp.fixedToCamera = true;
            this.breakUp.cameraOffset.setTo(game.camera.width - game.width * 0.15, game.camera.height - game.height * 0.1);



            // 创建情侣
            game.physics.setBoundsToWorld(); // 边界
            this.lovers = game.add.group(); // 创建组
            this.lovers.lastTime = 0;
            // 创建分数
            // titleScore = game.add.text(0, 0, "得分：0", {
            //     font: "18px Arial",
            //     fill: "#ff0000"
            // });


            // 倒计时
            var gameTimer = game.time.create(true);
            gameTimer.loop(1000, function () {
                // this.refreshTime;
                console.log('shenyangsihao........');
                time--;
                var tem = time;
                if (time < 10) {
                    tem = '0' + time;
                }
                countDownText.text = '00:' + tem;
                if (time === 0) {
                    // alert('游戏结束...');
                    game.state.start('over');
                }
            });
            gameTimer.start();

        };
        this.update = function () {
            console.log('拆散个数：' + score);
            this.breakUp.text = score;
            // 主流程
            var now = new Date().getTime(); // 获取当前时间戳
            if (now - this.lovers.lastTime > 300) {
                var lovesIndex = game.rnd.integerInRange(1, 3);
                var key = 'loversPerson' + lovesIndex;
                var size = game.cache.getImage(key).width;
                console.log('宽度：' + size + ',');
                // 逻辑
                var x = game.rnd.integerInRange(size / 2, game.width - size / 2);
                var y = 0;
                // console.log(lovesIndex, key, size, x, y);
                // 获取对象池中的第一个
                var placeLove = this.lovers.getFirstExists(false, true, x, y, key);
                placeLove.anchor.setTo(0.5, 0.5);
                placeLove.outOfBoundsKill = true;
                placeLove.checkWorldBounds = true;

                game.physics.arcade.enable(placeLove); // 起物理引擎
                placeLove.body.velocity.y = 200;
                this.lovers.lastTime = now;

                // 打开输入事件
                placeLove.inputEnabled = true;
                placeLove.events.onInputDown.add(this.taped, this);
            }
            console.log(this.lovers ? this.lovers.length : 0);
        };
        this.taped = function (sprite) {
            console.log('触发成功');
            sprite.inputEnabled = false;
            // sprite.kill();

            var loveOverAnim = sprite.animations.add('hitted');
            sprite.play('hitted', 100, false);
            loveOverAnim.onComplete.add(function (sprite) {
                sprite.kill();
                // 跟新分数
                score++;
                console.log('asdfasdfasdfadfadsfasdf' + score);
            }, this, sprite);

            // 事件触发之后onComplete 开个渐变动画、kill
        };
        this.refreshTime = function () {}
    },
    // 结束
    over: function () {
        this.create = function () {
            // 结束
            var title = game.add.text(game.world.centerX, game.world.height * 0.2, '拆散：' + score + '对情侣、哈哈', {
                fontSize: '28px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            // 重新开始
            var restart = game.add.button(game.world.centerX, game.world.centerY * 0.65, 'OneMoreGame', actionClick, this, 1, 1, 0);
            restart.anchor.setTo(0.5, 0.5);

            function actionClick() {
                game.state.start('play'); // 场景切换到游戏中...
                time = 20;
                score = 0;
            }
        }
    }
};
Object.keys(game.states).forEach(function (key) {
    game.state.add(key, game.states[key]);
});
// 添加场景到游戏
// game.state.add('boot', game.states.boot);
// game.state.add('preload', game.states.preload);
// game.state.add('created', game.states.created);
// game.state.add('play', game.states.play);
// game.state.add('over', game.states.over);
// 启动游戏
game.state.start('boot');

// // 优化 - 添加场景到游戏
// Object.keys(states).forEach(function (key) {
//     game.state.add(key, states[key]);
// });
// // 游戏启动
// game.start.start('preload');
/**
 * game.add 对象工厂
 * game.cache 缓存
 * game.device 设备
 * game.input 输入
 * game.load 加载器
 * game.plugins 插件
 * game.scale 缩放
 * game.sound 音频
 * game.stage 舞台
 * game.state 场景
 * game.time 定时器
 * game.tweens 动画
 * game.world 世界
 * */
