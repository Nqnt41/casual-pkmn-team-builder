import './pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {addToTeam, removeFromTeam, printTeamImages, PrintAllImages, formatName} from './manageDisplay.js'

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
        console.log("data", api);
    }, [api]);

    return (
        <div className="App backgroundRSE">
            <div> {printTeamImages(setTeam, team)} </div>
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
            {team.map((member, index) => (
                <h3 onClick={() => removeFromTeam(member, setTeam, team)} key={index}>{index + 1 + ". " + formatName(member?.name)}</h3>
            ))}
            <h3>{'>' + note}</h3>
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setData={setData} setNote={setNote}/>
        </div>
    );
}

export default App;