import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const COLORS = [
    { id: 'orange', class: 'bg-orange-500', name: 'Orange' },
    { id: 'blue', class: 'bg-blue-600', name: 'Blue' },
    { id: 'grey', class: 'bg-slate-400', name: 'Grey' },
    { id: 'green', class: 'bg-emerald-500', name: 'Green' },
];

const ColorTheGrid = () => {
    const { level, submitAnswer } = useGame();
    const [grids, setGrids] = useState([]);
    const [rule, setRule] = useState(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
    const [userColors, setUserColors] = useState({}); // { gridIndex: colorId }

    useEffect(() => {
        generateLevel();
    }, [level]);

    const generateLevel = () => {
        // Generate 4 grids
        const newGrids = [];
        for (let i = 0; i < 4; i++) {
            newGrids.push(generateGridContent());
        }
        setGrids(newGrids);
        setUserColors({});

        // Generate Rule
        // Simple Rule: "If grid has 'Z', mark Orange. Else mark Blue."
        // Or "If all numbers are Even, mark Green."
        const ruleType = Math.random() > 0.5 ? 'LETTER' : 'NUMBER';

        if (ruleType === 'LETTER') {
            setRule({
                text: "If grid contains 'Z', mark it Orange. Otherwise mark it Blue.",
                check: (content) => content.includes('Z') ? 'orange' : 'blue'
            });
        } else {
            setRule({
                text: "If all numbers are Even, mark it Green. Otherwise mark it Grey.",
                check: (content) => {
                    const nums = content.filter(c => typeof c === 'number');
                    const allEven = nums.every(n => n % 2 === 0);
                    return allEven ? 'green' : 'grey';
                }
            });
        }
    };

    const generateGridContent = () => {
        // 4 items per grid (2x2)
        const content = [];
        for (let i = 0; i < 4; i++) {
            if (Math.random() > 0.5) {
                // Number
                content.push(Math.floor(Math.random() * 9) + 1);
            } else {
                // Letter
                const chars = "ABCXYZ";
                content.push(chars[Math.floor(Math.random() * chars.length)]);
            }
        }
        return content;
    };

    const handleGridClick = (index) => {
        setUserColors(prev => ({ ...prev, [index]: selectedColor }));
    };

    const handleSubmit = () => {
        // Validate
        let correct = true;
        for (let i = 0; i < grids.length; i++) {
            const expected = rule.check(grids[i]);
            if (userColors[i] !== expected) {
                correct = false;
                break;
            }
        }

        if (correct) {
            submitAnswer(true);
        } else {
            submitAnswer(false);
            alert('Incorrect coloring!');
        }
    };

    if (!rule) return <div>Loading...</div>;

    const INSTRUCTIONS = [
        {
            title: "Read the Rule",
            desc: "A specific rule will be displayed at the top. Read it carefully.",
            visual: <div className="p-2 bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 rounded text-center">"If grid has 'Z', mark Orange. Else mark Blue."</div>
        },
        {
            title: "Analyze Each Grid",
            desc: "Look at the content of each 2x2 grid. Does it satisfy the condition?",
            visual: (
                <div className="flex gap-4 justify-center">
                    <div className="w-16 h-16 grid grid-cols-2 gap-1 p-1 bg-white border border-slate-200 rounded shadow-sm">
                        <div className="bg-slate-50 flex items-center justify-center text-xs font-bold">A</div>
                        <div className="bg-slate-50 flex items-center justify-center text-xs font-bold">Z</div>
                        <div className="bg-slate-50 flex items-center justify-center text-xs font-bold">1</div>
                        <div className="bg-slate-50 flex items-center justify-center text-xs font-bold">2</div>
                    </div>
                </div>
            )
        },
        {
            title: "Color Correctly",
            desc: "Select the correct color from the palette and click the grid to mark it.",
            visual: <div className="flex gap-2 items-center"><div className="w-6 h-6 rounded-full bg-orange-500 ring-2 ring-slate-300"></div><span className="text-slate-400">+</span><div className="w-8 h-8 border-2 border-slate-300 rounded bg-white"></div></div>
        }
    ];

    return (
        <GameShell title="Color the Grid" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto gap-8">

                {/* Rule Display */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-blue-800 font-medium text-center max-w-2xl">
                    {rule.text}
                </div>

                {/* Grids */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {grids.map((content, idx) => {
                        const colorId = userColors[idx];
                        const colorClass = COLORS.find(c => c.id === colorId)?.class || 'bg-white';

                        return (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    onClick={() => handleGridClick(idx)}
                                    className={`w-32 h-32 grid grid-cols-2 gap-1 p-2 rounded-xl shadow-sm cursor-pointer transition-all border-4 ${colorId ? `${colorClass} border-transparent` : 'bg-white border-slate-200 hover:border-blue-300'
                                        }`}
                                >
                                    {content.map((item, i) => (
                                        <div key={i} className="flex items-center justify-center bg-white/90 rounded-md font-bold text-slate-700">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                {/* Marker circle */}
                                <div className={`w-4 h-4 rounded-full ${colorId ? colorClass : 'bg-slate-200'}`}></div>
                            </div>
                        );
                    })}
                </div>

                {/* Palette */}
                <div className="flex gap-4 p-4 bg-white rounded-full shadow-lg border border-slate-100">
                    {COLORS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedColor(c.id)}
                            className={`w-12 h-12 rounded-full ${c.class} transition-transform hover:scale-110 ${selectedColor === c.id ? 'ring-4 ring-offset-2 ring-slate-400 scale-110' : ''
                                }`}
                            title={c.name}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 shadow-lg"
                >
                    Submit Colors
                </button>

            </div>
        </GameShell>
    );
};

export default ColorTheGrid;
