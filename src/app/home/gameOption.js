import './styling/gameSelection.css';

import { useNavigate } from 'react-router-dom';

export const AccessGame = () => {
    const navigate = useNavigate();
    const games = [1, 2, 3, 4, 6, 7, 8, 9, 10, 15, 16, 21, 27, 31]; // ['national', 'rby', 'gsc', 'rse', 'dpp', 'hgss', 'bw', 'b2w2', 'xy', 'oras', 'sm', 'usum', 'ss', 'sv'];

    const handleClick = (game) => {
        navigate(`/team-builder?game=${game}`);
    }

    return (
        <div className='container'>
            {games.map((game) => {
                const imageSrc = require(`../../../images/logos/${game}.png`);
                return (
                    <img
                        key={game}
                        className="selection"
                        src={imageSrc}
                        alt={`${game} logo`}
                        onClick={() => handleClick(game)}
                    />
                );
            })}
        </div>
    );
};