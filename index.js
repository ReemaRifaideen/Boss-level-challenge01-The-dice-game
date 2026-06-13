// Game State
let scores = { player1: 0, player2: 0 };
let isRolling = false;

const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const resultDisplay = document.getElementById("result");
const img1 = document.querySelectorAll("img")[0];
const img2 = document.querySelectorAll("img")[1];
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

// Sound effect for dice roll
function playRollSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Create multiple quick beeps like dice tumbling
    const beeps = [
      { time: 0, freq: 600, duration: 0.08 },
      { time: 0.1, freq: 800, duration: 0.07 },
      { time: 0.18, freq: 500, duration: 0.08 },
      { time: 0.27, freq: 900, duration: 0.07 },
      { time: 0.35, freq: 700, duration: 0.08 },
      { time: 0.44, freq: 1000, duration: 0.06 },
      { time: 0.51, freq: 400, duration: 0.05 }
    ];
    
    beeps.forEach(beep => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(beep.freq, now + beep.time);
      
      // Create popping/clicking effect
      gainNode.gain.setValueAtTime(0.3, now + beep.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + beep.time + beep.duration);
      
      osc.start(now + beep.time);
      osc.stop(now + beep.time + beep.duration);
    });
  } catch (e) {
    // Silent fail if audio context not supported
  }
}

// Roll the dice
function rollDice() {
  if (isRolling) return;
  
  isRolling = true;
  rollBtn.disabled = true;
  
  // Play roll sound
  playRollSound();
  
  // Add spin animation
  img1.style.animation = "none";
  img2.style.animation = "none";
  setTimeout(() => {
    img1.style.animation = "rollSpin 0.6s ease-out";
    img2.style.animation = "rollSpin 0.6s ease-out";
  }, 10);

  // Generate random numbers
  const randomNumber1 = Math.floor(Math.random() * 6) + 1;
  const randomNumber2 = Math.floor(Math.random() * 6) + 1;

  // Simulate roll delay
  setTimeout(() => {
    // Update images
    img1.setAttribute("src", "images/dice" + randomNumber1 + ".png");
    img2.setAttribute("src", "images/dice" + randomNumber2 + ".png");

    // Determine winner
    let winner = "";
    if (randomNumber1 > randomNumber2) {
      scores.player1++;
      winner = "🚩 Player 1 Wins This Round!";
    } else if (randomNumber2 > randomNumber1) {
      scores.player2++;
      winner = "🚩 Player 2 Wins This Round!";
    } else {
      winner = "🤝 Draw! Both rolled the same!";
    }

    updateDisplay(winner);
    
    setTimeout(() => {
      isRolling = false;
      rollBtn.disabled = false;
    }, 600);
  }, 600);
}

function updateDisplay(message) {
  resultDisplay.innerHTML = message;
  score1Display.innerHTML = scores.player1;
  score2Display.innerHTML = scores.player2;
}

function resetGame() {
  scores = { player1: 0, player2: 0 };
  isRolling = false;
  rollBtn.disabled = false;
  rollBtn.innerHTML = "🎲 Roll Dice";
  
  img1.setAttribute("src", "images/dice6.png");
  img2.setAttribute("src", "images/dice6.png");
  
  score1Display.innerHTML = "0";
  score2Display.innerHTML = "0";
  
  resultDisplay.innerHTML = "🎲 Let's Roll! 🎲";
}

// Event Listeners
rollBtn.addEventListener("click", rollDice);
resetBtn.addEventListener("click", resetGame);

// Spacebar support
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    rollDice();
  }
});
