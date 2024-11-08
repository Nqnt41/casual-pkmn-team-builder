class Pokemon {
    constructor(globalId = -1, id = -1, name = "", nickname = "", abilities = {}, encounters = "", stats = {}, types = {}, coverage = {},
                forms = [], varieties = [], sprite = "", shinySprite = "", isLegendary = false, isMythical = false) {
        this.globalId = globalId;
        this.id = id;
        this.name = name;
        this.nickname = name;
        this.abilities = abilities;
        this.encounters = encounters;
        this.stats = stats;
        this.types = types;
        this.coverage = coverage;
        this.forms = forms;
        this.varieties = varieties;
        this.sprite = sprite;
        this.shinySprite = shinySprite;
        this.isLegendary = isLegendary;
        this.isMythical = isMythical;
    }
}

const types = {
    normal: {
        id: 1,
        name: "normal",
        color: "#A8A77A",
        weakness: new Set(["fighting"]), // use Sets for faster lookup //weakness
        //effectiveAgainst: new Set([]),// effectiveAgainst
        //halfDamageFrom: new Set([]), // resists
        halfDamageTo: new Set(["rock", "steel"]), // weakAgainst
        noDamageFrom: new Set(["ghost"]),
        noDamageTo: new Set(["ghost"]),
    },
    fighting: {
        id: 2,
        name: "fighting",
        color: "#C22E28",
        weakness: new Set(["flying", "psychic", "fairy"]),
        effectiveAgainst: new Set(["normal", "rock", "steel", "ice", "dark"]),
        halfDamageFrom: new Set(["rock", "bug", "dark"]),
        halfDamageTo: new Set(["flying", "poison", "bug", "psychic", "fairy"]),
        //noDamageFrom: new Set([]),
        noDamageTo: new Set(["ghost"]),
    },
    flying: {
        id: 3,
        name: "flying",
        color: "#A98FF3",
        weakness: new Set(["rock", "electric", "ice"]),
        effectiveAgainst: new Set(["fighting", "bug", "grass"]),
        halfDamageFrom: new Set(["fighting", "bug", "grass"]),
        halfDamageTo: new Set(["rock", "steel", "electric"]),
        noDamageFrom: new Set(["ground"]),
        //noDamageTo: new Set([]),
    },
    poison: {
        id: 4,
        name: "poison",
        color: "#A33EA1",
        weakness: new Set(["ground", "psychic"]),
        effectiveAgainst: new Set(["grass", "fairy"]),
        halfDamageFrom: new Set(["fighting", "poison", "bug", "grass", "fairy"]),
        halfDamageTo: new Set(["poison", "ground", "rock", "ghost"]),
        //noDamageFrom: new Set([]),
        noDamageTo: new Set(["steel"]),
    },
    ground: {
        id: 5,
        name: "ground",
        color: "#E2BF65",
        weakness: new Set(["water", "grass", "ice"]),
        effectiveAgainst: new Set(["poison", "rock", "steel", "fire", "electric"]),
        halfDamageFrom: new Set(["poison", "rock"]),
        halfDamageTo: new Set(["bug", "grass"]),
        noDamageFrom: new Set(["electric"]),
        noDamageTo: new Set(["flying"]),
    },
    rock: {
        id: 6,
        name: "rock",
        color: "#B6A136",
        weakness: new Set(["fighting", "ground", "steel", "water", "grass"]),
        effectiveAgainst: new Set(["flying", "bug", "fire", "ice"]),
        halfDamageFrom: new Set(["normal", "flying", "poison", "fire"]),
        halfDamageTo: new Set(["fighting", "ground", "steel"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    bug: {
        id: 7,
        name: "bug",
        color: "#A6B91A",
        weakness: new Set(["flying", "rock", "fire"]),
        effectiveAgainst: new Set(["grass", "psychic", "dark"]),
        halfDamageFrom: new Set(["fighting", "ground", "grass"]),
        halfDamageTo: new Set(["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    ghost: {
        id: 8,
        name: "ghost",
        color: "#735797",
        weakness: new Set(["ghost", "dark"]),
        effectiveAgainst: new Set(["ghost", "psychic"]),
        halfDamageFrom: new Set(["poison", "bug"]),
        halfDamageTo: new Set(["dark"]),
        noDamageFrom: new Set(["normal", "fighting"]),
        noDamageTo: new Set(["normal"]),
    },
    steel: {
        id: 9,
        name: "steel",
        color: "#B7B7CE",
        weakness: new Set(["fighting", "ground", "fire"]),
        effectiveAgainst: new Set(["rock", "ice", "fairy"]),
        halfDamageFrom: new Set(["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"]),
        halfDamageTo: new Set(["steel", "fire", "water", "electric"]),
        noDamageFrom: new Set(["poison"]),
        //noDamageTo: new Set([]),
    },
    fire: {
        id: 10,
        name: "fire",
        color: "#EE8130",
        weakness: new Set(["ground", "rock", "water"]),
        effectiveAgainst: new Set(["bug", "steel", "grass", "ice"]),
        halfDamageFrom: new Set(["bug", "steel", "fire", "grass", "ice", "fairy"]),
        halfDamageTo: new Set(["rock", "fire", "water", "dragon"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    water: {
        id: 11,
        name: "water",
        color: "#6390F0",
        weakness: new Set(["grass", "electric"]),
        effectiveAgainst: new Set(["ground", "rock", "fire"]),
        halfDamageFrom: new Set(["steel", "fire", "water", "ice"]),
        halfDamageTo: new Set(["water", "grass", "dragon"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    grass: {
        id: 12,
        name: "grass",
        color: "#7AC74C",
        weakness: new Set(["flying", "poison", "bug", "fire", "ice"]),
        effectiveAgainst: new Set(["ground", "rock", "water"]),
        halfDamageFrom: new Set(["ground", "water", "grass", "electric"]),
        halfDamageTo: new Set(["flying", "poison", "bug", "steel", "fire", "grass", "dragon"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    electric: {
        id: 13,
        name: "electric",
        color: "#F7D02C",
        weakness: new Set(["ground"]),
        effectiveAgainst: new Set(["flying", "water"]),
        halfDamageFrom: new Set(["flying", "steel", "electric"]),
        halfDamageTo: new Set(["grass", "electric", "dragon"]),
        //noDamageFrom: new Set([]),
        noDamageTo: new Set(["ground"]),
    },
    psychic: {
        id: 14,
        name: "psychic",
        color: "#F95587",
        weakness: new Set(["bug", "ghost", "dark"]),
        effectiveAgainst: new Set(["fighting", "poison"]),
        halfDamageFrom: new Set(["fighting", "psychic"]),
        halfDamageTo: new Set(["steel", "psychic"]),
        //noDamageFrom: new Set([]),
        noDamageTo: new Set(["dark"]),
    },
    ice: {
        id: 15,
        name: "ice",
        color: "#96D9D6",
        weakness: new Set(["fighting", "rock", "steel", "fire"]),
        effectiveAgainst: new Set(["flying", "ground", "grass", "dragon"]),
        halfDamageFrom: new Set(["ice"]),
        halfDamageTo: new Set(["steel", "fire", "water", "ice"]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    },
    dragon: {
        id: 16,
        name: "dragon",
        color: "#6F35FC",
        weakness: new Set(["ice", "dragon", "fairy"]),
        effectiveAgainst: new Set(["dragon"]),
        halfDamageFrom: new Set(["fire" , "water", "grass", "electric"]),
        halfDamageTo: new Set(["steel"]),
        //noDamageFrom: new Set([]),
        noDamageTo: new Set(["fairy"]),
    },
    dark: {
        id: 17,
        name: "dark",
        color: "#705746",
        weakness: new Set(["fighting", "bug", "fairy"]),
        effectiveAgainst: new Set(["ghost", "psychic"]),
        halfDamageFrom: new Set(["ghost" , "dark"]),
        halfDamageTo: new Set(["fighting", "dark", "fairy"]),
        noDamageFrom: new Set(["psychic"]),
        //noDamageTo: new Set([]),
    },
    fairy: {
        id: 18,
        name: "fairy",
        color: "#D685AD",
        weakness: new Set(["poison", "steel"]),
        effectiveAgainst: new Set(["fighting", "dragon", "dark"]),
        halfDamageFrom: new Set(["fighting", "bug", "dark"]),
        halfDamageTo: new Set(["poison", "steel", "fire"]),
        noDamageFrom: new Set(["dragon"]),
        //noDamageTo: new Set([]),
    },
    stellar: {
        id: 19,
        name: "stellar",
        color: "#40B5A5",
        //weakness: new Set([]),
        //effectiveAgainst: new Set([]),
        //halfDamageFrom: new Set([]),
        //halfDamageTo: new Set([]),
        //noDamageFrom: new Set([]),
        //noDamageTo: new Set([]),
    }
}