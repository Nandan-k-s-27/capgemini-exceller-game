import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const LEVELS = [
    // Level 1: Intro (The Box)
    [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 0, 2, 0, 1],
        [1, 0, 1, 2, 0, 1],
        [1, 0, 2, 0, 0, 1],
        [1, 0, 1, 0, 4, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    // Level 2: The Corridor
    [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 1, 1],
        [1, 1, 2, 0, 0, 1],
        [1, 1, 0, 2, 0, 1],
        [1, 1, 0, 0, 4, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    // Level 3: Two Rooms
    [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 0, 1, 0, 1],
        [1, 2, 2, 1, 0, 1],
        [1, 0, 0, 0, 0, 1], // Gap in wall
        [1, 0, 1, 4, 0, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    // Level 4: The Squeeze
    [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 2, 0, 2, 1],
        [1, 0, 1, 0, 1, 1],
        [1, 0, 2, 0, 0, 1],
        [1, 0, 1, 2, 4, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    // Level 5: Open Field
    [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 0, 2, 0, 1],
        [1, 0, 0, 2, 0, 1],
        [1, 2, 0, 0, 2, 1],
        [1, 0, 2, 4, 0, 1],
        [1, 1, 1, 1, 1, 1],
    ]
];

const MotionChallenge = () => {
    const { level, submitAnswer } = useGame();
    const [grid, setGrid] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // {r, c}
    const [moves, setMoves] = useState(0);
    const minMoves = 10; // Placeholder

    // Grid Codes:
    // 0: Empty
    // 1: Wall (Rock)
    // 2: Block (Plastic)
    // 3: Ball (Red)
    // 4: Hole (Target)

    // Grid Codes:
    // 0: Empty, 1: Wall, 2: Block, 3: Ball, 4: Hole

    const loadLevel = useCallback(() => {
        // Select level template based on current game level (cycling)
        const levelIndex = (level - 1) % LEVELS.length;
        // Deep copy the grid to avoid mutating the template
        const template = LEVELS[levelIndex];
        const newGrid = template.map(row => [...row]);

        setGrid(newGrid);
        setMoves(0);
        setSelectedItem(null);
    }, [level]);

    useEffect(() => {
        loadLevel();
    }, [loadLevel]);

    const handleCellClick = (r, c) => {
        const val = grid[r][c];
        if (val === 2 || val === 3) { // Block or Ball
            setSelectedItem({ r, c, val });
        } else {
            setSelectedItem(null);
        }
    };

    const moveItem = (dr, dc) => {
        if (!selectedItem) return;

        const { r, c, val } = selectedItem;
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds
        if (grid[nr][nc] === 0 || grid[nr][nc] === 4) { // Empty or Hole
            // If Hole, only Ball can enter
            if (grid[nr][nc] === 4) {
                if (val === 3) {
                    // Win!
                    const newGrid = [...grid];
                    newGrid[r][c] = 0;
                    // Ball disappears into hole
                    setGrid(newGrid);
                    setMoves(m => m + 1);
                    setTimeout(() => submitAnswer(true), 500);
                    return;
                } else {
                    // Block cannot enter hole? Assume yes for now
                    return;
                }
            }

            // Move to empty
            const newGrid = grid.map(row => [...row]);
            newGrid[r][c] = 0;
            newGrid[nr][nc] = val;
            setGrid(newGrid);
            setSelectedItem({ r: nr, c: nc, val });
            setMoves(m => m + 1);
        }
    };

    const INSTRUCTIONS = [
        {
            title: "Goal: Reach the Hole",
            desc: "The objective is to move the Red Ball into the Black Hole.",
            visual: <div className="flex gap-2 items-center justify-center p-2 bg-slate-100 rounded"><div className="w-6 h-6 bg-red-500 rounded-full shadow"></div><ArrowRight size={16} /><div className="w-6 h-6 bg-black rounded-full border-2 border-slate-400"></div></div>
        },
        {
            title: "Clear the Path",
            desc: "The path is blocked by obstacles. Select a block (Blue) or the Ball (Red) by clicking on it.",
            visual: <div className="flex gap-2 justify-center"><div className="w-8 h-8 bg-blue-500 rounded shadow ring-2 ring-white"></div></div>
        },
        {
            title: "Move Items",
            desc: "Use the on-screen arrow buttons to move the selected item into an empty adjacent space.",
            visual: (
                <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                    <div></div><div className="bg-slate-200 rounded p-1 flex justify-center"><ArrowUp size={12} /></div><div></div>
                    <div className="bg-slate-200 rounded p-1 flex justify-center"><ArrowLeft size={12} /></div><div></div><div className="bg-slate-200 rounded p-1 flex justify-center"><ArrowRight size={12} /></div>
                    <div></div><div className="bg-slate-200 rounded p-1 flex justify-center"><ArrowDown size={12} /></div><div></div>
                </div>
            )
        },
        {
            title: "Efficiency Matters",
            desc: "Try to solve the puzzle in as few moves as possible.",
            visual: <div className="text-sm font-bold text-slate-500 text-center">Moves: 12</div>
        }
    ];

    return (
        <GameShell title="Motion Challenge" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto gap-8">

                <div className="flex justify-between w-full px-4">
                    <div className="text-slate-500 font-bold">Moves: {moves}</div>
                    <div className="text-slate-400 text-sm">Min Moves: {minMoves}</div>
                </div>

                {/* Grid */}
                <div className="grid gap-1 p-2 bg-slate-800 rounded-xl shadow-inner" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const isSelected = selectedItem?.r === r && selectedItem?.c === c;

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-md transition-all ${val === 1 ? 'bg-slate-600' : // Wall
                                        val === 0 ? 'bg-slate-700/50' : // Empty
                                            val === 4 ? 'bg-black border-2 border-slate-500' : // Hole
                                                'cursor-pointer hover:opacity-90'
                                        } ${isSelected ? 'ring-2 ring-white z-10' : ''}`}
                                >
                                    {val === 2 && <div className="w-10 h-10 bg-blue-500 rounded-sm shadow-lg"></div>} {/* Block */}
                                    {val === 3 && <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg"></div>} {/* Ball */}
                                    {val === 4 && <div className="w-6 h-6 bg-black rounded-full shadow-inner inset-shadow"></div>}
                                </div>
                            );
                        })
                    ))}
                </div>

                {/* Controls */}
                <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <button onClick={() => moveItem(-1, 0)} className="p-4 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400"><ArrowUp /></button>
                    <div></div>
                    <button onClick={() => moveItem(0, -1)} className="p-4 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400"><ArrowLeft /></button>
                    <button onClick={() => moveItem(1, 0)} className="p-4 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400"><ArrowDown /></button>
                    <button onClick={() => moveItem(0, 1)} className="p-4 bg-slate-200 rounded-xl hover:bg-slate-300 active:bg-slate-400"><ArrowRight /></button>
                </div>

            </div>
        </GameShell>
    );
};

export default MotionChallenge;
