// document.body.addEventListener('click', function(event) {
//     const target = event.target;

//     // if(target.dataset.toggle == 'modal'){
//     //     console.log(document.getElementById(target.dataset.target).classList.toggle('d-none'))
//     // }

//     if(target.dataset.option === 'chinese'){
//         window.location.href = 'http://10.241.24.109:8000/checkers/';
//     }
//     if(target.dataset.option === 'x0'){
//         window.location.href = 'http://10.241.24.109:8000/tictactoe/';
//     }
//     if(target.dataset.option === 'letters'){
//         window.location.href = 'http://10.241.24.109:8000/words/word_search/';


//         console.log('no');

//         // fetch('/words/api/categories-difficulties/')
//         // .then(response => response.json())
//         // .then(data => {
//         //     const categorySelect = document.getElementById('category');
//         //     const difficultySelect = document.getElementById('difficulty');

//         //     categorySelect.innerHTML = '';
//         //     difficultySelect.innerHTML = '';

//         //     data.categories.forEach(category => {
//         //         let option = new Option(category.name, category.id);
//         //         categorySelect.add(option);
//         //     });

//         //     data.difficulties.forEach(difficulty => {
//         //         let option = new Option(difficulty, difficulty);
//         //         difficultySelect.add(option);
//         //     });
//         // })
//         // .catch(error => console.error('Error loading the data:', error));
//     }

// });




document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener('submit', function(event) {
        const email = document.querySelector('input[name="email"]');
        const password = document.querySelector('input[name="password"]');
        let valid = true;

        if (!email.value.includes('@')) {
            alert('Por favor, introduce un correo electrónico válido.');
            valid = false;
        }

        if (password.value.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            valid = false;
        }

        if (!valid) {
            event.preventDefault(); // Detener la acción predeterminada del formulario
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.form-container form');
    registerForm.addEventListener('submit', function(event) {
        let valid = true;

        const inputs = registerForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="url"]');
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                alert('Por favor, llena todos los campos requeridos.');
                valid = false;
            }
        });

        const password = document.querySelector('input[name="password1"]');
        const confirmPassword = document.querySelector('input[name="password2"]');
        if (password.value !== confirmPassword.value) {
            alert('Las contraseñas no coinciden.');
            valid = false;
        }

        if (!valid) {
            event.preventDefault(); // Detener la acción predeterminada del formulario
        }
    });
});
