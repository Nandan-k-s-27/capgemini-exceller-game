import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import GameShell from '../../components/shared/GameShell';
import { motion } from 'framer-motion';
import { Square, Triangle, Circle, Plus, Hexagon, Star } from 'lucide-react';

const SHAPES = [
    { id: 1, icon: Square, color: 'text-red-500' },
    { id: 2, icon: Triangle, color: 'text-yellow-500' },
    { id: 3, icon: Circle, color: 'text-green-500' },
    { id: 4, icon: Plus, color: 'text-blue-500' },
    { id: 5, icon: Hexagon, color: 'text-purple-500' },
    { id: 6, icon: Star, color: 'text-orange-500' },
];

const GeoSudo = () => {
    const { level, submitAnswer } = useGame();
    const [grid, setGrid] = useState([]);
    const [initialGrid, setInitialGrid] = useState([]);
    const [size, setSize] = useState(4);
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        // Level 1-3: 4x4
        // Level 4+: 5x5 (Not implemented fully, sticking to 4x4 for demo)
        const newSize = 4;
        setSize(newSize);
        generateLevel(newSize);
    }, [level]);

    const generateLevel = (s) => {
        // Simple backtracking to generate valid grid
        const fullGrid = createSolvedGrid(s);

        // Mask cells
        // Difficulty determines how many to remove
        const removeCount = Math.min(s * s - 4, level + 3);
        const newGrid = fullGrid.map(row => [...row]);
        const mask = fullGrid.map(row => row.map(() => true)); // true = fixed

        let removed = 0;
        while (removed < removeCount) {
            const r = Math.floor(Math.random() * s);
            const c = Math.floor(Math.random() * s);
            if (newGrid[r][c] !== 0) {
                newGrid[r][c] = 0;
                mask[r][c] = false; // false = editable
                removed++;
            }
        }

        setGrid(newGrid);
        setInitialGrid(mask);
        setSelectedCell(null);
    };

    const createSolvedGrid = (s) => {
        const board = Array(s).fill().map(() => Array(s).fill(0));
        solve(board, s);
        return board;
    };

    const solve = (board, s) => {
        for (let r = 0; r < s; r++) {
            for (let c = 0; c < s; c++) {
                if (board[r][c] === 0) {
                    const nums = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (isValid(board, r, c, num, s)) {
                            board[r][c] = num;
                            if (solve(board, s)) return true;
                            board[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const isValid = (board, r, c, num, s) => {
        // Check row
        for (let i = 0; i < s; i++) if (board[r][i] === num) return false;
        // Check col
        for (let i = 0; i < s; i++) if (board[i][c] === num) return false;
        // No subgrid check for 4x4 in this simplified version (usually 2x2 blocks, but GeoSudo often just Row/Col)
        // If we want 2x2 blocks:
        const blockSize = Math.sqrt(s);
        if (Number.isInteger(blockSize)) {
            const boxRow = Math.floor(r / blockSize) * blockSize;
            const boxCol = Math.floor(c / blockSize) * blockSize;
            for (let i = 0; i < blockSize; i++) {
                for (let j = 0; j < blockSize; j++) {
                    if (board[boxRow + i][boxCol + j] === num) return false;
                }
            }
        }
        return true;
    };

    const handleCellClick = (r, c) => {
        if (!initialGrid[r][c]) {
            setSelectedCell({ r, c });
        }
    };

    const handleShapeSelect = (shapeId) => {
        if (selectedCell) {
            const newGrid = [...grid];
            newGrid[selectedCell.r] = [...newGrid[selectedCell.r]];
            newGrid[selectedCell.r][selectedCell.c] = shapeId;
            setGrid(newGrid);

            // Check if full
            checkCompletion(newGrid);
        }
    };

    const checkCompletion = (currentGrid) => {
        // Check if any zeros
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (currentGrid[r][c] === 0) return;
            }
        }

        // Validate
        let valid = true;
        // Check rows/cols again
        for (let r = 0; r < size; r++) {
            const rowSet = new Set();
            const colSet = new Set();
            for (let c = 0; c < size; c++) {
                rowSet.add(currentGrid[r][c]);
                colSet.add(currentGrid[c][r]);
            }
            if (rowSet.size !== size || colSet.size !== size) valid = false;
        }

        // Also check 2x2 blocks if applicable

        if (valid) {
            setTimeout(() => submitAnswer(true), 500);
        } else {
            // Maybe visual feedback?
        }
    };

    const INSTRUCTIONS = [
        {
            title: "Understand the Grid",
            desc: "This is a Sudoku-style puzzle using shapes instead of numbers.",
            visual: (
                <div className="grid grid-cols-2 gap-1 w-16 h-16 bg-slate-200 p-1 rounded">
                    <div className="bg-white rounded flex items-center justify-center"><Square size={12} className="text-red-500" /></div>
                    <div className="bg-white rounded flex items-center justify-center"><Triangle size={12} className="text-yellow-500" /></div>
                    <div className="bg-white rounded flex items-center justify-center"><Triangle size={12} className="text-yellow-500" /></div>
                    <div className="bg-white rounded flex items-center justify-center"><Square size={12} className="text-red-500" /></div>
                </div>
            )
        },
        {
            title: "Follow the Rules",
            desc: "Each Row and each Column must contain every shape exactly once.",
            visual: (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1 bg-red-50 p-1 rounded border border-red-200"><span className="text-xs font-bold text-red-500">Row Error:</span> <Square size={12} /><Square size={12} /></div>
                    <div className="flex gap-1 bg-green-50 p-1 rounded border border-green-200"><span className="text-xs font-bold text-green-500">Row OK:</span> <Square size={12} /><Triangle size={12} /></div>
                </div>
            )
        },
        {
            title: "Fill the Grid",
            desc: "Click a cell to select it, then choose a shape from the palette below to fill it.",
            visual: <div className="flex gap-2"><div className="w-8 h-8 border-2 border-blue-400 rounded bg-white"></div><span className="text-xl">➔</span><Triangle size={24} className="text-yellow-500" /></div>
        }
    ];

    return (
        <GameShell title="Geo-Sudo" instructions={INSTRUCTIONS}>
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto gap-8">

                {/* Grid */}
                <div className="grid gap-2 p-4 bg-slate-200 rounded-xl" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const ShapeIcon = val ? SHAPES[val - 1].icon : null;
                            const isFixed = initialGrid[r] && initialGrid[r][c];
                            const isSelected = selectedCell?.r === r && selectedCell?.c === c;

                            return (
                                <motion.div
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    whileHover={!isFixed ? { scale: 1.05 } : {}}
                                    className={`w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isFixed ? 'bg-slate-300' : 'bg-white shadow-sm'
                                        } ${isSelected ? 'ring-4 ring-blue-400 z-10' : ''}`}
                                >
                                    {ShapeIcon && (
                                        <ShapeIcon
                                            size={32}
                                            className={SHAPES[val - 1].color}
                                            strokeWidth={isFixed ? 3 : 2}
                                        />
                                    )}
                                </motion.div>
                            );
                        })
                    ))}
                </div>

                {/* Controls */}
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {SHAPES.slice(0, size).map((shape) => (
                        <button
                            key={shape.id}
                            onClick={() => handleShapeSelect(shape.id)}
                            className="p-3 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <shape.icon size={32} className={shape.color} />
                        </button>
                    ))}
                    <button
                        onClick={() => handleShapeSelect(0)} // Clear
                        className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                    >
                        <span className="text-xs font-bold">CLEAR</span>
                    </button>
                </div>

            </div>
        </GameShell>
    );
};

export default GeoSudo;
