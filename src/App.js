import './pokemon.css';
import {useEffect, useState} from "react";
import {fetchData} from './manageData.js';
import {SearchBar, printTeamImages, PrintAllImages} from './manageDisplay.js'

function App() {
    const [api, setAPI] = useState([]);
    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    useEffect(() => {
        fetchData([2, 3], setLoading, setAPI, api);
    }, []);

    useEffect(() => {
        printTeamImages(setTeam, team);
    }, []);

    return (
        <div className="App backgroundBW">
            <div> {printTeamImages(setTeam, team, setNote, note, loading)} </div>
            <SearchBar id={id} setID={setID} team={team} setTeam={setTeam} setNote={setNote} loading={loading}/>
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setNote={setNote}/>
        </div>
    );
}

export default App;