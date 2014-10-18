var game = new Phaser.Game(320, 240, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
var pixel = { scale: 2, canvas: null, context: null, width: 0, height: 0 }
var player;
var cursors;

var currentSpeed = 0;
var cursors;

var swordsmen;
var orderRate = 250;
var nextOrder = 0;

var nextJump = 0;
var jumpRate = 750;

var map;
var destructibles;
var platforms;
var ground;

function preload() {

    game.stage.backgroundColor = '#222222';
    //game.load.image('player', '../assets/testhero.png');
    game.load.image('swordsman', '../assets/swordsman.png');
    game.load.image('heroarm', '../assets/hero_arm.png');
    game.load.tilemap('caveMap', '../assets/cave.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('cave', '../assets/cave.png');
    game.load.spritesheet('player', '../assets/walksheet.png', 32, 32);
}

function create() {
    game.stage.smoothed = false;

    cursors = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('caveMap');
    map.addTilesetImage('cave');
    destructibles = map.createLayer('destructibles');
    platforms = map.createLayer('platforms');
    ground = map.createLayer('ground');
    ground.resizeWorld();

    map.setCollisionBetween(52, 53, true, platforms);
    map.setCollisionBetween(60, 61, true, platforms);
    map.setCollisionBetween(51, 52, true, ground);
    map.setCollisionBetween(59, 60, true, ground);
    map.setCollisionBetween(32,34, true, ground);
    map.setCollisionBetween(40,42, true, ground);
    //map.setCollisionBetween(50,65);

    player = game.add.sprite(0,0,null);
    player.anchor.setTo(.5);

    player.arm = game.add.sprite(3,-5, 'heroarm');
    player.arm.anchor.setTo(0.1, 0.9);
    player.addChild(player.arm);

    player.torso = game.add.sprite(0, 0, 'player');
    player.torso.anchor.setTo(.5);
    player.addChild(player.torso);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    game.camera.follow(player);

    player.body.width = 16;

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 1200;
    player.body.collideWorldBounds = true;

    player.torso.animations.add('walk', [1, 2, 3, 4], 6);
    player.torso.animations.add('rWalk', [4, 3, 2, 1], 6);

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
    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -300;

        player.torso.animations.play(player.scale.x > -1 ? 'rWalk' : 'walk');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 300;

        player.torso.animations.play(player.scale.x < 1 ? 'rWalk' : 'walk');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.torso.frame = 0;
    }

    //  Allow the player to jump if they are touching the ground.
    if (game.time.now > nextJump && cursors.up.isDown)
    {
        nextJump = game.time.now + jumpRate;
        player.body.velocity.y = -399;
    }

    if (game.input.activePointer.isDown)
    {
        orderSwordsmen();
    }

    player.arm.rotation = player.scale.x * game.math.angleBetween(
        player.x, player.y,
        game.input.activePointer.x, game.input.activePointer.y
    );

    if(game.input.activePointer.x < player.x) {
        player.scale.x = -1;
        player.arm.scale.y = -1;
        player.arm.scale.x = -1;
    }else {
        player.scale.x = 1;
        player.arm.scale.y = 1;
        player.arm.scale.x = 1;
    }
}

function render() {
  //  game.debug.body(player.arm);
}

function orderSwordsmen() {
  if (game.time.now > nextOrder && swordsmen.countDead() > 0)
    {
        nextOrder = game.time.now + orderRate;

        var swordsman = swordsmen.getFirstExists(false);

        swordsman.reset(player.x + 5, player.y - 16);

        game.physics.arcade.moveToPointer(swordsman, 400);
    }
  //game.add.sprite(player.body.x, player.body.y, 'swordsman');
}
