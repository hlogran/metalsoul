BasicGame.Map = function (game) {
};

BasicGame.Map.prototype = {

    init: function (params) {
        if(params===undefined){
            this.updateStats = false;
        }
        else{
            this.updateStats = true;
            this.earnedMoney = params.earnedMoney;
            this.earnedExperience= params.earnedExperience;
            this.clearedLevel = params.clearedLevel;
        }
    },

    create: function () {
        var self = this;

        this.firstRender = true;
        var cardPlaceHolderSide = 120;

        this.map = this.add.sprite(config.game_half_width, config.game_half_height, 'map');
        this.map.anchor.set(0.0, 0.0);
        this.map.x = -this.map.width / 2 + config.game_half_width;
        this.map.y = -this.map.height / 2 + config.game_half_height;
        this.map.inputEnabled = true;
        this.map.input.enableDrag();
        this.map.checkWorldBounds = true;

        function CardPlaceHolder(){
            var phSpt = new Phaser.Sprite( self.game, 0, 0, "placeholder");
            phSpt.anchor.set(0.5, 1);
            self.game.world.addChild(phSpt);
            return phSpt;
        }

        var spaceInBetween = (config.game_width - cardPlaceHolderSide * 5) / 6;
        var x = (cardPlaceHolderSide/2 + spaceInBetween);

        var phs = [];

        for(var i = 0; i < 5; i++){
            var ph = new CardPlaceHolder();
            ph.x = x + i * (ph.width + spaceInBetween);
            ph.y = self.game.height;
            phs.push(ph);
        }

        var levelBar = this.add.sprite(0, 0, 'levelBar');
        this.levelGauge = this.add.sprite(100, 100, 'levelGauge');
        this.moneyBar = this.add.sprite(200, 200, 'moneyBar');

        this.moneyBar.anchor.set(0.5, 0.5);
        this.moneyBar.x = this.moneyBar.width/2 + 20;
        this.moneyBar.y = this.moneyBar.height/2 + 30;

        levelBar.anchor.set(0.5, 0.5);
        levelBar.x = this.moneyBar.width/2 + 250;
        levelBar.y = this.moneyBar.y - 6;

        this.levelGauge.anchor.set(0, 0.5);
        this.levelGauge.x = levelBar.x - 56;
        this.levelGauge.y = levelBar.y + 1;

        //calculo el ancho
        var f = (player.experience - player.getExperienceToLevel(player.level) )/(player.getExperienceToLevel(player.level+1) - player.getExperienceToLevel(player.level))
        this.levelGauge.fullWidth = this.levelGauge.width;
        this.levelGauge.cropRect = new Phaser.Rectangle(0, 0, this.levelGauge.fullWidth *f, this.levelGauge.height );
        this.levelGauge.updateCrop();

        var lblMoney = this.lblMoney = self.game.add.bitmapText(this.moneyBar.width/2-12, -4, 'kalibers', player.money.toString(), 21);
        lblMoney.anchor.set(1, 0.5);

        this.moneyBar.addChild(lblMoney);

        this.lblLevel = self.game.add.bitmapText(levelBar.x-levelBar.width/2+35, levelBar.y, 'kalibers', player.level.toString(), 31);
        this.lblLevel.tint = "0xffffff";
        this.lblLevel.anchor.set(0.5, 0.5);

        this.checkboxes = [];
        for(var i = 0; i < 5; i++){
            var card = player.cards[i];
            if(card.id > -1){

                var cardObject = new myFramework.Card(this.game, phs[i].x, phs[i].y, card.id, card.level, myFramework.CardDisplayType.PORTRAIT);
                cardObject.index = i;
                //anulo el zoom a las cartas del jugador
                (function(c){
                    c.onThumbnailClick(function(){
                        self.zoomCard.call(self, c);
                    });
                }(cardObject));

                var phElement;

                switch (cardObject.element){
                    case CCG.Data.Elements.WATER:
                        phElement = new Phaser.Sprite(self.game, phs[i].x, phs[i].y, "slotBlue");
                        break;
                    case CCG.Data.Elements.GRASS:
                        phElement = new Phaser.Sprite(self.game, phs[i].x, phs[i].y, "slotGreen");
                        break;
                    case CCG.Data.Elements.FIRE:
                        phElement = new Phaser.Sprite(self.game, phs[i].x, phs[i].y, "slotRed");
                        break;
                }

                phElement.anchor.set(0.5, 1.0);

                this.game.world.add(phElement);

                //agrego el checkbox
                if(card.selected){
                    var count = 0;
                    self.checkboxes.forEach(function(e){
                        if(e.frame==1){
                            count++;
                        }
                    });
                    if(count>=3) {
                        card.selected = false;
                    }
                }

                var checkbox = new Phaser.Sprite( self.game, 0, 0, "slotSelector", card.selected ? 1: 0 );
                checkbox.x = phs[i].x - phs[i].width/2;  // + phs[i].width/2 - checkbox.width;
                checkbox.y = phs[i].y - phs[i].height; // + phs[i].height/2 - checkbox.height;
                checkbox.inputEnabled = true;
                //checkbox.card = cardObject;

                (function(chk, crd){
                    chk.events.onInputDown.add(
                        function() {
                            if (chk.frame == 1) {
                                var hayMasChequeados = false;
                                self.checkboxes.forEach(function(e){
                                    if(e != chk && e.frame==1){
                                        hayMasChequeados=true;
                                    }
                                });
                                if(hayMasChequeados) {
                                    chk.frame = 0;
                                    crd.selected = false;
                                }
                            }
                            else{
                                var count = 0;
                                self.checkboxes.forEach(function(e){
                                    if(e.frame==1){
                                        count++;
                                    }
                                });
                                if(count<3) {
                                    chk.frame = 1;
                                    crd.selected = true;
                                }
                                else{
                                    self.dialog("Solo puede seleccionar 3 cartas a la vez" );
                                }
                            }
                        }
                    );
                }(checkbox, card))


                if(cardObject.portraitData.height > (phs[i].height - checkbox.height)){
                    var scale = (phs[i].height - checkbox.height) / cardObject.portraitData.height;
                    cardObject.portrait.scale.set(scale,scale);
                }

                cardObject.portrait.y -=cardObject.portrait.height/2;
                this.game.world.add(cardObject);
                self.checkboxes.push(checkbox);
                this.game.world.add(checkbox);
            }
        }

        //agrego pins
        var nextLevel = -1;
        this.pins = [];
        for(var i = 0; i < encounters.length; i++){
			console.log(1);
            var pin = new Phaser.Sprite(self.game, encounters[i].x, encounters[i].y, 'bases');
			console.log(2);
            pin.animations.add('unavailable', [0], 60, false);
			console.log(3);
            pin.animations.add('available', [1], 60, false);
			console.log(4);
            pin.animations.add('cleared', [2], 60, false);
			console.log(5);

            switch(encounters[i].status){
                case AVAILABLE:
                    pin.animations.play("available");
                    break;
                case UNAVAILABLE:
                    pin.animations.play("unavailable");
                    if(nextLevel == -1) {nextLevel = i-1};
                    break;
                case CLEARED:
                    pin.animations.play("cleared");
                    break;
            }
            pin.animations.currentAnim.setFrame( pin.animations.currentAnim.frameTotal-1, true );
            pin.anchor.set(0.5, 1);
            pin.inputEnabled=true;
            pin.input.priorityID = 1;

            (function(_pin, _encounterId) {
                _pin.events.onInputUp.add(function() {
                    if(encounters[_encounterId].status!=UNAVAILABLE ){
                        self.playGame(_encounterId);
                    }
                });
            })(pin, i)
            this.pins.push(pin);
            this.map.addChild(pin);
        }

        if(nextLevel > -1){
            this.map.x = -encounters[nextLevel].x + config.game_half_width;
            this.map.y = -encounters[nextLevel].y + config.game_half_height;
        }
        else{
            this.map.x = -encounters[encounters.length-1].x + config.game_half_width;
            this.map.y = -encounters[encounters.length-1].y + config.game_half_height;
        }

        var configButton = this.add.sprite(0, 0, 'config');
        configButton.y = 5;
        configButton.x = this.game.width - configButton.width -5;
        configButton.inputEnabled = true;
        configButton.events.onInputDown.add( function(){self.pause.call(self);})

        //transicion
        this.game.transition("open");

    },


    update: function () {
        if(this.map.x > 0) this.map.x = 0;
        if(this.map.y > 0) this.map.y = 0;
        if(this.map.x < this.game.width - this.map.width) this.map.x = this.game.width - this.map.width;
        if(this.map.y < this.game.height - this.map.height) this.map.y = this.game.height - this.map.height;
        //	Do some nice funky main menu effect here
    },

    render: function() {
        if(this.firstRender){
            this.firstRender = false;
            return;
        }

        var self = this;

        var startedTweens = 0; //guarda la cantidad de tweens iniciados
        var completedTweens = 0; //guarda la cantidad de tweens finalizados

        //función que maneja la finalizacion de los tweens
        function onTweenCompleted(){
            completedTweens++;
            if(completedTweens == startedTweens){
                self.game.saveGame();
            }
        }

        if(this.updateStats){

            this.map.x = -encounters[self.clearedLevel].x + config.game_half_width;
            this.map.y = -encounters[self.clearedLevel].y + config.game_half_height;

            //agrego el dinero
            var current = {value: player.money};
            player.money = player.money + this.earnedMoney;

            startedTweens++;
            var tweenMoney = self.game.add.tween(current).to({value: player.money}, 400, null, true, 200);
            tweenMoney.onUpdateCallback(function(){
                self.lblMoney.setText( Math.floor(current.value).toString() );
            }, self);
            tweenMoney.onComplete.add(
                function(){
                    //sumamos la experiencia
                    startedTweens++;
                    var tweenExp = self.game.add.tween(player).to({experience: player.experience + self.earnedExperience}, 400, null, true, 200);
                    tweenExp.onUpdateCallback(function(){
                        var currentLevel = player.level;
                        var nextLevelExp = player.getExperienceToLevel(player.level + 1);
                        if(player.experience >= nextLevelExp){
                            currentLevel = player.level = currentLevel = player.level + 1;
                            self.lblLevel.setText(currentLevel.toString());
                        }
                        var f = (player.experience - player.getExperienceToLevel(player.level) )/(player.getExperienceToLevel(player.level+1) - player.getExperienceToLevel(player.level))
                        self.levelGauge.cropRect = new Phaser.Rectangle(0, 0, self.levelGauge.fullWidth *f, self.levelGauge.height );
                        self.levelGauge.updateCrop();

                    }, self);

                    tweenExp.onComplete.add(
                        function(){
                            //paso al siguiente nivel
                            console.log('self.clearedLevel', self.clearedLevel);
                            if(encounters[self.clearedLevel].status != CLEARED){
                                encounters[self.clearedLevel].status = CLEARED;
                                self.pins[self.clearedLevel].animations.getAnimation('cleared').onComplete.add(function(){
                                    if(self.clearedLevel < encounters.length -1){
                                        if(encounters[self.clearedLevel+1].status != CLEARED){
                                            startedTweens++;
                                            var tweenMove = self.game.add.tween(self.map).to({x: -encounters[self.clearedLevel+1].x + config.game_half_width, y: -encounters[self.clearedLevel+1].y + config.game_half_height}, 1000, null, true, 200);
                                            tweenMove.onComplete.add(
                                                function(){
                                                    if(encounters[self.clearedLevel+1].status != AVAILABLE) {
                                                        encounters[self.clearedLevel + 1].status = AVAILABLE;
                                                        self.pins[self.clearedLevel + 1].animations.play('available');
                                                    }
                                                    onTweenCompleted();
                                                }
                                            )
                                        }
                                    }
                                });
                                self.pins[self.clearedLevel].animations.play('cleared');
                            }
                            onTweenCompleted();
                        }
                    );
                    onTweenCompleted();
                }
            )
            self.updateStats = false;
        }
    },

    playGame: function(encounterId){

        //this.game.SoundManager1.stopAllMusic();
        this.game.SoundManager1.playMusic("choosing", true);

        var self = this;
        var grp = self.game.add.group();

        var bgData = new Phaser.BitmapData(self.game, 'bgData', this.game.width, this.game.height);
        bgData.fill(0, 0, 0);
        var bg = self.game.add.sprite(0, 0, bgData,"", grp);
        bg.alpha = 0.75;
        bg.inputEnabled=true;

        self.pins.forEach(function(pin){pin.inputEnabled=false});

        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, 'pregameBG');
        innerBg.anchor.set(0.5, 0.5);
        grp.addChild(innerBg);

        var lblTitle = new Phaser.BitmapText(this.game, this.game.width / 2, 80, 'kalibers', encounters[encounterId].title, 45);
        lblTitle.anchor.set(0.5, 0.5);
        grp.addChild(lblTitle);

        var lblDescription = new Phaser.BitmapText(this.game, this.game.width / 2, 180, 'vampire', encounters[encounterId].description, 19);
        lblDescription.maxWidth=260;
        lblDescription.anchor.set(0.5, 0.5);
        grp.addChild(lblDescription);

        function addPortraits(cards, side /*0 for left, 1 for right*/){
            var INITIAL_Y = innerBg.y-innerBg.height/2+115;
            var x = side == 0 ? innerBg.x-innerBg.width/2+2 : innerBg.x+innerBg.width/2-2;
            var y = INITIAL_Y;
            var index = 0;

            for(var i = 0; i < cards.length; i++){
                var card = new myFramework.Card(self.game, x, y, cards[i].id, 1, 0);
                var img = null;
                switch(card.element){
                    case CCG.Data.Elements.GRASS:
                        img = side == 0 ? 'Green PlayerHolderR' : 'Green PlayerHolderL';
                        break;
                    case CCG.Data.Elements.FIRE:
                        img = side == 0 ? 'Red PlayerHolderR' : 'Red PlayerHolderL'
                        break;
                    case CCG.Data.Elements.WATER:
                        img = side == 0 ? 'Blue PlayerHolderR' : 'Blue PlayerHolderL'
                        break;
                }

                var holder = new Phaser.Sprite(self.game, x, y, img);
                grp.addChild(holder);
                var p = new Phaser.Sprite(self.game, x, y, card.image);

                p.anchor.set(0.50, 0.50)

                if(side==0){
                    p.x += p.width/2 + index*40;
                }
                else {
                    holder.anchor.set(1, 0);
                    p.x -= p.width/2 + index*40;
                }
                p.y += holder.height/3;

                if(side==0)
                    if(card.headingRight) p.scale.x = -1;
                else
                    if(!card.headingRight) p.scale.x = -1;

                grp.addChild(p);
                y += 115;
                index++;
            }
        }

        //player portraits
        var selectedCards = []
        for(var i = 0; i <5; i++){
            if(player.cards[i].id > -1){
                if(self.checkboxes[i].frame==1){
                    selectedCards.push({id: player.cards[i].id, level: player.cards[i].level});
                }
            }
        }
        addPortraits(selectedCards, 0);
        addPortraits(encounters[encounterId].enemies[0], 1);

        var btnPlay = grp.addChild(new Phaser.Button(this.game, this.game.width/2, innerBg.y + innerBg.height/2 - 120, 'btnPregamePlay', play, this, 0, 1, 2));
        var btnBack = grp.addChild(new Phaser.Button(this.game, this.game.width/2, innerBg.y + innerBg.height/2-60, 'btnPregameBack',
            function(){
                self.pins.forEach(function(pin){
                    pin.inputEnabled=true;
                    pin.input.priorityID = 1;
                });
                grp.destroy(true);
                //self.game.SoundManager1.stopAllMusic();
                self.game.SoundManager1.playMusic("main_menu", true);

            }, this, 0, 1, 2));

        btnPlay.anchor.set(0.5, 0.5);
        btnBack.anchor.set(0.5, 0.5);

        function play(){
            self.game.transition("close", function(){
                //self.game.SoundManager1.stopAllMusic();
                self.game.SoundManager1.playMusic("in_game", true);
                self.game.state.start('Game', true, false, {level: encounterId, cards: selectedCards});
            });
        }
    },

    dialog: function(text){
        var self = this;
        var grp = self.game.add.group();

        var bgData = new Phaser.BitmapData(self.game, 'bgData', this.game.width, this.game.height);
        bgData.fill(0, 0, 0);
        var bg = self.game.add.sprite(0, 0, bgData,"", grp);
        bg.alpha = 0.75;
        bg.inputEnabled=true;

        var innerBgData = new Phaser.BitmapData(this.game, 'innerBgData', this.game.width * 0.4, this.game.height * 0.4);
        innerBgData.fill(255, 213, 137);
        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, innerBgData);
        innerBg.anchor.set(0.5, 0.5);
        grp.addChild(innerBg);

        innerBg.top = innerBg.y - innerBg.height/2;

        var lbl = new Phaser.Text(self.game, self.game.width/2, innerBg.top + innerBg.height*1/5, text, { font: "bold 20px Arial" , fill: 'black'}, grp);
        lbl.anchor.set(0.5, 0);
        lbl.wordWrap = true;
        lbl.wordWrapWidth = innerBg.width;
        grp.add(lbl);

        //boton salir
        var btnBack = new myFramework.Button(self.game, "OK", 'btnOrange', self.game.width/2, innerBg.top + innerBg.height*4/5, function(){
            self.pins.forEach(function(pin){
                pin.inputEnabled=true;
                pin.input.priorityID = 1;
            });
            grp.destroy(true);
        } );
        grp.addChild(btnBack);
    },

    pause: function(){
        var self = this;
        var grp = self.game.add.group();

        var bgData = new Phaser.BitmapData(self.game, 'bgData', this.game.width, this.game.height);
        bgData.fill(0, 0, 0);
        var bg = self.game.add.sprite(0, 0, bgData,"", grp);
        bg.alpha = 0.75;
        bg.inputEnabled=true;

        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, 'optionsBG');
        innerBg.anchor.set(0.5, 0.5);
        grp.addChild(innerBg);

        innerBg.top = innerBg.y - innerBg.height/2;

        self.pins.forEach(function(pin){pin.inputEnabled=false});
        //boton musica
        var btnMusic = new myFramework.Button(self.game, self.game.SoundManager1.musicMuted ? "Music OFF" : "Music ON", 'btnBlue', self.game.width/2, innerBg.top + innerBg.height*1/5 , function(){
            self.game.SoundManager1.toggleMusicMuted();
            this.setText(self.game.SoundManager1.musicMuted ? "Music OFF" : "Music ON");
        } );
        grp.addChild(btnMusic);

        //boton sonido
        var btnSound = new myFramework.Button(self.game, self.game.SoundManager1.sfxMuted ? "Sound OFF" : "Sound ON", 'btnBlue', self.game.width/2, innerBg.top + innerBg.height*2/5, function(){
            self.game.SoundManager1.toggleSfxMuted();
            this.setText(self.game.SoundManager1.sfxMuted ? "Sound OFF" : "Sound ON");
        } );
        grp.addChild(btnSound);

        //boton menu
        var btnMenu = new myFramework.Button(self.game, "Volver al Menu", 'btnBlue', self.game.width/2, innerBg.top + innerBg.height*3/5 , function(){
            self.game.state.start('MainMenu', true, false);
        } );
        grp.addChild(btnMenu);

        //boton salir
        var btnBack = new myFramework.Button(self.game, "Salir", 'btnOrange', self.game.width/2, innerBg.top + innerBg.height*4/5, function(){
            self.pins.forEach(function(pin){
                pin.inputEnabled=true;
                pin.input.priorityID = 1;
            });
            grp.destroy(true);
        } );
        grp.addChild(btnBack);

    },

    zoomCard: function(cardObject){
        var self = this;


        self.pins.forEach(function(pin){
            pin.inputEnabled=false;
        });

        var grp = self.game.add.group();

        var zoomedBgData = new Phaser.BitmapData(this.game, 'zoomedBg', this.game.width, this.game.height);
        zoomedBgData.fill(0, 0, 0);

        var zoomedBg = this.game.add.sprite(0, 0, zoomedBgData,"", grp);
        zoomedBg.alpha = 0.7;
        zoomedBg.inputEnabled=true;

        this.moneyBar.bringToTop();

        //muestro la carta
        var WIDTH = 600;
        var HEIGHT = 400;

        self.game.world.add(cardObject.card);
        cardObject.card.scale.x =  cardObject.card.scale.y = 0.8;
        cardObject.card.x = (self.game.width-WIDTH)/2 + cardObject.card.width/2;
        cardObject.card.y = (self.game.height-HEIGHT)/2  + cardObject.card.height/2;

        //boton level up
        var lbl;
        var btn;
        var cost = cardObject.nextLevel;
        if(player.money < cost){
            btn = new Phaser.Button(self.game, (self.game.width-WIDTH)/2+WIDTH, (self.game.height-HEIGHT)/2, "btnLevelup", function(){}, self, 3, 3, 3, 3);
            lbl = new Phaser.BitmapText(self.game, 600, 198, 'kalibers', cardObject.nextLevel.toString(), 22);
            lbl.anchor.set(0.5, 0.5);
            lbl.tint = "0xFF0000";
            btn.anchor.set(1, 0);
            grp.add(btn);
            grp.add(lbl);
        }
        else{
            btn = self.add.button( (self.game.width-WIDTH)/2+WIDTH, (self.game.height-HEIGHT)/2, "btnLevelup", function(){
                player.money = player.money - cardObject.nextLevel;
                cardObject.LevelUp.call(cardObject);
                player.cards[cardObject.index].level = cardObject.cardLevel;
                self.game.world.remove(cardObject.card);
                self.game.world.add(cardObject.card);
                self.game.input.enable = false;
                var current = {value: player.money};
                var tweenMoney =  self.game.add.tween(current).to({value: player.money}, 200, null, true, 0);
                tweenMoney.onUpdateCallback(function(){
                    self.lblMoney.text = Math.floor(current.value) ;
                }, self);
                tweenMoney.onComplete.add(function(){
                    btnSalir.onInputUp.dispatch();
                    self.zoomCard(cardObject);
                    self.game.input.enable = true;
                });
            }, self, 0, 1, 2, 0, grp);

            lbl = new Phaser.BitmapText(self.game, 600, 198, 'kalibers', cardObject.nextLevel.toString(), 22);
            lbl.anchor.set(0.5, 0.5);
            lbl.tint = "0x00FF00";
            btn.anchor.set(1, 0);
            grp.add(lbl);
        }


        //checkbox
        var checkbox = new Phaser.Sprite( self.game, btn.x-btn.width, self.game.height/2, "checkbox", player.cards[cardObject.index].selected ? 1: 0 );
        checkbox.inputEnabled = true;
        checkbox.events.onInputDown.add(function(){
            self.checkboxes[cardObject.index].events.onInputDown.dispatch();
            checkbox.frame = self.checkboxes[cardObject.index].frame;
        });
        grp.add(checkbox);

        var lblc = new Phaser.BitmapText(self.game, checkbox.x+checkbox.width, checkbox.y+checkbox.height/2, 'kalibers', "SELECIONADA", 26);
        lblc.anchor.set(0.0, 0.5);
        grp.add(lblc);

        //boton salir
        var btnSalir = new Phaser.Button(self.game, (self.game.width-WIDTH)/2+WIDTH, (self.game.height-HEIGHT)/2+HEIGHT, 'btnBack', function(){

            self.pins.forEach(function(pin){
                pin.inputEnabled=true;
                pin.input.priorityID = 1;
            });

            grp.destroy(true);
            self.game.world.remove(cardObject.card);
            self.game.world.remove(btnSalir);
        }, self, 0, 1, 2, 0, grp);
        btnSalir.anchor.set(1, 1);
        self.game.world.add(btnSalir);
    }
};