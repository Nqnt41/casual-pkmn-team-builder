import Axios from "axios";
import {convertToName} from './manageDisplay.js'
import {Pokemon} from './pokemonInfo'

export const fetchData = async (setLoading, setAPI) => {
    setLoading(true);
    const fetchedAPI = await fetchPokedexAPI(setAPI, 1);
    console.log("Did it work", fetchedAPI);
    await fetchSpeciesInfo(fetchedAPI, setAPI);
    setLoading(false);
};

/*const fetchAPI = async (setAPI) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1025`);
        setAPI(res.data.results); // Adjust for correct data structure 1025
        return res.data.results;
    }
    catch (error) {
        console.error("FetchAPI: Error fetching API:", error);
        setAPI([]);
        return [];
    }
};*/

const concurrencyLimitFetch = async (urls, limit) => {
    const results = [];
    const executing = new Set();

    for (let i  = 0; i < urls.length; i++) {
        const promise = Axios.get(urls[i]).then((res) => res.data).catch((err) => console.error(`Error fetching ${urls[i]}`, err));

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
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedexId}/`);

        // Extract URLs
        const urls = res.data.pokemon_entries.map((entry) =>
            entry.pokemon_species.url.replace('-species', ''));

        // Fetch in batches (e.g., 5 requests at a time)
        const fetchedData = await concurrencyLimitFetch(urls, 5);

        const pokemonList = fetchedData.map((data, index) => {
            if (!data) return null; // Skip any failed requests

            const abilities = data.abilities?.map((ability) => [ability.ability.name, ability.is_hidden]) || [];
            const stats = data.stats?.map((stat) => stat.base_stat) || [];
            const types = data.types?.map((type) => type.type.name) || [];
            //const appearances = data.pokedex_numbers?.map((pokedex) => [pokedex.pokedex.name, pokedex.entry_number]) || [];
            //const eggGroups = data.egg_groups?.map((group) => group.name) || [];

            return new Pokemon(data.id, [], data.name, data.name, abilities, stats, types, {}, [], [], false, false, false);
        }).filter(Boolean); // Remove any null values for failed requests

        setAPI(pokemonList);
        return pokemonList;
    } catch (error) {
        console.error("FetchPokedexAPI: Error fetching API:", error);
        setAPI([]);
        return [];
    }
};

const fetchSpeciesInfo = async (fetchedAPI, setAPI) => {
    const apiCopy = [...fetchedAPI];

    for (let i  = apiCopy.length; i > 0; i--) {
        const altForm = await checkAltForms(i);

        for (let j  = 0; j < altForm.length; j++) {
            apiCopy.splice(i, 0, altForm[j]);
        }
    }

    setAPI(apiCopy);
};

const checkAltForms = async (id) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const altForms = [];
        for (let i = res.data.varieties?.length - 1; i >= 0; i--) {
            if (!res.data.varieties[i].is_default && !res.data.varieties[i].pokemon.name.includes("totem")) {
                altForms.push(res.data.varieties[i].pokemon);
            }
        }
        return altForms;
    }
    catch (error) {
        console.error("checkAltForm: error fetching species", error);
        return [];
    }
}

export const fetchPokemonData = async (member, setData, setID) => {
    try {
        if (typeof member !== 'number' && member.includes(' ')) {
            member = convertToName(member);
        }
        if (!/^[\d\w\-\.\s]+$/.test(member)) {
            console.error("fetchPokemonData: Invalid Pokemon name");
            setData("");
            setID(null);
            return null;
        }
        else {
            const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${member}`); // TODO: Search broken
            setData(res.data);
            return res.data;
        }
    }
    catch (error) {
        console.error("fetchPokemonData: Failed to fetch!", error);
        setData("");
        setID(null);
        return null;
    }
};