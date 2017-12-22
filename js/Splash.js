
BasicGame.Splash = function (game) {

	this.logo = null;

    this.animation = null;
};
BasicGame.Splash.prototype = {

	create: function () {
		var self = this;
		
        this.stage.backgroundColor = '#ffffff' ;

        this.splash001 = this.add.sprite((this.game.width)/2, (this.game.height)/2, 'splash001');
        this.splash001.anchor.set(0.5, 0.5);
        this.splash001.alpha = 0;

        this.splash002 = this.add.sprite((this.game.width)/2, (this.game.height)/2, 'splash002');
        this.splash002.anchor.set(0.5, 0.5);
        this.splash002.alpha = 0;
		
        this.splash003 = this.add.sprite((this.game.width)/2, (this.game.height)/2, 'splash003');
        this.splash003.anchor.set(0.5, 0.5);
        this.splash003.alpha = 0;
/*		
		self.game.add.tween(self.splash001).to({alpha: 1}, 500, null, true).onComplete.add(function(){
			self.game.add.tween(self.splash001).to({alpha: 0}, 500, null, true, 1000).onComplete.add(function(){
				self.game.add.tween(self.splash002).to({alpha: 1}, 500, null, true).onComplete.add(function(){
					self.game.add.tween(self.splash002).to({alpha: 0}, 500, null, true, 1000).onComplete.add(function(){
						self.game.add.tween(self.splash003).to({alpha: 1}, 500, null, true).onComplete.add(function(){
							self.game.add.tween(self.splash003).to({alpha: 0}, 500, null, true, 1000).onComplete.add(function(){
*/							
								self.game.state.start('MainMenu');
/*								
							});
						});
					});
				});
			});
        });
*/
        this.game.SoundManager1.playMusic('main_menu', true);
	}
};
