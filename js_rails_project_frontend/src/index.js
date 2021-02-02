const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));

function fetchJSON(action_path, configObject) {
    return fetch(action_path, configObject)
    .then(response => response.json())
    .then(json => json)
    .catch(function(error) {
      let messageElement = document.getElementById("message");
      messageElement.innerText = "ERROR";
    })
  }

function getAuth(callbackFunction, action, user, config={}) {
    console.log(">>>>> getAuth")
    fetchJSON(`${BACKEND_URL}/auth_user`, config)
    .then(json => {
        if (json['status']) {
            authConfig = user.createAuthConfig(json['auth_token'])
            console.log("\tFrom auth_user json returned:\n\t")
            console.log("\t")
            console.log(json)
            console.log("\tAuth Config:")
            console.log("\t")
            console.log(authConfig);
            if (json['status'] == "authorized") {
                console.log("\tAccessing " + `${BACKEND_URL}/${action}`);
                fetchJSON(`${BACKEND_URL}/${action}`, authConfig)
                .then(json => {
                    callbackFunction(json);
                    if (action === "habits") {
                        Habit.renderAddHabitForm();
                        renderHabits(user);
                    }
                })
            }
        } else {
            callbackFunction(json, status);
        }
    })
}

function monitorUserArea(user) {
    console.log(">>>> monitorUserArea");
    console.log(user);
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
                console.log("\tLogin Form");
                config = user.createLoginConfig();
                //getAuth(user.handleLoginConfig.bind(user), "habits", user, config,);
                fetchJSON(`${BACKEND_URL}/auth_user`, config)
                .then(json => {
                    if (json['status']) {
                        authConfig = user.createAuthConfig(json['auth_token'])
                        console.log("\tFrom auth_user json returned:\n\t")
                        console.log("\t")
                        console.log(json)
                        console.log("\tAuth Config:")
                        console.log("\t")
                        console.log(authConfig);
                        if (json['status'] == "authorized") {
                            console.log("\tAccessing " + `${BACKEND_URL}/habits`);
                            fetchJSON(`${BACKEND_URL}/habits`, authConfig)
                            .then(json => {
                                user.handleLoginConfig(json);
                                Habit.renderAddHabitForm();
                                renderHabits(user);
                            })
                        }
                    } else {
                        callbackFunction(json, status);
                    }
                })
                break;
            case "signupForm":
                console.log("\tsignupForm");
                config = User.createSignupConfig();
                console.log(config);
                fetchJSON(`${BACKEND_URL}/signup`, config)
                .then(json => {
                    User.handleSignupConfig(json);
                    if (json['status'] == true) {
                        User.renderLogin();
                    }
                });
                break;
            case "habitForm":
                console.log("\thabitForm");
                habitConfig = Habit.createHabitConfig(user);
                console.log(habitConfig);
                fetchJSON(`${BACKEND_URL}/habit`, habitConfig)
                .then(json => {
                    Habit.handleHabitConfig(json);
                })
                break;
            default:
                break;

        }

    })

}

function monitorUserArea2(user) {
    console.log(">>>> monitorUserArea");
    console.log(user);
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
                console.log("\tLogin Form");
                config = user.createLoginConfig();
                getAuth(user.handleLoginConfig.bind(user), "habits", user, config,);
                break;
            case "signupForm":
                console.log("\tsignupForm");
                config = User.createSignupConfig();
                console.log(config);
                fetchJSON(`${BACKEND_URL}/signup`, config)
                .then(json => {
                    User.handleSignupConfig(json);
                    if (json['status'] == true) {
                        User.renderLogin();
                    }
                });
                break;
            case "habitForm":
                console.log("\thabitForm");
                habitConfig = Habit.createHabitConfig(user);
                console.log(habitConfig);
                fetchJSON(`${BACKEND_URL}/habit`, habitConfig)
                .then(json => {
                    Habit.handleHabitConfig(json);
                })
                break;
            default:
                break;

        }

    })

}

function renderHabits(user) {
    console.log(">>>>>renderHabits()");
    let config = user.createAuthConfig(user.authToken);
    return fetchJSON(`${BACKEND_URL}/habits`, config)
    .then(json =>  {
        Habit.renderHabits(json);
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
    renderHabits(user);

})

