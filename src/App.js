import './App.css';
import './pokemon.css'
import Axios from "axios";
import {useEffect, useState} from "react";

function App() {
    const [data, setData] = useState("");
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        printTeamImages();
    }, [api]);

    const fetchData = async () => {
        setLoading(true);
        const fetchedAPI = await fetchAPI();
        await fetchSpeciesInfo(fetchedAPI);
        setLoading(false);
    };

    const fetchAPI = async () => {
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

    const fetchSpeciesInfo = async (fetchedAPI) => {
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
            return null;
        }
    }

    const fetchPokemonData = async (member) => {
        if (member == null) {
            member = id;
        }
        try {
            if (!/^\d+$/.test(member) && !/^[a-zA-Z]+$/.test(member)) {
                console.error("fetchPokemonData: Invalid Pokemon name");
                setData("");
                setID(null);
                return null;
            }
            else {
                const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${member}`);
                setData(res.data);
                return res.data;
            }
        }
        catch (error) {
            console.error("fetchPokemonData: Failed to fetch", error);
            setData("");
            setID(null);
            return null;
        }
    };

    const spliceID = (url) => {
        if (url.includes("https://pokeapi.co/api/v2/pokemon/")) {
            const regex = /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\d+)\/?$/;
            const match = url.match(regex);

            if (match) {
                return match[1];
            }
            return null;
        }
        return null;
    };

    const addToTeam = async (member) => {
        const fetchedData = await fetchPokemonData(member);
        console.log(fetchedData);

        if (fetchedData == null) {
            setNote("Not a valid ID!");
        }
        else if (team.length < 6) {
            setTeam([...team, fetchedData]);
            console.log(team);

            setNote("");
        }
        else {
            setNote("Team is full!");
        }
    };

    const removeFromTeam = async (member) => {
        const newTeam = team.filter((pokemon) => pokemon !== member);

        setTeam(newTeam);
    };

    const printTeamImages = () => {
        if (!team.length) {
            return <p>No team members yet!</p>;
        }

        return ( //TODO: Images not printing for some god forsaken reason. Consult version history. Also find a way to stop the loading every change.
            <div>
                {team.map((pokemon, index) => (
                    <img
                        className={`teamSprite behindSprite ${pokemon.types[1] ? 'behindSprite2' : ''}`}
                        data-type={pokemon.types[0].type.name}
                        data-type2={pokemon.types[1] ? pokemon.types[1].type.name : ''}
                        key={index}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                        onClick={() => {
                            removeFromTeam(pokemon);
                        }}
                    />
                ))}
            </div>
        );
    };

    const printAllImages = () => {
        if (loading) {
            return <h1>Loading...</h1>
        }
        else {
            return (
                <div>
                    {api.map((pokemon, index) => (
                        <img
                            className="pokemonSprite"
                            key={spliceID(pokemon?.url)} // TODO: Index doesnt work for extra things lol
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spliceID(pokemon?.url)}.png`}
                            onClick={() => addToTeam(spliceID(pokemon?.url))}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="App">
            {printTeamImages()}

            <input
                placeholder="Pokemon ID"
                onChange={(event) => {
                    setID(event.target.value);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        addToTeam();
                    }
                }}
            />
            <button onClick={() => addToTeam()}> Print </button>
            <h1> {data?.name} </h1>
            {team.map((member, index) => (
                <h3 onClick={() => removeFromTeam(member)} key={index}>{index + 1 + ". " + member?.name}</h3>
            ))}
            <h3> {'>' + note} </h3>

            {printAllImages()}

        </div>
    );
}

export default App;