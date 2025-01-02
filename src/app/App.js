import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './home/Home';
import BuildTeam from './teamBuilder/BuildTeam';

function App() {
    return (
        <Router basename="/casual-pkmn-team-builder">
            <Routes>
                <Route path="/" element={<Navigate to="/game-selection" />} />

                <Route path="/game-selection" element={<Home />} />
                <Route path="/team-builder" element={<BuildTeam />} />
            </Routes>
        </Router>
    );
}

export default App;