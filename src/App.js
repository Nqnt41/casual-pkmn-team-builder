import './App.css';
import './pokemon.css'
import Axios from "axios";
import {useEffect, useState} from "react";

function App() {
    const [data, setData] = useState("")
    const [api, setAPI] = useState([]) // only for testing
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchAPI();
    }, []);

    const fetchAPI = async () => {
        try {
            Axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1025`).then((res) => {
                setAPI(res.data.results); // Adjust for correct data structure
            });
        }
        catch (error) {
            setAPI([]);
        }
    };

    const fetchPokemonData = async (member) => {
        if (member == null) {
            member = id;
        }

        try {
            if (!/^\d+$/.test(member) && !/^[a-zA-Z]+$/.test(member)) {
                setData("");
                setID(null);
                return null;
            }
            else {
                const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${member}`);
                setData(res.data);
                return res.data;
            }
        } catch (error) {
            setData("");
            setID(null);
            return null;
        }
    };

    const addToTeam = async (member) => {
        const fetchedData = await fetchPokemonData(member);

        if (fetchedData == null) {
            setNote("Not a valid ID!");
        } else if (team.length < 6) {
            setTeam([...team, fetchedData]);
            console.log(team.length);

            setNote("");
        } else {
            setNote("Team is full!");
        }
    };

    const removeFromTeam = async (member) => {
        const newTeam = team.filter((pokemon) => pokemon !== member);

        setTeam(newTeam);
    };

    const printTeamImages = () => {
        return (
            <div>
                {team.map((pokemon, index) => (
                    <img
                        className={`teamSprite behindSprite ${pokemon.types[1] ? 'behindSprite2' : ''}`}
                        data-type={pokemon.types[0].type.name}
                        data-type2={pokemon.types[1] ? pokemon.types[1].type.name : ''}
                        key={index}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                        alt={pokemon.name}
                        onClick={() => removeFromTeam(pokemon)}
                    />
                ))}
            </div>
        );
    };

    const printAllImages = () => {
        return (
            <div>
                {api.map((pokemon, index) => (
                    <img
                        className="pokemonSprite"
                        key={index}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                        alt={pokemon.name}
                        onClick={() => addToTeam(index + 1)}
                    />
                ))}
            </div>
        );
    };

    // TODO: do images instead of text
    // printAllImages();

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