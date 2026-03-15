import { GameProvider, useGame } from './context/GameContext';
import DigitChallenge from './games/digit-challenge/DigitChallenge';
import SwitchChallenge from './games/switch-challenge/SwitchChallenge';
import GeoSudo from './games/geo-sudo/GeoSudo';
import GridChallenge from './games/grid-challenge/GridChallenge';
import MotionChallenge from './games/motion-challenge/MotionChallenge';
import InductiveReasoning from './games/inductive-reasoning/InductiveReasoning';
import ColorTheGrid from './games/color-the-grid/ColorTheGrid';
import { Calculator, Shuffle, Grid3X3, BrainCircuit, Move, Lightbulb, Palette, Play } from 'lucide-react';

const GAMES = [
    { id: 'digit', title: 'Digit Challenge', icon: Calculator, color: 'bg-blue-500', desc: 'Solve equations with missing digits.' },
    { id: 'switch', title: 'Switch Challenge', icon: Shuffle, color: 'bg-purple-500', desc: 'Decode the logic flow.' },
    { id: 'geo', title: 'Geo-Sudo', icon: Grid3X3, color: 'bg-emerald-500', desc: 'Geometric Sudoku puzzles.' },
    { id: 'grid', title: 'Grid Challenge', icon: BrainCircuit, color: 'bg-indigo-500', desc: 'Memory and multitasking.' },
    { id: 'motion', title: 'Motion Challenge', icon: Move, color: 'bg-orange-500', desc: 'Pathfinding puzzle.' },
    { id: 'inductive', title: 'Inductive Reasoning', icon: Lightbulb, color: 'bg-yellow-500', desc: 'Find the odd one out.' },
    { id: 'color', title: 'Color the Grid', icon: Palette, color: 'bg-pink-500', desc: 'Follow conditional rules.' },
];

const Dashboard = () => {
    const { startGame } = useGame();

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Capgemini Exceller Game Assessment</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Practice the 7 game-based aptitude tests used in the recruitment process.
                        Each game adapts to your performance.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => startGame(game.id, { duration: 360 })}
                            className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all text-left border border-slate-100 overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform ${game.color}`}></div>

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg ${game.color}`}>
                                <game.icon size={24} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
                            <p className="text-slate-500 text-sm mb-6">{game.desc}</p>

                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                                Play Now <Play size={16} className="ml-1" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GameRouter = () => {
    const { currentGameId } = useGame();

    if (!currentGameId) return <Dashboard />;

    switch (currentGameId) {
        case 'digit': return <DigitChallenge />;
        case 'switch': return <SwitchChallenge />;
        case 'geo': return <GeoSudo />;
        case 'grid': return <GridChallenge />;
        case 'motion': return <MotionChallenge />;
        case 'inductive': return <InductiveReasoning />;
        case 'color': return <ColorTheGrid />;
        default: return <Dashboard />;
    }
};

const App = () => {
    return (
        <GameProvider>
            <GameRouter />
        </GameProvider>
    );
};

export default App;
