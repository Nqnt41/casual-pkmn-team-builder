import './styling/pokemon.css';

import {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {fetchInitialData} from './manageData.js';
import {SearchBar, printTeamImages, PrintAllImages, GenerationSelect} from './manageDisplay.js';
import {TeamStorage} from './manageTeam.js';
import {pullLocalStorage} from './dataStorage.js';

function BuildTeam() {
    const [api, setAPI] = useState([]);
    const [confirmed, setConfirmed] = useState(false);
    const [filters, setFilters] = useState([]); // [ [allowedTypes] ]

    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [storedTeams, setStoredTeams] = useState([]);

    const [loading, setLoading] = useState(true);
    const [backgroundLoading, setBackgroundLoading] = useState(true);

    const [note, setNote] = useState("");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const game = Number(queryParams.get('game'));

    // All: 2, 3, 4, 6, 7, 8, 9, 11, 16, 21, 27, 31
    useEffect(() => {
        fetchInitialData(game, setLoading, setBackgroundLoading, setAPI, api, setConfirmed, confirmed);
    }, [game]);

    useEffect(() => {
        printTeamImages(setTeam, team, setNote, note, loading);
    }, []);

    useEffect(() => {
        pullLocalStorage(setLoading, setAPI, api, setTeam, setStoredTeams);
    }, []);

    return (
        <div className="App backgroundBW">
            <TeamStorage setAPI={setAPI} api={api} loading={loading} backgroundLoading={backgroundLoading}
                         setTeam={setTeam} team={team} setStoredTeams={setStoredTeams} storedTeams={storedTeams} setNote={setNote}/>
            <div> {printTeamImages(setTeam, team, setNote, note, loading)} </div>
            <SearchBar id={id} setID={setID} team={team} setTeam={setTeam} setNote={setNote} loading={loading}/>
            <PrintAllImages api={api} loading={loading} setID={setID} team={team} setTeam={setTeam} setNote={setNote} filters={filters}/>
        </div>
    );
}

export default BuildTeam;