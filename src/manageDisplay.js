import './App.css';
import './pokemon.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {useState} from "react";
import {fetchPokemon, fetchVariety} from "./manageData";

export const addToTeam = async (pokemon, setID, team, setTeam, setNote) => {
    if (team.length < 6 && typeof pokemon === 'string') {
        const fetchedPokemon = await fetchPokemon(convertToName(pokemon));
        if (fetchedPokemon !== null) {
            console.log("fetchedPokemon", fetchedPokemon);
            setTeam([...team, fetchedPokemon]);
        }
        else {
            setNote("Not a valid Pokemon!");
        }
    }
    else if (team.length < 6) {
        setTeam([...team, pokemon]);
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
        if (team[i] === member) { setTeam(team.filter((item, j) => j !== i)); }
    }
    setNote("");
};

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

export const TeamStorage = ( { loading, setTeam, team, setStoredTeams, storedTeams, setNote } ) => {
    const [teamToRemove, setTeamToRemove] = useState("");

    const accessStoredTeam = (index) => {
        setTeam(storedTeams[index]);
    }

    const addToStorage = () => {
        if (team.length > 0 && storedTeams.length < 5) {
            setStoredTeams([...storedTeams, team]);
            setNote("");
        }
        else if (team.length <= 0) {
            setNote("Team is empty, could not be stored.");
        }
        else if (storedTeams.length >= 56) {
            console.log("length", storedTeams);
            setNote("Maximum number of teams stored - remove one to make room!");
        }
    }

    const removeFromStorage = (index) => {
        if (!isNaN(index) && index >= 0 && index < storedTeams.length) {
            console.log(storedTeams.length, index + 1)
            setStoredTeams(storedTeams.filter((team, j) => j !== index));
        }
    }

    if (!loading) {
        return (
            <div>
                <button className="addTeam" onClick={() => addToStorage()}>Store Team</button>

                {storedTeams.map((team, index) => (
                    <button key={index + 1} className="accessTeam" onClick={() => accessStoredTeam(index)}>{index + 1}</button>
                ))}

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
            </div>
        );
    }
}

