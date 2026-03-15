import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { motion } from 'framer-motion';
import { Square, Triangle, Circle, Plus } from 'lucide-react';

const SHAPES = [
    { id: 'square', icon: Square, color: 'text-red-500' },
    { id: 'triangle', icon: Triangle, color: 'text-yellow-500' },
    { id: 'circle', icon: Circle, color: 'text-green-500' },
    { id: 'plus', icon: Plus, color: 'text-blue-500' },
];

const SwitchChallenge = () => {
    const { level, submitAnswer } = useGame();
    const [inputSeq, setInputSeq] = useState([]);
    const [outputSeq, setOutputSeq] = useState([]);
    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState('');
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        generateLevel();
    }, [level]);

    const generateLevel = () => {
        setFeedback(null);
        // 1. Generate random input sequence (4 shapes)
        // We shuffle the SHAPES array
        const shuffledShapes = [...SHAPES].sort(() => Math.random() - 0.5);
        setInputSeq(shuffledShapes);

        // 2. Generate a random permutation code (e.g., "2341")
        // Code represents: Output[i] comes from Input[Code[i]-1]
        // Valid permutation of 1,2,3,4
        const indices = [1, 2, 3, 4];
        const perm = indices.sort(() => Math.random() - 0.5);
        const code = perm.join('');
        setCorrectOption(code);

        // 3. Generate Output Sequence based on code
        const newOutput = perm.map(p => shuffledShapes[p - 1]);
        setOutputSeq(newOutput);

        // 4. Generate Distractor Options
        const distractors = new Set();
        distractors.add(code);
        while (distractors.size < 4) {
            const d = [1, 2, 3, 4].sort(() => Math.random() - 0.5).join('');
            distractors.add(d);
        }
        setOptions(Array.from(distractors).sort());
    };

    const handleOptionClick = (opt) => {
        if (opt === correctOption) {
            setFeedback('correct');
            submitAnswer(true);
        } else {
            submitAnswer(false); // Or handle wrong answer feedback
            setFeedback('wrong');
        }
    };

    const INSTRUCTIONS = [
        {
            title: "Observe the Transformation",
            desc: "Look at the Top Sequence (Input) and the Bottom Sequence (Output). The symbols have been rearranged.",
            visual: (
                <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <div className="flex gap-1"><Square size={16} /><Triangle size={16} /></div>
                    <div className="text-xs text-slate-400">↓</div>
                    <div className="flex gap-1"><Triangle size={16} /><Square size={16} /></div>
                </div>
            )
        },
        {
            title: "Decode the Switch",
            desc: "Find the 4-digit code that explains this reordering. Each number represents the original position of the item now in that slot.",
            visual: (
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-slate-600">If Input is <span className="font-bold">[A, B, C, D]</span></p>
                    <p className="text-sm text-slate-600">And Output is <span className="font-bold">[B, A, D, C]</span></p>
                    <p className="text-sm font-bold text-blue-600">Code: 2143</p>
                </div>
            )
        },
        {
            title: "Select the Answer",
            desc: "Choose the correct code from the options provided.",
            visual: <div className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-mono font-bold text-slate-600">2143</div>
        }
    ];

    return (
        <GameShell title="Switch Challenge" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto gap-12">

                {/* Input Sequence */}
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {inputSeq.map((shape, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                                className={`w-16 h-16 flex items-center justify-center bg-slate-50 rounded-xl ${shape.color}`}
                            >
                                <shape.icon size={32} fill="currentColor" className="opacity-20" />
                                <shape.icon size={32} className="absolute" strokeWidth={2.5} />
                            </motion.div>
                            <span className="text-xs font-mono text-slate-400">{i + 1}</span>
                        </div>
                    ))}
                </div>

                {/* The Switch / Funnel Visual */}
                <div className="relative w-full max-w-md h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-100 rounded-xl skew-y-3 opacity-50"></div>
                    <div className="z-10 text-slate-400 font-mono text-sm">TRANSFORMATION SWITCH</div>
                    {/* Visual lines could go here */}
                </div>

                {/* Output Sequence */}
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {outputSeq.map((shape, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                                className={`w-16 h-16 flex items-center justify-center bg-slate-50 rounded-xl ${shape.color}`}
                            >
                                <shape.icon size={32} fill="currentColor" className="opacity-20" />
                                <shape.icon size={32} className="absolute" strokeWidth={2.5} />
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="py-4 text-2xl font-mono font-bold bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 text-slate-600 tracking-widest"
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {feedback === 'correct' ? 'Correct pattern!' : 'Incorrect pattern. Try another option.'}
                    </div>
                )}

            </div>
        </GameShell>
    );
};

export default SwitchChallenge;
