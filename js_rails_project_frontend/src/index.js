const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));

function clearError() {
    document.getElementById("error").innerText = "";
}

function fetchJSON(action_path, configObject) {
    return fetch(action_path, configObject)
    .then(response => response.json())
    .then(json => json)
    .catch(function(error) {
      let errorElement = document.getElementById("error");
      errorElement.innerText = error.message;
    })
  }

function monitorUserArea(user) {
    console.log(">>>> monitorUserArea");

    const userAreaElement = document.getElementById("user");
    userAreaElement.addEventListener("submit", function(e) {
        e.preventDefault();
        let config;
        let authConfig;
        formElement = this.querySelectorAll("form")[0];
        const formName = formElement.getAttribute("name");
        console.log("\tSelecting: " + formName);

        switch(formName) {
            case "loginForm":
                config = user.createLoginConfig();
                fetchJSON(`${BACKEND_URL}/auth_user`, config)
                .then(json => {
                    if (json['status']) {
                        authConfig = user.createAuthConfig(json['auth_token'])
                        if (json['status'] == "authorized") {
                            console.log("\tAccessing " + `${BACKEND_URL}/habits`);
                            fetchJSON(`${BACKEND_URL}/habits`, authConfig)
                            .then(json => {
                                user.handleLogin(json);
                                Habit.renderAddHabitForm();
                                Habit.handleHabits(user);
                                renderHabitSummary(user);
                            })
                        }
                    } else {
                        // handle error if false
                    }
                })
                break;
            case "signupForm":
                config = User.createSignupConfig();
                fetchJSON(`${BACKEND_URL}/users`, config)
                .then(json => {
                    User.handleSignup(json);
                    if (json['status'] == true) {
                        User.renderLogin();
                    }
                });
                break;
            case "habitForm":
                Habit.handleAddHabit(user);
                break;
            default:
                break;

        }

    })

}



function monitorSignupLink() {
    const signupBtn = document.querySelector("button#signupLink");
    signupBtn.addEventListener("click", function(e) {
        User.renderSignupForm();
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    let user = new User();
    User.renderLogin();
    monitorUserArea(user);
    monitorSignupLink();
})

