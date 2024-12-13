
        const authForm = document.getElementById('authForm');
        const messageDiv = document.getElementById('message');
        const adminSection = document.getElementById('adminSection');
        const usersDiv = document.getElementById('users');

        const submitBtn = document.getElementById('submitBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const toggleForm = document.getElementById('toggleForm');
        const formTitle = document.getElementById('formTitle');

        const API_URL = 'https://account-manage-backend-a5f4hcexc5bvf5bm.westeurope-01.azurewebsites.net';

        let isLogin = true; // Track whether the form is for login or register

        function showMessage(message, type) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
        }

        function toggleFormMode() {
            isLogin = !isLogin;
            if (isLogin) {
                formTitle.textContent = 'Login';
                submitBtn.textContent = 'Login';
                toggleForm.textContent = "Vous n'avez pas de compte ?";
            } else {
                formTitle.textContent = 'Register';
                submitBtn.textContent = 'Register';
                toggleForm.textContent = 'Déjà inscrit ?';
            }
        }

        async function fetchUsers() {
            toggleForm.style.display = 'none';
            const response = await fetch(`${API_URL}/users`);
            const users = await response.json();

            usersDiv.innerHTML = '';
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user';

                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = user.username;

                const passwordSpan = document.createElement('span');
                passwordSpan.textContent = user.encryptedPassword;

                const toggleButton = document.createElement('button');
                toggleButton.textContent = 'Decrypt';
                toggleButton.className = 'toggle-password';

                toggleButton.addEventListener('click', async () => {
                    if (toggleButton.textContent === 'Decrypt') {
                        const decryptedResponse = await fetch(`${API_URL}/decrypt-password/${user.username}`);
                        const data = await decryptedResponse.json();
                        passwordSpan.textContent = data.decryptedPassword;
                        toggleButton.textContent = 'Encrypt';
                        toggleButton.style.color = 'white';
                    } else {
                        passwordSpan.textContent = user.encryptedPassword;
                        toggleButton.textContent = 'Decrypt';
                        toggleButton.style.color = 'white';
                    }
                });

                userDiv.appendChild(usernameSpan);
                userDiv.appendChild(passwordSpan);
                userDiv.appendChild(toggleButton);

                usersDiv.appendChild(userDiv);
            });
        }

        submitBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showMessage('Tous les champs sont obligatoires.', 'error');
                return;
            }

            const endpoint = isLogin ? '/login' : '/register';
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.status === 200 || response.status === 201) {
                showMessage(result.message, 'success');
                if (isLogin) {
                    authForm.style.display = 'none';
                    adminSection.style.display = 'block';
                    fetchUsers();
                }
            } else {
                showMessage(result.message, 'error');
            }
        });

        document.getElementById('username').addEventListener('input', () => {
            if (document.getElementById('username').value) {
                showMessage('', ''); // Supprime le message d'erreur
            }
        });

        document.getElementById('password').addEventListener('input', () => {
            if (document.getElementById('password').value) {
                showMessage('', ''); // Supprime le message d'erreur
            }
        });


        logoutBtn.addEventListener('click', () => {
            authForm.style.display = 'block';
            adminSection.style.display = 'none';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            showMessage('', ''); // Supprime le message
            formTitle.textContent = 'Login'; // Réinitialise le titre
            submitBtn.textContent = 'Login'; // Réinitialise le bouton
            toggleForm.textContent = "Vous n'avez pas de compte ?"; // Réinitialise le lien
            toggleForm.style.display = 'block'; // Affiche le lien
            isLogin = true; // Réinitialise le mode du formulaire
        });


        toggleForm.addEventListener('click', toggleFormMode);
