
BasicGame.CharacterSelect = function (game) {


};

BasicGame.CharacterSelect.prototype = {

	create: function () {
        var self = this;

        this.add.sprite(0, 0, 'characterSelectBg');

        function AddSelectableCharacter(cardId){
            var char = new Phaser.Sprite(self.game, 0, 0, 'characterSelectPh');
            char.anchor.set(0.5, 0.5);

            var img = new Phaser.Sprite(self.game, 0, 0, CCG.Data.Cards[cardId].image);
            img.anchor.set(0.5, 0.5);

            var lbl = new myFramework.Label(self.game, CCG.Data.Cards[cardId].name, 0, -char.height/2+20, char.width, 40, { font: "bold 20px Arial" , fill: 'white'});

            char.addChild(img);
            char.addChild(lbl);

            char.inputEnabled=true;

            char.events.onInputUp.add(function() {
                //transicion
                self.game.transition("close", function(){
                    player.cards[0] = {id: cardId, level: 1, selected: true};
                    self.state.start('Map');
                });
            });
            return char;
        }

        var char1 = new AddSelectableCharacter(0);
        var char2 = new AddSelectableCharacter(1);
        var char3 = new AddSelectableCharacter(2);

        char1.x = (config.game_half_width - char1.width / 2) / 2;
        char1.y = config.game_half_height;

        char2.x = config.game_half_width;
        char2.y = config.game_half_height;

        char3.x = (config.game_half_width + char3.width / 2) / 2 + config.game_half_width;
        char3.y = config.game_half_height;

        //label select
        var lbl = new myFramework.Label(this.game, "SELECCIONA TU PERSONAJE", config.game_half_width, config.game_height - 60, 400, 50, { font: "bold 25px Arial" , fill: 'white'});
        this.game.world.addChild(char1);
        this.game.world.addChild(char2);
        this.game.world.addChild(char3);
        this.game.world.addChild(lbl);

        //transicion
        this.game.transition("open");
	},

	update: function () {

		//	Do some nice funky main menu effect here

	}

};
