var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var cursors;
function preload() {

game.stage.backgroundColor = '#ffffff';
game.load.image('sprite', '../assets/sprite.png');
game.load.image('sprite2', '../assets/sprite2.png');

}

function create() {
  game.stage.smoothed = false;
  cursors = game.input.keyboard.createCursorKeys();
  player = game.add.sprite(0, 0, 'sprite');
  player.anchor.setTo(.5, 1);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    game.add.sprite(0, 100, 'sprite2');
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
    console.log(player.body.touching);
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -350;
    }
}
