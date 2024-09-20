import './App.css';
import './pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {addToTeam, removeFromTeam, printTeamImages, printAllImages} from './manageDisplay.js'

function App() {
    const [data, setData] = useState("");
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(setLoading, setAPI);
    }, []);

    useEffect(() => {
        printTeamImages(setTeam, team);
    }, [api]);

    return (
        <div className="App">
            {printTeamImages(setTeam, team)}
            <input
                placeholder="Pokemon ID"
                onChange={(event) => setID(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        addToTeam(id, setID, team, setTeam, setData, setNote);
                    }
                }}
            />
            <button onClick={() => addToTeam(id, setID, team, setTeam, setData, setNote)}>Add</button>
            <h1>{data?.name}</h1>
            {team.map((member, index) => (
                <h3 onClick={() => removeFromTeam(member, setTeam, team)} key={index}>{index + 1 + ". " + member?.name}</h3>
            ))}
            <h3>{'>' + note}</h3>
            {printAllImages(api, loading)}
        </div>
    );
}

export default App;
