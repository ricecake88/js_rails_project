const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));

function fetchJSON(action_path, configObject) {
    return fetch(action_path, configObject)
    .then(response => response.json())
    .then(json => json)
    .catch(function(error) {
      let messageElement = document.querySelector("message");
      messageElement.innerText = "ERROR";
    })
  }

function monitorUserArea(user) {
    const userAreaElement = document.getElementById("user");

    userAreaElement.addEventListener("submit", function(e) {
        e.preventDefault();
        let config;
        console.log("Submitted!");
        console.log(this);
        formElement = this.querySelectorAll("form")[0];
        const formName = formElement.getAttribute("name");
        console.log(formName);
        switch(formName) {
            case "loginForm":
                console.log("In Login Form");
                config = User.createLoginConfig();
                console.log(config);
                fetchJSON(`${BACKEND_URL}/login`, config)
                .then(json => {
                    console.log("retrieved login config");
                    user.handleLoginConfig(json);
                    monitorHabits();
                    Habit.renderAddHabitForm();
                });
                break;
            case "signupForm":
                console.log("In Signup Form");
                config = User.createSignupConfig();
                fetchJSON(`${BACKEND_URL}/signup`, config)
                .then(json => {
                    console.log("retrieved signup config");
                    User.handleSignupConfig(json);
                });
                break;
            case "habitForm":
                console.log("In Habit Form");
                console.log(user);
                config = Habit.createHabitConfig(user);
                console.log(config);
                fetchJSON(`${BACKEND_URL}/habit`, config)
                .then(json => {
                    console.log(json);
                    console.log("retrieved habit config");
                    Habit.handleHabitConfig(json);
                })
                .catch(function(error) {
                    let messageElement = document.getElementById("message");
                    console.log(messageElement);
                    messageElement.innerText = error;
                });
                break;
            default:

        }

    })

}

function monitorSignupLink() {
    const signupBtn = document.querySelector("button#signupLink");
    signupBtn.addEventListener("click", function(e) {
        fetchJSON(`${BACKEND_URL}/habits`, config)
        .then(json => {
            console.log("retrieved login config");
            console.log("print");
        });
    })
}

function monitorHabits() {
    alert("monitorHabits");
    console.log("monitorHabits");
    fetchJSON(`${BACKEND_URL}/habits`)
    .then(json => {
        console.log(json);
        Habit.renderHabits(json)
    })
}

document.addEventListener('DOMContentLoaded', (event) => {

    let user = new User();
    User.renderLogin();
    monitorUserArea(user);
    monitorSignupLink();
    monitorHabits();

})