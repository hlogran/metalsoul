var myFramework = {};

myFramework.isButtonDown = false;

myFramework.CardDisplayType = {
    CARD: 0,
    THUMBNAIL: 1,
    PORTRAIT: 2
};

//Card
(function(){
    var Card = function(game, x, y, cardId, cardLevel, displayType, thumbnailSize){
        var self = this;

        Phaser.Group.call(this, game, null);

        this.x = x;
        this.y = y;
        this.DisplayType = displayType;
        this.cardLevel = cardLevel;

        this.cardData = CCG.Data.Cards[cardId];

        //copio los datos de la carta
        this.name = this.cardData.name;
        this.image = this.cardData.image;
        this.element = this.cardData.element;

        this.attackEffect = this.cardData.attackEffect;
        this.magicEffect = this.cardData.magicEffect;
        this.doMagic = this.cardData.doMagic;
        this.doMagicParams = this.cardData.doMagicParams;
        this.text = this.cardData.text;
        this.thumbnailData = this.cardData.thumbnail;
        this.portraitData = this.cardData.portrait;
        this.headingRight = this.cardData.headingRight;

        this.cardLevel = cardLevel;

        this.thumbnail = new Phaser.Group(this.game, null);
        this.card = new Phaser.Group(this.game, null);
        this.portrait = new Phaser.Group(this.game, null);

        this.createPortrait();
        this.createThumbnail();
        this.createCard();

        this.onThumbnailClick = function(newFunction){
            self.surface.events.onInputDown.removeAll();
            self.surface.events.onInputDown.add(newFunction);
        };

        switch(displayType){
            case myFramework.CardDisplayType.THUMBNAIL:
                this.add(this.thumbnail);
                this.surface = this.thumbnail.eventsArea;
                this.surface.inputEnabled = true;
                this.onThumbnailClick(function(){
                    self.zoomIn();
                });
                break;
            case myFramework.CardDisplayType.PORTRAIT:
                this.add(this.portrait);
                this.surface = this.portrait.eventsArea;
                this.surface.inputEnabled = true;
                this.onThumbnailClick(function(){
                    self.zoomIn();
                });
                break;
            case myFramework.CardDisplayType.CARD:
                this.add(this.card);
                this.surface = this.card.eventsArea;
                break;
        }

        this.width = this.surface.width;

        return this;
    };

    Card.prototype = Object.create(Phaser.Group.prototype);

    Card.prototype.constructor = Card;

    Card.prototype.createThumbnail = function(){
        this.thumbnail.x = 0;
        this.thumbnail.y = 0;

        var thumbnailBg = this.thumbnail.create(0, 0, 'thumbnail_bg')
        thumbnailBg.anchor.setTo(0.5, 0.5);

        var thumbnailImage = this.thumbnail.create(0, 0, this.image);
        thumbnailImage.anchor.setTo(0.5, 0.5);
        thumbnailImage.cropRect = new Phaser.Rectangle(this.thumbnailData.x, this.thumbnailData.y, this.thumbnailData.size, this.thumbnailData.size );
        thumbnailImage.updateCrop();

        //ajusto el tamaño del sprite al tamaño del thumbnail
        var scaleFactorT = thumbnailBg.width*.9 / this.thumbnailData.size;
        thumbnailImage.scale = new Phaser.Point(scaleFactorT, scaleFactorT);

        var thumbnailFrame = this.thumbnail.create(0, 0, 'thumbnail_frame');
        thumbnailFrame.anchor.setTo(0.5, 0.5);

        var thumbnailElement = this.thumbnail.create(config.card_thumbnail_element_pos.x, config.card_thumbnail_element_pos.y, this.element.image);
        thumbnailElement.anchor.setTo(0.5, 0.5);
        var scaleFactor = config.card_thumbnail_element_size / thumbnailElement.width;
        thumbnailElement.scale = new Phaser.Point(scaleFactor, scaleFactor);

        this.thumbnail.eventsArea = thumbnailFrame;
    }

    Card.prototype.createPortrait = function(){
        this.portrait.x = 0;
        this.portrait.y = 0;

        var portraitImage = this.portrait.create(0, 0, this.image);
        portraitImage.anchor.setTo(0.5, 0.5);
        portraitImage.cropRect = new Phaser.Rectangle(this.portraitData.x, this.portraitData.y, this.portraitData.width, this.portraitData.height );
        portraitImage.updateCrop();

        //ajusto el tamaño del sprite al tamaño del portrait
        var scaleFactorT = Math.min (
                180 / this.portraitData.width,
                170 / this.portraitData.height
        );

        portraitImage.scale = new Phaser.Point(scaleFactorT, scaleFactorT);

        this.portrait.eventsArea = portraitImage;
    }

    Card.prototype.createCard = function() {
        var self = this;

        this.attack = this.cardData.attack(this.cardLevel);
        this.magicPower = this.cardData.magicPower(this.cardLevel);
        this.maxLife = this.cardData.maxLife(this.cardLevel);
        this.maxDefense = this.cardData.maxDefense(this.cardLevel);
        this.maxMagic = this.cardData.maxMagic(this.cardLevel);
        this.lifeMultiplier = this.cardData.lifeMultiplier(this.cardLevel);
        this.defenseMultiplier = this.cardData.defenseMultiplier(this.cardLevel);
        this.magicMultiplier = this.cardData.magicMultiplier(this.cardLevel);
        this.nextLevel = this.cardData.nextLevel(this.cardLevel);

        var cardBg = this.card.create(config.card_image_pos.x, config.card_image_pos.y, 'card_bg');
        cardBg.anchor.setTo(0.5, 0.5);

        var image = this.card.create(config.card_image_pos.x, config.card_image_pos.y, this.image);
        image.anchor.setTo(0.5, 0.5);

        var layout = this.card.create(0, 0, 'card_layout');
        layout.anchor.setTo(0.5, 0.5);

        var imageElement = this.card.create(config.card_element_pos.x, config.card_element_pos.y, this.element.image);
        imageElement.anchor.setTo(0.5, 0.5);

        var lblName = new Phaser.BitmapText(self.game, config.card_name_pos.x, config.card_name_pos.y, 'kalibers', self.name, 30);
        self.card.add(lblName);
        lblName.anchor.set(0.0, 0.5);

        var lblLevel = new Phaser.BitmapText(self.game, -100, -10, 'kalibers', self.cardLevel.toString(), 26);
        self.card.add(lblLevel);
        lblLevel.anchor.set(0.5, 0.0);

        var lblHP = new Phaser.BitmapText(self.game, -22, 48, 'kalibers', self.maxLife.toString(), 23);
        self.card.add(lblHP);
        lblHP.anchor.set(1.0, 0.5);


        var lblAttack = new Phaser.BitmapText(self.game, 160, 48, 'kalibers', self.attack.toString(), 23);
        self.card.add(lblAttack);
        lblAttack.anchor.set(1.0, 0.5);


        var lblRecovery = new Phaser.BitmapText(self.game, -10, 92, 'kalibers', self.attack.toString(), 23);
        self.card.add(lblRecovery);
        lblRecovery.anchor.set(1.0, 0.5);

        var lblText = new Phaser.BitmapText(self.game, -150, 120, 'kalibers', self.text, 23);

        lblText.maxWidth = 300;
        self.card.add(lblText);
        lblText.anchor.set(0.0, 0.0);

        this.card.eventsArea = layout;

    }

    Card.prototype.zoomIn = function() {
        var self = this;

        var target = null;

        var zoomedBgData = new Phaser.BitmapData(this.game, 'zoomedBg', this.game.width, this.game.height);
        zoomedBgData.fill(0, 0, 0);

        var zoomedBg = this.game.add.sprite(0, 0, zoomedBgData);
        zoomedBg.alpha = 0;
        zoomedBg.inputEnabled=true;

        if(this.DisplayType == myFramework.CardDisplayType.CARD) {
            target = this;
        }
        else {
            this.card.scale.x = 0;
            this.card.scale.y = 0;
            this.card.x = this.x;
            this.card.y = this.y;
            this.game.world.add(this.card);
            target = this.card;
        }

        target.inputEnabled = false;

        var oldScaleX = target.scale.x;
        var oldScaleY = target.scale.y;
        var oldPositionX = target.x;
        var oldPositionY = target.y;

        this.game.input.disabled = true;

        this.game.world.bringToTop(target);

        this.game.add.tween(zoomedBg).to({alpha: 0.5}, config.card_zoom_time, null, true, 0);
        this.game.add.tween(target.scale).to({x: 1,y: 1},config.card_zoom_time, null, true, 0);
        this.game.add.tween(target).to({x: this.game.width / 2, y: this.game.height / 2}, config.card_zoom_time, null, true, 0).onComplete.add(function(){
            //que hace cuando completo?
            self.game.input.onUp.add(function(){
                self.game.add.tween(zoomedBg).to({alpha: 0}, config.card_zoom_time, null, true, 0);
                self.game.add.tween(target.scale).to({x: oldScaleX, y: oldScaleY},config.card_zoom_time, null, true, 0);
                self.game.add.tween(target).to({x: oldPositionX, y: oldPositionY}, config.card_zoom_time, null, true, 0).onComplete.add(function(){
                    self.game.input.onUp.removeAll();
                    self.game.world.removeChild(zoomedBg);
                    if(this.DisplayType != myFramework.CardDisplayType.CARD) {
                        self.game.world.removeChild(target);
                    }
                    target.inputEnabled = true;
                }, self);
            });
            self.game.input.disabled = false;
        });
    };

    Card.prototype.LevelUp = function() {
        this.cardLevel = this.cardLevel+1;
        this.createCard();
    };

    myFramework.Card = Card;
}());

