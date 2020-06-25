
class User {
    constructor(firstName="", email="", password="", login_state=false) {
        this.email = email;
        this.firstName = firstName;
        this.password = password; //needs encryption - do I need this ?
        this.loggedIn = login_state;
    }

    /* getter for login_state */
    get loggedIn() {
        return this._login_state;
    }

    /* setter for login_state */
    set loggedIn(state) {
        this._login_state = state;
    }

    /* getter for email */
    get email() {
        return this._email;
    }

    /* setter for email */
    set email(email) {
        this._email = email;
    }

    /* getter for firstName */
    get firstName() {
        return this._firstName;
    }

    /* setter for lastName */
    set firstName(name) {
        this._firstName = name;
    }

    fetch_json(action_path, configObject) {
        return fetch(action_path, configObject)
        .then(response => response.json())
        .then(json => json)
    }

    /* creates config object from retrieved information
    /*    from login form */
    createLoginConfigObject() {
        alert("Button pressed!");
        let login_ok = false;

        let email = document.querySelector("#login_submit_form input#email").value;
        let password = document.querySelector("#login_submit_form input#password").value

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
        return configObject;
    }

    /* handles return json from login state */
    handle_login_info(json) {

        const userElement = document.querySelector('#user');
        const textElement = document.createElement('p');

        /* if login was successful, it welcomes the user
         * and hides the login form,  otherwise
         * it says that login is failed */
        if (!json['status']) {
            textElement.textContent = "Login Failed";
            userElement.appendChild(textElement);
        } else { //login passed
            textElement.textContent = "Welcome, " + json['first_name'];
            userElement.appendChild(textElement);
            login.setAttribute("class", "hidden");
        }

    }

//            .then(response => response.json(localStorage.setItem("loggedIn", true))

    createSignupConfigObj() {
        this.hide_login();

        // get info from form
        const email = document.querySelector("#signup_form input#email").value;
        const first_name = document.querySelector("#signup_form input#first_name").value;
        const last_name = document.querySelector("#signup_form input#last_name").value;
        const password = document.querySelector("#signup_form input#password").value;
        const password_confirmation = document.querySelector("#signup_form input#password").value;

        if (password !== password_confirmation) {
            console.log("Passwords do not match");
        } else {
            console.log("They match!");
        }

        // create configObject from form input
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

        console.log(configObject);
        return configObject;
    }

    handleSignupInfo(json) {

        if (json['status']) {
            document.getElementById('user').innerHTML = "Welcome, " + json.first_name;
            //this.first_name = json.first_name;
            //this.last_name = json.last_name;
            //this.email_address = json.email;
        } else {
            document.getElementById('user').innerHTML = json.message;
        }
    }

    hide_login() {
        const login_form = document.getElementById('login');
        login_form.setAttribute("class", "hidden");
    }
}