import './pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {addToTeam, printTeamImages, PrintAllImages} from './manageDisplay.js'

function App() {
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchData(setLoading, setAPI);
    }, []);

    useEffect(() => {
        printTeamImages(setTeam, team);
    }, []);

    return (
        <div className="App backgroundBW">
            <div> {printTeamImages(setTeam, team, setNote, note)} </div>
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
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setNote={setNote}/>
        </div>
    );
}

export default App;