import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const GridChallenge = () => {
    const { level, submitAnswer } = useGame();

    // Phases: 'INIT', 'MEMORIZE', 'DISTRACT', 'RECALL', 'RESULT'
    const [phase, setPhase] = useState('INIT');
    const [sequence, setSequence] = useState([]); // Array of {r, c}
    const [currentStep, setCurrentStep] = useState(0); // Which step in the sequence we are processing
    const [userSequence, setUserSequence] = useState([]);
    const [symmetryTask, setSymmetryTask] = useState(null); // { shape: '...', isSymmetric: true/false }

    // Level Config
    const gridSize = 4 + Math.floor(level / 3); // Increase grid size every 3 levels
    const sequenceLength = 2 + Math.floor(level / 2); // Increase sequence length

    useEffect(() => {
        startLevel();
    }, [level]);

    const startLevel = () => {
        // Generate full sequence of dots
        const newSeq = [];
        for (let i = 0; i < sequenceLength; i++) {
            newSeq.push({
                r: Math.floor(Math.random() * gridSize),
                c: Math.floor(Math.random() * gridSize)
            });
        }
        setSequence(newSeq);
        setCurrentStep(0);
        setUserSequence([]);
        setPhase('MEMORIZE');
    };

    // Phase Management
    useEffect(() => {
        let timer;
        if (phase === 'MEMORIZE') {
            timer = setTimeout(() => {
                setPhase('DISTRACT');
                generateSymmetryTask();
            }, 2000); // Show dot for 2 seconds
        }
        return () => clearTimeout(timer);
    }, [phase, currentStep]);

    const generateSymmetryTask = () => {
        // Simple random symmetry task
        // For MVP, we'll use a placeholder or simple CSS shape
        const isSym = Math.random() > 0.5;
        setSymmetryTask({ isSymmetric: isSym });
    };

    const handleSymmetryAnswer = (answer) => {
        // Check symmetry answer
        if (answer === symmetryTask.isSymmetric) {
            // Correct symmetry answer
            // Move to next step or recall
            if (currentStep < sequence.length - 1) {
                setCurrentStep(prev => prev + 1);
                setPhase('MEMORIZE');
            } else {
                setPhase('RECALL');
            }
        } else {
            // Wrong symmetry answer
            // In real test, maybe penalty? For now, continue but maybe flash red
            // Let's just continue for flow
            if (currentStep < sequence.length - 1) {
                setCurrentStep(prev => prev + 1);
                setPhase('MEMORIZE');
            } else {
                setPhase('RECALL');
            }
        }
    };

    const handleGridClick = (r, c) => {
        if (phase !== 'RECALL') return;

        const newSeq = [...userSequence, { r, c }];
        setUserSequence(newSeq);

        // Check if sequence is complete
        if (newSeq.length === sequence.length) {
            checkResult(newSeq);
        }
    };

    const checkResult = (userSeq) => {
        let correct = true;
        for (let i = 0; i < sequence.length; i++) {
            if (userSeq[i].r !== sequence[i].r || userSeq[i].c !== sequence[i].c) {
                correct = false;
                break;
            }
        }

        if (correct) {
            submitAnswer(true);
        } else {
            submitAnswer(false);
            // Maybe restart level?
            startLevel();
        }
    };

    const INSTRUCTIONS = [
        {
            title: "Phase 1: Memorize",
            desc: "A dot will appear on the grid. Memorize its position.",
            visual: <div className="w-16 h-16 bg-white border border-slate-200 grid grid-cols-2 p-1 gap-1 rounded"><div className="bg-blue-500 rounded-full"></div><div className="bg-slate-100 rounded-full"></div><div className="bg-slate-100 rounded-full"></div><div className="bg-slate-100 rounded-full"></div></div>
        },
        {
            title: "Phase 2: Distraction",
            desc: "Answer the symmetry question shown. Is the shape symmetrical?",
            visual: (
                <div className="flex flex-col gap-2 items-center p-2 bg-slate-50 rounded">
                    <div className="w-8 h-8 bg-indigo-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                    <div className="flex gap-2"><div className="px-2 py-1 bg-green-500 text-white text-[10px] rounded">YES</div><div className="px-2 py-1 bg-red-500 text-white text-[10px] rounded">NO</div></div>
                </div>
            )
        },
        {
            title: "Phase 3: Recall",
            desc: "After the sequence ends, click the grid cells to mark the positions of the dots in the order they appeared.",
            visual: <div className="flex gap-1"><div className="w-6 h-6 bg-blue-400 rounded-full text-white flex items-center justify-center text-xs font-bold">1</div><span className="text-slate-400">➔</span><div className="w-6 h-6 bg-blue-400 rounded-full text-white flex items-center justify-center text-xs font-bold">2</div></div>
        }
    ];

    return (
        <GameShell title="Grid Challenge" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto gap-8">

                {/* Phase Display */}
                <div className="text-xl font-bold text-slate-500">
                    {phase === 'MEMORIZE' && "Memorize Position!"}
                    {phase === 'DISTRACT' && "Is this Symmetrical?"}
                    {phase === 'RECALL' && "Recall the Sequence!"}
                </div>

                {/* Main Content Area */}
                <div className="relative w-80 h-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">

                    {/* Grid View (Memorize & Recall) */}
                    {(phase === 'MEMORIZE' || phase === 'RECALL') && (
                        <div
                            className="absolute inset-0 grid gap-1 p-4"
                            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                        >
                            {Array(gridSize * gridSize).fill(0).map((_, i) => {
                                const r = Math.floor(i / gridSize);
                                const c = i % gridSize;

                                // Show dot if MEMORIZE and it's the current step
                                const showDot = phase === 'MEMORIZE' && sequence[currentStep]?.r === r && sequence[currentStep]?.c === c;

                                // Show user selection in RECALL
                                const selectionIndex = userSequence.findIndex(p => p.r === r && p.c === c);
                                const isSelected = selectionIndex !== -1;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleGridClick(r, c)}
                                        disabled={phase !== 'RECALL'}
                                        className={`rounded-full transition-all ${showDot ? 'bg-blue-500 scale-75' :
                                            isSelected ? 'bg-blue-400 scale-75' : 'bg-slate-100 hover:bg-slate-200'
                                            }`}
                                    >
                                        {isSelected && <span className="text-white font-bold">{selectionIndex + 1}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Symmetry Task (Distract) */}
                    {phase === 'DISTRACT' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6">
                            <div className="w-32 h-32 bg-indigo-500 mb-8 mask-shape" style={{
                                clipPath: symmetryTask?.isSymmetric
                                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond (Symmetric)
                                    : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 30%)' // Asymmetric
                            }}></div>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => handleSymmetryAnswer(true)}
                                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600"
                                >
                                    YES
                                </button>
                                <button
                                    onClick={() => handleSymmetryAnswer(false)}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                                >
                                    NO
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </GameShell>
    );
};

export default GridChallenge;
