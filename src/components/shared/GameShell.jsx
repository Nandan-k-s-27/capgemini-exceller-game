import React from 'react';
import { useGame } from '../../context/GameContext';
import { Timer, Trophy, Activity, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GameShell = ({ children, title, instructions }) => {
    const { gameState, score, level, timeLeft, endGame, resetGame } = useGame();
    const [showInstructions, setShowInstructions] = React.useState(false);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (gameState === 'GAME_OVER') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
                >
                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                    <p className="text-slate-400 mb-6">Great effort! Here is your result.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-700 p-4 rounded-xl">
                            <div className="text-sm text-slate-400">Final Score</div>
                            <div className="text-2xl font-bold text-emerald-400">{score}</div>
                        </div>
                        <div className="bg-slate-700 p-4 rounded-xl">
                            <div className="text-sm text-slate-400">Level Reached</div>
                            <div className="text-2xl font-bold text-blue-400">{level}</div>
                        </div>
                    </div>

                    <button
                        onClick={resetGame}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
                    >
                        Back to Menu
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <Activity size={16} />
                        Level {level}
                    </div>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="text-xs font-bold text-slate-500 underline hover:text-blue-600"
                    >
                        How to Play
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" />
                        <span className="font-bold text-slate-700">{score}</span>
                    </div>
                    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-700'}`}>
                        <Timer size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={endGame}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                        title="Quit Game"
                    >
                        <XCircle size={24} />
                    </button>
                </div>
            </header>

            {/* Game Content */}
            <main className="flex-1 p-6 overflow-hidden relative">
                {children}
            </main>

            {/* Instruction Modal */}
            {showInstructions && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-slate-800">How to Play</h2>
                            <button onClick={() => setShowInstructions(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <XCircle size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8">
                            {Array.isArray(instructions) ? (
                                <div className="space-y-6">
                                    {instructions.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-700 mb-1">{step.title}</h3>
                                                <p className="text-slate-500">{step.desc}</p>
                                                {step.visual && (
                                                    <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                        {step.visual}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-600 text-lg leading-relaxed">{instructions}</p>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl sticky bottom-0">
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default GameShell;
