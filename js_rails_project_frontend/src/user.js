
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
            .then(response => response.json())
            .then(json => {
                console.log(json);
              if (!json['status']) {
                const userElement = document.querySelector('#user');
                const textElement = document.createElement('p');
                textElement.textContent = "Login Failed";
                userElement.appendChild(textElement);
              } else { //login passed
                console.log("blah");
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
    
}