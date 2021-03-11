const BACKEND_URL = 'http://localhost:3000';

function clearError() {
    document.getElementById("error").innerText = "";
}

function displayError(errors) {
    if (Array.isArray(errors) && errors.length !== 0) {
        let errorString = "";
        errors.forEach(error => {
            errorString += `${error}<br/>`
        })
        document.getElementById("error").innerHTML = errorString
    } else {
        document.getElementById("error").innerText = errors
    }
}

/* wrap fetchJSON around fetch to simplify fetch*/
function fetchJSON(action_path, configObject) {
    return fetch(action_path, configObject)
    .then(response => response.json())
    .then(json => json)
    .catch(function(error) {
      let errorElement = document.getElementById("error");
      errorElement.innerText = error.message;
    })
  }

  /* listens for the form element, and perform different actions
  depending on whether the user has logged in, added a habit, or
  signing up for a new account */
function monitorUserArea(user) {

    const userAreaElement = document.getElementById("user");
    userAreaElement.addEventListener("submit", function(e) {
        e.preventDefault();
        formElement = this.querySelectorAll("form")[0];
        const formName = formElement.getAttribute("name");

        switch(formName) {
            case "loginForm":
                // log in and try to authenticate user
                fetchJSON(`${BACKEND_URL}/auth_user`, user.createLoginConfig())
                .then(json => {

                    // once authorized create GET config with the auth_token
                    // and set up user fields
                    if (json['status'] === "authorized" ) {
                         fetchJSON(`${BACKEND_URL}/habits`, user.createAuthConfig(json['auth_token']))
                            .then(json => {
                                user.handleLogin(json);
                                Habit.renderAddHabitForm();
                                Habit.handleHabits(user);
                                renderHabitSummary(user);
                            })
                    } else {
                        displayError(json['errors']);
                    }
                })
                break;
            case "signupForm":
                user.handleSignup();
                break;
            case "habitForm":
                Habit.handleAddHabit(user);
                break;
            default:
                break;

        }

    })

}

document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    let user = new User();
    User.renderLogin();
    monitorUserArea(user);
})

