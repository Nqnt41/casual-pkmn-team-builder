import {parseTypes} from './manageTypes.js'
import {pokedexIDtoName} from './textParsing.js';

export class Pokedex {
    constructor(id = -1, active = true, list = []) {
        this.id = id;
        this.name = pokedexIDtoName(id);
        this.active = active;
        this.list = list;
    }
}

export class Pokemon {
    constructor(id = -1, appearances = [], name = "", printName = "", nickname = name, abilities = [],
                stats = [], types = [], coverage = {}, eggGroups = [],
                varieties = [], isLegendary = false, isMythical = false, isBaby = false) {
        this.id = id;
        this.appearances = appearances;
        this.name = name;
        this.printName = printName;
        this.nickname = nickname;
        this.abilities = abilities;
        this.stats = stats;
        if (typeof types[0] == 'string') { // changed this so that parseTypes is called
            this.types = parseTypes(types);
        }
        else {
            this.types = types;
        }
        this.coverage = coverage;
        this.eggGroups = eggGroups;
        this.varieties = varieties;
        this.isLegendary = isLegendary;
        this.isMythical = isMythical;
        this.isBaby = isBaby;
    }
}