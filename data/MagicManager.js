(function(){
    var _game;
    var _soundManager;

    function _getTeam(card){
        var team = null;
        var enemies = null;
        _game.player.cards.forEach(function(_card){
            if(team === null){
                if(_card === card){
                    team = _game.player.cards;
                }
            }
        });
        if(team === null){
            team = _game.cpu.cards;
            enemies = _game.player.cards;
        }
        else{
            enemies = _game.cpu.cards;
        }
        return {team: team, enemies: enemies}
    }

    function zap(card, chosenEnemy, damageDone, callback) {
        ParticleManager.shot(card.magicEffect,
            {x: card.x, y: card.y},
            {x: chosenEnemy.x, y: chosenEnemy.y},
            function(){
                //shake
                _soundManager.playSfx("attack");
                _game.add.tween(chosenEnemy).to({ x: chosenEnemy.x+5 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);

                var x = _game.rnd.between( chosenEnemy.x - chosenEnemy.width/2 + 25,  chosenEnemy.x + chosenEnemy.width/2 - 25 );
                var y = _game.rnd.between( chosenEnemy.y - chosenEnemy.height/2 + 25,  chosenEnemy.y + chosenEnemy.height/2 - 25 );

                var lblDanio = new Phaser.BitmapText(_game, x, y, 'kalibers', damageDone.toString(), 50);
                lblDanio.tint = "0xFF0000";
                lblDanio.anchor.set(0.5, 0.5);
                _game.world.add(lblDanio);

                _game.add.tween(lblDanio).to({y: y-25, alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0)
                    .onComplete.add(function(){
                    _game.add.tween(lblDanio).to({alpha:0}, 2000, null, true, 0)
                        .onComplete.add(function(){
                            lblDanio.destroy(true);
                        });
                });
                if(callback){
                    setTimeout(callback, 100);
                }
            }
        );
    };

    var MagicManager = {
        Initialize: function (game, soundManager){
            _game = game;
            _soundManager = soundManager;
        },
        AttackOne: function(callback){

            var card = this;
            var power = this.magicPower;
            //obtengo el equipo enemigo
            var enemies = _getTeam(card).enemies;

            //obtengo el mayor daño
            var biggestDamage = 0;
            var chosenEnemy = null;
            enemies.forEach(function(enemy){
                var oldDefense = enemy.defense;
                var oldLife = enemy.life;
                var oldMagic= enemy.magic;
                var resultOfAttack = _game.takeDamage(enemy, card.element, power);
                var damageTaken = resultOfAttack.damageTaken + resultOfAttack.defenseTaken;
                if( damageTaken > biggestDamage ){
                    biggestDamage = damageTaken;
                    chosenEnemy = enemy;
                }
                else if( damageTaken == biggestDamage && resultOfAttack.dead){
                    chosenEnemy = enemy;
                }
                enemy.life = oldLife;
                enemy.defense = oldDefense;
                enemy.magic = oldMagic;
            });

            zap(card, chosenEnemy, power, function(){
                //aplico el daño al enemigo seleccionado
                _game.takeDamage(chosenEnemy, card.element, power);

                //reseteo los puntos de magia de la carta
                card.magic = 0;

                //actualizo las barras
                _game.updateBars(callback);
            });

        },
        AttackAll: function(callback){
            var card = this;
            var power = this.magicPower;

            //obtengo el equipo enemigo
            var enemies = _getTeam(card).enemies;

            var zapCounter = 0;

            function onZapEnded(enemy){
                zapCounter--;
                _game.takeDamage(enemy, card.element, power);
                if(zapCounter<=0){
                    _game.updateBars(callback);
                }
            }

            //aplico el daño a todos
            enemies.forEach(function(enemy){
                zapCounter++;
                zap(card, enemy, power,
                    function(){
                        onZapEnded(enemy);
                    });
            });

            //reseteo los puntos de magia de la carta
            card.magic = 0;

            //actualizo las barras
        },
        ChangeTokensElement: function(callback){
            var card = this;

            if(card.doMagicParams.length>=0){
                var from = card.doMagicParams[0];
                //cambio el elemento de los tokens
                _game.gameBoard.slots.forEach(function(slotCol){
                    slotCol.forEach(function(slot){
                        if(slot.token != null){
                            if(slot.token.element === from){
                                slot.token.setElement(card.element);
                            }
                        }
                    });
                });
            }

            //reseteo los puntos de magia de la carta
            card.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        DropDefenseOne: function(callback){
            var card = this;
            var power = this.magicPower;

            //obtengo el equipo enemigo
            var enemies = _getTeam(card).enemies;

            //obtengo el enemigo mas aprovechable
            var biggestDefenseDrop = 0;
            var lesserDefense = 0;
            var lesserLife = 0;
            var chosenEnemy = null;
            enemies.forEach(function(enemy){
                var defenseDrop = Math.min(enemy.defense, power);
                if(defenseDrop > biggestDefenseDrop || chosenEnemy==null){
                    chosenEnemy = enemy;
                    lesserDefense = enemy.defense;
                    lesserLife = enemy.life;
                }
                else if (defenseDrop === biggestDefenseDrop){
                    if(enemy.defense < lesserDefense){
                        chosenEnemy = enemy;
                        lesserDefense = enemy.defense;
                        lesserLife = enemy.life;
                    }
                    else if(enemy.defense == lesserDefense && enemy.life < lesserLife){
                        chosenEnemy = enemy;
                        lesserLife = enemy.life;
                    }
                }
            });

            //aplico la reduccion de defensa al enemigo seleccionado
            chosenEnemy.defense = Math.max(0, chosenEnemy.defense-power);

            //reseteo los puntos de magia de la carta
            card.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        DropDefenseAll: function(callback){
            var card = this;
            var power = this.magicPower;

            //obtengo el equipo enemigo
            var enemies = _getTeam(card).enemies;

            //aplico la reduccion a todos
            enemies.forEach(function(enemy){
                enemy.defense = Math.max(0, enemy.defense-power);
            });

            //reseteo los puntos de magia de la carta
            card.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        RaiseDeffenseSelf: function(callback){
            var power = this.magicPower;
            //elevo la defensa de la carta
            this.defense = Math.min(this.maxDefense, this.defense+power);

            //reseteo los puntos de magia de la carta
            this.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        RaiseDeffenseAll: function(callback){
            var power = this.magicPower;
            //obtengo el equipo
            var team = _getTeam(this).team;

            //elevo a todos
            team.forEach(function(card){
                card.defense = Math.min(card.maxDefense, card.defense+power);
            });

            //reseteo los puntos de magia de la carta
            this.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        HealSelf: function(callback){
            var power = this.magicPower;
            //elevo la defensa de la carta
            this.life = Math.min(this.maxLife, this.life+power);

            //reseteo los puntos de magia de la carta
            this.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        },
        HealAll: function(callback){
            var power = this.magicPower;
            //obtengo el equipo
            var team = _getTeam(this).team;

            //elevo a todos
            team.forEach(function(card){
                card.life = Math.min(card.maxLife, card.life+power);
            });

            //reseteo los puntos de magia de la carta
            this.magic = 0;

            //actualizo las barras
            _game.updateBars(callback);
        }
    }
    window.MagicManager = MagicManager;
}());

