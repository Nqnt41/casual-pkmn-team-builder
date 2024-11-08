import Axios from "axios";
import {convertToName} from './manageDisplay.js'
import {pokemon} from './pokemonInfo'

export const fetchData = async (setLoading, setAPI) => {
    setLoading(true);
    const fetchedAPI = await fetchAPI(setAPI);
    await fetchSpeciesInfo(fetchedAPI, setAPI);
    setLoading(false);
};

const fetchAPI = async (setAPI) => {
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
};

const fetchPokedexAPI = async (setAPI, pokedexId) => {
    try {
        const res = await Axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedexId}/`);
        const pokemonList = res.data.pokemon_entries.map(entry => ({
            name: entry.pokemon_species.name,
            url: `https://pokeapi.co/api/v2/pokemon/${entry.pokemon_species.name}/`
        }));
        setAPI(pokemonList);
        return pokemonList;
    }
    catch (error) {
        console.error("FetchAPI: Error fetching API:", error);
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