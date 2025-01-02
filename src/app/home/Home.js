import {AccessGame} from './gameOption';

export default function Home() {
    return (
        <div className="bg">
            <main>
                <div className="textMargin">
                    <h1>Select which Pokémon generation you would like to create your team with!</h1>
                    <h2>(The game can be changed later via the generation selection dropdown)</h2>
                </div>
                <AccessGame/>
            </main>
        </div>
    );
}