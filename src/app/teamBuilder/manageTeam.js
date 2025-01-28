import './styling/App.css';
import './styling/pokemon.css';
import './styling/dropdown.css';

import {useState} from "react";
import {fetchPokemon} from "./manageData";
import {convertToName} from '../textParsing.js';
import {GenerationSelect} from './manageDisplay';

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
        setNote("Team is full!"); // TODO: Search currently broken, doesnt check properly for if pokemon name is valid.
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

export const TeamStorage = ( { setAPI, api, loading, backgroundLoading, setTeam, team, setStoredTeams, storedTeams, setNote } ) => { // setAPI={setAPI} api={api} loading={loading} backgroundLoading={backgroundLoading}
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
            <div>
                <button className="addTeam" onClick={() => addToStorage()}>Store Team</button>

                {storedTeams.map((currTeam, index) => (
                    <button
                        key={index + 1}
                        className="accessTeam"
                        onClick={() => accessStoredTeam(index)}
                        onMouseEnter={() => handleMouseEnter(currTeam)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {index + 1}
                    </button>
                ))}

                <div className="popupWindow teamImages">
                    {hoverTeam.map((pokemon, index) => (
                        <img
                            className={`teamSprite behindSprite ${pokemon?.types[1] ? 'behindSprite2' : ''} pokeballSymbol`}
                            data-type={pokemon?.types[0]}
                            data-type2={pokemon?.types[1] ? pokemon?.types[1] : ''}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                            alt={pokemon?.printName}
                        />
                    ))}
                </div>

                <input
                    className="removeTeam"
                    placeholder="Enter Number"
                    onChange={(event) => setTeamToRemove(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            removeFromStorage(Number(teamToRemove) - 1);
                        }
                    }}
                />
                <button onClick={() => removeFromStorage(Number(teamToRemove) - 1)} className="search">Remove</button>
                <GenerationSelect setAPI={setAPI} api={api} loading={loading} backgroundLoading={backgroundLoading}/>
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