export const printTeamImages = (setTeam, team, setNote, note, loading) => {
    if (!loading && !team.length) {
        return <div className="teamNote groupBorder">No team members yet!</div>;
    }
    else if (!loading) {
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
                {console.log("api", api)}
                {api.map((pokedex, outerIndex) => (
                    <div key={outerIndex} className="groupBorder">
                    <h1 className="generationText">{pokedexIDtoName(pokedex[0]?.pokedexID)}</h1>
                    {pokedex.map((pokemon) => (
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

export const formatName = (name) => {
    const parts = name.split("-");
    const maintainNames = ["jangmo-o", "hakamo-o", "kommo-o", "ho-oh", "chi-yu", "chien-pao", "wo-chien", "ting-lu", "porygon-z"]
    const exceptions = ["-mega", "-alola", "-galar", "-hisui", "-gmax", "-eternamax", "-crowned", "-altered", "-cap",
        "-primal", "-origin", "-black", "-white", "-therian", "-terastal", "stellar", "-resolute", "-mr", "lycanroc-", "nidoran-m", "nidoran-f"]

    const capitalizedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));

    if (capitalizedParts.length === 1) {
        return capitalizedParts[0];
    }
    else if (maintainNames.some(exception => name.includes(exception))) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    else if (exceptions.some(exception => name.includes(exception))) {
        if (name.includes("mr-")) {
            capitalizedParts[0] = "Mr.";
            if (name.includes("-galar")) {
                return "Galarian Mr. Mime";
            }
            return capitalizedParts.join(" ");
        }
        else if (name.includes("jr-")) {
            return "Mime Jr.";
        }
        else if (name.includes("nidoran-m")) {
            return "Male Nidoran";
        }
        else if (name.includes("nidoran-f")) {
            return "Female Nidoran";
        }
        else if (name.includes("ogerpon") || name.includes("urshifu") || name.includes("-cap")) {
            if (name.includes("-gmax")) {
                return "Gigantamax " + [capitalizedParts[1], capitalizedParts[2], capitalizedParts[0]].join(" ")
            }
            return [capitalizedParts[1], capitalizedParts[2], capitalizedParts[0]].join(" ");
        }
        else if (name.includes("-alola")) {
            capitalizedParts[1] = "Alolan";
        }
        else if (name.includes("-galar")) {
            capitalizedParts[1] = "Galarian"
        }
        else if (name.includes("-hisui")) {
            capitalizedParts[1] = "Hisuian"
        }
        else if (name.includes("-gmax")) {
            capitalizedParts[1] = "Gigantamax"
        }
        return [capitalizedParts[1], capitalizedParts[0], ...capitalizedParts.slice(2)].join(" ");
    }
    else {
        return capitalizedParts.join(" ");
    }
}

export const convertToName = (member) => {
    const parts = member.toLowerCase().split(" ");

    const exceptions = ["alolan", "galarian", "hisuian", "gigantamax", "mr.", "mr", "jr.", "jr", "porygon z", "rotom"];

    if (parts.length === 1) {
        return parts[0];
    }

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "form" || parts[i] === "forme") {
            parts.splice(i, 1);
        }
    }

    if (exceptions.some(exception => member.includes(exception))) {
        const name = member.toLowerCase();
        if (name.includes("mr") || name.includes("mr.")) {
            if (name.includes("galarian")) {
                return "mr-mime-galar";
            }
            else {
                return "mr" + "-" + parts[1];
            }
        }
        else if (name.includes("jr") || name.includes("jr.")) {
            return parts[0] + "-jr";
        }
        else if (name.includes("porygon z")) {
            return "porygon-z";
        }
        else if (name.includes("alolan")) {
            return parts[1] + "-alola";
        }
        else if (name.includes("galarian")) {
            return parts[1] + "-galar";
        }
        else if (name.includes("hisuian")) {
            return parts[1] + "-hisui";
        }
        else if (name.includes("gigantamax")) {
            return parts[1] + "-gmax";
        }
        else if (name.includes("rotom")) {
            return parts[0] + "-" + parts[1];
        }
        else {
            return parts[1] + "-" + parts[0];
        }
    }
    else if (parts.length === 2) {
        return parts[1] + "-" + parts[0];
    }
    else if (parts.length === 3) {
        return parts[1] + "-" + parts[0] + "-" + parts[2];
    }
    return parts[0];
}

const pokedexIDtoName = (pokedexID) => {
    // https://pokeapi.co/api/v2/pokedex/?offset=0&limit=50
    switch(pokedexID) {
        // Every Pokémon:
        case 1:
            return "National Pokédex";

        // Kanto:
        case 2:
            return "Kanto Pokédex";
        case 26:
            return "Kanto Pokédex (Let's Go!)";

        // Johto:
        case 3:
            return "Johto Pokédex";
        case 7:
            return "Johto Pokédex (HeartGold and SoulSilver)";

        // Hoenn:
        case 4:
            return "Hoenn Pokédex";
        case 15:
            return "Hoenn Pokédex (Omega Ruby and Alpha Sapphire)";

        // Sinnoh:
        case 5:
            return "Sinnoh Pokédex (Diamond and Pearl)";
        case 6:
            return "Sinnoh Pokédex (Platinum)";
        case 30:
            return "Hisuian Pokédex";

        // Unova:
        case 8:
            return "Unova Pokédex (Black and White)";
        case 9:
            return "Unova Pokédex (Black and White 2)";

        // Kalos:
        case 11:
            return "Kalos Pokédex";
        case 12:
            return "Central Kalos Pokédex";
        case 13:
            return "Coastal Kalos Pokédex";
        case 14:
            return "Mountain Kalos Pokédex";

        // Alola (Sun and Moon):
        case 16:
            return "Alolan Pokédex (Sun and Moon)";
        case 17:
            return "Alolan Pokédex - Melemele Island (Sun and Moon)";
        case 18:
            return "Alolan Pokédex - Akala Island (Sun and Moon)";
        case 19:
            return "Alolan Pokédex - Ula'ula Island (Sun and Moon)";
        case 20:
            return "Alolan Pokédex - Poni Island (Sun and Moon)";

        // Alola (Ultra Sun and Moon):
        case 21:
            return "Alolan Pokédex (Ultra Sun and Moon)";
        case 22:
            return "Alolan Pokédex - Melemele Island (Ultra Sun and Moon)";
        case 23:
            return "Alolan Pokédex - Akala Island (Ultra Sun and Moon)";
        case 24:
            return "Alolan Pokédex - Ula'ula Island (Ultra Sun and Moon)";
        case 25:
            return "Alolan Pokédex - Poni Island (Ultra Sun and Moon)";

        // Galar:
        case 27:
            return "Galarian Pokédex";
        case 28:
            return "Galarian Pokédex - Isle of Armor";
        case 29:
            return "Galarian Pokédex - Crown Tundra";

        // Paldea:
        case 31:
            return "Paldean Pokédex";
        case 32:
            return "Paldean Pokédex - Kitakami";
        case 33:
            return "Paldean Pokédex - Blueberry";
    }
}