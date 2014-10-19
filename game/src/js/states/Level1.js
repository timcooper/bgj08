'use strict';

// Define constants
var SHOT_DELAY = 200; // milliseconds (10 bullets/second)
var BULLET_SPEED = 400; // pixels/second
var NUMBER_OF_BULLETS = 200;

var PLAYER;

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


(function(){
	GameCtrl.Level1 = function () {

			//        When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
	/*
		this.game;                //        a reference to the currently running game
		this.add;                //        used to add sprites, text, groups, etc
		this.camera;        //        a reference to the game camera
		this.cache;                //        the game cache
		this.input;                //        the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
		this.load;                //        for preloading assets
		this.math;                //        lots of useful common math operations
		this.sound;                //        the sound manager - add a sound, play one, set-up markers, etc
		this.stage;                //        the game stage
		this.time;                //        the clock
		this.tweens;        //        the tween manager
		this.world;                //        the game world
		this.particles;        //        the particle manager
		this.physics;        //        the physics manager
		this.rnd;                //        the repeatable random number generator
	*/
		//        You can use any of these from any function within this State.
		//        But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

	};

	GameCtrl.Level1.prototype = {

		initPlayer:function(spawnPoint, map){
			var destructibles = new GameCtrl.Destructibles(this.game, map, this.pickups);
			destructibles.create();

			var player = new GameCtrl.Player(this.game, this.tilesCollision, destructibles);

			PLAYER=player;
			player.create(spawnPoint.x,spawnPoint.y);
			return player;
		},

		create: function () {
			this.game.stage.backgroundColor = '#222222';

			this.physics.startSystem(Phaser.Physics.ARCADE);

			this.game.time.deltaCap=0.02;
			this.game.physics.arcade.frameRate = 1 / 60;

			this.game.stage.disableVisibilityChange = true;


			var map = this.add.tilemap('level1Map');
			map.addTilesetImage('cave');

      map.layers.forEach(function(l){
        var layer=map.createLayer(l.name);

        if(l.name==='collision'){
					this.testLayer = layer;
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

          this.tilesCollision=layer;
        }


        layer.resizeWorld();
      }, this);

      this.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


      this.game.time.advancedTiming = true;
      this.fpsText = this.game.add.text(
        5, 5, '', { font: '10px Arial', fill: '#ffffff' }
      );
      this.fpsText.fixedToCamera = true;

      this.game.stage.disableVisibilityChange = true;

			this.pickups = new GameCtrl.Pickups(this.game);

			this.realPlayer=this.initPlayer(map.objects.playerSpawn[0], map);
      this.realPlayer.addTroops('swordsmen', 50);
      this.realPlayer.addTroops('archers', 50);
      this.realPlayer.addTroops('seers', 50);
      this.realPlayer.addTroops('berserkers', 50);
			this.player = this.realPlayer.sprite;

      this.enemies = new GameCtrl.Enemies(this.game, this.realPlayer, map, this.pickups);
      this.enemies.create();

			this.enemies.spawn();
		},

		update: function () {
			if (this.game.time.fps !== 0) {
				this.fpsText.setText(this.game.time.fps + ' FPS');
			}

			//this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
			this.physics.arcade.collideSpriteVsTilemapLayer(this.player, this.tilesCollision);
			this.physics.arcade.collideSpriteVsTilemapLayer(this.pickups, this.tilesCollision);

			this.physics.arcade.overlap(this.player, this.pickups, null, this.realPlayer.pickup, this.realPlayer );

			this.enemies.update(this.testLayer);

			this.realPlayer.update(this.enemies);

		},
		render: function(){
			//this.game.debug.bodyInfo(this.player, 0, 100);
			//this.game.debug.body(this.player,0,100);
		}
	};

}());
