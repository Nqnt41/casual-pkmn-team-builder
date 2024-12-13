import '../styling/App.css';
import '../styling/pokemon.css';
import '../styling/backgrounds.css';
import '../styling/dropdown.css';
import 'reactjs-popup/dist/index.css';

import Popup from 'reactjs-popup';
import {useState} from "react";
import {fetchVariety} from "./manageData";
import {formatName} from './textParsing.js';
import {addToTeam, removeFromTeam} from './manageTeam.js';

export const SearchBar = ( {id, setID, team, setTeam, setNote, loading} ) => {
    if (!loading) {
        return (
            <div>
                <input
                    className="search"
                    placeholder="Enter Pokémon Name/ID"
                    onChange={(event) => setID(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            addToTeam(id, setID, team, setTeam, setNote);
                        }
                    }}
                />
                <button onClick={() => addToTeam(id, setID, team, setTeam, setNote)} className="search">Add</button>
            </div>
        );
    }
}

export const printTeamImages = (setTeam, team, setNote, note, loading) => {
    if (!loading && team.length) {
        return (
            <div className="teamBorder">
                <div className="teamImages">
                    {team.map((pokemon, index) => (
                        <figure className="item" key={index}
                                onClick={() => removeFromTeam(pokemon, setTeam, team, setNote)}>
                            <img
                                className={`teamSprite behindSprite ${pokemon?.types[1] ? 'behindSprite2' : ''} pokeballSymbol`}
                                data-type={pokemon?.types[0]}
                                data-type2={pokemon?.types[1] ? pokemon?.types[1] : ''}
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                                alt={pokemon?.printName}
                            />
                            <figcaption className="caption">{pokemon?.printName}</figcaption>
                        </figure>
                    ))}
                </div>
                <h3 className="note">{'>' + note}</h3>
            </div>
        );
    }
};

export const PrintAllImages = ({ api, loading, setID, team, setTeam, setNote }) => {
    const [popup, setPopup] = useState(null);
    const [hoveredPokemonId, setHoveredPokemonId] = useState(null);

    const handleMouseEnter = (pokemonId) => {
        setHoveredPokemonId(pokemonId);
    };

    const handleMouseLeave = () => {
        setHoveredPokemonId(null);
    };

    const handleClick = (e, pokemon) => {
        if (e.nativeEvent.button === 0) {
            if (pokemon.varieties.length > 1 && team.length < 6) {
                setPopup(pokemon);
            }
            else {
                addToTeam(pokemon, setID, team, setTeam, setNote);
            }
        }
        else if (e.nativeEvent.button === 2) {
            e.preventDefault();
            removeFromTeam(pokemon, setTeam, team, setNote);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }
    else {
        return (
            <div>
                {api.map((pokedex, outerIndex) => pokedex.active && (
                    <div key={outerIndex} className="groupBorder">
                    <h1 className="generationText">{pokedex?.name}</h1>
                    {pokedex?.list.map((pokemon) => (
                        <img
                            className={`pokemonSprite ${team.some((member) => member.id === pokemon?.id) ? 'highlight' : ''} 
                                ${hoveredPokemonId === pokemon?.id ? 'altHighlight' : ''}`}
                            key={pokemon.id}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                            alt={pokemon?.printName}
                            onMouseEnter={() => handleMouseEnter(pokemon?.id)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleClick(e, pokemon)}
                            onContextMenu={(e) => handleClick(e, pokemon)}
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    ))}
                    </div>
                ))}
                {popup && (
                    <Popup open={true} onClose={() => setPopup(null)} position="center">
                    <ol>
                    {popup.varieties.map((variety, index) => (
                        <li key={index}>
                            <button
                                onClick={async () => {
                                console.log("variety", variety);
                                const newPokemon = await fetchVariety(variety, popup);
                                addToTeam(newPokemon, setID, team, setTeam, setNote);
                                setPopup(null);
                                }}
                            >
                                {formatName(variety)}
                            </button>
                        </li>
                    ))}
                    </ol>
                    </Popup>
                )}
            </div>
        );
    }
};

export const GenerationSelect = ({ api, setAPI }) => {
    const [hover, setHover] = useState(false);
    const [listHidden, setListHidden] = useState(true);

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const changeActiveStatus = (index) => {
        setAPI((api) => {
            const updatedAPI = [...api];

            if (updatedAPI[index]) {
                updatedAPI[index] = {
                    ...updatedAPI[index],
                    active: !updatedAPI[index].active,
                };
            }
            else {
                console.error("ERROR - GenerationSelect: Invalid index provided to changeActiveStatus");
            }
            return updatedAPI;
        });
    };

    return (
        <div className={`checklist ${listHidden ? 'hidePadding' : ''}`}>
            <div
                className={`mainButton ${hover ? 'mainButtonHighlight' : ''}`}
                onMouseEnter={() => handleMouseEnter()}
                onMouseLeave={handleMouseLeave}
                onClick={() => {setListHidden(!listHidden)}}
            >
                Pokedex Select
            </div>
            <span className={`${listHidden ? 'empty' : ''}`}>
                {api.map((pokedex, index) => (
                    <div>
                        <label>
                            <input className="pointing" type="checkbox" checked={pokedex.active} onChange={() => changeActiveStatus(index)} />
                            <span className="pointing">{pokedex.name}</span>
                        </label>
                    </div>
                ))}
            </span>
        </div>
    );
}