import Axios from "axios";
import {formatName} from '../textParsing.js'
import {Pokedex, Pokemon} from '../pokemonInfo'

export const fetchInitialData = async (game, setLoading, setBackgroundLoading, setAPI, api, setConfirmed, confirmed) => {
    const allGames = [1, 2, 3, 4, 6, 7, 8, 9, 12, 13, 14, 16, 21, 27, 31];

    if (!confirmed) {
        setLoading(true);

        let gameIds = [game]; // Keep track of game as an array
        if (game === 10) {
            gameIds = [12, 13, 14]; // Change to an array
            console.log("true", gameIds);
        }

        await fetchData(gameIds, true, setLoading, setAPI, api);
        setLoading(false);

        setBackgroundLoading(true);

        // Ensure `allGames.filter()` works properly by handling `gameIds` as an array
        const remainingGames = allGames.filter(item => !gameIds.includes(item));

        await fetchData(remainingGames, false, setLoading, setAPI, api);
        setBackgroundLoading(false);

        setConfirmed(true);
    }
};

export const fetchData = async (pokedexIDs, isActive, setLoading, setAPI) => {
    const newAPI = [];
    for (const pokedexID of pokedexIDs) {
        const fetchedAPI = await fetchPokedexAPI(pokedexID);
        const fetchedPokedex = new Pokedex(pokedexID, isActive, fetchedAPI);

        if (fetchedAPI != null) {
            newAPI.push(fetchedPokedex);
        }
    }

    console.log(newAPI);

    setAPI((prevAPI) => [...prevAPI, ...newAPI]);
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

const fetchPokedexAPI = async (pokedexID) => {
    try {
        // TODO: for (const pokedexID of pokedexIDs) {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedexID}/`);

        const urls = res.data.pokemon_entries.map((entry) => {
            const speciesUrl = entry.pokemon_species.url;
            const pokemonUrl = entry.pokemon_species.url.replace('-species', '');
            return [pokemonUrl, speciesUrl];
        })

        // Fetch in batches
        const fetchedData = await concurrencyLimitFetch(urls, 5);

        return fetchedData.map(([pokemonData, speciesData]) => {
            if (!pokemonData) {
                return null;
            } else {
                const printName = formatName(pokemonData.name);
                const abilities = pokemonData.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
                const stats = pokemonData.stats?.map((stat) => stat.base_stat) || [];
                const types = pokemonData.types?.map((type) => type.type.name) || [];
                if (!speciesData) {
                    console.log(`fetchPokedexAPI - ${pokemonData.name} does not have species-data section. Using default values.`);
                    return new Pokemon(pokemonData.id, [], pokemonData.name, printName, pokemonData.name, abilities, stats, types,
                        {}, [], [], false, false, false);
                } else {
                    const appearances = speciesData.pokedex_numbers?.map((pokedex) => [pokedex.pokedex.name, pokedex.entry_number]) || [];
                    const eggGroups = speciesData.egg_groups?.map((group) => group.name) || [];
                    const varieties = speciesData.varieties?.map((variety) => variety.pokemon.name) || [];

                    return new Pokemon(pokemonData.id, appearances, pokemonData.name, formatName(pokemonData.name), pokemonData.name,
                        abilities, stats, types, {}, eggGroups, varieties, speciesData.isLegendary, speciesData.isMythical, speciesData.isBaby);
                }
            }
        }).filter(Boolean);
    } catch (error) {
        console.error("FetchPokedexAPI: Error fetching API:", error);
        return [];
    }
};

export const fetchPokemon = async (name) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        const pokemonData = res.data;
        const speciesRes = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        const speciesData = speciesRes.data;
        console.log("res", pokemonData);

        const printName = formatName(pokemonData.name);
        const abilities = pokemonData.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
        const stats = pokemonData.stats?.map((stat) => stat.base_stat) || [];
        const types = pokemonData.types?.map((type) => type.type.name) || [];

        if (!speciesData) {
            if (pokemonData.species.name !== pokemonData.name) {
                console.log(`fetchPokemon - ${pokemonData.name} is variety. Use species data from base species.`);

                const baseRes = await Axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.species.name}/`);
                const baseData = baseRes.data;

                const appearances = baseData.pokedex_numbers?.map((pokedex) => [pokedex.pokedex.name, pokedex.entry_number]) || [];
                const eggGroups = baseData.egg_groups?.map((group) => group.name) || [];
                const varieties = baseData.varieties?.map((variety) => variety.pokemon.name) || [];

                return new Pokemon(pokemonData.id, appearances, pokemonData.name, printName, pokemonData.name, abilities, stats, types,
                    {}, eggGroups, varieties, baseData.isLegendary, baseData.isMythical, baseData.isBaby);
            }
            else {
                console.log(`fetchPokemon - ${pokemonData.name} does not have species-data section. Using default values.`);
                return new Pokemon(pokemonData.id, [], pokemonData.name, printName, pokemonData.name, abilities, stats, types,
                    {}, [], [], false, false, false);
            }
        }
        else {
            const appearances = speciesData.pokedex_numbers?.map((pokedex) => [pokedex.pokedex.name, pokedex.entry_number]) || [];
            const eggGroups = speciesData.egg_groups?.map((group) => group.name) || [];
            const varieties = speciesData.varieties?.map((variety) => variety.pokemon.name) || [];

            return new Pokemon(pokemonData.id, appearances, pokemonData.name, formatName(pokemonData.name), pokemonData.name,
                abilities, stats, types, {}, eggGroups, varieties, speciesData.isLegendary, speciesData.isMythical, speciesData.isBaby);
        }
    } catch (error) {
        console.error("fetchVariety: Error fetching variety:", error);
        return null;
    }
}

export const fetchVariety = async (name, oriPokemon) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        console.log("res", res.data);

        const printName = formatName(res.data.name);
        const abilities = res.data.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
        const stats = res.data.stats?.map((stat) => stat.base_stat) || [];
        const types = res.data.types?.map((type) => type.type.name) || [];

        return new Pokemon(res.data.id, oriPokemon.appearances, res.data.name, printName, res.data.name, abilities, stats, types,
            {}, oriPokemon?.eggGroups, oriPokemon?.varieties, oriPokemon?.isLegendary, oriPokemon?.isMythical, oriPokemon?.isBaby);
    } catch (error) {
        console.error("fetchVariety: Error fetching variety:", error);
        return null;
    }
}