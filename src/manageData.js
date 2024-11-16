import Axios from "axios";
import {convertToName, formatName} from './manageDisplay.js'
import {Pokemon} from './pokemonInfo'

export const fetchData = async (setLoading, setAPI) => {
    setLoading(true);
    const fetchedApi = await fetchPokedexAPI(setAPI, 1);
    // await fetchSpeciesInfo(fetchedAPI, setAPI);
    console.log("Fetched data", fetchedApi);
    setLoading(false);
};

const concurrencyLimitFetch = async (urls, limit) => {
    const results = [];
    const executing = new Set();

    for (let i  = 0; i < urls.length; i++) {
        const promise = Promise.all([
            Axios.get(urls[i][0]).then((res) => res.data).catch((err) =>
                console.error(`concurrencyLimitFetch: Error fetching pokemonUrl ${urls[i][0]} at ${i}`, err)),
            Axios.get(urls[i][1]).then((res) => res.data).catch((err) =>
                console.error(`concurrencyLimitFetch: Error fetching speciesUrl ${urls[i][0]} at ${i}`, err))
        ]);

        results.push(promise);
        executing.add(promise);

        promise.finally(() => executing.delete(promise));

        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
};

const fetchPokedexAPI = async (setAPI, pokedexId) => {
    try {
        // TODO: for (const pokedexId of pokedexIds) {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedexId}/`);

        // Extract URLs
        const urls = res.data.pokemon_entries.map((entry) => {
            const speciesUrl = entry.pokemon_species.url;
            const pokemonUrl = entry.pokemon_species.url.replace('-species', '');
            return [pokemonUrl, speciesUrl];
        })

        // Fetch in batches (e.g., 5 requests at a time)
        const fetchedData = await concurrencyLimitFetch(urls, 5);

        const pokemonList = fetchedData.map(([pokemonData, speciesData]) => {
            if (!pokemonData) {
                return null;
            }
            else {
                const printName = formatName(pokemonData.name);
                const abilities = pokemonData.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
                const stats = pokemonData.stats?.map((stat) => stat.base_stat) || [];
                const types = pokemonData.types?.map((type) => type.type.name) || [];
                if (!speciesData) {
                    console.log(`fetchPokedexApi - ${pokemonData.name} does not have species-data section. Using default values.`);
                    return new Pokemon(pokemonData.id, [], pokemonData.name, printName, pokemonData.name, abilities, stats, types,
                        {}, [], [], false, false, false);
                }
                else {
                    const appearances = speciesData.pokedex_numbers?.map((pokedex) => [pokedex.pokedex.name, pokedex.entry_number]) || [];
                    const eggGroups = speciesData.egg_groups?.map((group) => group.name) || [];
                    const varieties = speciesData.varieties?.map((variety) => variety.pokemon.name) || [];

                    return new Pokemon(pokemonData.id, appearances, pokemonData.name, formatName(pokemonData.name), pokemonData.name,
                        abilities, stats, types, {}, eggGroups, varieties, speciesData.isLegendary, speciesData.isMythical, speciesData.isBaby);
                }

                /*
                constructor(id = -1, appearances = [], name = "", printName = "", nickname = "",
                abilities = [], stats = [], types = {}, coverage = {}, eggGroups = [],
                varieties = [], isLegendary = false, isMythical = false, isBaby = false) {
                 */
            }
        }).filter(Boolean); // Remove any null values for failed requests

        setAPI(pokemonList);
        return pokemonList;
    } catch (error) {
        console.error("FetchPokedexAPI: Error fetching API:", error);
        setAPI([]);
        return [];
    }
};

export const fetchVariety = async (name, oriPokemon) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        console.log("res", res.data);

        const printName = formatName(res.data.name);
        const abilities = res.data.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
        const stats = res.data.stats?.map((stat) => stat.base_stat) || [];
        const types = res.data.types?.map((type) => type.type.name) || [];

        console.log(`fetchVariety - ${res.data}`);
        console.log('types', types);

        return new Pokemon(res.data.id, oriPokemon.appearances, res.data.name, printName, res.data.name, abilities, stats, types,
            {}, oriPokemon?.eggGroups, oriPokemon?.varieties, oriPokemon?.isLegendary, oriPokemon?.isMythical, oriPokemon?.isBaby);
    } catch (error) {
        console.error("fetchVariety: Error fetching variety:", error);
        return null;
    }
}