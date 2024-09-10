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

    const addToTeam = async (key) => {
        if (key != null) {
            if (team.length < 6) {
                setTeam([...team, fetchedData]);
                console.log(team.length);

                setNote("");
            }
            else {
                setNote("Team is full!");
            }
        }
        const fetchedData = await fetchPokemonData();

        if (fetchedData == null) {
            setNote("Not a valid ID!");
        }
        else if (team.length < 6) {
            setTeam([...team, fetchedData]);
            console.log(team.length);

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

    const fetchPokemonData = async () => {
        try {
            if (!/^\d+$/.test(id) && !/^[a-zA-Z]+$/.test(id)) {
                setData("");
                setID(null);
                return null;
            }
            else {
                const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setData(res.data);
                return res.data;
            }
        } catch (error) {
            setData("");
            setID(null);
            return null;
        }
    };

    const printAllImages = () => {
        return (
            <div>
                {api.map((pokemon, index) => (
                    <img
                        key={index}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                        alt={pokemon.name}
                        onClick={() => addToTeam(key)}
                    />
                ))}
            </div>
        );
    };

    // TODO: Bigger goal next, maybe its own page. List buttons for every single pokemon, or at least 10. clicking adds to team and removes them from list.
    // TODO: Maybe start with just listing 10 sprites. Then make them console.log buttons. Then have them add to team.
    //printAllImages();


    return (
      <div className="App">
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
          <h2 onClick={() => removeFromTeam(member)} key={index}>{index + ". " + member?.name}</h2>
        ))}
        <h3> {'>' + note} </h3>

        {printAllImages()}

      </div>
    );
}

export default App;
