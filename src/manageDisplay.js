import './App.css';
import './pokemon.css';
import {fetchPokemonData} from './manageData.js'

export const addToTeam = async (id, setID, team, setTeam, setData, setNote) => {
    const fetchedData = await fetchPokemonData(id, setData, setID);
    if (fetchedData == null) {
        setNote("Not a valid ID!");
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

export const printAllImages = (api, loading, id, setID, team, setTeam, setData, setNote) => {
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
                        onClick={() => addToTeam(spliceID(pokemon?.url), setID, team, setTeam, setData, setNote)}
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

export const formatName = (name) => {
    const parts = name.split("-");
    const maintainNames = ["jangmo-o", "hakamo-o", "kommo-o", "ho-oh", "chi-yu", "chien-pao", "wo-chien", "ting-lu"]
    const exceptions = ["-mega", "-alola", "-galar", "-hisui", "-gmax", "-eternamax", "-crowned", "-cap", "-primal", "-origin", "-black", "-white", "-therian", "-terastal", "stellar", "-resolute", "-mr"]

    // Capitalize the first letter of each part
    const capitalizedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));

    if (capitalizedParts.length === 1) {
        return capitalizedParts[0];
    }
    else if (maintainNames.some(exception => name.includes(exception))) {
        return name.charAt(0).toUpperCase() + name.slice(1)
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

const handleNameExceptions = (name) => {
    // TODO: If name has gmax, turn into Gigantamax. If name has Pikachu, Mime, Porygon, etc handle differently. Or maybe use mega as keyword
    return -1;
}