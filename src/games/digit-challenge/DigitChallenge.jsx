import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

const DigitChallenge = () => {
    const { level, submitAnswer } = useGame();
    const [equation, setEquation] = useState([]);
    const [userInputs, setUserInputs] = useState({});
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    const evaluateExpression = useCallback((parts) => {
        // First pass handles multiplication/division, second pass handles addition/subtraction.
        const tokens = [...parts];
        const collapsed = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if ((token === '×' || token === '÷') && collapsed.length > 0 && i + 1 < tokens.length) {
                const left = collapsed.pop();
                const right = tokens[i + 1];
                const value = token === '×' ? left * right : left / right;
                collapsed.push(value);
                i += 1;
            } else {
                collapsed.push(token);
            }
        }

        let result = collapsed[0];
        for (let i = 1; i < collapsed.length; i += 2) {
            const operator = collapsed[i];
            const value = collapsed[i + 1];

            if (operator === '+') result += value;
            if (operator === '-') result -= value;
        }

        return result;
    }, []);

    // Helper to check uniqueness during generation
    const checkUnique = useCallback((nums) => {
        const str = nums.join('');
        const unique = new Set(str.split(''));
        return unique.size === str.length;
    }, []);

    const generateLevel = useCallback(() => {
        setUserInputs({});
        setFeedback(null);

        let parts = [];
        let missingIndices = [];
        let isValid = false;
        let attempts = 0;

        while (!isValid && attempts < 100) {
            attempts++;
            parts = [];
            missingIndices = [];

            // Randomly pick numbers ensuring no immediate duplicates in operands
            // Then calculate result and check total uniqueness

            if (level <= 2) {
                const a = Math.floor(Math.random() * 9) + 1;
                const b = Math.floor(Math.random() * 9) + 1;
                const res = a + b;
                if (checkUnique([a, b, res])) {
                    parts = [a, '+', b, '=', res];
                    missingIndices = [0];
                    isValid = true;
                }
            } else if (level <= 5) {
                // Simplified for guaranteed solvability: A * B + C or similar
                // Let's stick to the previous pattern but check unique
                const a = Math.floor(Math.random() * 9) + 1;
                const b = Math.floor(Math.random() * 9) + 1;
                const c = Math.floor(Math.random() * 9) + 1;
                const res = a * b + c; // Logic from previous code (A * B + C)

                if (res < 100 && checkUnique([a, b, c, res])) {
                    parts = [a, '×', b, '+', c, '=', res];
                    missingIndices = [0, 4];
                    isValid = true;
                }
            } else {
                const a = Math.floor(Math.random() * 9) + 1;
                const b = Math.floor(Math.random() * 9) + 1;
                const c = Math.floor(Math.random() * 9) + 1;
                const res = a * b - c;

                if (res > 0 && res < 100 && checkUnique([a, b, c, res])) {
                    parts = [a, '×', b, '-', c, '=', res];
                    missingIndices = [0, 2, 4];
                    isValid = true;
                }
            }
        }

        // Fallback if random gen fails (should be rare)
        if (!isValid) {
            // Safe fallback
            parts = [2, '+', 3, '=', 5];
            missingIndices = [0];
        }

        setEquation({ parts, missingIndices });
    }, [checkUnique, level]);

    // Generate Equation based on Level
    useEffect(() => {
        generateLevel();
    }, [generateLevel]);

    // Calculate used digits for UI
    const usedDigits = useMemo(() => {
        if (!equation.parts) return [];
        const used = new Set();

        // 1. Digits from the fixed parts of the equation
        equation.parts.forEach((part, idx) => {
            if (typeof part === 'number') {
                // If this index is NOT missing, it's a fixed number
                if (!equation.missingIndices.includes(idx)) {
                    String(part).split('').forEach(d => used.add(Number(d)));
                }
            }
        });

        // 2. Digits from user inputs
        Object.values(userInputs).forEach(val => {
            if (val !== undefined) used.add(val);
        });

        return Array.from(used);
    }, [equation, userInputs]);

    const handleDigitClick = (digit) => {
        if (usedDigits.includes(digit)) return; // Prevent usage

        // Find first empty slot
        const firstEmpty = equation.missingIndices.find(idx => userInputs[idx] === undefined);
        if (firstEmpty !== undefined) {
            setUserInputs(prev => ({ ...prev, [firstEmpty]: digit }));
        }
    };

    const handleBackspace = () => {
        const filledIndices = Object.keys(userInputs).map(Number).sort((a, b) => b - a);
        if (filledIndices.length > 0) {
            const lastFilled = filledIndices[0];
            const newInputs = { ...userInputs };
            delete newInputs[lastFilled];
            setUserInputs(newInputs);
        }
    };

    const checkAnswer = () => {
        // Reconstruct equation
        let filledParts = [...equation.parts];
        let isComplete = true;

        equation.missingIndices.forEach(idx => {
            if (userInputs[idx] === undefined) isComplete = false;
            filledParts[idx] = userInputs[idx];
        });

        if (!isComplete) return;

        const expressionParts = filledParts.slice(0, filledParts.indexOf('='));

        const target = filledParts[filledParts.length - 1];

        try {
            const result = evaluateExpression(expressionParts);
            if (result === target) {
                setFeedback('correct');
                setTimeout(() => submitAnswer(true), 1000);
            } else {
                setFeedback('wrong');
                setTimeout(() => {
                    setFeedback(null);
                    setUserInputs({});
                }, 1000);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const INSTRUCTIONS = [
        {
            title: "Understand the Equation",
            desc: "You will see a math equation with some missing numbers.",
            visual: <div className="flex gap-2 justify-center text-xl font-bold font-mono bg-slate-100 p-2 rounded"><span className="text-slate-400">?</span><span>+</span><span>5</span><span>=</span><span>8</span></div>
        },
        {
            title: "Fill in the Blanks",
            desc: "Use the number pad to type the missing digits. The cursor moves automatically to the next empty slot.",
            visual: <div className="flex justify-center"><div className="w-12 h-12 bg-white border-2 border-slate-200 flex items-center justify-center font-bold rounded-lg shadow-sm text-slate-700">3</div></div>
        },
        {
            title: "Check Your Work",
            desc: "Ensure the equation is mathematically correct, then press Submit.",
            visual: <div className="flex gap-2 justify-center text-xl font-bold font-mono bg-teal-50 text-teal-700 p-2 rounded border border-teal-200"><span>3</span><span>+</span><span>5</span><span>=</span><span>8</span></div>
        }
    ];

    return (
        <GameShell title="Digit Challenge" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">

                {/* Equation Display */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12 text-4xl font-bold text-slate-700">
                    {equation.parts && equation.parts.map((part, idx) => {
                        const isMissing = equation.missingIndices.includes(idx);
                        if (isMissing) {
                            return (
                                <motion.div
                                    key={idx}
                                    animate={feedback === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                                    className={`w-16 h-20 flex items-center justify-center rounded-xl border-4 ${userInputs[idx] !== undefined
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-slate-100 border-slate-300 border-dashed'
                                        }`}
                                >
                                    {userInputs[idx]}
                                </motion.div>
                            );
                        }
                        return <div key={idx}>{part}</div>;
                    })}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                        const isUsed = usedDigits.includes(digit);
                        return (
                            <button
                                key={digit}
                                onClick={() => handleDigitClick(digit)}
                                disabled={isUsed}
                                className={`w-20 h-20 text-3xl font-bold border-2 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center
                                    ${isUsed
                                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:scale-105'
                                    }`}
                            >
                                {digit}
                            </button>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex gap-4 w-full max-w-xs">
                    <button
                        onClick={handleBackspace}
                        className="flex-1 py-4 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        <Delete size={20} /> Clear
                    </button>
                    <button
                        onClick={checkAnswer}
                        className="flex-1 py-4 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                    >
                        <Check size={20} /> Submit
                    </button>
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {feedback === 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20"
                        >
                            <div className="bg-emerald-500 text-white p-8 rounded-full shadow-2xl">
                                <Check size={64} strokeWidth={4} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div >
        </GameShell >
    );
};

export default DigitChallenge;
