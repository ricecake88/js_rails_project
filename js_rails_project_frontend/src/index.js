const BACKEND_URL = 'http://localhost:3000';

this.currentUser = null;

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

function isAuthenticated() {
    if (window.localStorage.user) {
        return true;
    } else return false;
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
                                user.renderLogout();
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

function retrieveInfo(user) {

    // user is already logged in and authorized
    // this is retrieving interface after a refresh
    fetchJSON(`${BACKEND_URL}/habits`, user.createAuthConfig(user.authToken))
        .then(json => {
            user.handleLogin(json);
            Habit.renderAddHabitForm();
            user.renderLogout();
            Habit.handleHabits(user);
            renderHabitSummary(user);
            })
}

document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    let user;
    if (isAuthenticated() === false) {
        // login new user
        user = new User();
        User.renderLogin();
    } else {
       // retrieve user if user is already authenticated
       if (this.currentUser === null) {
         let userObj = JSON.parse(window.localStorage.user);
         user = new User(userObj["id"],
            userObj["firstName"],
            userObj["email"],
            userObj["authToken"],
            userObj["login_state"]);
         retrieveInfo(user);
       }
    }
    monitorUserArea(user);
})

