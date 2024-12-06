import './pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {SearchBar, TeamStorage, printTeamImages, PrintAllImages} from './manageDisplay.js'

function App() {
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [storedTeams, setStoredTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchData([2, 3], setLoading, setAPI, api);
    }, []);

    useEffect(() => {
        printTeamImages(setTeam, team, setNote, note, loading);
    }, []);

    return (
        <div className="App backgroundBW">
            <TeamStorage loading={loading} setTeam={setTeam} team={team} setStoredTeams={setStoredTeams} storedTeams={storedTeams} setNote={setNote}/>
            <div> {printTeamImages(setTeam, team, setNote, note, loading)} </div>
            <SearchBar id={id} setID={setID} team={team} setTeam={setTeam} setNote={setNote} loading={loading}/>
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setNote={setNote}/>
        </div>
    );
}

export default App;