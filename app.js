// ==========================================
// 1. DOM Elements Selection
// ==========================================
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');
const goToLogin = document.getElementById('go-to-login');
const goToSignup = document.getElementById('go-to-signup');

const signupForm = document.getElementById('signup-form');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');

const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// ==========================================
// 2. Initialize Mock Database
// ==========================================
if (!localStorage.getItem('usersDatabase')) {
    localStorage.setItem('usersDatabase', JSON.stringify([]));
}

// ==========================================
// 3. Toggle Logic
// ==========================================
goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    resetForms();
});

goToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    signupSection.classList.remove('hidden');
    resetForms();
});

function resetForms() {
    signupForm.reset();
    loginForm.reset();
    document.querySelectorAll('.form-control').forEach(ctrl => {
        ctrl.className = 'form-control'; 
    });
    signupBtn.setAttribute('disabled', 'true');
}

// ==========================================
// 4. Validation Functions
// ==========================================
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('.error-msg');
    small.innerText = message;
    return false;
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
    return true;
}

function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        return showSuccess(input);
    } else {
        return showError(input, 'Email is not valid');
    }
}

function checkSignupValidity() {
    let isNameValid = signupName.value.trim() !== '' ? showSuccess(signupName) : showError(signupName, 'Name is required');
    let isEmailValid = signupEmail.value.trim() !== '' ? checkEmail(signupEmail) : showError(signupEmail, 'Email is required');
    let isPassValid = signupPassword.value.length >= 6 ? showSuccess(signupPassword) : showError(signupPassword, 'Min 6 characters required');

    if (isNameValid && isEmailValid && isPassValid) {
        signupBtn.removeAttribute('disabled');
    } else {
        signupBtn.setAttribute('disabled', 'true');
    }
}

signupName.addEventListener('input', checkSignupValidity);
signupEmail.addEventListener('input', checkSignupValidity);
signupPassword.addEventListener('input', checkSignupValidity);

// ==========================================
// 5. Submit Handlers (Database Logic)
// ==========================================

// SIGNUP SUBMIT
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!signupBtn.hasAttribute('disabled')) {
        const usersDB = JSON.parse(localStorage.getItem('usersDatabase'));
        
        const userExists = usersDB.some(user => user.email === signupEmail.value.trim());
        if (userExists) {
            showError(signupEmail, 'Email already registered!');
            return;
        }

        const newUser = {
            name: signupName.value.trim(),
            email: signupEmail.value.trim(),
            password: signupPassword.value.trim()
        };
        usersDB.push(newUser);
        localStorage.setItem('usersDatabase', JSON.stringify(usersDB));

        alert('Account created successfully! Please log in.');
        goToLogin.click(); 
    }
});

// LOGIN SUBMIT (Dash Board-এ রিডাইরেক্ট করবে)
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    if (loginEmail.value.trim() === '') isValid = showError(loginEmail, 'Email required');
    if (loginPassword.value.trim() === '') isValid = showError(loginPassword, 'Password required');

    if (isValid) {
        const usersDB = JSON.parse(localStorage.getItem('usersDatabase'));
        
        const foundUser = usersDB.find(
            user => user.email === loginEmail.value.trim() && user.password === loginPassword.value.trim()
        );

        if (foundUser) {
            // ১. লগইন করা ইউজারের ডাটা সেভ করা
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            
            // ২. Dash Board ফোল্ডারে পাঠানো
            window.location.href = './Dash Board/index.html'; 
        } else {
            showError(loginEmail, 'Invalid credentials');
            showError(loginPassword, 'Invalid credentials');
        }
    }
});