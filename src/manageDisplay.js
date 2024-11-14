import './App.css';
import './pokemon.css';
import {fetchPokemonData} from './manageData.js'
import {useState} from "react";

export const addToTeam = async (id, setID, team, setTeam, setData, setNote) => {
    const fetchedData = await fetchPokemonData(id, setData, setID);
    if (fetchedData == null) {
        setNote("Not a valid Pokemon!");
    }
    else if (team.length < 6) {
        setTeam([...team, fetchedData]);
        setNote("");
    }
    else {
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
        <div className="teamBorder">
            {team.map((pokemon, index) => (
                <img
                    className={`teamSprite behindSprite ${pokemon.types[1] ? 'behindSprite2' : ''} pokeballSymbol`}
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

export const PrintAllImages = ({ api, loading, setID, team, setTeam, setData, setNote }) => {
    const handlePokemonClick = (pokemonID) => {
        addToTeam(pokemonID, setID, team, setTeam, setData, setNote); // Call your existing addToTeam function
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }
    else {
        return (
            <div className="groupBorder">
                {api.map((pokemon) => {
                    const pokemonID = parseInt(spliceID(pokemon?.url), 10); // Extract pokemonID for clarity
                    return (
                        <img
                            className={`pokemonSprite ${team.some(pokemon => pokemon.id === pokemonID) ? 'highlight' : ''}`} // Highlight selected Pokémon
                            key={pokemonID}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`}
                            alt={pokemon?.name}
                            onClick={() => handlePokemonClick(pokemonID)} // Call the click handler
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    );
                })}
            </div>
        );
    }
};

const spliceID = (url) => {
    const regex = /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\d+)\/?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const formatName = (name) => {
    const parts = name.split("-");
    const maintainNames = ["jangmo-o", "hakamo-o", "kommo-o", "ho-oh", "chi-yu", "chien-pao", "wo-chien", "ting-lu", "porygon-z"]
    const exceptions = ["-mega", "-alola", "-galar", "-hisui", "-gmax", "-eternamax", "-crowned", "-altered", "-cap",
        "-primal", "-origin", "-black", "-white", "-therian", "-terastal", "stellar", "-resolute", "-mr", "lycanroc-", "nidoran-m", "nidoran-f"]

    // Capitalize the first letter of each part
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
        if (parts[i] == "form" || parts[i] == "forme") {
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