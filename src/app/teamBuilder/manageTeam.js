import './styling/App.css';
import './styling/pokemon.css';
import './styling/dropdown.css';

import {useState} from "react";
import {fetchPokemon} from "./manageData";
import {convertToName} from '../textParsing.js';

export const addToTeam = async (pokemon, setID, team, setTeam, setNote) => {
    if (team.length < 6 && typeof pokemon === 'string') {
        const fetchedPokemon = await fetchPokemon(convertToName(pokemon));
        if (fetchedPokemon !== null) {
            setTeam([...team, fetchedPokemon]);
            localStorage.setItem('team', JSON.stringify([...team, fetchedPokemon]));
            playCry(fetchedPokemon);
        }
        else {
            setNote("Not a valid Pokemon!");
        }
    }
    else if (team.length < 6) {
        setTeam([...team, pokemon]);
        localStorage.setItem('team', JSON.stringify([...team, pokemon]));
        playCry(pokemon);
    }

    if (team.length >= 5) {
        setNote("Team is full!");
    }
    else if (pokemon == null) {
        setNote("Not a valid Pokemon!");
    }
    else {
        setNote("");
    }
};

export const removeFromTeam = (member, setTeam, team, setNote) => {
    for (let i = 0; i < team.length; i++) {
        if (team[i] === member) {
            const newTeam = team.filter((item, j) => j !== i);
            setTeam(newTeam);
            localStorage.setItem('team', JSON.stringify(newTeam));
            playCry(member);
        }
    }
    setNote("");
};

export const TeamStorage = ( { setAPI, api, loading, setTeam, team, setStoredTeams, storedTeams, setNote } ) => {
    const [teamToRemove, setTeamToRemove] = useState("");
    const [hoverTeam, setHoverTeam] = useState([]);

    const handleMouseEnter = (currTeam) => {
        setHoverTeam(currTeam);
    };

    const handleMouseLeave = () => {
        setHoverTeam([]);
    };

    const accessStoredTeam = (index) => {
        setTeam(storedTeams[index]);
    }

    const addToStorage = () => {
        if (team.length > 0 && storedTeams.length < 5) {
            setStoredTeams([...storedTeams, team]);
            localStorage.setItem('storedTeams', JSON.stringify([...storedTeams, team]));
            setNote("");
        }
        else if (team.length <= 0) {
            setNote("Team is empty, could not be stored.");
        }
        else if (storedTeams.length >= 6) {
            setNote("Maximum number of teams stored - remove one to make room!");
        }
    }

    const removeFromStorage = (index) => {
        if (!isNaN(index) && index >= 0 && index < storedTeams.length) {
            const filteredTeams = storedTeams.filter((team, j) => j !== index)
            setStoredTeams(filteredTeams);
            localStorage.setItem('storedTeams', JSON.stringify(filteredTeams));
        }
    }

    if (!loading) {
        return (
            <div style={{marginBottom: "10px"}}>
                <button className="addTeam" onClick={() => addToStorage()}>Store Team</button>

                {storedTeams.map((currTeam, index) => (
                    <span>
                        <button
                            key={index + 1}
                            className="accessTeam"
                            onClick={() => accessStoredTeam(index)}
                            onMouseEnter={() => handleMouseEnter(currTeam)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {index + 1}
                        </button>
                        <button
                            key={index + 1}
                            className="removeTeam"
                            style={{ marginRight: index !== storedTeams.size - 1 ? '0.25rem' : '' }}
                            onClick={() => removeFromStorage(index)}
                        >
                            X
                        </button>
                    </span>
                ))}

                {/*<button className="addTeam" onClick={() => console.log("test")}>Save to Firebase</button>*/}

                <div className="popupWindow teamImages">
                    {hoverTeam.map((pokemon, index) => (
                        <img
                            className={`teamSprite behindSprite ${pokemon?.types[1] ? 'behindSprite2' : ''} pokeballSymbol`}
                            style={{zIndex: "10000"}}
                            data-type={pokemon?.types?.[0]?.name || ""}
                            data-type2={pokemon?.types?.[1]?.name || ""}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                            alt={pokemon?.printName}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

const playCry = (pokemon) => {
    const sound = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon?.id}.ogg`);
    sound.volume = 0.3;
    sound.play().catch((err) => {
        console.error(`addToTeam - playCry: Error playing the cry of pokemon ${pokemon?.name}:`, err);
    });
}