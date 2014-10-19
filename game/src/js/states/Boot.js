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

        self.game.scale.maxWidth = 640;
        self.game.scale.maxHeight = 480;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        self.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        self.game.scale.refresh();

        self.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;
        self.game.state.start('Preloader');
    }
};

})();
