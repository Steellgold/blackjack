# 🎰 Blackjack

A modern multiplayer Blackjack game built with Next.js, Socket.IO, and TypeScript. Play against the dealer or with friends in real-time!

## ✨ Features

- 🎮 Single-player and multiplayer modes
- 🌐 Real-time gameplay with WebSocket
- 💬 In-game chat system
- 🎨 Multiple table themes
- 🌍 Internationalization (English/French)
- 📱 Responsive design (Mobile, Tablet, Desktop)
- 🎲 Realistic card dealing animations
- 💰 Betting system with chips
- 🎯 Standard Blackjack rules implementation
- 👥 Support for up to 7 players per table

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Socket.IO Client
  - Zustand (State Management)
  - Framer Motion (Animations)

- **Backend:**
  - Socket.IO
  - Fastify
  - TypeScript

## 📁 Project Structure

```
apps/
├── socket/      # Socket.IO backend server
└── www/         # Next.js frontend application
packages/
├── game/        # Shared game logic and types
└── db/          # Database integration (Supabase) - Not used for now
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Steellgold/blackjack.git
cd blackjack
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the `packages/www` directory:
```env
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001/"
```

4. Start the development servers:
```bash
pnpm dev
```

5. Open `http://localhost:3000` in your browser to play!

## 🎮 Game Rules

- Each player starts with a defined balance
- Players can bet using various chip denominations
- The goal is to beat the dealer's hand without going over 21
- Players can "Hit" (take another card) or "Stand" (keep current hand)
- Dealer must hit on 16 and stand on 17
- Blackjack (Ace + 10-value card) pays 2.5x the bet
- Regular wins pay 2x the bet
- Push (tie) returns the original bet

## 🌟 Features in Detail

### 🎲 Real-time Multiplayer
- Create private tables
- Join existing tables using table codes
- Watch other players' moves in real-time
- Synchronize game states across all players

### 💬 Chat System
- Real-time chat with other players at the table
- Unread message notifications
- Player name and timestamp for each message

### 🎨 Theme System
- Multiple table themes (Classic, Sky, Modern, Neon, Darkness)
- Theme persistence across sessions
- Smooth theme transitions

### 🌍 Internationalization
- English and French language support
- Persistent language selection
- Complete translation coverage

### 💰 Betting System
- Multiple chip denominations
- Visual chip stacking
- Bet placement animations
- Balance management

### 📱 Responsive Design
- Optimized for mobile devices
- Tablet support
- Desktop-first experience
- Adaptive layouts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
