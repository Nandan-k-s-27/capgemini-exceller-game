# Capgemini Exceller Game Assessment

A React + Vite based game-assessment simulator containing 7 cognitive mini-games inspired by aptitude-style screening rounds.

This project provides a structured game shell with timer, scoring, level progression, and distinct challenge mechanics across numerical, visual, memory, logic, and motion tasks.

## Live Project Goals

- Simulate multi-round, time-bound cognitive assessments.
- Provide a polished UI for game-based aptitude practice.
- Maintain reusable game architecture through shared context and shell components.
- Track core performance metrics like score and level progression.

## Game Suite (7 Games)

1. **Digit Challenge**  
   Fill missing digits in equations while preserving uniqueness constraints.
2. **Switch Challenge**  
   Decode shape-transformation mappings and identify the correct permutation code.
3. **Geo-Sudo**  
   Solve a shape-based Sudoku-like grid using row/column (and block) validity rules.
4. **Grid Challenge**  
   Memorize position sequences, survive distraction tasks, and recall in order.
5. **Motion Challenge**  
   Move blocks/ball strategically to guide the red ball into the target hole.
6. **Inductive Reasoning**  
   Find the odd one out from generated rule-based visual patterns.
7. **Color the Grid**  
   Apply conditional logic rules and assign correct colors to mini-grids.

## Core Features

- **Unified game lifecycle** via a global game context.
- **Timer-based gameplay** with default 6-minute session duration per game.
- **Dynamic level progression** (level increases on correct answers).
- **Performance scoring model** tied to level and answer speed.
- **Reusable shell UI** for score, level, timer, quit, and instruction modal.
- **Instruction-first UX** with in-game tutorial modal for each game.
- **Modern animations** powered by Framer Motion.

## Scoring Logic

Implemented in `src/context/GameContext.jsx`:

- On correct submission:  
  `points = round((level^2 / max(1, timeTakenForLevel)) * 100)`
- `score += points`
- `level += 1`
- Timer decrements every second when state is `PLAYING`.
- Session transitions to `GAME_OVER` when timer reaches zero or user quits.

## Tech Stack

- **Frontend:** React 19, Vite 7
- **State Management:** React Context API (`GameContext`)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Styling:** Utility-first classes (Tailwind-style utility usage)
- **Linting:** ESLint

## Project Structure

```text
src/
  App.jsx                        # Dashboard + game router
  context/
    GameContext.jsx              # Global game state, timer, scoring, progression
  components/
    shared/
      GameShell.jsx              # Shared game HUD, modal, game-over UI
  games/
    digit-challenge/
      DigitChallenge.jsx
    switch-challenge/
      SwitchChallenge.jsx
    geo-sudo/
      GeoSudo.jsx
    grid-challenge/
      GridChallenge.jsx
    motion-challenge/
      MotionChallenge.jsx
    inductive-reasoning/
      InductiveReasoning.jsx
    color-the-grid/
      ColorTheGrid.jsx
```

## Setup and Run

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Screenshots

### Landing Page

![Landing Page](screenshots/Landing_page.png)

### Digit Challenge

![Digit Challenge](screenshots/Digit_challenge.png)

### Switch Challenge

![Switch Challenge](screenshots/Switch_challenge.png)

### Geo-Sudo

![Geo-Sudo](screenshots/Geo_sudo.png)

### Grid Challenge

![Grid Challenge](screenshots/Grid_challenge.png)

### Inductive Reasoning

![Inductive Reasoning](screenshots/Inductive_reasoning.png)

### Color the Grid

![Color the Grid](screenshots/Color_the_grid.png)

### Game Over Screen

![Game Over](screenshots/Game_over.png)

## Gameplay Video

### Motion Challenge Demo

- Direct file link: [Motion_challenge.mp4](screenshots/Motion_challenge.mp4)

<video src="screenshots/Motion_challenge.mp4" controls width="900"></video>

## Gameplay Flow

1. User lands on dashboard and selects one of 7 games.
2. Global game context initializes timer, score, and level.
3. User solves interactive levels under time pressure.
4. Correct answers increase score and level.
5. Session ends on timer completion or manual quit.
6. Game Over view displays final score and highest level reached.

## Current Strengths

- Clean component decomposition between shell and game-specific logic.
- Consistent UX patterns across all mini-games.
- Scalable architecture for adding additional games.
- Strong visual feedback and interaction cues.

## Potential Improvements

- Persist high scores and session history (local storage or backend).
- Add per-game analytics and detailed result breakdown.
- Replace `alert()` feedback with non-blocking toast notifications.
- Improve puzzle generation depth and adaptive difficulty curves.
- Add sound design and accessibility enhancements.
- Add automated tests for game logic and context state transitions.

## Repository

GitHub: https://github.com/Nandan-k-s-27/capgemini-exceller-game

## License

This project is currently provided for educational and portfolio purposes.
