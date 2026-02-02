// Quiz Configuration - Edit these questions!
const quizQuestions = [
  {
    image: "images/IMG_1203.jpeg",
    question: "What year was this valentine dinner?",
    options: ["2018", "2019", "2020", "2021"],
    correctAnswer: 1 // 2019
  },
  {
    image: "images/IMG_4589.jpeg",
    question: "What is in this picture but no longer there today?",
    options: ["Balls", "Chair", "Hair style", "Sheets"],
    correctAnswer: 0 // Balls
  },
  {
    image: "images/IMG_6456.jpeg",
    question: "What did we eat before coming to this restaurant this Valentine day?",
    options: ["Nachos", "Tacos", "Nuggets", "Torta"],
    correctAnswer: 1 // Tacos
  },
  {
    image: "images/IMG_8180.jpeg",
    question: "Who is this drop dead gorgeous lady here?",
    options: ["The love of my life", "Mamacita", "Sugga Plum", "All of the above"],
    correctAnswer: 3 // All of the above
  },
  {
    image: "images/IMG_2481.jpeg",
    question: "Where was this taken?",
    options: ["Six Flags", "Cancun", "Disney", "Crazy Land"],
    correctAnswer: 1 // Cancun
  }
];

let currentQuestionIndex = 0;
let score = 0;
let missedQuestions = [];

// Initialize quiz when page loads
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("total-questions").textContent = quizQuestions.length;
  loadQuestion();
});

function loadQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  const optionsContainer = document.getElementById("quiz-options");
  const feedback = document.getElementById("quiz-feedback");

  // Update question number
  document.getElementById("current-question").textContent = currentQuestionIndex + 1;

  // Update image and question text
  document.getElementById("quiz-image").src = question.image;
  document.getElementById("quiz-question-text").textContent = question.question;

  // Clear previous options and feedback
  optionsContainer.innerHTML = "";
  feedback.textContent = "";

  // Create option buttons
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  const question = quizQuestions[currentQuestionIndex];
  const options = document.querySelectorAll(".quiz-option");
  const feedback = document.getElementById("quiz-feedback");

  // Disable all buttons
  options.forEach(btn => btn.onclick = null);

  // Show correct/wrong
  if (selectedIndex === question.correctAnswer) {
    options[selectedIndex].classList.add("correct");
    feedback.textContent = "Correct!";
    score++;
  } else {
    options[selectedIndex].classList.add("wrong");
    feedback.textContent = "Not quite, but nice try!";
    missedQuestions.push(currentQuestionIndex + 1);
    createDislikes();
  }

  // Move to next question or finish quiz
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      finishQuiz();
    }
  }, 1500);
}

function finishQuiz() {
  const quizSection = document.getElementById("quiz-section");
  const mainProposal = document.getElementById("main-proposal");
  const feedback = document.getElementById("quiz-feedback");
  const quizCard = document.querySelector(".quiz-card");

  // Check for perfect score
  if (score === quizQuestions.length) {
    // Show Starbucks reward immediately in the card
    quizCard.innerHTML = `
      <p class="perfect-score-text">PERFECT SCORE!</p>
      <p class="quiz-question">You answered all questions correctly!</p>
      <img class="quiz-image" src="images/starbucks.gif" alt="Starbucks">
      <p class="reward-text">You win a FREE Starbucks!</p>
    `;
    feedback.textContent = "";

    setTimeout(() => {
      // Dramatic transition - show in the card
      quizCard.innerHTML = `
        <p class="dramatic-text">But wait...</p>
      `;
    }, 3500);

    setTimeout(() => {
      quizCard.innerHTML = `
        <p class="dramatic-text">There's something else...</p>
      `;
    }, 5000);

    setTimeout(() => {
      quizCard.innerHTML = `
        <p class="dramatic-text">Something important...</p>
      `;
    }, 6500);

    setTimeout(() => {
      quizSection.classList.add("fade-out");

      setTimeout(() => {
        quizSection.style.display = "none";
        mainProposal.style.display = "block";
        mainProposal.classList.add("fade-in");
        setupNoButton();
      }, 500);
    }, 8000);

  } else {
    // Not perfect - show missed questions and try again
    const missedList = missedQuestions.join(", ");
    quizCard.innerHTML = `
      <p class="quiz-question">You missed question${missedQuestions.length > 1 ? 's' : ''}: ${missedList}</p>
      <p class="try-again-text">You need a perfect score to continue!</p>
      <button class="quiz-option try-again-btn" id="try-again-btn">Try Again</button>
    `;
    feedback.textContent = `You got ${score}/${quizQuestions.length}`;

    // Add event listener for try again button (works better on mobile)
    document.getElementById("try-again-btn").addEventListener("click", restartQuiz);
    document.getElementById("try-again-btn").addEventListener("touchend", function(e) {
      e.preventDefault();
      restartQuiz();
    });
  }
}

function restartQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  score = 0;
  missedQuestions = [];

  // Restore quiz card structure
  const quizCard = document.querySelector(".quiz-card");
  quizCard.innerHTML = `
    <img class="quiz-image" id="quiz-image" src="" alt="Quiz photo">
    <p class="quiz-question" id="quiz-question-text"></p>
    <div class="quiz-options" id="quiz-options"></div>
  `;

  document.getElementById("quiz-feedback").textContent = "";
  loadQuestion();
}

// No button state
let noButtonSize = 100; // percentage
let noButtonPressed = false;

// Setup No button touch/hover behavior after proposal shows
function setupNoButton() {
  const noButton = document.getElementById("no-button");

  function handleNoButton(e) {
    e.preventDefault();

    if (!noButtonPressed) {
      // First press - show gun.gif and "Choose wisely"
      noButtonPressed = true;
      document.getElementsByClassName("image")[0].src = "images/gun.gif";
      document.getElementById("question").textContent = "Choose wisely...";
      document.getElementById("name").style.display = "none";
    } else {
      // Subsequent presses - shrink the button (minimum 20%)
      noButtonSize = Math.max(20, noButtonSize - 15);
      noButton.style.transform = `scale(${noButtonSize / 100})`;
    }
  }

  // Touch events for mobile
  noButton.addEventListener("touchstart", handleNoButton, { passive: false });

  // Click for desktop
  noButton.addEventListener("click", handleNoButton);
}

// Dislike buttons falling effect for wrong answers
function createDislikes() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const dislike = document.createElement('div');
      dislike.className = 'falling-dislike';
      dislike.innerHTML = '👎';

      const size = Math.random() * 20 + 20;
      const startX = Math.random() * window.innerWidth;

      dislike.style.left = startX + 'px';
      dislike.style.top = '-50px';
      dislike.style.fontSize = size + 'px';

      document.body.appendChild(dislike);

      // Animate falling
      const duration = Math.random() * 2 + 1.5;
      const endX = startX + (Math.random() - 0.5) * 100;

      dislike.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 50}px) translateX(${endX - startX}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'ease-in'
      }).onfinish = () => dislike.remove();

    }, i * 50);
  }
}

// Confetti effect
function createConfetti() {
  const colors = ['#ff4d79', '#ff6b9d', '#ff85b3', '#ffa6c9', '#ffcce0', '#fff', '#ff1493', '#ff69b4'];
  const shapes = ['heart', 'circle'];

  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 15 + 8;
      const startX = Math.random() * window.innerWidth;

      confetti.style.left = startX + 'px';
      confetti.style.top = '-20px';
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';

      if (shape === 'heart') {
        confetti.innerHTML = '❤';
        confetti.style.fontSize = size + 'px';
        confetti.style.color = color;
        confetti.style.background = 'none';
      } else {
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = '50%';
      }

      document.body.appendChild(confetti);

      // Animate falling
      const duration = Math.random() * 3 + 2;
      const endX = startX + (Math.random() - 0.5) * 200;

      confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 50}px) translateX(${endX - startX}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'ease-out'
      }).onfinish = () => confetti.remove();

    }, i * 30);
  }
}

// Countdown timer
function updateCountdown() {
  const valentine = new Date('February 14, 2026 00:00:00').getTime();
  const now = new Date().getTime();
  const distance = valentine - now;

  if (distance < 0) {
    document.getElementById('countdown').innerHTML = "It's Valentine's Day!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('countdown').innerHTML =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function showMessage(response) {
  if (response === "Yes") {
    // Remove the name message and the "No" button
    document.getElementById("name").remove();
    document.getElementById("no-button").remove();
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.pause();
      videoElement.remove();
    }

    // Create confetti!
    createConfetti();

    // Create an audio element to play the sound
    const audioElement = document.createElement("audio");
    audioElement.src = "./Minions Cheering.mp3";
    audioElement.preload = "auto";
    audioElement.play()
      .catch(e => console.error("Audio playback failed:", e));

    // Update the text content and show countdown
    const yesMessage = document.getElementById("question");
    yesMessage.innerHTML = `Yeees! See you on the 14th, Princess.<br><span id="countdown" class="countdown"></span>`;
    yesMessage.style.display = "block";
    yesMessage.style.fontStyle = "normal";
    document.getElementsByClassName("image")[0].src = "images/dance.gif";

    // Remove the "Yes" button
    document.getElementById("yesButton").remove();

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}
