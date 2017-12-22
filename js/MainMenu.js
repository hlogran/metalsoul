
BasicGame.MainMenu = function (game) {


};

BasicGame.MainMenu.prototype = {

	create: function () {
        var self=this;
        this.add.sprite(0, 0, 'mainMenuBg');
        this.add.sprite((self.game.width- self.cache.getImage('mainMenuBg2').width)/2, 0, 'mainMenuBg2');
        this.add.sprite(0, 0, 'main characters Cover');
        var title = this.add.sprite(0, 0, 'title');
        var btnSound = this.add.button(85, 547, 'btnSound', function(btn){
            self.game.SoundManager1.toggleSfxMuted();
            setButtonsFrames();
        }, this, 0, 1, 2);
        var btnMusic = this.add.button(40, 547, 'btnMusic', function(btn){
            self.game.SoundManager1.toggleMusicMuted();
            setButtonsFrames();
        }, this, 0, 1, 2);
        function setButtonsFrames(){
            if(self.game.SoundManager1.musicMuted){
                btnMusic.setFrames('Music BTN0003', 'Music BTN0004', 'Music BTN0005');
            }
            else{
                btnMusic.setFrames('Music BTN0000', 'Music BTN0001', 'Music BTN0002');
            }
            if(self.game.SoundManager1.sfxMuted){
                btnSound.setFrames('Sound BTN0003', 'Sound BTN0004', 'Sound BTN0005');
            }
            else{
                btnSound.setFrames('Sound BTN0000', 'Sound BTN0001', 'Sound BTN0002');
            }
        }
        setButtonsFrames();
        this.grpButtons = this.add.group();
        var btnPlay = this.grpButtons.addChild(new Phaser.Button(this.game, 0, 0, 'btnPlay', this.showSlots, this, 'Blue BTN Main0000', 'Blue BTN Main0001', 'Blue BTN Main0002'));
        var btnAyuda = this.grpButtons.addChild(new myFramework.Button(self.game, "AYUDA", 'btnAyuda', 740, 580, function(){
            self.tutorial();
        } ));

		
        this.grpSlots = this.add.group();
        var btnSlot1 = this.grpSlots.addChild(new Phaser.Button(this.game, 0, 0, 'btnSlot1', function(){this.playGame(1)}, this, 'Blue BTN Slot 10000', 'Blue BTN Slot 10001', 'Blue BTN Slot 10002'));
        var btnSlot2 = this.grpSlots.addChild(new Phaser.Button(this.game, 0, 0, 'btnSlot2', function(){this.playGame(2)}, this, 'Blue BTN Slot 20000', 'Blue BTN Slot 20001', 'Blue BTN Slot 20002'));
        var btnSlot3 = this.grpSlots.addChild(new Phaser.Button(this.game, 0, 0, 'btnSlot3', function(){this.playGame(3)}, this, 'Blue BTN Slot 30000', 'Blue BTN Slot 30001', 'Blue BTN Slot 30002'));

        btnSlot1.anchor.set(0.5, 0.0);
        btnSlot2.anchor.set(0.5, 0.0);
        btnSlot3.anchor.set(0.5, 0.0);

        title.anchor.set(0.5, 0.0);
        btnPlay.anchor.set(0.5, 0.0);
        btnAyuda.anchor.set(0.5, 0.5);

        title.x = config.game_half_width;
        title.y = -140;

        btnPlay.x = config.game_half_width;
        btnPlay.y = 357;

        btnAyuda.x = config.game_half_width;
        btnAyuda.y = 445 + btnAyuda.height/2;

        btnSlot1.x = config.game_half_width;
        btnSlot2.x = config.game_half_width;
        btnSlot3.x = config.game_half_width;

        btnSlot1.y = 340;
        btnSlot2.y = 400;
        btnSlot3.y = 460;

		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
        this.grpSlots.visible = false;
	},

	update: function () {

	},

    playGame: function(index) {
        var self = this;
        this.game.slot=index;
        this.game.loadGame(index);
        this.game.transition("close", function(){
            if(player.cards[0].id == -1){
                self.state.start('CharacterSelect');
            }
            else{
                self.state.start('Map');
            }
        });
        //this.game.SoundManager1.stopAllMusic();
        //this.game.SoundManager1.playMusic("in_game", true);
    },

    showSlots: function() {
        this.grpSlots.visible = true;
        this.grpButtons.visible = false;
    },

    tutorial: function(){
        var self = this;
        var grp = self.game.add.group();

        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, 'Tuto_Screen1');
        innerBg.anchor.set(0.5, 0.5);
        innerBg.inputEnabled=true;
        grp.addChild(innerBg);

        //boton salir
        var btnBack = new myFramework.Button(self.game, "SIGUIENTE", 'btnOrange', 740, 580, function(){
            self.tutorial2();
            grp.destroy(true);
        } );
        grp.addChild(btnBack);

    },
    tutorial2: function(){
        var self = this;
        var grp = self.game.add.group();

        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, 'Tuto_Screen2');
        innerBg.anchor.set(0.5, 0.5);
        innerBg.inputEnabled=true;
        grp.addChild(innerBg);

        //boton salir
        var btnBack = new myFramework.Button(self.game, "SALIR", 'btnOrange', 740, 580, function(){
            grp.destroy(true);
        } );
        grp.addChild(btnBack);

    },
};
