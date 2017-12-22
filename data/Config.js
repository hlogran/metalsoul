var COOKIE_NAME = "CCG";

var config = {
    //general
    game_width: 960,
    game_height: 640,
    game_half_width: 960/2,
    game_half_height: 640/2,

    game_images_folder: 'assets/images/',

    //diseño de cartas
    card_zoom_time: 500,
    card_image_pos: {x: 0, y: -87},
    card_element_pos: {x: -144, y: -216},
    card_name_pos: {x: -75, y: -215},
    card_name_font: { font: "bold 25px kaliber_solid_brkregular", fill: 'white', stroke: 'black', strokeThickness:3 },
    card_level_pos: {x: -95, y: 5},
    card_level_font: { font: "bold 25px kaliber_solid_brkregular", fill: 'white', stroke: 'black', strokeThickness:3 },
    card_stats_font: { font: "bold 22px kaliber_solid_brkregular", fill: 'white', stroke: 'black', strokeThickness:3 },
    card_stats_hp_pos: {x: -19, y: 51},
    card_stats_attack_pos: {x: 155, y: 51},
    card_stats_recovery_pos: {x: 5, y: 110},
    card_description_font: { font: "bold 20px kaliber_solid_brkregular", fill: 'white', stroke: 'black', strokeThickness:3 },
    card_description_pos: {x: -30, y: 145},
    card_description_width: 310,
    card_thumbnail_element_pos: {x: 34, y: -33},
    card_thumbnail_element_size: 31,

    calcAtaque: function(ataque, cantidadFichas){
        return Math.floor(ataque * cantidadFichas);
    }

}