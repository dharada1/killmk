//
enchant();

window.onload = function() {

  var core = new Core(320, 320);

  core.preload('image/chara1.png', 'image/mktakuya.png', 'sound/bgm.wav',
               'sound/clear.wav', 'sound/shot.wav', 'sound/shock.wav',
               'sound/uwa.m4a', 'sound/gameover.wav', 'sound/ah.wav');

  core.fps = 60;

  core.onload = function () {
    core.keybind(' '.charCodeAt(0), 'space');

    core.assets['sound/bgm.wav'].play();

    var Player = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.image = core.assets['image/chara1.png'];
        this.frame = 4;
        this.scaleX = 1;
        this.life = 100;
      }
    })

    var Enemy = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 100, 126);
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.life = 200;
        this.image = core.assets['image/mktakuya.png'];
      }
    })

    var Bullet = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image = core.assets['image/chara1.png'];
        this.frame = 8;
      }
    })

    player = new Player(320/2,320-32);
    enemy = new Enemy(0,0);

    var renda = 0;

    player.on('enterframe', function() {
      if (core.input.right) {
        this.scaleX = 1
        this.vx = 3;
        if (this.x >= 320-this.width) this.vx = 0;
        this.x += this.vx;
      }

      if (core.input.left) {
        this.scaleX = -1
        this.vx = -3;
        if (this.x <= 0) this.vx = 0;
        this.x += this.vx;
      }

      if (this.intersect(enemy)) {
        this.life -=1;
        label3.text = player.life;
        core.assets['sound/ah.wav'].play();
      }

      if (this.life == 0) {
         core.pushScene(gameover);
         core.assets['sound/gameover.wav'].play();
      }

      renda += 1;
      if (renda == 10) renda = 0;
      if (core.input.space && renda == 0) {

        bullet = new Bullet(this.x, 320-32-32);
        core.rootScene.addChild(bullet);
        core.assets['sound/shot.wav'].play();

        bullet.on('enterframe', function() {
          this.y -= 3;
          this.rotate(3);
          if (this.within(enemy,50)) {
            core.assets['sound/uwa.m4a'].play();
            core.assets['sound/shock.wav'].play();
            enemy.life -= 1;
            enemy.vx *= 1.02;
            enemy.tl.fadeOut(2)
                    .fadeIn(1);
            enemy.rotate(10);
             label.text = enemy.life;
             this.tl.moveBy(rand(2000)-1000, rand(2000)-1000, 40)
                    .fadeOut(100);
          };
          if (this.y < -this.width || this.y > 320 || this.x < -this.height || this.x > 320){
            core.rootScene.removeChild(this);
          }
        });

      }
    });

    enemy.on('enterframe', function() {
      this.x += this.vx;
      if (this.x < 0 || this.x > 320-100) this.vx = -this.vx;
      this.rotate(this.vx);
      if (rand(100) == 0)  this.tl.moveBy(0,200,20)
                                  .moveBy(0,-200,100);
      if (this.life <= 0) {
         core.pushScene(gameclear);
         core.assets['sound/clear.wav'].play();
      }
    })

    var label = new Label();
    label.x = 280;
    label.y = 5;
    label.color = 'yellow';
    label.font = '14px "Arial"';
    label.text = enemy.life;
    core.rootScene.addChild(label);

    var label2 = new Label();
    label2.x = 230;
    label2.y = 20;
    label2.color = 'yellow';
    label2.font = '14px "Arial"';
    label2.text = "MKTAKUYA";
    core.rootScene.addChild(label2);

    var label3 = new Label();
    label3.x = 0;
    label3.y = 5;
    label3.color = 'yellow';
    label3.font = '14px "Arial"';
    label3.text = player.life;
    core.rootScene.addChild(label3);


    var label4 = new Label();
    label4.x = 0;
    label4.y = 20;
    label4.color = 'yellow';
    label4.font = '14px "Arial"';
    label4.text = "KUMA";
    core.rootScene.addChild(label4);

    var description = new Label();
    description.x  = 120;
    description.y = 200;
    description.color = 'yellow';
    description.font = '14px "Arial"';
    description.text = "PUSH SPACE AND KILL MK";
    core.rootScene.addChild(description);

    var description2 = new Label();
    description2.x = 10;
    description2.y = 150;
    description2.color = 'yellow';
    description2.font = '14px "Arial"';
    description2.text = "YOU CAN MOVE <- ->";
    core.rootScene.addChild(description2);

    core.rootScene.addChild(player);
    core.rootScene.addChild(enemy);
    core.rootScene.backgroundColor = "black";

    var gameclear = new Scene();
    gameclear.backgroundColor = 'yellow';
    var gameclearMessage = new Label("VICTORY ACHIEVED");
    gameclearMessage.font = '14px "Arial"';
    gameclearMessage.x = 90;
    gameclearMessage.y = 100;
    gameclear.addChild(gameclearMessage);

    var gameover = new Scene();
    gameover.backgroundColor = 'red';
    var gameoverMessage = new Label("YOU ARE DEAD...");
    gameoverMessage.font = '14px "Arial"';
    gameoverMessage.x = 100;
    gameoverMessage.y = 100;
    gameover.addChild(gameoverMessage);

  };
  core.start();
};

function rand(n) {
  return Math.floor(Math.random() * (n+1));
}
