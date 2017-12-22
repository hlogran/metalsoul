
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {
    sfxList: [
        "assets/audio/attack.mp3",
        "assets/audio/selection.mp3",
        "assets/audio/tokenDrop.mp3",
        "assets/audio/attack.mp3"
    ],

    musicList : [
        "assets/audio/main_menu.mp3",
        "assets/audio/in_game.mp3",
        "assets/audio/choosing.mp3"
    ],

	preload: function () {

        this.add.sprite(0, 0, 'preloaderBg');
        this.preloadBar = this.add.sprite(0, 0 , 'preloaderBar');
        this.preloadFrame = this.add.sprite(0, 0, 'preloaderFrame');

        this.preloadFrame.x = this.game.width/2 - this.preloadBar.width / 2 ;
        this.preloadFrame.y = this.game.height * .65 ;

        this.preloadBar.x = this.preloadFrame.x + 4;
        this.preloadBar.y = this.preloadFrame.y + 38;

        this.load.setPreloadSprite(this.preloadBar);

        var self = this;

        this.sfxList.forEach(function(snd){
            var name = snd.replace(/^.*(\\|\/|\:)/, '').split('.')[0];
            self.load.audio(name, snd);
            self.game.SoundManager1.addSfx(self.game.add.audio(name));
        });

        this.musicList.forEach(function(snd){
            var name = snd.replace(/^.*(\\|\/|\:)/, '').split('.')[0];
            self.load.audio(name, snd);
            self.game.SoundManager1.addMusic(self.game.add.audio(name, 1, true));
        });

        //preloads
        this.load.image('splash003', 'assets/images/splash003.png');
        this.load.image('splash002', 'assets/images/splash002.png');
        this.load.image('splash001', 'assets/images/splash001.jpg');
        this.load.image('card_layout', 'assets/images/card_layout.png');
        this.load.image('card_bg', 'assets/images/card_bg.png');
        this.load.image('thumbnail_bg', 'assets/images/thumbnail_bg.png');
        this.load.image('thumbnail_frame', 'assets/images/thumbnail_frame.png');

        this.load.image('placeholder', 'assets/images/placeholder.png');
        this.load.image('title', 'assets/images/titleLogo.png');

        this.load.atlas('btnPlay', 'assets/images/Blue BTN Main.png', 'assets/images/Blue BTN Main.json');

        this.load.atlas('btnAyuda', 'assets/images/btnAyuda.png', 'assets/images/btnAyuda.json');

        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
        this.load.image('mainMenuBg2', 'assets/images/mainMenuBg2.png');

        this.load.atlas('btnSound', 'assets/images/Sound BTN.png', 'assets/images/Sound BTN.json');
        this.load.atlas('btnMusic', 'assets/images/Music BTN.png', 'assets/images/Music BTN.json');

        this.load.image('characterSelectBg', 'assets/images/characterSelectBg.png');
        this.load.image('characterSelectPh', 'assets/images/characterSelectPh.png');

        this.load.atlas('btnOrange', 'assets/images/Orange BTN Options.png', 'assets/images/Orange BTN Options.json');
        this.load.atlas('btnBlue', 'assets/images/Blue BTN Options.png', 'assets/images/Blue BTN Options.json');

        this.load.atlas('btnSlot1', 'assets/images/Slot 1BTNs.png', 'assets/images/Slot 1BTNs.json');
        this.load.atlas('btnSlot2', 'assets/images/Slot 2BTNs.png', 'assets/images/Slot 2BTNs.json');
        this.load.atlas('btnSlot3', 'assets/images/Slot 3BTNs.png', 'assets/images/Slot 3BTNs.json');

        this.load.atlas('btnPregamePlay', 'assets/images/Blue BTN Pregame.png', 'assets/images/Blue BTN Pregame.json');
        this.load.atlas('btnPregameBack', 'assets/images/Orange BTN Pregame.png', 'assets/images/Orange BTN Pregame.json');

        this.load.image('Tuto_Screen1', 'assets/images/Tuto_Screen1.jpg');
        this.load.image('Tuto_Screen2', 'assets/images/Tuto_Screen2.jpg');
        this.load.image('main characters Cover', 'assets/images/main characters Cover.png');

        //this.load.image('creditsBg', 'assets/images/creditsBg.png');
        this.load.image('map', 'assets/images/map.png');
        this.load.image('levelBar', 'assets/images/levelBar.png');
        this.load.image('levelGauge', 'assets/images/levelGauge.png');
        this.load.image('moneyBar', 'assets/images/moneyBar.png');
        this.load.atlas('btnBack', 'assets/images/Orange BTN Pregame.png', 'assets/images/Orange BTN Pregame.json');

        this.load.spritesheet('btnLevelup', 'assets/images/btnLevelup.png', 291, 612/4);
        this.load.spritesheet('checkbox', 'assets/images/checkbox.png', 40, 40);

        this.load.atlas('bases', 'assets/images/bases.png', 'assets/images/bases.json');

        this.load.image('slot', 'assets/images/slot.png');
        this.load.image('thumbnail_frame_magic', 'assets/images/thumbnail_frame_magic.png');

        this.load.image('config', 'assets/images/config.png');

        this.load.spritesheet('arrow', 'assets/images/arrow.png', 141, 141);
        this.load.spritesheet('turnIndicator', 'assets/images/turnIndicator.png', 198, 38);

        this.load.spritesheet('tokens', 'assets/images/tokens.png', 72, 72);

        for(var elementName in CCG.Data.Elements) {
            this.load.image(CCG.Data.Elements[elementName].image, CCG.Data.Elements[elementName].image);
            this.load.image(CCG.Data.Elements[elementName].backgroundRight, CCG.Data.Elements[elementName].backgroundRight);
            this.load.image(CCG.Data.Elements[elementName].backgroundLeft, CCG.Data.Elements[elementName].backgroundLeft);
        }

        this.load.image('bar_blue', 'assets/images/bar_blue.png');
        this.load.image('bar_red', 'assets/images/bar_red.png');
        this.load.image('bar_green', 'assets/images/bar_green.png');
        this.load.image('bg shadow', 'assets/images/bg shadow.png');

        this.load.bitmapFont('kalibers', 'assets/fonts/kalibers.png', 'assets/fonts/kalibers.fnt');
        this.load.bitmapFont('mishmash', 'assets/fonts/mishmash.png', 'assets/fonts/mishmash.fnt');
        this.load.bitmapFont('vampire', 'assets/fonts/vampire.png', 'assets/fonts/vampire.fnt');

        for(var i = 0; i < CCG.Data.Cards.length; i++){
            this.load.image(CCG.Data.Cards[i].image, CCG.Data.Cards[i].image);
        }

        this.load.atlas('door', 'assets/images/door.png', 'assets/images/door.json');
        this.load.atlas('Magic Left', 'assets/images/Magic Left.png', 'assets/images/Magic Left.json');
        this.load.atlas('Magic Right', 'assets/images/Magic Right.png', 'assets/images/Magic Right.json');

        this.load.image('optionsBG', 'assets/images/optionsBG.png');
        this.load.image('pregameBG', 'assets/images/pregameBG.png');

        this.load.image('Blue PlayerHolderL', 'assets/images/Blue PlayerHolderL.png');
        this.load.image('Green PlayerHolderL', 'assets/images/Green PlayerHolderL.png');
        this.load.image('Red PlayerHolderL', 'assets/images/Red PlayerHolderL.png');

        this.load.image('Blue PlayerHolderR', 'assets/images/Blue PlayerHolderR.png');
        this.load.image('Green PlayerHolderR', 'assets/images/Green PlayerHolderR.png');
        this.load.image('Red PlayerHolderR', 'assets/images/Red PlayerHolderR.png');

        this.load.image('slotBlue', 'assets/images/slotBlue.png');
        this.load.image('slotRed', 'assets/images/slotRed.png');
        this.load.image('slotGreen', 'assets/images/slotGreen.png');

        this.load.spritesheet('slotSelector', 'assets/images/slotSelector.png', 121, 23);

        this.load.image('particle_blue', 'assets/images/particle_blue.png');
        this.load.image('particle_green', 'assets/images/particle_green.png');
        this.load.image('particle_red', 'assets/images/particle_red.png');

        this.load.image('attack_blue', 'assets/images/attack_blue.png');
        this.load.image('attack_green', 'assets/images/attack_green.png');
        this.load.image('attack_red', 'assets/images/attack_red.png');

        this.load.image('winBG', 'assets/images/winBG.png');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
        var self=this;

        if (!this.ready)
        {
            if (self.cache.isSoundDecoded('main_menu'))
            {
                this.ready = true;

                this.state.start('Splash');
            }
        }

        //TODO eliminar los assets del preload
        //this.state.start('Splash');
        //this.state.start('Game');
	}

};
