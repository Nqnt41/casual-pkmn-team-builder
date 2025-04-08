import {useEffect, useState} from "react";

import { fetchPokemon } from '../app/teamBuilder/manageData.js'

import { Auth } from './auth.js';
import { db, auth } from './firebaseConfig.js';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

export const Database = (storedTeams, setStoredTeams) => {
    const teamsRef = collection(db, "teams");

    const [storedDatabaseTeams, setStoredDatabaseTeams] = useState(
        [{memberIDs: [], name: ""},
            {memberIDs: [], name: ""},
            {memberIDs: [], name: ""},
            {memberIDs: [], name: ""},
            {memberIDs: [], name: ""}
        ]);

    const updateTeam = async () => {
        try {
            setStoredDatabaseTeams(() =>
                storedTeams.map((storedTeam, index) => ({
                    name: `Team ${index}`,
                    memberIDs: storedTeam.map(pokemon => pokemon.id)
                }))
            );
        }
        catch (err) {
            console.error("database.updateTeams - error updating team states.")
        }
    };

    const onSubmitTeam = async () => {
        try {
            await updateTeam();

            await addDoc(teamsRef, {
                storedTeams: storedDatabaseTeams,
                userId: auth?.currentUser?.uid,
            });

            //getMovieList();
        }
        catch (err) {
            console.error("onSubmitMovie - " + err);
        }
    }

    const fetchTeams = async () => {
        setStoredTeams((team) => {
            //team = await fetchPokemon(storedDatabaseTeams[i]); // TODO: Lazy, work on it later.
        })
    }
}

export const MoviesDatabase = () => {
    const [movieList, setMovieList] = useState([]);
    const [newMovieTitle, setNewMovieTitle] = useState("");
    const [newMovieDate, setNewMovieDate] = useState(0);
    const [newMovieIsOscar, setNewMovieIsOscar] = useState(false);

    const moviesCollectedRef = collection(db, "movies-practice");

    const [updatedTitle, setUpdatedTitle] = useState("");

    const getMovieList = async () => {
        // READ THE DATA
        // SET THE MOVIE LIST
        try {
            const data = await getDocs(moviesCollectedRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            console.log(filteredData);
            setMovieList(filteredData);
        }
        catch (err) {
            console.error("BuildTeam - " + err)
        }
    };

    useEffect(() => {
        getMovieList();
    }, [])

    const onSubmitMovie = async () => {
        try {
            await addDoc(moviesCollectedRef, {
                title: newMovieTitle,
                releaseDate: newMovieDate,
                recievedAnOscar: newMovieIsOscar,
                userId: auth?.currentUser?.uid,
            });

            getMovieList();
        }
        catch (err) {
            console.error("onSubmitMovie - " + err);
        }
    }

    const deleteMovie = async (id) => {
        const movieDoc = doc(db, "movies-practice", id);
        await deleteDoc(movieDoc);

        getMovieList();
    }

    const updateMovieTitle = async (id) => {
        const movieDoc = doc(db, "movies-practice", id);
        await updateDoc(movieDoc, { title: updatedTitle });

        getMovieList();
    }

    return (
        <div>
            <h1>
                <Auth />
            </h1>

            <input
                placeholder="Movie title..."
                onChange={(e) => setNewMovieTitle(e.target.value)}
            />
            <input
                placeholder="Release date..."
                type="number"
                onChange={(e) => setNewMovieDate(Number(e.target.value))}
            />
            <input
                type="checkbox"
                checked={newMovieIsOscar}
                onChange={(e) => setNewMovieIsOscar(e.target.checked)}
            />
            <label>Recieved an Oscar</label>
            <button onClick={onSubmitMovie}>Submit movie</button>


            {movieList.map((movie) => (
                <div>
                    <h1 style={{color: movie.recievedAnOscar ? "green" : "red"}}>{movie.title}</h1>
                    <h2>Date: {movie.releaseDate}</h2>
                    <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

                    <input
                        placeholder="new title..."
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
                </div>
            ))}
        </div>
    );
}