var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
function preload() {

game.stage.backgroundColor = '#ffffff';
game.load.image('sprite', '../assets/sprite.png');
game.load.image('sprite2', '../assets/sprite2.png');

}

function create() {
  game.stage.smoothed = false;
player = game.add.sprite(0, 0, 'sprite');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
game.add.sprite(0, 100, 'sprite2');
}

function update() {

}
