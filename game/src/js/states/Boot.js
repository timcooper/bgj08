var GameCtrl = {
    // any global stuff you want
};

(function(){
'use strict';

GameCtrl.Boot = function () {
};

GameCtrl.Boot.prototype = {

    preload: function () {
        this.load.image('preloaderBackground', '../assets/images/progress_bar_background.png');
        this.load.image('preloaderBar', '../assets/images/progress_bar.png');
    },

    create: function () {
        self.game.stage.smoothed = false;
        self.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;
        self.game.state.start('Preloader');
    }
};

})();
