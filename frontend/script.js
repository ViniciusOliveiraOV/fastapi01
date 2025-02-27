const API_URL = "http://127.0.0.1:8000/api/v1/users";

// Adicionar usuário 

document.getElementById("user-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first_name").value; 
    const lastName = document.getElementById("last_name").value;
    const gender = document.getElementById("gender").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            roles: ["user"]
        })
    });

    if (!firstName || !lastName || !gender) {
        alert("Preencha todos os campos");
        return;
    }

    if (response.ok) {
        fetchUsers();
        document.getElementById("user-form").reset();
        //alert("Usuário atualizado com sucesso!");
    }
});

// Atualizar usuários 
async function updateUser(userId){
    const user = await fetch(`${API_URL}/${userId}`).then(response => response.json());

    document.getElementById("update-first_name").value = user.first_name || "";
    document.getElementById("update-last_name").value = user.last_name || ""; 
    document.getElementById("update-gender").value = user.gender || "masculino";

    // mostra formulário atualizado / oculta add form 
    document.getElementById("update-user-form").style.display = "block";
    document.getElementById("user-form").style.display = "none";

    // submissão do form para atualização
    document.getElementById("update-user-form").onsubmit = async (event) => {
        event.preventDefault();
        const updatedData = {
            first_name: document.getElementById("update-first_name").value,
            last_name: document.getElementById("update-last_name").value,
            gender: document.getElementById("update-gender").value,
        };

        const response = await fetch(`${API_URL}/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            fetchUsers();
            document.getElementById("update-user-form").style.display = "none";
            document.getElementById("user-form").style.display = "block";
        }
    };


}

// Deletar usuários 

async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/${userId}`,{
        method: "DELETE"
    });

    if (response.ok) {
        fetchUsers();
    } else {
        console.error("Error deleting user");
    }
}

const loadingSpinner = document.getElementById('loading-spinner');
const overlay = document.getElementById('overlay');

// Show spinner before fetching data
function showSpinner() {
    loadingSpinner.style.display = 'block';
    overlay.style.display = 'block';
}

// Hide spinner after fetching data
function hideSpinner() {
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
}


// Example: Fetch Users and show/hide the spinner
async function fetchUsers() {
    showSpinner(); // Show spinner when starting the fetch

    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";

        users.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `${user.first_name} ${user.last_name} (${user.gender})`;

            const updateButton = document.createElement("button");
            updateButton.textContent = "Atualizar";
            updateButton.onclick = () => updateUser(user.id);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = () => {
                const confirmDelete = window.confirm("Tem certeza que deseja deletar o usuário?");

                if (confirmDelete) {
                    deleteUser(user.id);
                }
            };
            
            li.appendChild(updateButton);
            li.appendChild(deleteButton);
            userList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        hideSpinner(); // Hide spinner after the fetch is complete
    }
}


document.getElementById("search-input").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    const users = document.querySelectorAll("#user-list li");
    
    users.forEach(user => {
        const text = user.textContent.toLowerCase();
        user.style.display = text.includes(searchTerm) ? "" : "none";
    });
});

// Inicializar lista de usuários 
fetchUsers()
