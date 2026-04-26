# Card Game Scorer

A modern, responsive web application for tracking scores of a 4-player card game (Color + Plus-Minus hybrid). Built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **🎯 Real-time Score Tracking**: Track scores for up to 4 players with automatic calculations
- **📱 Mobile-First Design**: Fully responsive UI that works perfectly on mobile, tablet, and desktop
- **🌙 Dark Mode**: Toggle between light and dark themes
- **💾 Auto-Save**: All data persists in localStorage - never lose your game progress
- **📜 Round History**: View complete history of all rounds with detailed information
- **↩️ Undo Function**: Remove the last round if needed
- **✨ Modern UI**: Glassmorphism design with smooth animations

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **localStorage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How to Use

### Basic Flow

1. **Edit Player Names**: Click on any player name to customize it
2. **Add a Round**: Click the "Add Round" button
3. **Fill Round Details**:
   - Select the bidder from the dropdown
   - Enter the bid (minimum 5)
   - Select the power suit (♠️ ♥️ ♦️ ♣️)
   - Enter rounds won by each player (total must equal 13)
4. **Submit**: The scores are automatically calculated and updated

### Scoring Logic

- **Bidder Success** (wins ≥ bid): Add bid value to bidder's score
- **Bidder Failure** (wins < bid): Subtract bid value from bidder's score
- **Other Players**: Add their rounds won to their score

### Features

- **Auto-Distribute**: Click "Auto-distribute" to automatically distribute remaining tricks to non-bidders
- **Undo**: Remove the last round from history
- **Reset Game**: Clear all data and start fresh (requires confirmation)
- **Dark Mode**: Toggle between light and dark themes

## Project Structure

```
cards/
├── app/
│   ├── globals.css       # Global styles with Tailwind
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main page with state management
├── components/
│   ├── AddRoundModal.tsx # Modal for adding rounds
│   ├── PlayerCard.tsx    # Individual player score card
│   ├── RoundHistory.tsx  # List of past rounds
│   └── ScoreBoard.tsx    # Grid of player cards
├── lib/
│   ├── storage.ts        # localStorage utilities
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Responsive Breakpoints

- **Mobile**: 320px - 767px (stacked layout)
- **Tablet**: 768px - 1023px (2-column grid)
- **Desktop**: 1024px+ (4-column grid)

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- Focus indicators on all interactive elements
- Minimum touch target size of 44x44px
- Reduced motion support for users who prefer it

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
