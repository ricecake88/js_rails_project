
class User {

    constructor(firstName="", email="", password="", authToken="", login_state=false) {
        this._email = email;
        this._firstName = firstName;
        this._password = password; //needs encryption - do I need this ?
        this._loggedIn = login_state;
        this._authToken = authToken;
        this._habits = [];
        this._id = -1;
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

    get authToken() {
        return this._authToken;
    }

    get id() {
        return this._id;
    }

    get habits() {
        return this._habits;
    }


    fetch_json(action_path, configObject) {
        return fetch(action_path, configObject)
        .then(response => response.json())
        .then(json => json)
    }

    static renderLogin() {
        console.log("renderLogin")
        const userAreaElement = document.getElementById("user");
        userAreaElement.innerHTML = "";

        const signupDiv = document.createElement("div");
        signupDiv.setAttribute("id", "login");
        signupDiv.setAttribute("class", "hidden");

        const loginForm = document.createElement("form");
        loginForm.setAttribute("method", "post");
        loginForm.setAttribute("id", "loginSubmitForm");
        loginForm.setAttribute("name", "loginForm")

        const usernameLabel = document.createElement("label");
        usernameLabel.setAttribute("for", "email");
        usernameLabel.textContent = "Email:";

        const usernameLabelbr = document.createElement("br");

        const usernameInput = document.createElement("input");
        usernameInput.setAttribute("id", "email");
        usernameInput.setAttribute("name", "Email");
        usernameInput.setAttribute("placeholder", "Enter your e-mail address");

        const usernameInputbr = document.createElement("br");

        const passwordLabel = document.createElement("label");
        passwordLabel.setAttribute("for", "password");
        passwordLabel.textContent = "Password:";

        const passwordLabelbr = document.createElement("br");

        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute("id", "password");
        passwordInput.setAttribute("name", "password");

        const passwordInputbr = document.createElement("br");

        const submitButton = document.createElement("button");
        submitButton.setAttribute("value", "Submit");
        submitButton.setAttribute("id", "submitLogin");
        submitButton.setAttribute("name", "Submit");
        submitButton.textContent = "Submit";

        loginForm.appendChild(usernameLabel);
        loginForm.appendChild(usernameLabelbr);
        loginForm.appendChild(usernameInput);
        loginForm.appendChild(usernameInputbr);
        loginForm.appendChild(passwordLabel);
        loginForm.appendChild(passwordInput);
        loginForm.appendChild(passwordInputbr);
        loginForm.appendChild(submitButton);

        const signupBtn = document.createElement("button");
        signupBtn.setAttribute("value", "submit");
        signupBtn.setAttribute("name", "signupLink");
        signupBtn.setAttribute("id", "signupLink");
        signupBtn.textContent = "Signup";

        userAreaElement.appendChild(loginForm);
        userAreaElement.appendChild(signupBtn);

        console.log(userAreaElement);

    }

    static renderSignupForm() {

        const userAreaElement = document.getElementById("user");
        userAreaElement.innerHTML = "";

        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "";

        const signupDiv = document.createElement("div");
        signupDiv.setAttribute("id", "signup");
        signupDiv.setAttribute("class", "hidden");

        const signupFormElement = document.createElement("form");
        signupFormElement.setAttribute("method", "post");
        signupFormElement.setAttribute("id", "signupForm");
        signupFormElement.setAttribute("name", "signupForm");

        const firstNameLabel = document.createElement("label");
        firstNameLabel.setAttribute("for", "firstName");
        firstNameLabel.textContent = "First Name:";

        const firstNameLabelBr = document.createElement("br");
        const firstNameInput = document.createElement("input");
        firstNameInput.setAttribute("type", "text");
        firstNameInput.setAttribute("name", "firstName");
        firstNameInput.setAttribute("id", "firstName");


        const firstNameInputBr = document.createElement("br")
        const lastNameLabel = document.createElement("lastName");
        lastNameLabel.setAttribute("for", "lastName");
        lastNameLabel.textContent = "Last Name";

        const lastNameLabelBr = document.createElement("br");
        const lastNameInput = document.createElement("input");
        lastNameInput.setAttribute("type", "text");
        lastNameInput.setAttribute("name", "lastName");
        lastNameInput.setAttribute("id", "lastName");

        const lastNameInputBr = document.createElement("br");
        const emailLabel = document.createElement("label");
        emailLabel.setAttribute("for", "email");
        emailLabel.textContent = "Email: ";

        const emailLabelBr = document.createElement("br");
        const emailInput = document.createElement("input");
        emailInput.setAttribute("type", "text");
        emailInput.setAttribute("name", "email");
        emailInput.setAttribute("id", "email");

        const emailInputBr = document.createElement("br");
        const passwordLabel = document.createElement("label");
        passwordLabel.setAttribute("for", "password");
        passwordLabel.textContent = "Password: ";

        const passwordLabelBr = document.createElement("br");
        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute("name", "password");
        passwordInput.setAttribute("id", "password");

        const passwordInputBr = document.createElement("br");
        const passwordConfirmationLabel = document.createElement("label");
        passwordConfirmationLabel.setAttribute("for", "passwordConfirmation");
        passwordConfirmationLabel.textContent = "Password Confirmation: ";

        const passwordConfirmationLabelBr = document.createElement("br");
        const passwordConfirmationInput  = document.createElement("input");
        passwordConfirmationInput.setAttribute("type", "password");
        passwordConfirmationInput.setAttribute("id", "passwordConfirmation");

        const passwordConfirmationInputBr = document.createElement("br");

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";

        signupFormElement.appendChild(firstNameLabel);
        signupFormElement.appendChild(firstNameLabelBr);
        signupFormElement.appendChild(firstNameInput);
        signupFormElement.appendChild(firstNameInputBr);
        signupFormElement.appendChild(lastNameLabel);
        signupFormElement.appendChild(lastNameLabelBr);
        signupFormElement.appendChild(lastNameInput);
        signupFormElement.appendChild(lastNameInputBr);
        signupFormElement.appendChild(emailLabel);
        signupFormElement.appendChild(emailLabelBr);
        signupFormElement.appendChild(emailInput);
        signupFormElement.appendChild(emailInputBr)
        signupFormElement.appendChild(passwordLabel);
        signupFormElement.appendChild(passwordLabelBr);
        signupFormElement.appendChild(passwordInput);
        signupFormElement.appendChild(passwordInputBr);
        signupFormElement.appendChild(passwordConfirmationLabel);
        signupFormElement.appendChild(passwordConfirmationLabelBr);
        signupFormElement.appendChild(passwordConfirmationInput);
        signupFormElement.appendChild(passwordConfirmationInputBr);
        signupFormElement.appendChild(submitBtn);
        signupFormElement.appendChild(cancelBtn);

        userAreaElement.appendChild(signupFormElement);
    }

    createLoginConfig() {
        //alert("Button pressed!");
        let login_ok = false;
        let email = document.querySelector("#loginSubmitForm input#email").value;
        let password = document.querySelector("#loginSubmitForm input#password").value

        //check validity of email

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
        this._password = password;
        return configObject;
    }

    /* handles return json from login state */
   handleLoginConfig(json) {
       console.log(">>>> handleLoginConfig(json)")
       const userElement = document.querySelector('#user');
       const messageElement = document.querySelector("#message");
       const textElement = document.createElement('p');

       /* if login was successful, it welcomes the user
        * and hides the login form,  otherwise
        * it says that login is failed */
       if (!json['status']) {
           messageElement.textContent = json['errors'];
           this._password = '';
       } else { //login passed
           console.log(json);
           messageElement.textContent = "Welcome, " + json.first_name;
           this._firstName = json.first_name;
           this._lastName = json.last_name;
           this._email = json.email;
           this._loggedIn = true;
           this._id = json.id;
           //Habit.renderAddHabitForm();
        }
    }

    static createSignupConfig() {

        // get info from form
        const email = document.querySelector("#signupForm input#email").value;
        const firstName = document.querySelector("#signupForm input#firstName").value;
        const lastName = document.querySelector("#signupForm input#lastName").value;
        const password = document.querySelector("#signupForm input#password").value;
        const password_confirmation = document.querySelector("#signupForm input#passwordConfirmation").value;


        // create configObject from form input
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                'email': email,
                'first_name': firstName,
                'last_name': lastName,
                'password': password,
                'password_confirmation': password_confirmation
            }),
        };

        return configObject;


    }

    static handleSignupConfig(json) {
        console.log(">>>>> handleSignupConfig()")
        if (json.status == 404) {
            document.getElementById('message').innerHTML = "ERROR. Sign up failed."
        } else if (json['status'] == true) {
            document.getElementById('message').innerHTML = "Account Created. Please Log In."
            this._first_name = json.first_name;
            this._last_name = json.last_name;
            this._email_address = json.email;
            this._loggedIn = true;
            this._id = json.id;
            document.getElementById('user').innerHTML = "";
        } else {
            document.getElementById('message').innerHTML = json.message;
            this._password = '';
        }
    }

    createAuthConfig(authToken) {
        let configObject = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + authToken
            },
        };

        this._authToken = authToken;
        return configObject;
    }

}