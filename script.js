const quizList = document.querySelector(".quiz-list");
const questionContainer = document.querySelector(".question");
const choicesContainer = document.querySelector(".choices");

const loader = document.createElement("div");
loader.classList.add("loader");
loader.innerHTML = `
   <div class="spinner"></div>
   </br>
   <p>Loading...</p>
`;

async function fetchQuizQuestions() {
   try {
      const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple");
      const data = await response.json();
      if (!response.ok) {
         throw new Error('Could not fetching', response.status);
      }
      return data.results;
   } catch (error) {
      console.error("Error fetching quiz data:", error);
      questionContainer.innerHTML = `<p>Error loading quiz data. Please try again later.</p>`;
   }
}

function renderQuestion(questionData, questionIndex, totalQuestions) {
   questionContainer.innerHTML = `
      <h2>Question ${questionIndex + 1}/${totalQuestions}</h2>
      <p>${questionData.question}</p>
   `;

   choicesContainer.innerHTML = "";

   const choices = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);

   choices.forEach((choice) => {
      const choiceButton = document.createElement("button");
      choiceButton.classList.add("choice");
      choiceButton.textContent = choice;

      choiceButton.addEventListener("click", () => {
         checkAnswer(choice, questionData.correct_answer, questionIndex, totalQuestions);
      });

      choicesContainer.appendChild(choiceButton);
   });
}

function checkAnswer(selected, correctAnswer, currentIndex, totalQuestions) {
   if (selected === correctAnswer) {
      alert("Correct!");
      score++;
   } else {
      alert(`Incorrect! The correct answer is: ${correctAnswer}`);
   }

   if (currentIndex + 1 < totalQuestions) {
      renderQuestion(quizQuestions[currentIndex + 1], currentIndex + 1, totalQuestions);
   } else {
      displayFinalMessage();
   }
}

function displayFinalMessage() {
   questionContainer.innerHTML = `<h2>Quiz Completed!</h2><p>Thank you for playing!</p><p>Your score is: ${score}/${quizQuestions.length}</p>`;
   choicesContainer.innerHTML = "";
}

let quizQuestions = [];
let score = 0;

async function startQuiz() {
   questionContainer.appendChild(loader);

   quizQuestions = await fetchQuizQuestions();

   loader.remove();

   if (quizQuestions && quizQuestions.length > 0) {
      renderQuestion(quizQuestions[0], 0, quizQuestions.length);
   }
}

startQuiz();
