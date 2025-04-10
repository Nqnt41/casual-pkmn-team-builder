import './styling/App.css';
import './styling/pokemon.css';
import './styling/backgrounds.css';
import './styling/dropdown.css';
import 'reactjs-popup/dist/index.css';

import Popup from 'reactjs-popup';
import {useState} from "react";
import {fetchVariety} from "./manageData.js";
import {formatName} from '../textParsing.js';
import {addToTeam, removeFromTeam} from './manageTeam.js';

export const SearchBar = ( {id, setID, team, setTeam, setNote, loading, permittedTypes, setPermittedTypes} ) => {
    if (!loading) {
        return (
            <div>
                <input
                    className="search"
                    style={{zIndex: 0}}
                    placeholder="Enter Pokémon Name/ID"
                    onChange={(event) => setID(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            addToTeam(id, setID, team, setTeam, setNote);
                        }
                    }}
                />
                <button
                    onClick={() => addToTeam(id, setID, team, setTeam, setNote)}
                    className="search"
                    style={{zIndex: 0}}
                >Add</button>

                <TypeSelection permittedTypes={permittedTypes} setPermittedTypes={setPermittedTypes}/>
            </div>
        );
    }
}

const TypeSelection = ( {permittedTypes, setPermittedTypes} ) => {
    const [hover, setHover] = useState(false);
    const [listHidden, setListHidden] = useState(true);
    const [dropText, setDropText] = useState("▲");

    const changeDropdownLogo = () => {
        if (dropText === "▲") {
            setDropText("▼");
        }
        else {
            setDropText("▲");
        }
    }

    const handleCheckboxChange = (index) => {
        const updatedTypes = [...permittedTypes];
        updatedTypes[index].isActive = !updatedTypes[index].isActive;
        setPermittedTypes(updatedTypes);
    };

    return (
        <div className={`checklist ${listHidden ? 'hidePadding' : ''}`}>
            <div
                className={`typesButton ${hover ? 'mainButtonHighlight' : ''}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                    changeDropdownLogo();
                    setListHidden(!listHidden);
                }}
            >
                {dropText + " Filter Types"}
            </div>
            {!listHidden &&
                <span>
                    {permittedTypes.map((type, index) => (
                        <div className={`${index !== permittedTypes.length - 1 ? 'border' : ''}`}>
                            <label>
                                <input className="checkbox" type="checkbox" checked={type.isActive} onChange={() => handleCheckboxChange(index)}/>
                                <span className="pointing">{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                            </label>
                        </div>
                    ))}
                </span>
            }
        </div>
    );
}

export const printTeamImages = (setTeam, team, setNote, note, loading, teamName, setTeamName, setCurrTeamName, currTeamName) => {
    if (!loading && team.length) {
        return (
            <div className="teamBorder">
                <div style={{marginBottom: "20px"}}>
                <input
                    className="search"
                    placeholder="Team Name..."
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            setCurrTeamName(teamName);
                        }
                    }}
                />
                <button
                    className="search"
                    onClick={() => setCurrTeamName(teamName)}>Set Team Name</button>
                </div>
                <div style={{fontSize: "1.5rem", fontWeight: "bold", marginTop: "0", marginBottom: "1rem"}}>{currTeamName}</div>
                <div className="teamImages">
                    {team.map((pokemon, index) => (
                        <figure className="item" key={index} onClick={() => removeFromTeam(pokemon, setTeam, team, setNote)}>
                            <img
                                className={`teamSprite behindSprite ${pokemon?.types?.[1]?.name ? 'behindSprite2' : ''} pokeballSymbol`}
                                data-type={pokemon?.types?.[0]?.name || ""}
                                data-type2={pokemon?.types?.[1]?.name || ""}
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                                onError={(e) => {
                                    if (!e.target.src.includes("sprites/pokemon/other/official-artwork")) {
                                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
                                    }
                                    else {
                                        e.target.src = "";
                                        e.target.alt = pokemon?.printName || "Unknown Pokémon";
                                    }
                                    e.target.onerror = null;
                                }}
                            />
                            <figcaption className="caption">{pokemon?.printName || "Unknown"}</figcaption>
                        </figure>
                    ))}
                </div>
                <h3 className="note">{note}</h3>
            </div>
        );
    }
};

export const PrintAllImages = ({ api, loading, setID, id, team, setTeam, setNote, permittedTypes }) => {
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
                        <div className="pokemonListWrapper">
                            {pokedex?.list.filter((pokemon) => pokemon.types.some((type) => type.isActive)).map((pokemon) => (
                                <img
                                    className={`pokemonSprite ${team.some((member) => member.varieties?.some((variety) => variety === pokemon?.name)) ? 'highlight' : ''} 
                                        ${hoveredPokemonId === pokemon?.id ? 'altHighlight' : ''}`}
                                    key={pokemon.id}
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
                                    alt={pokemon?.printName}
                                    onMouseEnter={() => handleMouseEnter(pokemon?.id)}
                                    onMouseLeave={() => handleMouseLeave}
                                    onClick={(e) => handleClick(e, pokemon)}
                                    onContextMenu={(e) => handleClick(e, pokemon)}
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {popup && (
                    <Popup open={true} onClose={() => setPopup(null)} position="center">
                    <ol>
                    {popup.varieties.map((variety, index) => (
                        <li key={index}>
                            <button
                                onClick={async () => {
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

export const GenerationSelect = ({ setAPI, api, loading, backgroundLoading }) => {
    const [hover, setHover] = useState(false);
    const [listHidden, setListHidden] = useState(true);
    const [dropText, setDropText] = useState("▲");

    const changeDropdownLogo = () => {
        if (dropText === "▲") {
            setDropText("▼");
        }
        else {
            setDropText("▲");
        }
    }

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

    if (!loading) {
        return (
            <div className={`checklist zIndex ${listHidden ? 'hidePadding' : ''}`}>
                <div
                    className={`mainButton ${hover ? 'mainButtonHighlight' : ''}`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => {
                        changeDropdownLogo();
                        setListHidden(!listHidden)
                    }}
                >
                    {dropText + " Pokédex Select"}
                </div>
                <span className={`${listHidden ? 'empty' : ''}`}>
                    <div className="genLabel">Chosen Pokédex</div>
                    {api.map((pokedex, index) => (
                        <div className={`${index !== api.length - 1 ? 'border' : ''}`}>
                            {index === 1 && <div className="genLabel">Other Pokédexes</div>}
                            <label>
                                <input className="checkbox" type="checkbox" checked={pokedex.active} onChange={() => changeActiveStatus(index)}/>
                                <span className="pointing">{pokedex.name}</span>
                            </label>
                        </div>
                    ))}
                    {backgroundLoading && (
                        <div className="topBorder">Loading Alternate Pokédex Entries...</div>
                    )}
                </span>
            </div>
        );
    }
}