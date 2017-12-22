var AVAILABLE = 0;
var CLEARED = 1;
var UNAVAILABLE = 2;

var encountersInit = [
    {
        x: 700,
        y: 900,
        experience: 2,
        money: 300,
        card: 10,
        status: AVAILABLE,
        title: "NIVEL 1",
        description: "TIP: Junta la mayor\ncantidad de manos\nazules para vencer\na tu enemigo",
        enemies: [
            [
                {id: 10, level: 1}
            ]
        ],
        noElements: true
    },
    {
        x: 660,
        y: 990,
        experience: 5,
        money: 400,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 2",
        description: "TIP: Recoge solo las\npiezas del elemento\nde tu personaje",
        enemies: [
            [
                {id: 11, level: 1}
            ]
        ]
    },
    {
        x: 828,
        y: 1012,
        experience: 10,
        money: 600,
        card: 12,
        status: UNAVAILABLE,
        title: "NIVEL 3",
        description: "TIP: Ademas de ganar\ndinero y experiencia,\npodes ganar nuevas\ncartas",
        enemies: [
            [
                {id: 12, level: 1}
            ]
        ]
    },
    {
        x: 880,
        y: 880,
        experience: 11,
        money: 900,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 4",
        description: "TIP: Se acerca una\nhorda de enemigos",
        enemies: [
            [
                {id: 10, level: 1},
                {id: 11, level: 1}
            ],
            [
                {id: 12, level: 1}
            ]
        ]
    },
    {
        x: 1020,
        y: 880,
        experience: 11,
        money: 1100,
        card: 14,
        status: UNAVAILABLE,
        title: "NIVEL 5",
        description: "TIP: Usa tu magia\nsabiamente",
        enemies: [
            [
                {id: 13, level: 1},
                {id: 10, level: 1}
            ],
            [
                {id: 14, level: 1}
            ]
        ]
    },
    {
        x: 1190,
        y: 870,
        experience: 11,
        money: 1200,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 6",
        description: "TIP: Defiendete con\nel escudo",
        enemies: [
            [
                {id: 10, level: 1},
                {id: 11, level: 1},
                {id: 12, level: 1}
            ],
            [
                {id: 13, level: 1},
                {id: 14, level: 1}
            ]
        ]
    },
    {
        x: 1276,
        y: 870,
        experience: 11,
        money: 1200,
        card: 3,
        status: UNAVAILABLE,
        title: "NIVEL 7",
        description: "PELIGRO",
        enemies: [
            [
                {id: 12, level: 1},
                {id: 13, level: 1},
                {id: 14, level: 1}
            ],
            [
                {id: 10, level: 1},
                {id: 11, level: 1}
            ],
            [
                {id: 3, level: 2},
                {id: 11, level: 1}
            ]
        ]
    },
    {
        x: 930,
        y: 750,
        experience: 11,
        money: 1200,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 8",
        description: "TIP: Recupera energia\ncon los corazones",
        enemies: [
            [
                {id: 11, level: 1},
                {id: 11, level: 1},
                {id: 12, level: 1}
            ],
            [
                {id: 3, level: 2},
                {id: 12, level: 1}
            ]
        ]
    },
    {
        x: 1010,
        y: 630,
        experience: 11,
        money: 1200,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 9",
        description: "PELIGRO",
        enemies: [
            [
                {id: 14, level: 2},
                {id: 11, level: 2},
                {id: 12, level: 2}
            ],
            [
                {id: 3, level: 2},
                {id: 11, level: 1}
            ],
            [
                {id: 8, level: 2}
            ]
        ]
    },
    {
        x: 1164,
        y: 640,
        experience: 11,
        money: 1200,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 10",
        description: "TIP: Cada personaje\ntiene su magia",
        enemies: [
            [
                {id: 14, level: 1},
                {id: 13, level: 1},
                {id: 3, level: 2}
            ],
            [
                {id: 3, level: 2},
                {id: 14, level: 2}
            ]
        ]
    },
    {
        x: 1310,
        y: 700,
        experience: 11,
        money: 1500,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 11",
        description: "PELIGRO",
        enemies: [
            [
                {id: 11, level: 2},
                {id: 3, level: 2},
                {id: 3, level: 2}
            ],
            [
                {id: 3, level: 2},
                {id: 14, level: 2}
            ],
            [
                {id: 7, level: 3},
                {id: 14, level: 2}
            ]
        ]
    },
    {
        x: 1522,
        y: 730,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 12",
        description: "TIP: Mejora con dinero\ntus personajes para\nganar",
        enemies: [
            [
                {id: 7, level: 2},
                {id: 3, level: 2},
                {id: 13, level: 2}
            ],
            [
                {id: 13, level: 2},
                {id: 14, level: 2}
            ],
            [
                {id: 7, level: 2},
                {id: 14, level: 2}
            ]
        ]
    },
    {
        x: 1690,
        y: 828,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 13",
        description: "Cada vez mas cerca\n del portal",
        enemies: [
            [
                {id: 7, level: 3},
                {id: 11, level: 3},
                {id: 13, level: 3}
            ],
            [
                {id: 13, level: 3},
                {id: 14, level: 3}
            ],
            [
                {id: 3, level: 3},
                {id: 14, level: 3}
            ]
        ]
    },
    {
        x: 1578,
        y: 936,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 14",
        description: "Sigue avanzando",
        enemies: [
            [
                {id: 7, level: 3},
                {id: 11, level: 3},
                {id: 7, level: 3}
            ],
            [
                {id: 13, level: 3},
                {id: 3, level: 3}
            ],
            [
                {id: 3, level: 3},
                {id: 14, level: 3}
            ]
        ]
    },
    {
        x: 1450,
        y: 962,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 15",
        description: "PELIGRO",
        enemies: [
            [
                {id: 7, level: 3},
                {id: 14, level: 3},
                {id: 14, level: 3}
            ],
            [
                {id: 10, level: 3},
                {id: 11, level: 3},
                {id: 12, level: 3}
            ],
            [
                {id: 9, level: 4},
                {id: 14, level: 3}
            ]
        ]
    },
    {
        x: 1290,
        y: 972,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 16",
        description: "Solo 8 niveles mas",
        enemies: [
            [
                {id: 7, level: 3},
                {id: 3, level: 3},
                {id: 7, level: 3}
            ],
            [
                {id: 7, level: 4},
                {id: 11, level: 3},
                {id: 12, level: 3}
            ],
            [
                {id: 11, level: 4},
                {id: 14, level: 4}
            ]
        ]
    },
    {
        x: 1170,
        y: 1042,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 17",
        description: "TIP: Quita piezas a\ntu enemigo",
        enemies: [
            [
                {id: 9, level: 3},
                {id: 13, level: 3},
                {id: 14, level: 3}
            ],
            [
                {id: 8, level: 3},
                {id: 11, level: 3},
                {id: 8, level: 3}
            ],
            [
                {id: 7, level: 3},
                {id: 3, level: 3}
            ]
        ]
    },
    {
        x: 1276,
        y: 1072,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 18",
        description: "Mas cerca",
        enemies: [
            [
                {id: 14, level: 4},
                {id: 13, level: 4},
                {id: 14, level: 4}
            ],
            [
                {id: 8, level: 3},
                {id: 7, level: 3},
                {id: 7, level: 3}
            ],
            [
                {id: 9, level: 3},
                {id: 3, level: 3}
            ]
        ]
    },
    {
        x: 1326,
        y: 1180,
        experience: 11,
        money: 2100,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 19",
        description: "PELIGRO",
        enemies: [
            [
                {id: 14, level: 3},
                {id: 11, level: 3},
                {id: 9, level: 3}
            ],
            [
                {id: 7, level: 3},
                {id: 3, level: 3},
                {id: 8, level: 3}
            ],
            [
                {id: 7, level: 3},
                {id: 4, level: 5}
            ]
        ]
    },
    {
        x: 1230,
        y: 1192,
        experience: 20,
        money: 2620,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 20",
        description: "Solo 4 mas",
        enemies: [
            [
                {id: 7, level: 3},
                {id: 11, level: 3},
                {id: 9, level: 3}
            ],
            [
                {id: 4, level: 5},
                {id: 3, level: 3}
            ],
            [
                {id: 3, level: 3},
                {id: 7, level: 4}
            ]
        ]
    },
    {
        x: 1120,
        y: 1220,
        experience: 20,
        money: 2620,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 21",
        description: "PELIGRO",
        enemies: [
            [
                {id: 8, level: 3},
                {id: 11, level: 3},
                {id: 14, level: 3}
            ],
            [
                {id: 4, level: 5},
                {id: 7, level: 3}
            ],
            [
                {id: 6, level: 6},
                {id: 7, level: 4}
            ]
        ]
    },
    {
        x: 1060,
        y: 1268,
        experience: 20,
        money: 2620,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 22",
        description: "Ultimos niveles",
        enemies: [
            [
                {id: 8, level: 3},
                {id: 11, level: 3},
                {id: 14, level: 3}
            ],
            [
                {id: 6, level: 5},
                {id: 7, level: 3}
            ],
            [
                {id: 3, level: 5},
                {id: 7, level: 4}
            ]
        ]
    },
    {
        x: 970,
        y: 1304,
        experience: 20,
        money: 2620,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 23",
        description: "Solo uno",
        enemies: [
            [
                {id: 13, level: 4},
                {id: 11, level: 4},
                {id: 14, level: 4}
            ],
            [
                {id: 6, level: 5},
                {id: 7, level: 5}
            ],
            [
                {id: 4, level: 5},
                {id: 3, level: 4}
            ]
        ]
    },
    {
        x: 790,
        y: 1300,
        experience: 20,
        money: 2620,
        card: -1,
        status: UNAVAILABLE,
        title: "NIVEL 24",
        description: "Combate final",
        enemies: [
            [
                {id: 10, level: 4},
                {id: 11, level: 4},
                {id: 13, level: 4}
            ],
            [
                {id: 9, level: 5},
                {id: 7, level: 5},
                {id: 6, level: 5}
            ],
            [
                {id: 5, level: 8},
                {id: 3, level: 4},
                {id: 3, level: 4}
            ]
        ]
    }
]