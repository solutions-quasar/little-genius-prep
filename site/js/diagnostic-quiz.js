/**
 * Little Genius Prep - Interactive Diagnostic Mini-Quiz Sandbox
 * Allows prospective parents & students to test SHSAT / Logic acumen.
 */

(function () {
  const quizQuestions = [
    {
      category: "SHSAT ELA • Revising & Editing",
      question: "Which revision best clarifies the relationship between ideas and maintains standard formal academic style?\n\n'The specialized high school admission exam requires consistent analytical stamina; therefore, several students neglect time management during the second section.'",
      options: [
        { letter: "A", text: "Stamina, for that reason, several students neglect", correct: false },
        { letter: "B", text: "Stamina; however, many students neglect time management during the second section.", correct: true },
        { letter: "C", text: "Stamina; in addition, several students neglects", correct: false },
        { letter: "D", text: "Stamina, nevertheless many students are neglecting", correct: false }
      ],
      explanation: "Choice B correctly uses the contrastive transition '; however,' to indicate the unexpected contradiction between exam demands and student habits."
    },
    {
      category: "SHSAT Mathematics • Non-Routine Geometry",
      question: "A right cylinder has radius r and height h. If the radius is doubled and the height is reduced by 50%, by what percentage does the cylinder's volume change?",
      options: [
        { letter: "A", text: "Volume remains unchanged (0% change)", correct: false },
        { letter: "B", text: "Volume increases by 50%", correct: false },
        { letter: "C", text: "Volume increases by 100% (doubles)", correct: true },
        { letter: "D", text: "Volume increases by 200%", correct: false }
      ],
      explanation: "V = π·r²·h. If r' = 2r and h' = 0.5h, then V' = π·(2r)²·(0.5h) = π·(4r²)·(0.5h) = 2·(π·r²·h). The new volume is 200% of the original, meaning an increase of 100%."
    },
    {
      category: "SHSAT Mathematics • Algebra & Rate Logic",
      question: "Arthur can complete a 57-question SHSAT practice section in 90 minutes. Alexander can complete the same section in 60 minutes. Working together at their constant rates, how many minutes will it take them to complete the section?",
      options: [
        { letter: "A", text: "36 minutes", correct: true },
        { letter: "B", text: "45 minutes", correct: false },
        { letter: "C", text: "50 minutes", correct: false },
        { letter: "D", text: "75 minutes", correct: false }
      ],
      explanation: "Rate = 1/90 + 1/60 = (2 + 3) / 180 = 5/180 = 1/36 sections per minute. Time = 36 minutes."
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;
  let userAnswers = [];

  function initQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;
    renderQuestion(currentQuestionIndex);
  }

  function renderQuestion(index) {
    const container = document.getElementById("quiz-container");
    const q = quizQuestions[index];
    const total = quizQuestions.length;
    const progressPercent = ((index) / total) * 100;

    container.innerHTML = `
      <div class="quiz-step-indicator">
        <span>Question ${index + 1} of ${total}</span>
        <span>${q.category}</span>
      </div>

      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%"></div>
      </div>

      <div class="quiz-question-box">
        <div class="quiz-category">${q.category}</div>
        <p class="quiz-question-text">${q.question.replace(/\n\n/g, '<br><br>')}</p>
        
        <div class="quiz-options-list">
          ${q.options.map((opt, optIdx) => `
            <button type="button" class="quiz-option-btn" data-index="${optIdx}">
              <span class="quiz-option-letter">${opt.letter}</span>
              <span class="quiz-option-label">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const buttons = container.querySelectorAll(".quiz-option-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", function () {
        const selectedIdx = parseInt(this.getAttribute("data-index"), 10);
        handleAnswer(index, selectedIdx);
      });
    });
  }

  function handleAnswer(questionIdx, selectedOptionIdx) {
    const q = quizQuestions[questionIdx];
    const chosenOption = q.options[selectedOptionIdx];
    const isCorrect = chosenOption.correct;

    if (isCorrect) userScore++;
    userAnswers.push({
      question: q.question,
      chosen: chosenOption,
      isCorrect: isCorrect,
      explanation: q.explanation
    });

    if (questionIdx + 1 < quizQuestions.length) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      renderResults();
    }
  }

  function renderResults() {
    const container = document.getElementById("quiz-container");
    const total = quizQuestions.length;
    let badge = "";
    let analysis = "";

    if (userScore === 3) {
      badge = "Elite Stuyvesant / Bronx Science Track";
      analysis = "Outstanding score! Your student demonstrates mastery of non-routine problem solving and academic precision. An intensive cohort will hone their testing pace and maximize their scaled composite rank.";
    } else if (userScore === 2) {
      badge = "Strong Brooklyn Tech & Regents Honors Candidate";
      analysis = "Very solid foundation! With targeted work on time management shortcuts and nuanced revising/editing grammar rules, your student can comfortably cross the specialized cutoff.";
    } else {
      badge = "High Growth Potential Candidate";
      analysis = "Great effort! NYC competitive exams test specialized traps that traditional classrooms rarely teach. A diagnostic assessment at our Brighton Beach center will map their exact growth trajectory.";
    }

    container.innerHTML = `
      <div class="quiz-result-card glass-panel">
        <div class="result-badge">${badge}</div>
        <h3 class="result-score-title">Mini Diagnostic Score: ${userScore} / ${total} Correct</h3>
        <p class="result-analysis">${analysis}</p>

        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <a href="#booking-form" class="btn btn-primary btn-lg">Book Full Proctored Diagnostic</a>
          <button type="button" id="btn-retake-quiz" class="btn btn-glass btn-lg">Retake Mini Quiz</button>
        </div>
      </div>
    `;

    document.getElementById("btn-retake-quiz").addEventListener("click", () => {
      currentQuestionIndex = 0;
      userScore = 0;
      userAnswers = [];
      renderQuestion(0);
    });
  }

  document.addEventListener("DOMContentLoaded", initQuiz);
})();
