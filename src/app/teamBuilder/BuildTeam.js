import './styling/pokemon.css';

import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { fetchInitialData } from './manageData.js';
import { SearchBar, printTeamImages, PrintAllImages } from './manageDisplay.js';
import { TeamStorage } from './manageTeam.js';
import { pullLocalStorage } from './dataStorage.js';
import { types } from '../manageTypes.js';

import { Database } from '../../server/database.js';

function BuildTeam() {
    const [api, setAPI] = useState([]);
    const [confirmed, setConfirmed] = useState(false);
    const [permittedTypes, setPermittedTypes] = useState(Object.values(types));

    const [id, setID] = useState(null);
    const [team, setTeam] = useState([]);
    const [storedTeams, setStoredTeams] = useState(new Map());
    const [teamName, setTeamName] = useState("");
    const [currTeamName, setCurrTeamName] = useState("");

    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const game = Number(queryParams.get('game'));

    // All: 2, 3, 4, 6, 7, 8, 9, 11, 16, 21, 27, 31
    useEffect(() => {
        fetchInitialData(game, setLoading, setAPI, api, setConfirmed, confirmed);
    }, [game]);

    useEffect(() => {
        printTeamImages(setTeam, team, setNote, note, loading, teamName, setTeamName, setCurrTeamName, currTeamName);
    }, []);

    useEffect(() => {
        pullLocalStorage(setLoading, setAPI, api, setTeam, setStoredTeams);
    }, []);

    return (
        <div className="App backgroundBW">
            <Database />
            <TeamStorage setAPI={setAPI} api={api} loading={loading} setTeam={setTeam} team={team}
                         setStoredTeams={setStoredTeams} storedTeams={storedTeams} setNote={setNote}/>
            <div> {printTeamImages(setTeam, team, setNote, note, loading, teamName, setTeamName, setCurrTeamName, currTeamName)} </div>
            <SearchBar id={id} setID={setID} team={team} setTeam={setTeam} setNote={setNote} loading={loading}
                       permittedTypes={permittedTypes} setPermittedTypes={setPermittedTypes}/>
            <PrintAllImages api={api} loading={loading} setID={setID} id={id} team={team} setTeam={setTeam}
                            setNote={setNote} permittedTypes={permittedTypes}/>
        </div>
    );
}

export default BuildTeam;