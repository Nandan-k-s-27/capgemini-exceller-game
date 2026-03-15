import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { Circle, Square } from 'lucide-react';

const ArrowIcon = ({ rotation, ...props }) => (
    <svg
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: `rotate(${rotation}deg)` }}
        {...props}
    >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

const InductiveReasoning = () => {
    const { level, submitAnswer } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        // Pick a random question or generate one
        // For MVP, we cycle or pick random
        // Let's generate a procedural one for "Rotation" to make it infinite
        if (Math.random() > 0.5) {
            generateRotationQuestion();
        } else {
            generateCountQuestion();
        }
    }, [level]);

    const generateRotationQuestion = () => {
        const step = 90;
        const start = Math.floor(Math.random() * 360);
        const options = [];
        const correctIdx = Math.floor(Math.random() * 5);

        for (let i = 0; i < 5; i++) {
            let rot = (start + i * step) % 360;
            if (i === correctIdx) {
                rot = (rot + 45) % 360; // Break the pattern
            }
            options.push({ id: i, rotation: rot, type: 'rotation' });
        }
        setCurrentQuestion({ options, correct: correctIdx });
    };

    const generateCountQuestion = () => {
        const baseCount = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
        const options = [];
        const correctIdx = Math.floor(Math.random() * 5);

        for (let i = 0; i < 5; i++) {
            let count = baseCount;
            if (i === correctIdx) {
                count = baseCount + 1; // Odd one has different count
            }
            options.push({ id: i, count, type: 'count' });
        }
        setCurrentQuestion({ options, correct: correctIdx });
    };

    const handleOptionClick = (idx) => {
        if (idx === currentQuestion.correct) {
            submitAnswer(true);
        } else {
            submitAnswer(false);
            // Feedback?
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    const INSTRUCTIONS = [
        {
            title: "Identify the Pattern",
            desc: "Look at the set of figures. All of them follow a specific rule except for one.",
            visual: <div className="flex gap-1 justify-center"><Circle size={16} className="text-blue-500" /><Circle size={16} className="text-blue-500" /><Square size={16} className="text-red-500" /><Circle size={16} className="text-blue-500" /></div>
        },
        {
            title: "Find the Odd One Out",
            desc: "Select the figure that breaks the pattern.",
            visual: (
                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-slate-500">e.g. All are Circles, but C is a Square.</p>
                    <div className="p-1 px-2 bg-red-100 text-red-600 rounded font-bold text-xs border border-red-200">Select C</div>
                </div>
            )
        },
        {
            title: "Common Rules",
            desc: "Patterns may involve rotation, shape count, intersection, or color.",
            visual: <div className="flex gap-2 text-slate-400"><ArrowIcon rotation={0} /><ArrowIcon rotation={45} /><ArrowIcon rotation={90} /></div>
        }
    ];

    return (
        <GameShell title="Inductive Reasoning" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto gap-12">

                <div className="grid grid-cols-5 gap-4">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(idx)}
                            className="w-32 h-32 flex flex-col items-center justify-center bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all active:scale-95 gap-2"
                        >
                            {opt.type === 'rotation' && (
                                <ArrowIcon rotation={opt.rotation} className="w-12 h-12 text-slate-700" />
                            )}
                            {opt.type === 'count' && (
                                <div className="flex flex-wrap justify-center gap-1 w-16">
                                    {Array(opt.count).fill(0).map((_, i) => (
                                        <Circle key={i} size={12} className="text-blue-500 fill-blue-500" />
                                    ))}
                                </div>
                            )}
                            <span className="text-xs font-bold text-slate-400">{String.fromCharCode(65 + idx)}</span>
                        </button>
                    ))}
                </div>

            </div>
        </GameShell>
    );
};

export default InductiveReasoning;
