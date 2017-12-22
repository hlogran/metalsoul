var playerInit = {
    //general
    money: 0,
    level: 1,
    experience: 0,
    cards: [
        {id: -1, level: 1, selected: true},
        {id: -1, level: 1, selected: true},
        {id: -1, level: 1, selected: true},
        {id: -1, level: 1, selected: false},
        {id: -1, level: 1, selected: false}
    ],
    getExperienceToLevel: function(level){
        return 1500000 * Math.pow((level - 1) / 98, 2.5);
    }
}