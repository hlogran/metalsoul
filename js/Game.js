
var marginTop = 20;
BasicGame.Game = function (game) {
};

BasicGame.Game.prototype = {

    init: function (params) {
        var topMargin = 31;
        var spaceInbetween = 19;

        if(params == undefined) return;

        this.cards = params.cards;
        this.level = params.level;
        this.player = {};
        this.player.cards = [];
        this.cpu = {};
        this.cpu.cards = [];

        this.playerCardPositions = [
            {x: 60, y: topMargin + this.game.height/2 - this.game.cache.getImage(CCG.Data.Elements[Object.keys(CCG.Data.Elements)[0]].backgroundLeft).height - spaceInbetween},
            {x: 60, y: topMargin + this.game.height/2},
            {x: 60, y: topMargin + this.game.height/2 + this.game.cache.getImage(CCG.Data.Elements[Object.keys(CCG.Data.Elements)[0]].backgroundLeft).height + spaceInbetween}
        ];

        this.enemyCardPositions = [
            {x: this.game.width - this.playerCardPositions[0].x, y: this.playerCardPositions[0].y},
            {x: this.game.width - this.playerCardPositions[1].x, y: this.playerCardPositions[1].y},
            {x: this.game.width - this.playerCardPositions[2].x, y: this.playerCardPositions[2].y}
        ];
    },

    addBars: function(card){
        var self = this;

        //hardcode (perdón!)
        var lifeBarX = 130;
        var defenseBarX = 145;
        var magicBarX = 160;

        var barBg = new Phaser.BitmapData(this.game, '', 75, 10);
        barBg.fill(0, 0, 0);

        //funcion que agrega las barras de energía a las cartas
        card.defense = card.maxDefense;
        card.magic = 0;
        card.life = card.maxLife;

        card.magicFrame.visible = false;

        card.lifeBar = self.game.add.sprite(lifeBarX, 0, 'bar_red');
        card.defenseBar = self.game.add.sprite(defenseBarX, 0, 'bar_blue');
        card.magicBar = self.game.add.sprite(magicBarX, 0, 'bar_green');

        card.lifeBar.y = card.y + card.lifeBar.height * 1.4;
        card.defenseBar.y = card.y;
        card.magicBar.y = card.y - card.magicBar.height * 1.4;

        card.lifeBar.anchor.set(card.background.anchor.x, 0.5);
        card.defenseBar.anchor.set(card.background.anchor.x, 0.5);
        card.magicBar.anchor.set(card.background.anchor.x, 0.5);

        if(card.lifeBar.anchor.x == 1) {
            card.lifeBar.x = self.game.width-magicBarX;
            card.defenseBar.x = self.game.width-defenseBarX;
            card.magicBar.x = self.game.width-lifeBarX;
        }

        card.lifeBar.fullWidth = 46;//card.lifeBar.width;
        card.defenseBar.fullWidth = 46;//card.defenseBar.width;
        card.magicBar.fullWidth = 46;//card.magicBar.width;

        function addMask(bar){
            var mask = bar.mask = self.game.add.graphics(bar.x - (bar.anchor.x==1 ? bar.width:0), bar.y - bar.height/2);
            mask.beginFill(0xFFFFFF);
            mask.moveTo(13,0);
            mask.lineTo(59, 0);
            mask.lineTo(46, 29);
            mask.lineTo(0, 29);
            mask.endFill();
            mask.originalX = mask.x;
        }

        addMask(card.lifeBar);
        addMask(card.defenseBar);
        addMask(card.magicBar);

        card.magicBar.mask.x = card.magicBar.mask.originalX + (card.magicBar.fullWidth) * (card.magicBar.anchor.x == 0 ? -1 : 1);
        
        card.lifeBar.lbl = self.game.add.bitmapText(card.lifeBar.x+10, card.lifeBar.y-card.lifeBar.height/2, 'kalibers', card.life + '/' + card.maxLife, 16);

        card.defenseBar.lbl = self.game.add.bitmapText(card.defenseBar.x+10, card.defenseBar.y-card.defenseBar.height/2, 'kalibers', card.defense + '/' + card.maxDefense, 16);

        card.magicBar.lbl = self.game.add.bitmapText(card.magicBar.x+10, card.magicBar.y-card.magicBar.height/2, 'kalibers', card.magic + '/' + card.maxMagic, 16);

        card.lifeBar.lbl.y -= card.lifeBar.lbl.height+1;
        card.defenseBar.lbl.y -= card.defenseBar.lbl.height+1;
        card.magicBar.lbl.y -= card.magicBar.lbl.height+1;

        card.lblName = self.game.add.bitmapText(card.background.x, card.background.y+card.background.height/2-2, 'kalibers', card.name, 20);
        card.lblLevel = self.game.add.bitmapText(card.background.x, card.background.y-card.background.height/2+2, 'vampire', 'LVL.' + card.cardLevel, 21);

        card.lblName.y -= card.lblName.height+3;
        card.lblLevel.y -= card.lblLevel.height+1;


        if(card.lifeBar.anchor.x == 1) {
            card.lifeBar.lbl.x -= card.lifeBar.width;
            card.defenseBar.lbl.x -= card.defenseBar.width;
            card.magicBar.lbl.x -= card.magicBar.width;
            card.lblName.x = self.game.width - card.lblName.width;
            card.lblLevel.x = self.game.width - card.lblLevel.width;
        }
    },

    setRound: function(callback){
        var self = this;

        var lblTitle = new Phaser.BitmapText(this.game, this.game.width / 2, this.game.height / 2, 'kalibers', "WAVE " + (self.round+1), 100);

        lblTitle.anchor.set(0.5, 0.5);
        self.game.world.add(lblTitle);

        if(self.round>0){
            this.cpu.cards.forEach(function(card){
                self.game.world.remove(card);
                card.lifeBar.lbl.destroy(true);
                card.defenseBar.lbl.destroy(true);
                card.magicBar.lbl.destroy(true);
                card.magicBar.mask.destroy(true);
                card.lifeBar.mask.destroy(true);
                card.defenseBar.mask.destroy(true);
                card.lifeBar.destroy(true);
                card.defenseBar.destroy(true);
                card.magicBar.destroy(true);
                card.lblName.destroy(true);
                card.lblLevel.destroy(true);

                card.background.destroy(true);
            });
            while(this.cpu.cards.length>0){
                this.cpu.cards.pop();
            }

        }

        self.game.add.tween(lblTitle).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
            if(self.round>0){
                self.addEnemyCards(callback);
            }
            if(self.round>0) {
                //actualizo el estado de las barras de energía de todas las cartas
                self.updateBars(callback);
            }
        });


        self.waveCounter.text = (Number(self.round)+1) + '/' + encounters[self.level].enemies.length;

    },

    addEnemyCards: function(callback){
        var self = this;
        for(var i = 0; i < encounters[self.level].enemies[self.round].length; i++){
            var card = new myFramework.Card(self.game, self.enemyCardPositions[i].x, self.enemyCardPositions[i].y, encounters[self.level].enemies[self.round][i].id, encounters[self.level].enemies[0][i].level, myFramework.CardDisplayType.PORTRAIT);

            card.background = new Phaser.Sprite(this.game, this.game.width, self.enemyCardPositions[i].y, card.element.backgroundRight);
            card.background.anchor.set(1, 0.5);
            self.game.world.add(card.background);

            card.magicFrame = new Phaser.Sprite(this.game, this.game.width+11, self.enemyCardPositions[i].y-4, "Magic Right");

            card.magicFrame.animations.add('anim', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6, false);
            card.magicFrame.play('anim', 6, true, false);
            card.magicFrame.anchor.set(1, 0.5);
            self.game.world.add(card.magicFrame);

            self.game.world.add(card);
            self.addBars(card);
            self.cpu.cards.push(card);

            card.x = self.game.width - 2 - card.portrait.width/2;
            card.y = card.background.y+card.background.height/2 - 10 - card.portrait.height/2;

            if(!card.headingRight) card.portrait.scale.x = -1;
        }
    },

    create: function () {
        var self = this;

        this.stage.backgroundColor = '#555555';

        var shadows = [];

        shadows.push(self.game.add.sprite(0,self.playerCardPositions[0].y,"bg shadow"));
        shadows.push(self.game.add.sprite(0,self.playerCardPositions[1].y,"bg shadow"));
        shadows.push(self.game.add.sprite(0,self.playerCardPositions[2].y,"bg shadow"));

        shadows.forEach(function(shadow){
           shadow.anchor.y = 0.5;
        });



        //seteo los managers
        MagicManager.Initialize(this, this.game.SoundManager1);
        ParticleManager.initialize(this.game, this.game.SoundManager1);

        //creo el tablero de juego
        this.gameBoard = new myFramework.GameBoard(this.game, this.game.width/2, this.game.height/2, 6, 5, encounters[self.level].noElements);
        this.game.world.add(this.gameBoard);
        this.gameBoard.processPlayersTurn = function(selection){
            self.setInputEnabled(false);
            self.processSeleccion(selection, self.player, self.cpu, function(){
                    self.playCPU();
                    self.playerTurnIndicator.frame = 0;
                    self.cpuTurnIndicator.frame = 1;
                    self.playerTurnIndicator.lbl.tint = "0x333333";
                    self.cpuTurnIndicator.lbl.tint = "0xFFFFFF";
                }
            );
        };
        self.gameBoard.clearArrows();

        //objeto que activa o desactiva el input en el juego
        var bmpInputFilter = new Phaser.BitmapData(this.game, '', this.game.width, this.game.height);
        bmpInputFilter.fill(0, 0, 0, 0);
        this.inputFilter = this.game.add.sprite(0, 0, bmpInputFilter);
        this.inputFilter.inputEnabled=false;

        this.gameOver = false;
        this.paused = false;

        var configButton = this.add.sprite(0, 0, 'config');
        configButton.y = 5;
        configButton.x = this.game.width - configButton.width -5;
        configButton.inputEnabled = true;
        configButton.events.onInputDown.add( function(){self.pause.call(self)} );

        //creo el contador de waves
        this.waveCounter = self.game.add.bitmapText(configButton.x - configButton.width-40, configButton.y, 'kalibers', '800');
        this.waveCounter.scale.set(1.4, 1.4);

        this.playerTurnIndicator = self.game.add.sprite(0, self.game.height, "turnIndicator", 1);
        this.playerTurnIndicator.anchor.set(0, 1);
        this.playerTurnIndicator.lbl = self.game.add.bitmapText(this.playerTurnIndicator.width-85, self.game.height - this.playerTurnIndicator.height+14, 'mishmash', 'TURN', 25);

        this.cpuTurnIndicator = self.game.add.sprite(self.game.width, self.game.height, "turnIndicator", 0);
        this.cpuTurnIndicator.anchor.set(0, 1);
        this.cpuTurnIndicator.scale.x *= -1;
        this.cpuTurnIndicator.lbl = self.game.add.bitmapText(self.game.width-self.playerTurnIndicator.lbl.x-self.playerTurnIndicator.lbl.width, self.playerTurnIndicator.lbl.y, 'mishmash', 'TURN', 25);
        this.cpuTurnIndicator.lbl.tint = "0x333333";

        //creo las cartas del jugador
        for(var i = 0; i < self.cards.length; i++){
            var card = new myFramework.Card(this.game, self.playerCardPositions[i].x, self.playerCardPositions[i].y, self.cards[i].id, self.cards[i].level, myFramework.CardDisplayType.PORTRAIT);


            card.background = new Phaser.Sprite(this.game, 0, self.playerCardPositions[i].y, card.element.backgroundLeft);
            card.background.anchor.set(0, 0.5);
            self.game.world.add(card.background);

            card.magicFrame = new Phaser.Sprite(this.game, -11, self.playerCardPositions[i].y-4, "Magic Left");
            card.magicFrame.animations.add('anim', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6, false);
            card.magicFrame.play('anim', 6, true, false);
            card.magicFrame.anchor.set(0, 0.5);
            self.game.world.add(card.magicFrame);

            this.game.world.add(card);
            self.addBars(card);
            this.player.cards.push(card);
            //anulo el zoom a las cartas del jugador
            function addEvent(_card){
                _card.onThumbnailClick(function(){
                    if(_card.magic>=_card.maxMagic)
                        _card.doMagic.call(_card);
                });
            }
            addEvent(card);

            card.x = 2 + card.portrait.width/2;
            card.y = card.background.y+card.background.height/2 - 10 - card.portrait.height/2;

            if(card.headingRight) card.portrait.scale.x = -1;
        }

        //creo las cartas del cpu
        self.round = 0;
        self.addEnemyCards();

        this.setRound(function(){self.gameBoard.dropTokens()});

        this.game.transition("open");

    },

    pause: function(){
        var self = this;
        self.tweens.pauseAll();
        self.paused=true;
        var grp = self.game.add.group();

        var zoomedBgData = new Phaser.BitmapData(this.game, 'zoomedBg', this.game.width, this.game.height);
        zoomedBgData.fill(0, 0, 0);

        var zoomedBg = this.game.add.sprite(0, 0, zoomedBgData,"", grp);
        zoomedBg.alpha = 0.5;
        zoomedBg.inputEnabled=true;

        var btnPlay = grp.addChild(new Phaser.Button(this.game, this.game.width/2 - 120, this.game.height/2 - 60, 'btnPregamePlay', play, this, 0, 1, 2));
        var btnBack = grp.addChild(new Phaser.Button(this.game, this.game.width/2 + 120, this.game.height/2 - 60, 'btnBack', back, this, 0, 1, 2));

        btnPlay.anchor.set(0.5, 0.5);
        btnBack.anchor.set(0.5, 0.5);

        function play(){
            self.tweens.resumeAll();
            //self.game.world.remove(btnSalir);
            self.paused=false;
            grp.destroy(true);
        }

        function back(){
            self.paused=false;
            self.game.transition("close", function(){
                self.game.SoundManager1.playMusic("main_menu", true);
                self.game.state.start('Map', true, false);
            })
        }

    },

    setInputEnabled: function(enabled){
        this.inputFilter.inputEnabled = !enabled;
        this.game.world.bringToTop(this.inputFilter);
    },

    updateBars: function(callback){
        var self = this;
        var startedTweens = 0; //guarda la cantidad de tweens iniciados
        var completedTweens = 0; //guarda la cantidad de tweens finalizados

        //funcion que actualiza las barras de un conjunto de cartas
        function updateBarsFrom(owner){
            owner.cards.forEach(function(card){
                //barra de vida
                startedTweens++;
                card.lifeBar.lbl.text = card.life + '/' + card.maxLife;
                var newWidth = card.lifeBar.fullWidth * card.life / card.maxLife;
                var lifeTween =  self.game.add.tween(card.lifeBar.mask).to({x: card.lifeBar.mask.originalX + (card.lifeBar.fullWidth - newWidth) * (card.lifeBar.anchor.x == 0 ? -1 : 1)}, 400, Phaser.Easing.Linear.None, true, 0);
                lifeTween.onComplete.add(onTweenCompleted);
                //barra de defensa
                startedTweens++;
                card.defenseBar.lbl.text = card.defense + '/' + card.maxDefense;
                var newWidth = card.defenseBar.fullWidth * card.defense / card.maxDefense;
                var defenseTween =  self.game.add.tween(card.defenseBar.mask).to({x: card.defenseBar.mask.originalX + (card.defenseBar.fullWidth - newWidth) * (card.defenseBar.anchor.x == 0 ? -1 : 1)}, 400, Phaser.Easing.Linear.None, true, 0);
                defenseTween.onComplete.add(onTweenCompleted);
                //barra de magia
                startedTweens++;
                card.magicBar.lbl.text = card.magic + '/' + card.maxMagic;
                var newWidth = card.magicBar.fullWidth * card.magic / card.maxMagic;
                var magicTween =  self.game.add.tween(card.magicBar.mask).to({x: card.magicBar.mask.originalX + (card.magicBar.fullWidth - newWidth) * (card.magicBar.anchor.x == 0 ? -1 : 1)}, 400, Phaser.Easing.Linear.None, true, 0);
                magicTween.onComplete.add(onTweenCompleted);

                if(card.magic == card.maxMagic){
                    card.magicFrame.visible = true;
                }
                else {
                    card.magicFrame.visible = false;
                }

                if(card.life == 0) {
                    card.alpha = 0.5;
                } else {
                    card.alpha = 1;
                }
            });
        }

        updateBarsFrom(self.cpu);
        updateBarsFrom(self.player);

        function onTweenCompleted(){
            completedTweens++;
            if(completedTweens == startedTweens){
                self.checkGameOver(callback);
            }
        }
    },

    checkGameOver: function(callback){

        var win = true;
        var lose = true;

        if(this.cpu.cards.length==0) win = false;

        this.cpu.cards.forEach(function(card){
            if(card.life > 0) win = false;
        });

        this.player.cards.forEach(function(card){
            if(card.life > 0) lose = false;
        });

        if(win) {
            if(this.round == encounters[this.level].enemies.length-1){
                this.win();
            }
            else{
                this.round = this.round+1;
                this.setRound(callback);
            }
        }
        else if (lose){
            this.lose();
        }
        else{
            //si no ganó ni perdió, llamo al callback
            if(callback) {
                callback();
            }
        }
    },

    lose: function () {
        this.gameOver = true;
        var self = this;
        var grp = this.add.group();

        var bgData = new Phaser.BitmapData(this.game, 'bgData', this.game.width, this.game.height);
        bgData.fill(0, 0, 0);
        var bg = new Phaser.Sprite(this.game, 0, 0, bgData);
        grp.addChild(bg);
        bg.alpha = 0.75;
        bg.inputEnabled=true

        var innerBgData = new Phaser.BitmapData(this.game, 'innerBgData', this.game.width * 0.8, this.game.height * 0.8);
        innerBgData.fill(255, 213, 137);
        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, innerBgData);
        innerBg.anchor.set(0.5, 0.5);
        grp.addChild(innerBg);

        var lblTitle = new Phaser.Text(this.game, this.game.width / 2, 100, "Derrotado!", { font: "bold 30px Arial" , fill: 'black'});
        lblTitle.anchor.set(0.5, 0.5);
        grp.addChild(lblTitle);

        var lblDescription = new Phaser.Text(this.game, this.game.width/2, 120, "\n\n ¿Quieres intentarlo de nuevo?", { font: "bold 19px Arial" , fill: 'black'});
        lblDescription.anchor.set(0.5, 0);
        lblDescription.wordWrap = true;
        lblDescription.wordWrapWidth = this.game.width * 0.6;
        grp.addChild(lblDescription);

        var btnPlay = grp.addChild(new Phaser.Button(this.game, this.game.width/2 - 120, innerBg.y + innerBg.height/2 - 60, 'btnPregamePlay', play, this, 0, 1, 2));
        var btnBack = grp.addChild(new Phaser.Button(this.game, this.game.width/2 + 120, innerBg.y + innerBg.height/2 - 60, 'btnBack', back, this, 0, 1, 2));

        btnPlay.anchor.set(0.5, 0.5);
        btnBack.anchor.set(0.5, 0.5);

        function play(){
            self.game.transition("close", function() {
                self.game.state.start('Game', true, false, {level: self.level, cards: self.cards});
            });
        }

        function back(){
            self.game.transition("close", function() {
                self.game.state.start('Map', true, false);
            });
        }
    },

    win: function () {
        this.gameOver = true;
        var self = this;
        var grp = this.add.group();

        var bgData = new Phaser.BitmapData(this.game, 'bgData', this.game.width, this.game.height);
        bgData.fill(0, 0, 0);
        var bg = new Phaser.Sprite(this.game, 0, 0, bgData);
        grp.addChild(bg);
        bg.alpha = 0.75;
        bg.inputEnabled=true

        var innerBg = new Phaser.Sprite(this.game, this.game.width/2, this.game.height/2, 'winBG');
        innerBg.anchor.set(0.5, 0.5);
        grp.addChild(innerBg);

        var lblMoney = new Phaser.BitmapText(self.game, 520, 205, 'kalibers', encounters[self.level].money.toString(), 28);
        grp.addChild(lblMoney);

        var lblExp = new Phaser.BitmapText(self.game, 585, 234, 'kalibers', encounters[self.level].experience.toString(), 28);
        grp.addChild(lblExp);

        /**************************************/
        var player_slotslibres = 0;
        player.cards.forEach(function(c){
            if(c.id == -1){
                player_slotslibres++;
            }
        });

        if(player_slotslibres>0 && encounters[this.level].card != undefined && encounters[this.level].card!=null  && encounters[this.level].card!=-1 ){
            var card = new myFramework.Card(this.game,  innerBg.x-innerBg.width/2+510,  innerBg.y-innerBg.height/2+333, encounters[this.level].card, 1, myFramework.CardDisplayType.THUMBNAIL);
            grp.addChild(card);
            for(var i = 0; i<player.cards.length; i++){
                if(player.cards[i].id==-1) {
                    player.cards[i]={id: encounters[this.level].card, level: 1, selected: true};
                    break;
                };
            }
        }
        /**************************************/

        var btnBack = grp.addChild(new Phaser.Button(this.game, innerBg.x-innerBg.width/2+512, innerBg.y + innerBg.height/2 - 60, 'btnBack', back, this, 0, 1, 2));

        btnBack.anchor.set(0.5, 0.5);
        function back(){
            self.game.transition("close", function() {
                self.game.SoundManager1.playMusic("main_menu", true);
                self.game.state.start('Map', true, false, {clearedLevel: self.level, earnedExperience: encounters[self.level].experience, earnedMoney: encounters[self.level].money });
            });
            this.gameOver = true;
        }

        //add portraits
        addPortraits(self.cards, 0);

        function addPortraits(cards, side /*0 for left, 1 for right*/){
            var INITIAL_Y = innerBg.y-innerBg.height/2+75;
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
    },

    processSeleccion: function (slots, owner, enemy, callback) {
        var self = this;
        var type = slots[0].token.type;
        var quantityByElem = self.classifyTokens(slots);
        var particleCount = 0;
        var startedTweens = 0; //guarda la cantidad de tweens iniciados
        var completedTweens = 0; //guarda la cantidad de tweens finalizados

        //hago una copia de los slots
        var copySlots = [];
        slots.forEach(function(s){
            var copy = {token: {type: s.token.type, element: s.token.element}, box: s.box};
            copySlots.push(copy);
        })

        self.gameBoard.removeTokenFromSlots(slots);
        self.gameBoard.dropTokens();

        self.game.SoundManager1.playSfx("selection");

        slots = copySlots;

        switch (type){
            case 0: //ATAQUE
                var labels = [];
                //función que maneja la finalizacion de los tweens
                function onTweenCompleted(){
                    completedTweens++;
                    if(completedTweens == startedTweens){
                        finishProcess();
                    }
                }

                owner.cards.forEach(function(card){
                    //si la carta esta muerta, paso a la siguiente carta
                    if(card.life <= 0) return;

                    //si no hay tokens con este elemento, paso a la siguiente carta
                    if(quantityByElem[card.element.name]==0) return;

                    //obtengo el valor del ataque
                    var qAttack = config.calcAtaque(card.attack, quantityByElem[card.element.name]);

                    //selecciono el enemigo al que le voy a aplicar el daño
                    var chosenEnemies = [];
                    if(quantityByElem[card.element.name] < 5 ){
                        var chosenEnemy = self.getBestTarget(enemy.cards, qAttack, card.element);
                        if(chosenEnemy == undefined){
                            chosenEnemy = enemy.cards[0];
                        }
                        chosenEnemies.push(chosenEnemy);
                        chosenEnemy.attackResult = self.takeDamage(chosenEnemy, card.element, qAttack);
                    }
                    else{
                        enemy.cards.forEach(function(chosenEnemy){
                            if(chosenEnemy.life>0){
                                chosenEnemies.push(chosenEnemy);
                                chosenEnemy.attackResult = self.takeDamage(chosenEnemy, card.element, qAttack);
                            }
                        });
                    }

                    //creo el label que acumulará el daño a hacer
                    //var lbl = new Phaser.Text(self.game, card.x, card.y, "0", { font: "bold 40px Arial" , fill: 'black'});
                    var lbl = new Phaser.BitmapText(self.game, card.x, card.y, 'kalibers', "0", 50);


                    lbl.anchor.set(0.5, 0.5);
                    lbl.visible = false;
                    self.game.world.add(lbl);
                    labels.push(lbl);

                    lbl.events.onDestroy.addOnce(function(){
                        chosenEnemies.forEach(function(chosenEnemy){
                            //aplico el daño
                            var attackResult = chosenEnemy.attackResult; //self.takeDamage(chosenEnemy, card.element, qAttack);
                            createDamageLabel(attackResult.damageTaken + attackResult.defenseTaken, chosenEnemy, card);
                        });
                    });

                    CreateParticles(
                        slots,
                        card,
                        function(){
                            lbl.visible = true;
                            lbl.setText( Math.floor(Number(lbl.text) + qAttack / (quantityByElem[card.element.name] * 4)).toString() );
                        },
                        function(){
                            lbl.setText(qAttack.toString());
                        },
                        function(){
                            labels.forEach(function(l){
                                self.game.add.tween(l).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true, 200).onComplete.add(
                                    function(){
                                        l.destroy(true);
                                    }
                                );
                            });
                        }
                    );

                    //dibujo sobre la carta atacada la cantidad de daño recibido
                    function createDamageLabel(damageDone, chosenEnemy, card){
                        var toPos = {
                            x: self.game.rnd.between( chosenEnemy.x - chosenEnemy.width/2 + 25,  chosenEnemy.x + chosenEnemy.width/2 - 25 ) ,
                            y: self.game.rnd.between( chosenEnemy.y - chosenEnemy.height/2 + 25,  chosenEnemy.y + chosenEnemy.height/2 - 25 )
                        };

                        startedTweens++;
                        ParticleManager.shot(
                            card.attackEffect,
                            {x: card.x, y: card.y},
                            toPos,
                            function(){
                                //shake
                                self.game.SoundManager1.playSfx("attack");
                                self.game.add.tween(chosenEnemy).to({ x: chosenEnemy.x+5 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);
                                var lblDanio = new Phaser.BitmapText(self.game, toPos.x, toPos.y, 'kalibers', damageDone.toString(), 50);
                                lblDanio.tint = "0xFF0000"
                                lblDanio.anchor.set(0.5, 0.5);
                                self.game.world.add(lblDanio);
                                self.game.add.tween(lblDanio).to({y: toPos.y-25, alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0)
                                    .onComplete.add(function(){
                                    self.game.add.tween(lblDanio).to({alpha:0}, 2000, Phaser.Easing.Linear.None, true, 0)
                                        .onComplete.add(function(){
                                            lblDanio.destroy(true);
                                        });
                                });
                                onTweenCompleted();
                            }
                        );
                    }
                });
                break;
            case 1: //MAGIA:
                owner.cards.forEach(function(card){
                    //si la carta esta muerta, paso a la siguiente carta
                    if(card.life <= 0) return;

                    //si no hay tokens con este elemento, paso a la siguiente carta
                    if(quantityByElem[card.element.name]==0) return;

                    if(card.life==0) return;
                    card.magic = Math.min( card.magic + card.magicMultiplier * quantityByElem[card.element.name], card.maxMagic);

                    CreateParticles(slots, card, null, null, finishProcess );
                });
                break;
            case 2: //VIDA:
                owner.cards.forEach(function(card){
                    if(quantityByElem[card.element.name]==0) return;
                    card.life = Math.min( card.life + card.lifeMultiplier * quantityByElem[card.element.name], card.maxLife);
                    CreateParticles(slots, card, null, null, finishProcess );
                });
                break;
            case 3: //DEFENSA:
                owner.cards.forEach(function(card){
                    //si la carta esta muerta, paso a la siguiente carta
                    if(card.life <= 0) return;
                    //si no hay tokens con este elemento, paso a la siguiente carta
                    if(quantityByElem[card.element.name]==0) return;
                    if(card.life==0) return;
                    card.defense = Math.min( card.defense + card.defenseMultiplier * quantityByElem[card.element.name], card.maxDefense);
                    CreateParticles(slots, card, null, null, finishProcess );
                });
                break;
        }


        //si llego hasta aca, sin haber creado ningun tween, llamo a la finalizacion
        if(startedTweens == 0 && particleCount==0){
            finishProcess();
        }

        //creador de particulas
        function CreateParticles(slots, card, onParticleFinished, onLocalParticlesFinished, onGlobalParticlesFinished){
            var localParticleCount = 0;
            //emito las particulas
            slots.forEach(function(_s){
                (function(s){
                    if(s.token.element != null && s.token.element != card.element) return;

                    particleCount += 1;
                    localParticleCount += 1;

                    ParticleManager.shot(card.element.particle, {x: s.box.world.x, y: s.box.world.y}, {x: card.x, y: card.y},
                        function(){
                            particleCount--;
                            localParticleCount--;

                            if(onParticleFinished){onParticleFinished()};

                            if(localParticleCount==0){
                                if(onLocalParticlesFinished){onLocalParticlesFinished()};
                            }

                            if(particleCount==0){
                                if(onGlobalParticlesFinished){onGlobalParticlesFinished()};
                            }
                        }
                    );
                }(_s));
            });
        }

        //funcion que se llama cuando termina el proceso
        function finishProcess(){
            self.updateBars(callback);
        }
    },

    playCPU: function(){
        var self = this;
        var gameBoard = this.gameBoard;
        var chains = [];

        //FUNCIONES AUXILIARES
        //función para desactivar el flag Checked en todos los slots
        function clearFlagChecked(){
            for(var col=0; col<gameBoard.colCount; col++){
                for(var row=gameBoard.rowCount; row<gameBoard.rowCount*2; row++){
                    gameBoard.slots[col][row].checked = false;
                }
            }
        }

        //función para desactivar el flag InChain en todos los slots
        function clearFlagInChain(){
            for(var col=0; col<gameBoard.colCount; col++){
                for(var row=gameBoard.rowCount; row<gameBoard.rowCount*2; row++){
                    gameBoard.slots[col][row].inChain = false;
                }
            }
        }

        //dado un slot, obtengo un array con los slots similares adyacentes
        function getMatchingslots(slot){
            slots = [];
            for(var iCol = slot.col-1; iCol <= slot.col+1; iCol++){
                for(var iRow = slot.row-1; iRow <= slot.row+1; iRow++){
                    if( iCol < 0 ||
                        iCol > gameBoard.colCount-1 ||
                        iRow < gameBoard.rowCount ||
                        iRow > gameBoard.rowCount*2-1 ||
                        iCol == slot.col && iRow == slot.row){
                        //no leo este slot
                    }
                    else{
                        if(gameBoard.slots[iCol][iRow].token.type === slot.token.type && !gameBoard.slots[iCol][iRow].checked){
                            slots.push(gameBoard.slots[iCol][iRow]);
                        }
                    }
                }
            }
            return slots;
        }

        //dado un slot, obtengo la más larga cadena de similares que puedo generar a partir de él
        function getChain(slot){
            slot.checked = true;
            var chain = [slot];
            var auxslot;
            var matchingslots = getMatchingslots(slot);
            while(matchingslots.length>0){
                /*
                if(matchingslots.length==1){
                    //si solo hay una token similar adyacente, voy por ese camino
                    auxslot = matchingslots[0];
                }
                else {
                    //si hay mas de una posibilidad, tengo que recorrer todas, y quedarme con la mas larga
                    var maxChainLength = 0;
                    var iMaxChainslot = 0;
                    for(var i = 0; i < matchingslots.length; i++){
                        var auxChain = getChain(matchingslots[i]);
                        if(auxChain.length > maxChainLength){
                            maxChainLength = auxChain.length;
                            iMaxChainslot = i;
                        }
                        //vuelvo todos los flags de la chain testeada a false
                        for(var j = 0; j < auxChain.length; j++){
                            auxChain[j].checked = false;
                        }
                    }
                    //en este punto ya conozco cual es la chain q me conviene seguir
                    auxslot = matchingslots[iMaxChainslot];
                }
                */
                auxslot = matchingslots[0];
                auxslot.checked=true;
                chain.push(auxslot);
                matchingslots = getMatchingslots(auxslot);
            }
            return chain;
        }

        //función que devuelve el resultado de una simulación de ataque contra el jugador
        function testAttack(slots){
            //primero me guardo la defensa y la vida de las cartas del player
            var oldStats = [];
            self.player.cards.forEach(function(card){
               oldStats.push({life: card.life, defense: card.defense, magic: card.magic});
            });
            //ahora aplico el ataque, como si se tratara de un ataque comun, guardando el registro
            var deaths = 0;
            var totalDamage = 0;
            var quantityByElem = self.classifyTokens(slots);
            self.cpu.cards.forEach(function(card){
                //si no hay tokens con este elemento, paso a la siguiente carta
                if(quantityByElem[card.element.name]==0) return;


                //obtengo el valor del ataque
                var qAttack = config.calcAtaque(card.attack, quantityByElem[card.element.name]);
                //selecciono el enemigo al que le voy a aplicar el daño
                var chosenEnemies = [];
                if(quantityByElem[card.element.name] < 5 ){
                    var chosenEnemy = self.getBestTarget(self.player.cards, qAttack, card.element);
                    chosenEnemies.push(chosenEnemy);
                }
                else{
                    self.player.cards.forEach(function(chosenEnemy){
                        if(chosenEnemy.life>0){
                            chosenEnemies.push(chosenEnemy);
                        }
                    });
                }
                //guardo registro del daño
                totalDamage =+ qAttack * chosenEnemies.length;
                //aplico el daño
                chosenEnemies.forEach(function(chosenEnemy){
                    if(!chosenEnemy) return;
                    if(self.takeDamage(chosenEnemy, card.element, qAttack).dead){
                        deaths++;
                    };
                });
            });

            //devuelvo a las cartas sus stats originales
            for(var i = 0; i<self.player.cards.length; i++){
                self.player.cards[i].life = oldStats[i].life;
                self.player.cards[i].defense = oldStats[i].defense;
                self.player.cards[i].magic = oldStats[i].magic;
            }

            //devuelvo el resultado del ataque
            return {deaths: deaths, totalDamage: totalDamage};
        };

        //función que devuelve el resultado de una simulacion de defensa
        function testDefense(slots){
            var totalDefense = 0;
            var quantityByElem = self.classifyTokens(slots);
            self.cpu.cards.forEach(function(card){
                if(quantityByElem[card.element.name]==0) return;
                if(card.life==0) return;
                var newDefense = Math.min( card.defense + card.defenseMultiplier * quantityByElem[card.element.name], card.maxDefense);
                totalDefense =+ newDefense-card.defense;
            });
            //devuelvo el resultado
            return totalDefense;
        }

        //función que devuelve el resultado de una simulacion de vida
        function testLife(slots){
            var totalLife = 0;
            var quantityByElem = self.classifyTokens(slots);
            self.cpu.cards.forEach(function(card){
                if(quantityByElem[card.element.name]==0) return;
                var newLife = Math.min( card.life + card.lifeMultiplier * quantityByElem[card.element.name], card.maxLife);
                totalLife =+ newLife-card.life;
            });
            //devuelvo el resultado
            return totalLife;
        }

        //función que devuelve el resultado de una simulacion de magia
        function testMagic(slots){
            var totalMagic = 0;
            var quantityByElem = self.classifyTokens(slots);
            self.cpu.cards.forEach(function(card){
                if(quantityByElem[card.element.name]==0) return;
                if(card.life==0) return;
                var newMagic = Math.min( card.magic + card.magicMultiplier * quantityByElem[card.element.name], card.maxMagic);
                totalMagic =+ newMagic-card.magic;
            });
            //devuelvo el resultado
            return totalMagic;
        }

        //PROCESO
        //primero recorro las cartas del cpu y disparo la magia, si corresponde
        var magicInProgress = 0;
        var tokensChanged = false; //controla que solo un cambio de tokens pueda hacerse por turno
        this.cpu.cards.forEach(function(_card){
            if(_card.life <= 0) return;
            if(_card.magic >= _card.maxMagic){
                var trigger = false; //variable que indica si debe dispararse la magia
                var power = _card.magicPower;
                switch (_card.doMagic){
                    case MagicManager.AttackOne:
                    case MagicManager.AttackAll:
                        trigger = true;
                        break;
                    case MagicManager.DropDefenseAll:
                    case MagicManager.DropDefenseOne:
                        self.player.cards.forEach(function(_playerCard){
                            if(_playerCard.defense >= power){
                                trigger = true;
                            }
                        });
                        break;
                    case MagicManager.RaiseDeffenseSelf:
                        trigger = _card.maxDefense-_card.defense >= power;
                        break;
                    case MagicManager.RaiseDeffenseAll:
                        self.cpu.cards.forEach(function(_ally){
                            if(_ally.maxDefense-_ally.defense >= power){
                                trigger = true;
                            }
                        });
                        break;
                    case MagicManager.HealSelf:
                        trigger = _card.maxLife-_card.life >= power;
                        break;
                    case MagicManager.HealAll:
                        self.cpu.cards.forEach(function(_ally){
                            if(_ally.maxLife-_ally.life >= power){
                                trigger = true;
                            }
                        });
                        break;
                    case MagicManager.ChangeTokensElement:
                        if(_card.doMagicParams.length > 0){
                            //1 - obtengo el porcentaje de tokens con el elemento que voy a cambiar
                            var tokenCount = 0;
                            var tokenFromElement = 0;
                            var tokenPercentage = 0;
                            self.gameBoard.slots.forEach(function(slotColum){
                                slotColum.forEach(function(slot){
                                    if(slot.token){
                                        tokenCount++;
                                        if(slot.token.element === _card.doMagicParams[0]){
                                            tokenFromElement++;
                                        }
                                    }
                                })
                            });
                            tokenPercentage = tokenFromElement * 100 / tokenCount;

                            //2 - obtengo el porcentaje de cartas con el elemento que voy a cambiar
                            var cardCount = 0;
                            var cardFromElement = 0;
                            var cardPercentage = 0;
                            self.cpu.cards.forEach(function(_ally){
                                cardCount++;
                                if(_ally.element === _card.doMagicParams[0]){
                                    cardFromElement++;
                                }
                            });
                            cardPercentage = cardFromElement * 100 / cardCount;

                            //3 - si el porcentaje de tokens es mayor al porcentaje de cartas, disparo la magia
                            if(tokenPercentage>cardPercentage && !tokensChanged){
                                trigger = true;
                                tokensChanged = true;
                            }
                        }
                        break;
                }

                if(trigger){
                    magicInProgress++;
                    _card.doMagic.call(_card, magicFinished);
                    if(this.gameOver) return;
                }
            }
        });

        function magicFinished(){
            magicInProgress--;
            if(magicInProgress<=0){
                playIA();
            }
        }

        if(magicInProgress<=0){
            playIA();
        }

        function playIA(){
            //recorro slot por slot y calculo su cadena
            clearFlagInChain();
            for(var col=0; col<gameBoard.colCount; col++){
                for(var row=gameBoard.rowCount; row<gameBoard.rowCount*2; row++){
                    if(!gameBoard.slots[col][row].inChain){
                        //marco todos los slots como no revisados
                        clearFlagChecked();
                        //obtengo la chain del slot
                        var chain = getChain(gameBoard.slots[col][row]);
                        //marco los slots de la chain para que no vuelvan a ser procesados
                        chain.forEach(function(slot){
                           slot.inChain = true;
                        });
                        clearFlagInChain()
                        //guardo la chain en un array
                        chains.push(chain);
                    }
                }
            }

            //de las cadenas seleccionadas, elimino las que tengan menos de 3 items
            for(var i = 0; i<chains.length; i++){
                if(chains[i].length < 3){
                    chains.splice(i, 1);
                    i--;
                }
            }

            //ACA VA LA VERDADERA IA
            function choseAction(){
                //1- OBTENGO EL MEJOR ATAQUE
                var bestAttack = null;
                var bestAttackRes = null;
                chains.forEach(function(chain){
                    if(chain[0].token.type != TOKEN_TYPE_ATTACK) return; //si no es ataque
                    var res = testAttack(chain);
                    if( bestAttackRes == null ||
                        res.deaths > bestAttackRes.deaths ||
                        res.deaths == bestAttackRes.deaths && res.totalDamage > bestAttack.totalDamage){
                        bestAttackRes = res;
                        bestAttack = chain;
                    }
                });
                if(bestAttackRes==null) {
                    bestAttackRes = {deaths: 0, totalDamage: -1};
                }
                //2- SI EL ATAQUE PRODUCE MUERTES, SELECCIONO ESA ACCION
                if(bestAttackRes) if(bestAttackRes.deaths>0) return bestAttack;
                //3- OBTENGO LA MEJOR DEFENSA
                var bestDefense = null;
                var bestDefenseRes = null;
                chains.forEach(function(chain){
                    if(chain[0].token.type != TOKEN_TYPE_DEFENSE) return; //si no es defensa, sale
                    var res = testDefense(chain);
                    if( bestDefenseRes == null ||
                        res > bestDefenseRes){
                        bestDefenseRes = res;
                        bestDefense = chain;
                    }
                });
                if(bestDefenseRes==null) {
                    bestDefenseRes = -1;
                }
                //4- OBTENGO LA MEJOR MAGIA
                var bestMagic = null;
                var bestMagicRes = null;
                chains.forEach(function(chain){
                    if(chain[0].token.type != TOKEN_TYPE_MAGIC) return; //si no es magia, sale
                    var res = testMagic(chain);
                    if( bestMagicRes == null ||
                        res > bestMagicRes){
                        bestMagicRes = res;
                        bestMagic = chain;
                    }
                });
                if(bestMagicRes==null) {
                    bestMagicRes = -1;
                }
                //5- OBTENGO LA MEJOR VIDA
                var bestLife = null;
                var bestLifeRes = null;
                chains.forEach(function(chain){
                    if(chain[0].token.type != TOKEN_TYPE_LIFE) return; //si no es vida, sale
                    var res = testLife(chain);
                    if( bestLifeRes == null ||
                        res > bestLifeRes){
                        bestLifeRes = res;
                        bestLife = chain;
                    }
                });
                if(bestLifeRes==null) {
                    bestLifeRes = -1;
                }
                //6- SI ATAQUE ES MEJOR QUE MAGIA...
                if(bestAttackRes.totalDamage >= bestMagicRes){
                    //7- SI ATAQUE ES MEJOR QUE VIDA...
                    if(bestAttackRes.totalDamage >= bestLifeRes){
                        //8- SI ATAQUE ES MEJOR QUE ESCUDO...
                        if(bestAttackRes.totalDamage >= bestDefenseRes){
                            return bestAttack;
                        } else {
                            return bestDefense;
                        }
                    }
                    else {
                        //9- SI VIDA ES MEJOR QUE ESCUDO...
                        if(bestLifeRes >= bestDefenseRes){
                            return bestLife;
                        } else {
                            return bestDefense;
                        }
                    }
                }
                else {
                    //10- SI MAGIA ES MEJOR QUE VIDA...
                    if(bestMagicRes >= bestLifeRes){
                        //11- SI MAGIA ES MEJOR QUE ESCUDO...
                        if(bestMagicRes >= bestDefenseRes){
                            return bestMagic;
                        } else {
                            return bestDefense;
                        }
                    }
                    else {
                        //11- SI VIDA ES MEJOR QUE ESCUDO...
                        if(bestLifeRes >= bestDefenseRes){
                            return bestLife;
                        } else {
                            return bestDefense;
                        }
                    }
                }



                //12- RECORRO A PARTIR DE LA MAGIA, y DEVUELVO EL PRIMER RESULTADO NO NULO
                if(bestMagic){
                    return bestMagic;
                }
                else{
                    if(bestDefense){
                        return bestDefense;
                    }
                    else{
                        if(bestLife){
                            return bestLife;
                        }
                        else{
                            return bestAttack;
                        }
                    }
                }
            }

            //dibujo la cadena seleccionada
            var selectedSlots = choseAction();

            if(selectedSlots==null){
                selectedSlots = choseAction();
            }

            var drawed = [];

            var i = 0;
            function drawLine(){
                setTimeout(function(){
                    if(self.paused){
                        drawLine();
                    }
                    else{
                        if(i < selectedSlots.length){
                            if(self.gameBoard.game==null) return;
                            drawed.push(selectedSlots[i]);
                            self.gameBoard.drawSelection(drawed);
                            i++;
                            drawLine();
                        }
                        else{
                            //En este punto, la seleción ya está dibujada. Entonces sigo con el proceso:
                            //1 - Mando a procesar la seleccion
                            self.processSeleccion(selectedSlots, self.cpu, self.player, function() {
                                    self.setInputEnabled(true);
                                    self.playerTurnIndicator.frame = 1;
                                    self.cpuTurnIndicator.frame = 0;
                                    self.playerTurnIndicator.lbl.tint = "0xFFFFFF";
                                    self.cpuTurnIndicator.lbl.tint = "0x333333";
                                }
                            );
                            //2 - Elimino los tokens seleccionados
                            //self.gameBoard.removeTokenFromSlots(selectedSlots);
                            self.gameBoard.clearArrows();
                        }
                    }
                }, 100);
            }
            drawLine();
        }
    },

    getBestTarget: function(targets, attack, element){
        //funcion que testea el resultado del ataque sobre una carta
        function testAttack(target){
            var attk = attack;
            if(target.element.weakness==element.name){
                attk=attack*2;
            }
            var resultDefense = Math.max(0, target.defense-attk);
            var resultLife = Math.max(0, (target.defense+target.life)-attk);
            return {lifeTaken: target.life-resultLife, defenseTaken: target.defense-resultDefense, death: resultLife==0};
        }

        //obtengo el mejor ataque posible
        var iBestTarget = -1;
        var bestResult = {};
        for(var i=0; i<targets.length; i++){
            if(targets[i].life <= 0) continue;
            var result = testAttack(targets[i]);
            if( iBestTarget == -1 ||             //si es el primer resultado obtenido, lo selecciono
                result.death && !bestResult.death ||
                result.lifeTaken > bestResult.lifeTaken ||
                result.lifeTaken == bestResult.lifeTaken && result.defenseTaken > bestResult.defenseTaken
                )
            {
                iBestTarget = i;
                bestResult = result;
            }
        }

        return targets[iBestTarget];
    },

    classifyTokens: function(slots){
        //dado una lista de slots, devuelve un array clasificandolos por elemento
        var quantityByElem = {};
        //creo un array que guardara la cantidad de tokens que hay para cada elemento
        for(var elementName in CCG.Data.Elements) {
            quantityByElem[elementName]=0;
        }
        //lleno el array de cantidades por elemento
        for(var i = 0; i < slots.length; i++){
            if(slots[i].token.element){
                quantityByElem[slots[i].token.element.name] += 1;
            }
            else{
                for(var elementName in CCG.Data.Elements) {
                    quantityByElem[elementName]+=1;
                }
            }
        }
        return quantityByElem;
    },

    takeDamage: function(card, element, quantity){
        if(!card){
            return;
        }
        //aplico el daño
        var oldDefense = card.defense;
        var oldLife = card.life;

        //chequeo si hay debilidad contra ese elemento
        if(card.element.weakness === element.name){
            quantity = quantity * 2;
        }

        //primero, resto de la defensa
        card.defense -= quantity;

        //si venci la defensa, aplico el resto del daño a la vida
        if(card.defense < 0){
            card.life += card.defense;
            card.defense = 0;
            if(card.life < 0){
                card.life = 0;
                card.magic = 0;
            }
        }

        //deveuelvo el resultado
        return {
            damageTaken: oldLife-card.life,
            defenseTaken: oldDefense-card.defense,
            dead: card.life <= 0
        };
    }
};
