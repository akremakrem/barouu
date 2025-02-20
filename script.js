document.addEventListener("DOMContentLoaded", function() {
    // إضافة الحروف المتساقطة ديناميكيًا
    const background = document.querySelector('.background');
    if (background) {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVSTUVWXYZ";

        function createFallingLetter() {
            const span = document.createElement('span');
            span.textContent = letters[Math.floor(Math.random() * letters.length)];
            span.style.left = Math.random() * 100 + 'vw';
            span.style.animationDuration = Math.random() * 3 + 2 + 's';
            background.appendChild(span);

            setTimeout(() => {
                span.remove();
            }, 5000);
        }

        setInterval(createFallingLetter, 300);
    }

    // حفظ الإجابات في localStorage
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const questionId = e.target.name;
            const answer = e.target.value;
            saveAnswer(questionId, answer);
        });
    });

    // تحميل الإجابات المحفوظة عند فتح الصفحة
    const savedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
    savedAnswers.forEach(answer => {
        const input = document.querySelector(`input[name="${answer.questionId}"][value="${answer.answer}"]`);
        if (input) {
            input.checked = true;
        }
    });
});

// وظائف التنقل بين الصفحات
function goToBackground() {
    window.location.href = "background.html";
}

function goToLinguistics() {
    window.location.href = "linguistics.html";
}

function goToPhonetics() {
    window.location.href = "phonetics.html";
}

function goToPsychology() {
    window.location.href = "psychology.html";
}

function goToEducation() {
    window.location.href = "education.html";
}

// دالة لحفظ الإجابات في localStorage
function saveAnswer(questionId, answer) {
    let answers = JSON.parse(localStorage.getItem('answers')) || [];
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);

    if (existingAnswerIndex !== -1) {
        answers[existingAnswerIndex] = { questionId, answer };
    } else {
        answers.push({ questionId, answer });
    }

    localStorage.setItem('answers', JSON.stringify(answers));
}

// دالة لإرسال الإجابات إلى الخادم
function sendAnswersToServer() {
    const answers = JSON.parse(localStorage.getItem('answers'));
    fetch('/save-answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// دالة للتحقق من اكتمال الإجابات في الصفحة الحالية
function validateCurrentSection() {
    const currentQuestions = document.querySelectorAll('.question-frame');
    return Array.from(currentQuestions).every(question => {
        return question.querySelector('input[type="radio"]:checked');
    });
}

// دالة للتعامل مع النقر على زر "Next"
function handleNext(nextFunction) {
    if (validateCurrentSection()) {
        saveCurrentAnswers();
        nextFunction();
    } else {
        alert('Please answer all questions before proceeding!');
    }
}

// دالة لحفظ الإجابات الحالية
function saveCurrentAnswers() {
    const currentQuestions = document.querySelectorAll('.question-frame');
    currentQuestions.forEach(question => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        if (selectedAnswer) {
            saveAnswer(selectedAnswer.name, selectedAnswer.value);
        }
    });
}

// إرسال الإجابات عند الانتهاء
function submitSurvey() {
    if (validateCurrentSection()) {
        saveCurrentAnswers();
        sendAnswersToServer();
        alert('Thank you for completing the survey!');
        window.location.href = 'index.html';
    } else {
        alert('Please answer all questions before submitting!');
    }
}