//GameBoard
(function(){
    var GameBoard = function(game, x, y, cols, rows, noElements) {
        var self = this;

        this.noElements = noElements;

        Phaser.Group.call(this, game, null);

        //array que contiene las casillas del tablero
        this.slots = [];

        //guardo las propiedades pasadas por parametro
        this.x = x;
        this.y = y;
        this.colCount = cols;
        this.rowCount = rows;

        this.tokensByType = [0, 0, 0, 0];

        //obtengo el ancho y el alto de los slots mediante su imagen
        var tmpSlot = new Phaser.Sprite( game, 0, 0, "slot" );
        var slotWidth = tmpSlot.width;
        var slotHeight = tmpSlot.height;
        tmpSlot.destroy(true);
        tmpSlot = null;

        for(var col = 0; col < cols; col++){
            var column = [];
            var slotX = (self.game.width - slotWidth * cols) / 2 + slotWidth * col + slotWidth/2 - x;
            for(var row = 0; row < rows*2; row++){
                var slotY = (self.game.height - slotHeight * rows) / 2 + slotHeight * row + slotHeight/2 - slotHeight * rows - y;

                var slot = {};
                slot.x = slotX;
                slot.y = slotY;
                slot.col = col;
                slot.row = row;
                slot.selected = false;

                if(row < rows){                //aca creamos los tokens
                    slot.token = self.create(0, 0, "tokens", 0);
                    slot.token.anchor.setTo(0.5, 0.5);
                    slot.token.x = slotX;
                    slot.token.y = slotY;
                    //function para cambiar el elemento al token
                    slot.token.setElement = function (element){
                        this.removeChildren();
                        this.element = element;
                        var sptElement = new Phaser.Sprite (self.game, 10, 10, element.image);
                        var scaleFactor = 27 / sptElement.width;
                        sptElement.scale = new Phaser.Point(scaleFactor, scaleFactor);
                        this.addChild(sptElement);
                    }
                    self.regenerateToken(slot.token);
                }
                else {
                    slot.token = null;

                    //en la mitad visible del tablero, colocamos las imagenes de los slots
                    var box = self.create(slotX, slotY, "slot");
                    box.alpha = .1;
                    box.anchor.setTo(0.5, 0.5);
                    box.inputEnabled = true;
                    box.hitArea = new Phaser.Circle(0, 0, box.width *.85 )

                    //los slots tienen eventos para que el player interactue con el tablero
                    var selectedSlots=[]; // array que contiene los slots seleccionados por el jugador
                    var isSelecting = false; //flag que indica si el player esta realizando una seleccion
                    box.events.onInputDown.add(function(){
                        if(this.token != null){
                            //marco todos los slots como no seleccionados
                            for(var c = 0; c < self.slots.length; c++){
                                for(var r = self.rowCount; r < self.rowCount*2; r++){
                                    self.slots[c][r].selected = false;
                                }
                            }

                            self.clearArrows();
                            selectedSlots=[this];
                            isSelecting = true;
                            this.selected = true;
                            this.box.alpha = .7;

                            self.game.input.addMoveCallback(function(){
                                var found = false;
                                for(var col=0; col< self.slots.length; col++){
                                    for(var row=0; row< self.slots[col].length; row++){
                                        var box = self.slots[col][row].box;
                                        if(box) {
                                            var localPos = box.toLocal(self.game.input.activePointer.position);
                                            if (box.hitArea.contains(localPos.x, localPos.y)) {
                                                found = true;
                                                onInputOver.call(self.slots[col][row]);
                                                break;
                                            }
                                        }
                                    }
                                    if(found) break;
                                }
                            }, self);

                            //agrego el evento al game para que se dispare cuando haya terminado la seleccion
                            game.input.onUp.addOnce(function(){
                                self.clearArrows();

                                if(selectedSlots.length > 2){
                                    //llamo a la funcion que procesa el turno del jugador
                                    self.processPlayersTurn(selectedSlots);
                                    //elimino los tokens seleccionados
                                    //self.removeTokenFromSlots(selectedSlots);
                                }

                                //reseteo las variables
                                selectedSlots=[];
                                isSelecting = false;

                                //bajo los nuevos tokens
                                self.game.input.deleteMoveCallback(0);
                            })
                        }
                    }, slot);

                    function onInputOver(){
                        if(isSelecting && this.token != null) {
                            if (!this.selected) {
                                var lastSelection = selectedSlots[selectedSlots.length - 1];
                                var xDiff = Math.abs(this.col - lastSelection.col);
                                var yDiff = Math.abs(this.row - lastSelection.row);

                                if (this.token.type === lastSelection.token.type && xDiff <= 1 && yDiff <= 1) {
                                    //es adyacente
                                    this.selected = true;
                                    selectedSlots.push(this);
                                    self.drawSelection(selectedSlots);
                                }
                                else if (yDiff == 0) {
                                    //es misma row
                                    var slotsToAdd = [];
                                    var selectionOK = true;
                                    for (var i = 1; i <= xDiff; i++) {
                                        var x;
                                        if (lastSelection.col < this.col) {
                                            x = lastSelection.col + i;
                                        }
                                        else {
                                            x = lastSelection.col - i;
                                        }

                                        var auxSlot = self.slots[x][lastSelection.row];
                                        if (auxSlot === lastSelection) continue;
                                        if (auxSlot.token.type === lastSelection.token.type && !auxSlot.selected) {
                                            slotsToAdd.push(auxSlot);
                                        }
                                        else {
                                            selectionOK = false;
                                            break;
                                        }
                                    }
                                    if (selectionOK) {
                                        slotsToAdd.forEach(function (slot) {
                                            slot.selected = true;
                                            selectedSlots.push(slot);
                                        });
                                        self.drawSelection(selectedSlots);
                                    }
                                }
                                else if (xDiff == 0) {
                                    //es misma col
                                    var slotsToAdd = [];
                                    var selectionOK = true;
                                    for (var i = 1; i <= yDiff; i++) {
                                        var y;
                                        if (lastSelection.row < this.row) {
                                            y = lastSelection.row + i;
                                        }
                                        else {
                                            y = lastSelection.row - i;
                                        }

                                        var auxSlot = self.slots[lastSelection.col][y];

                                        if (auxSlot.token.type === lastSelection.token.type && !auxSlot.selected) {
                                            slotsToAdd.push(auxSlot);
                                        }
                                        else {
                                            selectionOK = false;
                                            break;
                                        }
                                    }
                                    if (selectionOK) {
                                        slotsToAdd.forEach(function (slot) {
                                            slot.selected = true;
                                            selectedSlots.push(slot);
                                        });
                                        self.drawSelection(selectedSlots);
                                    }
                                }
                                else if (xDiff == yDiff) {
                                    //es misma diagonal
                                    var slotsToAdd = [];
                                    var selectionOK = true;

                                    for (var i = 1; i <= xDiff; i++) {
                                        var x;
                                        var y;

                                        if (lastSelection.col < this.col) {
                                            x = lastSelection.col + i;
                                        }
                                        else {
                                            x = lastSelection.col - i;
                                        }

                                        if (lastSelection.row < this.row) {
                                            y = lastSelection.row + i;
                                        }
                                        else {
                                            y = lastSelection.row - i;
                                        }

                                        var auxSlot = self.slots[x][y];
                                        if (auxSlot === lastSelection) continue;
                                        if (auxSlot.token.type === lastSelection.token.type && !auxSlot.selected) {
                                            slotsToAdd.push(auxSlot);
                                        }
                                        else {
                                            selectionOK = false;
                                            break;
                                        }
                                    }

                                    if (selectionOK) {
                                        slotsToAdd.forEach(function (slot) {
                                            slot.selected = true;
                                            selectedSlots.push(slot);
                                        });
                                        self.drawSelection(selectedSlots);
                                    }
                                }
                            }
                            else {
                                if (selectedSlots.length < 2) return;

                                if (this === selectedSlots[selectedSlots.length - 2]) {
                                    selectedSlots[selectedSlots.length - 1].selected = false;
                                    selectedSlots.pop();
                                    self.drawSelection(selectedSlots);
                                }
                            }
                        }
                    }

                    slot.box = box;
                }
                column.push(slot);
            }
            self.slots.push(column);
        }

        //bako los tokens inmediatamente
        for(var col = 0; col < cols; col++) {
            for (var row = 0; row < rows; row++) {
                var token = self.slots[col][row].token;
                self.slots[col][row].token = null;
                self.slots[col][row + rows].token = token;
                token.y = self.slots[col][row + rows].y;
            }
            for (var row = rows; row < rows*2; row++) {
                var slot = self.slots[col][row];
                slot.arrow = self.create(slot.x, slot.y, "arrow");
                slot.arrow.anchor.set(0.5, 0.5);
            }
        }

        //creo una mascara que oculta los tokens fuera de juego
        var mask = self.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect( x - self.colCount * slotWidth / 2, y - self.rowCount * slotHeight / 2, self.colCount * slotWidth, self.rowCount * slotHeight);
        self.mask = mask;


        return this;
    };

    GameBoard.prototype = Object.create(Phaser.Group.prototype);

    GameBoard.prototype.constructor = GameBoard;

    GameBoard.prototype.regenerateToken =  function(token){
        var self = this;

        var tokenType = self.game.rnd.integerInRange(0, 3);

        //verifico que no haya demasiados tokens de un mismo tipo
        while(self.tokensByType[tokenType] >= self.colCount*self.rowCount / 3.5 ){
            tokenType = self.game.rnd.integerInRange(0, 3);
        }

        self.tokensByType[tokenType]++;

        token.frame = tokenType;
        token.type = tokenType;

        var elements = [];

        if(self.noElements){
            token.element=null;
        }
        else{
            for(var elementName in CCG.Data.Elements) {
                elements.push(CCG.Data.Elements[elementName]);
            }
            token.setElement(elements[self.game.rnd.integerInRange(0, elements.length-1)]);
        }
    };

    GameBoard.prototype.drawSelection =  function(selectedTokens){
        this.clearArrows();

        if(selectedTokens.length == 0) return;

        for(var j = 0; j < selectedTokens.length; j++){
            var currentToken = null;
            var nextToken = null;
            var prevToken = null;

            currentToken = selectedTokens[j];

            if(j < selectedTokens.length -1){
                nextToken = selectedTokens[j+1];
            }

            if(j > 0){
                prevToken = selectedTokens[j-1];
            }

            if(currentToken.box){
                currentToken.box.alpha = .7;
            }

            currentToken.arrow.angle = 0;
            currentToken.arrow.visible = selectedTokens.length>1;

            this.game.world.bringToTop(currentToken.arrow);

            if(j==0){
                if(selectedTokens.length>1){
                    //inicio de flecha
                    currentToken.arrow.frame = 0;
                    if(nextToken.row == currentToken.row){
                        //horizontal
                        if(nextToken.col > currentToken.col){
                            currentToken.arrow.angle = 0;
                        }
                        else {
                            currentToken.arrow.angle = 180;
                        }
                    }
                    else if(nextToken.col == currentToken.col){
                        //vertical
                        if(nextToken.row > currentToken.row){
                            currentToken.arrow.angle = 90;
                        }
                        else {
                            currentToken.arrow.angle = 270;
                        }
                    }
                    else{
                        if(nextToken.col > currentToken.col) {
                            if(nextToken.row > currentToken.row){
                                currentToken.arrow.angle = 45;
                            }
                            else{
                                currentToken.arrow.angle = -45;
                            }
                        }
                        else {
                            if(nextToken.row > currentToken.row){
                                currentToken.arrow.angle = 135;
                            }
                            else{
                                currentToken.arrow.angle = -135;
                            }
                        }
                    }
                }
            }
            else {
                //rotamos el sprite
                if(prevToken.col == currentToken.col){
                    if(prevToken.row < currentToken.row){
                        currentToken.arrow.angle = 90;
                        if(nextToken) currentToken.arrow.scale.y = (nextToken.col > currentToken.col) ? -1 : 1;
                    }
                    else {
                        currentToken.arrow.angle = 270;
                        if(nextToken) currentToken.arrow.scale.y = (nextToken.col < currentToken.col) ? -1 : 1;
                    }
                }
                else if(prevToken.row == currentToken.row){
                    if(prevToken.col < currentToken.col){
                        currentToken.arrow.angle = 0;
                        if(nextToken) currentToken.arrow.scale.y = (nextToken.row < currentToken.row) ? -1 : 1;
                    }
                    else {
                        currentToken.arrow.angle = 180;
                        if(nextToken) currentToken.arrow.scale.y = (nextToken.row > currentToken.row) ? -1 : 1;
                    }
                }
                else {
                    if(prevToken.col < currentToken.col) {
                        if(prevToken.row < currentToken.row){
                            currentToken.arrow.angle = 45;
                        }
                        else{
                            currentToken.arrow.angle = -45;
                        }
                    }
                    else {
                        if(prevToken.row < currentToken.row){
                            currentToken.arrow.angle = 135;
                        }
                        else{
                            currentToken.arrow.angle = -135;
                        }
                    }
                }

                if(j == selectedTokens.length-1){
                    currentToken.arrow.frame = 1;
                }
                else {
                    //cuerpo de flecha
                    if(prevToken.col == nextToken.col && prevToken.col == currentToken.col ||
                        prevToken.row == nextToken.row  && prevToken.row ==  currentToken.row ||
                        Math.abs(prevToken.row-nextToken.row) == 2 && Math.abs(prevToken.col-nextToken.col) == 2){
                        //linea recta
                        currentToken.arrow.frame = 2;
                    }
                    else if(currentToken.col == prevToken.col || currentToken.row == prevToken.row){
                        //entra perpendicular
                        if(currentToken.col == nextToken.col || currentToken.row == nextToken.row){
                            //dobla a 90º
                            currentToken.arrow.frame = 3;
                        }
                        else {
                            //dobla a 45º
                            if(prevToken.col == nextToken.col || prevToken.row == nextToken.row){
                                //angulo cerrado
                                currentToken.arrow.frame = 5;
                            }
                            else {
                                //angulo abierto
                                currentToken.arrow.frame = 4;
                            }
                        }
                    }
                    else {
                        //entra oblicua
                        if(currentToken.col != nextToken.col && currentToken.row != nextToken.row){
                            //dobla a 90º
                            currentToken.arrow.frame = 3;
                            if (prevToken.col < currentToken.col && prevToken.row > currentToken.row ||
                                prevToken.col > currentToken.col && prevToken.row > currentToken.row){
                                currentToken.arrow.scale.y = nextToken.col < currentToken.col ? -1 : 1;
                            }
                            else{
                                currentToken.arrow.scale.y = nextToken.col > currentToken.col ? -1 : 1;
                            }
                        }
                        else {
                            //dobla a 45º
                            if(prevToken.col == nextToken.col || prevToken.row == nextToken.row){
                                //angulo cerrado
                                currentToken.arrow.frame = 5;
                                if (prevToken.col < currentToken.col && prevToken.row > currentToken.row ||
                                    prevToken.col > currentToken.col && prevToken.row < currentToken.row){
                                    currentToken.arrow.scale.y = nextToken.col != currentToken.col ? -1 : 1;
                                }
                                else {
                                    currentToken.arrow.scale.y = nextToken.col == currentToken.col ? -1 : 1;
                                }
                            }
                            else {
                                //angulo abierto
                                currentToken.arrow.frame = 4;
                                if (prevToken.col < currentToken.col && prevToken.row > currentToken.row ||
                                    prevToken.col > currentToken.col && prevToken.row < currentToken.row){
                                    currentToken.arrow.scale.y = nextToken.col == currentToken.col ? -1 : 1;
                                }
                                else{
                                    currentToken.arrow.scale.y = nextToken.col != currentToken.col ? -1 : 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    GameBoard.prototype.dropTokens =  function(callback){
        var self = this;

        var startedTweens = 0; //guarda la cantidad de tweens iniciados
        var completedTweens = 0; //guarda la cantidad de tweens finalizados

        //recorro cada columna de la grilla;
        for(var col = 0; col < self.colCount; col++) {
            //recorro cada fila desde abajo (salvo la ultima, porque no cae nunca);
            for (var row = self.rowCount*2 - 2; row >= 0; row--) {

                if(self.slots[col][row].token == null) continue;

                //recorro las filas desde abajo para ver donde cae
                for (var row2 = self.rowCount*2 - 1; row2 > row; row2--) {
                    if (self.slots[col][row2].token == null) {
                        //cae acá
                        var time = (self.slots[col][row2].y - self.slots[col][row].token.y) * 1000/500;
                        startedTweens++;
                        var tween = self.game.add.tween(self.slots[col][row].token).to({y: self.slots[col][row2].y}, time, Phaser.Easing.Quadratic.Out, true, 0);
                        tween.onComplete.add(function(){
                            self.game.SoundManager1.playSfx("tokenDrop");
                            onTweenCompleted();
                        });
                        self.slots[col][row2].token = self.slots[col][row].token;
                        self.slots[col][row].token = null;
                        break;
                    }
                }
            }
        }

        //función que maneja la finalizacion de los tweens
        function onTweenCompleted(){
            completedTweens++;
            if(completedTweens == startedTweens){
                //si se terminaron todos los tweens, llamo al callback
                if(callback) {
                    callback();
                }
            }
        }
    };

    GameBoard.prototype.removeTokenFromSlots = function(slots) {
        var self = this;

        slots.forEach(function(slot){
            if (slot.token != null) {
                self.tokensByType[slot.token.type]--;
                slot.token.type=-1;
            }
        });

        slots.forEach(function(slot){
            if (slot.token != null) {
                //muevo la token al primer slot no visible que esté libre
                var col = slot.col;
                for (var row = self.rowCount-1; row >= 0; row--) {
                    if (self.slots[col][row].token == null) {
                        self.regenerateToken(slot.token);
                        slot.token.y = self.slots[col][row].y;
                        self.slots[col][row].token = slot.token;
                        slot.token = null;
                        break;
                    }
                }
            }
        });
    }

    GameBoard.prototype.processPlayersTurn = function(selection){};

    GameBoard.prototype.clearArrows = function(){
        this.slots.forEach(function(slotsColumn){
            slotsColumn.forEach(function(slot){
                if(slot.arrow){
                    slot.arrow.visible = false;
                    slot.box.alpha = 0;
                }
            });
        });
        //this.drawingCanvas.clear();
    };

    myFramework.GameBoard = GameBoard;
}());

//Label
(function(){
    var Label = function(game, text, x, y, width, height, font)
    {
        var self = this;

        Phaser.Sprite.call(this, game, x, y);

        var bg = game.add.bitmapData(width, height);
        bg.fill(0, 0, 0, 0.5);

        var bgspt = new Phaser.Sprite(game, 0, 0, bg);
        bgspt.anchor.set(0.5, 0.5);

        var txt = new Phaser.Text(game, 0, 0, text, font);
        txt.anchor.set(0.5, 0.5);

        this.addChild(bgspt);
        this.addChild(txt);

        this.x = x;
        this.y = y;
        this.anchor.set(0.5, 0.5);

        return this;
    };

    Label.prototype = Object.create(Phaser.Sprite.prototype);
    Label.prototype.constructor = Label;

    myFramework.Label = Label;
}());

//Button
(function(){

    var Button = function(game, text, btnAtlas, x, y, callback)
    {
        var self = this;

        Phaser.Button.call(this, game, x, y, btnAtlas, callback, self, 0, 1, 2);


        self.txt = new Phaser.BitmapText(game, 0, -3, 'kalibers', text, 30);
        self.txt.anchor.set(0.5, 0.5);

        self.addChild(self.txt);
        self.anchor.set(0.5, 0.5);
        return self;
    };

    Button.prototype = Object.create(Phaser.Button.prototype);
    Button.prototype.constructor = Button;
    Button.prototype.setText = function(text){
        this.txt.setText(text);
    };
    myFramework.Button = Button;
}());

//Global Functions
myFramework.Functions = {
    wordWrap: function(str, maxWidth) {

        var newLineStr = "\n"; var done = false; var res = '';
        var newLineStr = "\n"; done = false; res = '';
        do {
            found = false;
            // Inserts new line at first whitespace of the line
            for (i = maxWidth - 1; i >= 0; i--) {
                if (myFramework.Functions.testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

            if (str.length < maxWidth){
                done = true;
                res += str;
            }

        } while (!done);

        return res;
    },

    testWhite: function (x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    }
}