import {fetchData} from './manageData.js';

export const pullLocalStorage = (setLoading, setAPI, api, setTeam, setStoredTeams) => {
    if (JSON.parse(localStorage.getItem('team')) !== null) {
        setTeam(JSON.parse(localStorage.getItem('team')));
    }
    if (JSON.parse(localStorage.getItem('storedTeams')) !== null) {
        setStoredTeams(JSON.parse(localStorage.getItem('storedTeams')));
    }
    /*const storedAPIString = localStorage.getItem('api');
    console.log("API", storedAPI);
    if (Array.isArray(storedAPI) && storedAPI.length > 0) {
        console.log("welp")
        setAPI(storedAPI);
    }
    else {
        console.log("working");
        fetchData([1], setLoading, setAPI, api);
    }*/
}