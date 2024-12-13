import '../styling/pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {SearchBar, printTeamImages, PrintAllImages, GenerationSelect} from './manageDisplay.js';
import {TeamStorage} from './manageTeam.js';
import {pullLocalStorage} from './dataStorage.js';

function App() {
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [storedTeams, setStoredTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    useEffect(() => {
        // All: 2, 3, 4, 6, 7, 8, 9, 11, 16, 21, 27, 31
        fetchData([2, 3, 4, 6, 7, 8, 9, 11, 16, 21, 27, 31], setLoading, setAPI, api);
    }, []);

    useEffect(() => {
        printTeamImages(setTeam, team, setNote, note, loading);
    }, []);

    useEffect(() => {
        pullLocalStorage(setLoading, setAPI, api, setTeam, setStoredTeams);
    }, []);

    return (
        <div className="App backgroundBW">
            <GenerationSelect api={api} setAPI={setAPI}/>
            <TeamStorage loading={loading} setTeam={setTeam} team={team} setStoredTeams={setStoredTeams} storedTeams={storedTeams} setNote={setNote}/>
            <div> {printTeamImages(setTeam, team, setNote, note, loading)} </div>
            <SearchBar id={id} setID={setID} team={team} setTeam={setTeam} setNote={setNote} loading={loading}/>
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setNote={setNote}/>
        </div>
    );
}

export default App;