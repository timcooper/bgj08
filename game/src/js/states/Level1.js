'use strict';
/* global GameCtrl */
/* global Phaser */
var BULLET_SPEED_TIME = 1; //Should say 1.
var MAX_SPEED = 150/BULLET_SPEED_TIME; // pixels/second
var MAX_SPEED_Y = 500/BULLET_SPEED_TIME; // pixels/second
var YSPEED = 350/BULLET_SPEED_TIME;
var MOVE_ACCELERATION = MAX_SPEED*5/BULLET_SPEED_TIME; // pixels/second/second
var GRAVITY = 1200/BULLET_SPEED_TIME;
var JUMP_BACK_OFF = 400;


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
		// 150,120
		initPlayer:function(x,y){
			var player = new Player(this.game, this.tilesCollision);

			PLAYER=player;

			player.create(x,y);
			return player;
		},
		createBullets:function(){
			// Create an object pool of bullets
			this.bulletPool = this.game.add.group();
			var bitBullet=this.add.bitmapData(8,8);
			bitBullet.ctx.beginPath();
			bitBullet.ctx.rect(0,0,8,8);
			bitBullet.ctx.fillStyle = '#ffffff';
			bitBullet.ctx.fill();

			for(var i = 0; i < NUMBER_OF_BULLETS; i += 1) {
				// Create each bullet and add it to the group.

				var bullet = this.game.add.sprite(0, 0, bitBullet);
				this.bulletPool.add(bullet);

				// Set its pivot point to the center of the bullet
				bullet.anchor.setTo(0.5, 0.5);

				// Enable physics on the bullet
				this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

				// Set its initial state to "dead".
				bullet.kill();
			}
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
        //GameCtrl.remotePlayers=[];



			/*this.input.setMoveCallback(function(){
				if(this.input.mousePointer.isDown){
					if(this.input.mousePointer.button !==0){
						//console.log(this.input.mousePointer.button);
						return ;
					}

					if (this.lastBulletShotAt === undefined) {
						this.lastBulletShotAt = 0;
					}
					if (this.game.time.now - this.lastBulletShotAt < SHOT_DELAY) {
						return;
					}

					this.lastBulletShotAt = this.game.time.now;

					var angle=this.game.physics.arcade.angleToPointer(this.player);

					/*
					TODO SOCKET
					GameCtrl.socket.emit('fire',{angle:angle});
					*/

					/*this.drawBullet({x:this.player.x,y:this.player.y,angle:angle,color:this.player._color});
				}

			}, this);*/


			this.realPlayer=this.initPlayer(Math.floor(Math.random()*600) + 100, 8);
			this.player = this.realPlayer.sprite;

			//game.physics.arcade.gravity.y = 640;

			//this.createBullets();



		},

		drawBullet:function(data){
			// Get a dead bullet from the pool
			var bullet = this.bulletPool.getFirstDead();

			// If there aren't any bullets available then don't shoot
			if (bullet === null || bullet === undefined) {
				return;
			}


			// Revive the bullet
			// This makes the bullet "alive"
			bullet.revive();

			//bullet.tint=parseInt(data.color,16);

			// Bullets should kill themselves when they leave the world.
			// Phaser takes care of this for me by setting this flag
			// but you can do it yourself by killing the bullet if
			// its x,y coordinates are outside of the world.
			bullet.checkWorldBounds = true;
			bullet.outOfBoundsKill = true;


			// Set the bullet position to the gun position.
			bullet.reset(data.x, data.y);

			// Shoot it in the right direction
			bullet.body.velocity.x = Math.cos(data.angle) * BULLET_SPEED;
			bullet.body.velocity.y = Math.sin(data.angle) * BULLET_SPEED;

		},
		update: function () {
			if (this.game.time.fps !== 0) {
				this.fpsText.setText(this.game.time.fps + ' FPS');
			}

			//this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
			this.physics.arcade.collideSpriteVsTilemapLayer(this.player, this.tilesCollision);



			this.realPlayer.update();

			/*
			var x=Math.floor(this.player.x);
			var y=Math.floor(this.player.y);
			if(x!=this.player.lastX || y!=this.player.lastY){

				TODO SOCKETS
				GameCtrl.socket.emit('move player', {x: Math.floor(this.player.x), y: Math.floor(this.player.y) });
			}
			*/

		},
		render: function(){
			//this.game.debug.bodyInfo(this.player, 0, 100);
			//this.game.debug.body(this.player,0,100);
		}
	};


	function Player(game, tilesCollision){
		this.game = game;
		this.tilesCollision = tilesCollision;
		this.physics = game.physics;
		this.add = game.add;
		this.sprite = null;
		this.keyboard = this.game.input.keyboard;


		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.W, Phaser.Keyboard.A,
			/*Phaser.Keyboard.S,*/ Phaser.Keyboard.D
		]);

		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		this.canJump = true;
	}

	Player.prototype = {
		create: function (x, y) {

      var s = game.add.sprite(32,32,null);
      s.anchor.setTo(.5);

      s.arm = game.add.sprite(3,-5, 'heroarm');
      s.arm.anchor.setTo(0.1, 0.9);
      s.addChild(s.arm);

      s.torso = game.add.sprite(0, 0, 'player');
      s.torso.anchor.setTo(.5);
      s.addChild(s.torso);

      s.torso.animations.add('walk', [1, 2, 3, 4], 6);
      s.torso.animations.add('rWalk', [4, 3, 2, 1], 6);

			this.sprite = s;

			this.physics.enable(s,Phaser.Physics.ARCADE,true);

			s.lastX=Math.floor(x);
			s.lastY=Math.floor(y);
			s.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED_Y); // x, y

			s.body.collideWorldBounds = true;
			s.body.gravity.set(0, GRAVITY);
			s.body.allowGravity = true;
			s.body.speedxPunish=0;

      this.sprite.body.width = 16;

			this.game.camera.follow(s, Phaser.Camera.FOLLOW_PLATFORMER);

			this.cursors = {
				up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
				left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
				right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
			};

		},
		update: function() {
			var body = this.sprite.body;

			body.acceleration.x=0;
			if(body.blocked.down){
				body.velocity.x = 0+body.velocityPunish.x;
			}

      if(this.game.input.activePointer.worldX < this.sprite.x) {
          this.sprite.scale.x = -1;
          this.sprite.arm.scale.x = -1;
          this.sprite.arm.scale.y = -1;
      }else {
          this.sprite.scale.x = 1;
          this.sprite.arm.scale.x = 1;
          this.sprite.arm.scale.y = 1;
      }

      this.sprite.arm.rotation = this.sprite.scale.x * this.game.math.angleBetween(
          this.sprite.x, this.sprite.y,
          this.game.input.activePointer.worldX, this.game.input.activePointer.worldY
      );


			var LEFT = false||this.cursors.left.isDown;
			var RIGHT = false||this.cursors.right.isDown;
			var UP = false||this.cursors.up.isDown;

			if(this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad1.connected) {
				var axis=this.pad1._rawPad.axes;
				LEFT=LEFT || axis[0]<0;
				RIGHT=RIGHT ||axis[0]>0;
				UP=UP || this.pad1.isDown(Phaser.Gamepad.XBOX360_X);
			}

			if(!RIGHT && LEFT){
				this.go('left');
        this.sprite.torso.animations.play(this.sprite.scale.x > -1 ? 'rWalk' : 'walk');
			}else if (!LEFT && RIGHT){
				this.go('right');
        this.sprite.torso.animations.play(this.sprite.scale.x < 1 ? 'rWalk' : 'walk');
			}else{
        this.sprite.torso.animations.stop();

        this.sprite.torso.frame = 0;
      }

			//var isInAir=(!body.blocked.down && !body.blocked.left && !body.blocked.right);
            var isInAir=(!body.blocked.down);


			if (!isInAir && UP && this.canJump) {
				this.jump();
			}

			if(!UP){
				this.canJump=true;

				// stop jumping!
				if (isInAir && body.velocity.y < 0){
					body.velocity.y=0;
				}
			}

			body.gravity.set(0, GRAVITY);


			if(body.deltaY() > 0){
				var _mapData = this.tilesCollision.getTiles(
					body.position.x - body.tilePadding.x,
					body.position.y ,
					body.width + body.tilePadding.x,
					body.height,
					false, false);


				for (var i = 0; i < _mapData.length; i += 1) {
					var t = _mapData[i];
					// solo con el cuadrado se "cuelga"
					//if (t.hasOwnProperty('slopeIndex')) console.log(t.slopeIndex)
					if (t.hasOwnProperty('slopeIndex') && t.slopeIndex === 1) {

						if( this.sprite.x - (t.worldX + t.width)< 10 /* &&
							t.worldY < this.sprite.y + this.sprite.height &&  t.worldY > this.sprite.y*/ ) {
							body.gravity.set(0, GRAVITY/10);

							break;
						} else if( this.sprite.world.x + this.sprite.width - t.right < 10
							/*t.worldY < this.sprite.y + this.sprite.height &&  t.worldY > this.sprite.y */){
								this.sprite.body.gravity.set(0, GRAVITY/10);
								console.log(this.sprite.world.x + this.sprite.width - t.right);
								break;
						}
					}
				}
			}
		},
		jump: function() {

			this.canJump = false;
			if (!this.sprite.body.blocked.down) {
				/*if (this.sprite.body.blocked.left) {
					//Al saltar desde una pared sale impulsado con la misma o al menos un poco de velocidad
					this.sprite.body.velocity.x = -this.sprite.body.velocity.x + JUMP_BACK_OFF;
				}
				if (this.sprite.body.blocked.right) {
					//Idem anterior
					this.sprite.body.velocity.x = -this.sprite.body.velocity.x - JUMP_BACK_OFF;
				}*/
			}
			this.sprite.body.velocity.y = -YSPEED;

		},

		go: function(direction) {
			var sign = (direction==='left') ? -1 : 1;

			var _bonus = 1;

			//this.sprite.body.acceleration.x=sign*MOVE_ACCELERATION;
			if(this.sprite.body.blocked.down){
				this.sprite.body.velocity.x = sign * MAX_SPEED * _bonus +this.sprite.body.speedxPunish;
			} else {
				this.sprite.body.acceleration.x = sign * MOVE_ACCELERATION * _bonus;

				// hung!
				if ((this.sprite.body.blocked.left || this.sprite.body.blocked.right) && this.sprite.body.velocity.y > -MAX_SPEED_Y *0.8 ){

					//this.sprite.body.velocity.y=0;
				}
			}


		},
		stop: function() {
			this.sprite.body.acceleration.x=0;
		}
	};


}());
