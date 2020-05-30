
class User {
    constructor(email, password, login_state="false") {
        this.email = email;
        this.password = password; //needs encryption
        this.login_state = login_state;
    }

    static handle_login() {
        const login = document.getElementById('login');
        login.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Button pressed!");

            let email = document.querySelector("#login_submit_form input#email").value;
            console.log(email);
            let password = document.querySelector("#login_submit_form input#password").value
            console.log(password);

            let configObject = {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            };
            console.log(configObject);
            fetch(`${BACKEND_URL}/login`, configObject)
            //.then(response => response.json(localStorage.setItem("loggedIn", true))
            .then(response => response.json())
            .then(json => {
                console.log(json);
                const userElement = document.querySelector('#user');
                const textElement = document.createElement('p');
              if (!json['status']) {
                textElement.textContent = "Login Failed";
                userElement.appendChild(textElement);
              } else { //login passed
               console.log("blah");
               textElement.textContent = "Welcome, " + json['first_name'];
               userElement.appendChild(textElement);
               login.setAttribute("class", "hidden");
              }
            })
            .catch(function(error) {
                console.log(error);
            });
        })
    }

    static logged_in() {
        if (this.login_state == true) {
            console.log("User is logged in");
            return true;
        } else {
            console.log("User is not logged in");
            return false;
        }
    }

    static monitor_signup_link(e) {
        const signup_button = document.querySelector("button#signup_link");
        signup_button.addEventListener("click", function(e) {
            e.preventDefault();
            document.getElementById('user').innerHTML = document.getElementById('signup').innerHTML;
            User.hide_login();
            const signup_form = document.getElementById('signup_form');
            signup_form.addEventListener("submit", function(e) {
                e.preventDefault();
                // get info from form
                const email = document.querySelector("#signup_form input#email").value;
                console.log(email);
                const first_name = document.querySelector("#signup_form input#first_name").value;
                console.log(first_name);
                const last_name = document.querySelector("#signup_form input#last_name").value;
                console.log(last_name)
                const password = document.querySelector("#signup_form input#password").value;
                console.log(password)
                const password_confirmation = document.querySelector("#signup_form input#password").value;
                if (password !== password_confirmation) {
                    console.log("Passwords do not match");
                } else {
                    console.log("They match!");
                }
                // add function to handle errors

                let configObject = {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'password': password
                    }),
                };
                fetch(`${BACKEND_URL}/signup`, configObject)
                .then(response => response.json())
                .then(json => {
                    if (json.status) {
                        document.getElementById('user').innerHTML = "Welcome, " + json.first_name;
                        this.first_name = json.first_name;
                        this.last_name = json.last_name;
                        this.email_address = json.email;
                    } else {
                        document.getElementById('user').innerHTML = json.message;
                    }
                })
                .catch(function(error) {
                    alert("Bad!");
                    console.log(error.message);
                })
            })
        })
    }

    static hide_login() {
        const login_form = document.getElementById('login');
        login_form.setAttribute("class", "hidden");
    }
}