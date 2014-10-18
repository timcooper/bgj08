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

var tiles;
var tilesCollision;

var enemies;

function preload() {

    game.stage.backgroundColor = '#222222';
    //game.load.image('player', '../assets/testhero.png');
    game.load.image('swordsman', '../assets/swordsman.png');
    game.load.image('heroarm', '../assets/hero_arm.png');
    game.load.tilemap('level1Map', '../assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('cave', '../assets/cave.png');
    game.load.spritesheet('player', '../assets/walksheet.png', 32, 32);
    game.load.spritesheet('slime', '../assets/slime.png', 16, 16);
}

function create() {
    game.stage.smoothed = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    map = game.add.tilemap('level1Map');
    map.addTilesetImage('cave');
    //destructibles = map.createLayer('destructibles');
    //platforms = map.createLayer('platforms');
    //ground = map.createLayer('ground');
    //ground.resizeWorld();

    /*map.setCollisionBetween(52, 53, true, platforms);
    map.setCollisionBetween(60, 61, true, platforms);
    map.setCollisionBetween(51, 52, true, ground);
    map.setCollisionBetween(59, 60, true, ground);
    map.setCollisionBetween(32,34, true, ground);
    map.setCollisionBetween(40,42, true, ground);*/

    map.layers.forEach(function(l){
				var layer=map.createLayer(l.name);

				if(l.name==='collision'){
	            	var firstgid=map.tilesets[map.getTilesetIndex('collision')].firstgid;
		            l.data.forEach(function(e){
		                e.forEach(function(t){
		                	if (t.index >-1) {
		                		t.slopeIndex = t.index - firstgid;
		                	}

		                    if (t.index < 0) {
		                        // none
		                    } else if (t.index - firstgid === 7) {
		                        // full square is by default
		                    } else if (t.index - firstgid === 6) {
		                        t.slope = 'HALF_TRIANGLE_BOTTOM_LEFT';
		                    } else if (t.index - firstgid === 1) {
		                        t.slope = 'HALF_TRIANGLE_BOTTOM_RIGHT';
		                    }else  if (t.index - firstgid === 3) {
		                    	t.slope = 'RECTANGLE_BOTTOM';
		                    }else{
		                    	//console.log(t.index - firstgid);
		                    }
		                    // you could also add custom collide function;
		                    // t.slopeFunction = function (i, body, tile) { custom code }
		                });
		            });

		            var collisionTiles = [];
		            for(var i=firstgid;i<firstgid+18; i += 1){
		                collisionTiles.push(i);
		            }
		            map.setCollision(collisionTiles, true, layer);

		            tilesCollision=layer;
		        }


				layer.resizeWorld();
			}, this);

      game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //var slopeMap = { '51': 2, '59': 2 };

    //tiles = game.physics.ninja.convertTilemap(map, ground, slopeMap);

			/*game.time.advancedTiming = true;
			fpsText = game.add.text(
			  20, 20, '', { font: '16px Arial', fill: '#ffffff' }
			);
			fpsText.fixedToCamera = true;*/

    enemies = game.add.group();

    player = game.add.sprite(32,32,null);
    player.anchor.setTo(.5);

    player.arm = game.add.sprite(3,-5, 'heroarm');
    player.arm.anchor.setTo(0.1, 0.9);
    player.addChild(player.arm);

    player.torso = game.add.sprite(0, 0, 'player');
    player.torso.anchor.setTo(.5);
    player.addChild(player.torso);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    player.body.width = 16;

    //  Player physics properties. Give the little guy a slight bounce.
		player.body.maxVelocity.setTo(400, 750); // x, y

		player.body.collideWorldBounds = true;
		player.body.gravity.set(0, 1200);
		player.body.allowGravity = true;

    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;

    player.torso.animations.add('walk', [1, 2, 3, 4], 6);
    player.torso.animations.add('rWalk', [4, 3, 2, 1], 6);

    //map.createFromObjects('enemies',39,'slime',0, true, false, enemies);
    //enemies.forEach(setupEnemies, this);
    //enemies.add('bounce');
//enemies.play('bounce', 6, true);
    /*slime = game.add.sprite(200,80,'slime');
    slime.animations.add('bounce');
    slime.animations.play('bounce', 6, true);*/

    swordsmen = game.add.group();
    swordsmen.enableBody = true;
    swordsmen.physicsBodyType = Phaser.Physics.ARCADE;
    swordsmen.createMultiple(30, 'swordsman', 0, false);
    swordsmen.setAll('anchor.x', 0.5);
    swordsmen.setAll('anchor.y', 0.5);
    swordsmen.setAll('outOfBoundsKill', true);
    swordsmen.setAll('checkWorldBounds', true);
}

function setupEnemies(s) {
  if(s.name == 'slime') {
    s.animations.add('bounce');
    s.animations.play('bounce', 6, true);
  }
}

function update() {
    game.physics.arcade.collideSpriteVsTilemapLayer(player, tilesCollision);
    //game.physics.arcade.collide(player, platforms);

		player.body.acceleration.x=0;
			player.body.velocity.x = 0+player.body.velocityPunish.x;

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

    if(game.input.activePointer.worldX < player.x) {
        player.scale.x = -1;
        player.arm.scale.x = -1;
        player.arm.scale.y = -1;
    }else {
        player.scale.x = 1;
        player.arm.scale.x = 1;
        player.arm.scale.y = 1;
    }

    player.arm.rotation = player.scale.x * game.math.angleBetween(
        player.x, player.y,
        game.input.activePointer.worldX, game.input.activePointer.worldY
    );
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
