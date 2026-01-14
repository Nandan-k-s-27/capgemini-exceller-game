import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, PAUSED, GAME_OVER
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentGameId, setCurrentGameId] = useState(null);
    const [gameConfig, setGameConfig] = useState(null);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (gameState === 'PLAYING' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const startGame = useCallback((id, config = {}) => {
        setCurrentGameId(id);
        setGameConfig(config);
        setScore(0);
        setLevel(1);
        setTimeLeft(config.duration || 360); // Default 6 mins
        setGameState('PLAYING');
    }, []);

    const endGame = useCallback(() => {
        setGameState('GAME_OVER');
    }, []);

    const submitAnswer = useCallback((isCorrect, timeTakenForLevel = 10) => {
        if (isCorrect) {
            // Scoring Formula: (Current Level)^2 / Time Taken
            // We add this to the total score
            const points = Math.round(Math.pow(level, 2) / Math.max(1, timeTakenForLevel) * 100);
            setScore((prev) => prev + points);
            setLevel((prev) => prev + 1);
            // Optional: Add bonus time?
        } else {
            // Penalty or just no points?
            // Maybe decrease level if it gets too hard?
            // For now, just no points.
        }
    }, [level]);

    const resetGame = useCallback(() => {
        setGameState('IDLE');
        setScore(0);
        setLevel(1);
        setTimeLeft(0);
        setCurrentGameId(null);
    }, []);

    const value = {
        gameState,
        score,
        level,
        timeLeft,
        currentGameId,
        startGame,
        endGame,
        submitAnswer,
        resetGame,
        setGameState
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
