# 🎌 Pachinko Machine Simulator

A web-based triple-board pachinko machine simulator built with HTML5 Canvas, CSS3, and JavaScript. Experience the excitement of traditional Japanese pachinko with modern web technology!

![Pachinko Machine](https://img.shields.io/badge/Game-Pachinko-gold?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Features

### Triple Board Action
- **3 Independent Boards**: Play on left, center, and right boards simultaneously
- **Strategic Gameplay**: Choose which board to fire on based on peg patterns
- **Simultaneous Play**: Multiple balls can be in play across different boards

### Realistic Physics
- **Gravity Simulation**: Balls fall naturally with realistic physics
- **Bounce Mechanics**: Authentic bouncing off golden pegs with randomness
- **Collision Detection**: Precise ball-to-peg interaction
- **Trail Effects**: Visual ball trails for enhanced gameplay experience

### Scoring System
- **7 Score Pockets per Board**: Each board has its own scoring zones
- **Variable Point Values**: 20, 50, 100, and 500 point pockets
- **Guaranteed Scoring**: Every ball lands in a scoring pocket
- **High Score Challenge**: Try to maximize your score with 10 balls

### Visual Design
- **Retro Aesthetic**: Traditional pachinko machine styling with wooden frame
- **Golden Accents**: Shimmering pegs and frame details
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Fluid ball movement and visual effects

## 🚀 How to Play

1. **Launch the Game**: Open `index.html` in your web browser
2. **Fire Balls**: Click any of the three fire buttons:
   - `FIRE LEFT` - Launch ball on the left board
   - `FIRE CENTER` - Launch ball on the center board  
   - `FIRE RIGHT` - Launch ball on the right board
3. **Watch & Score**: Watch balls bounce off pegs and land in score pockets
4. **Strategic Choices**: Fire on different boards for maximum scoring potential
5. **Aim for 500**: The center pocket on each board gives 500 points!
6. **Reset**: Click `RESET GAME` to start over with 10 new balls

## 🎯 Game Rules

- **10 Balls Total**: You get 10 balls to achieve the highest score
- **Board Independence**: Balls stay within their launched board
- **One Ball Per Board**: Wait for a ball to score before firing another on the same board
- **Guaranteed Scoring**: All balls will land in a scoring pocket
- **Score Values**: 
  - Edge pockets: 100 points
  - Mid pockets: 50 points  
  - Inner pockets: 20 points
  - **Center pocket: 500 points** 🎯

## 🛠️ Technical Details

### File Structure
```
pachinko/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # Game logic and physics engine
├── README.md           # This documentation
└── LICENSE             # MIT License
```

### Key Technologies
- **HTML5 Canvas**: For game rendering and graphics
- **CSS3 Gradients**: For visual styling and effects
- **Vanilla JavaScript**: No dependencies, pure JS physics engine
- **RequestAnimationFrame**: Smooth 60fps animation loop

### Physics Implementation
- **Gravity**: Realistic downward acceleration
- **Friction**: Air resistance simulation
- **Elastic Collision**: Bouncing with energy loss
- **Randomness**: Subtle variations for realistic unpredictability

## 🎨 Customization

The game is easily customizable by modifying the JavaScript constants:

```javascript
// Physics tweaking
this.gravity = 0.3;      // Ball fall speed
this.bounce = 0.7;       // Bounce energy retention
this.friction = 0.99;    // Air resistance

// Game parameters
this.ballsRemaining = 10; // Starting ball count
const scores = [100, 50, 20, 500, 20, 50, 100]; // Pocket values
```

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Sound effects and music
- Particle effects for scoring
- Different peg patterns/layouts
- Power-ups and special balls
- Multiplayer functionality
- Score leaderboards
- Additional board themes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎊 Acknowledgments

- Inspired by traditional Japanese pachinko machines
- Built with modern web technologies for cross-platform compatibility
- Designed for both entertainment and educational purposes

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

**Enjoy playing the Pachinko Machine Simulator!** 🎌

*Made with ❤️ for pachinko enthusiasts and web gaming fans*
