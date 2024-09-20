import './App.css';
import './pokemon.css';
import {fetchPokemonData} from './manageData.js'

export const addToTeam = async (id, setID, team, setTeam, setData, setNote) => {
    const fetchedData = await fetchPokemonData(id, setData, setID);
    if (fetchedData == null) {
        setNote("Not a valid ID!");
    } else if (team.length < 6) {
        setTeam([...team, fetchedData]);
        setNote("");
    } else {
        setNote("Team is full!");
    }
};

export const removeFromTeam = (member, setTeam, team) => {
    const newTeam = team.filter((pokemon) => pokemon !== member);
    setTeam(newTeam);
};

export const printTeamImages = (setTeam, team) => {
    if (!team.length) {
        return <p>No team members yet!</p>;
    }
    return (
        <div>
            {team.map((pokemon, index) => (
                <img
                    className={`teamSprite behindSprite ${pokemon.types[1] ? 'behindSprite2' : ''}`}
                    data-type={pokemon.types[0].type.name}
                    data-type2={pokemon.types[1] ? pokemon.types[1].type.name : ''}
                    key={index}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                    onClick={() => removeFromTeam(pokemon, setTeam, team)}
                />
            ))}
        </div>
    );
};

export const printAllImages = (api, loading) => {
    if (loading) {
        return <h1>Loading...</h1>
    } else {
        return (
            <div>
                {api.map((pokemon) => (
                    <img
                        className="pokemonSprite"
                        key={spliceID(pokemon?.url)}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spliceID(pokemon?.url)}.png`}
                        alt={pokemon?.name}
                        onClick={() => addToTeam(spliceID(pokemon?.url))}
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                ))}
            </div>
        );
    }
};

const spliceID = (url) => {
    const regex = /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\d+)\/?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
};