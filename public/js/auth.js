const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');

// toggle auth modals
authSwitchLinks.forEach(link => {
    link.addEventListener('click', () => {
        authModals.forEach(modal => modal.classList.toggle('active'));
    });
});

// register form 
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = registerForm.email.value;
    const password = registerForm.password.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            // Signed in 
            registerForm.querySelector('.error').textContent = '';
            console.log(cred);
            const user = cred.user;
            console.log(user);
            registerForm.reset();
        })
        .catch((error) => {
            registerForm.querySelector('.error').textContent = error.message;
        });
});

// login form 
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((cred) => {
            // Signed in 
            loginForm.querySelector('.error').textContent = '';
            console.log(cred);
            const user = cred.user;
            console.log(user);
            loginForm.reset();
        })
        .catch((error) => {
            console.log(error.code);
            loginForm.querySelector('.error').textContent = error.message;
        });
});

// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        console.log('signed out');
    }).catch((error) => {
        console.error(error.message);
    });
});

// auth listener
firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if(user){
        authWrapper.classList.remove('open');
        authModals.forEach(m => m.classList.remove('active'));
    }else{
        authWrapper.classList.add('open');
        authModals[0].classList.add('active');
    }
});