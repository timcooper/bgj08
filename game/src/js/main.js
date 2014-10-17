var game = new Phaser.Game(320, 240, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var cursors;

var currentSpeed = 0;
var cursors;

var swordsmen;
var orderRate = 100;
var nextOrder = 0;
function preload() {

game.stage.backgroundColor = '#ffffff';
game.load.image('player', '../assets/testhero.png');
game.load.image('swordsman', '../assets/swordsman.png');

}

function create() {
  game.stage.smoothed = false;
  cursors = game.input.keyboard.createCursorKeys();
  player = game.add.sprite(0, 0, 'player');
  player.anchor.setTo(.5, 1);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    swordsmen = game.add.group();
    swordsmen.enableBody = true;
    swordsmen.physicsBodyType = Phaser.Physics.ARCADE;
    swordsmen.createMultiple(30, 'swordsman', 0, false);
    swordsmen.setAll('anchor.x', 0.5);
    swordsmen.setAll('anchor.y', 0.5);
    swordsmen.setAll('outOfBoundsKill', true);
    swordsmen.setAll('checkWorldBounds', true);
}

function update() {
player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.scale.x = -1;
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
      player.scale.x = 1;
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -350;
    }

    if (game.input.activePointer.isDown)
    {
      orderSwordsmen();
    }
}

function orderSwordsmen() {
  if (game.time.now > nextOrder && swordsmen.countDead() > 0)
    {
        nextOrder = game.time.now + orderRate;

        var swordsman = swordsmen.getFirstExists(false);

        swordsman.reset(player.x, player.y);

        swordsman.rotation = game.physics.arcade.moveToPointer(swordsman, 1000, game.input.activePointer, 500);
    }
  //game.add.sprite(player.body.x, player.body.y, 'swordsman');
}
