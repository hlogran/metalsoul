(function(){
    var _game;
    var _soundManager;

    var ParticleManager = {
        initialize: function (game, soundManager){
            _game = game;
            _soundManager = soundManager;
        },
        effects: {
            FireBallRed: 'attack_red',
            FireBallGreen: 'attack_green',
            FireBallBlue: 'attack_blue',
            particleRed: 'particle_red',
            particleBlue: 'particle_blue',
            particleGreen: 'particle_green'
        },
        shot: function(effect, from, to, callback){
            //creo el emitter

            var missile = _game.add.emitter(from.x, from.y);

            missile.makeParticles( effect );
            missile.gravity = 0;
            missile.setXSpeed(0, 0);
            missile.setYSpeed(0, 0);

            missile.setScale(1, 0, 1, 0, 1000);
            missile.start(false, 10000, 1);

            //variables para tracear posicion
            var currentPos = {x: from.x , y: from.y};
            var prevPos = {x: from.x , y: from.y};
            
            var tweenMissile = _game.add.tween(currentPos).to({
                x: [from.x, _game.rnd.between(0, _game.width), to.x],
                y: [from.y, _game.rnd.between(0, _game.height), to.y]
            }, 750, Phaser.Easing.Linear.None, true).interpolation(function(v, k){
                return Phaser.Math.bezierInterpolation(v, k);
            });

            tweenMissile.onUpdateCallback(function(){
                missile.x = prevPos.x = currentPos.x;
                missile.y = prevPos.y = currentPos.y;
            }, self);

            tweenMissile.onComplete.add(function(){
                _game.add.tween(missile).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0)
                    .onComplete.add(function(){
                        missile.destroy(true);
                    }
                );

                if(callback){
                    callback();
                }
            });
        }
    }
    window.ParticleManager = ParticleManager;
}());

