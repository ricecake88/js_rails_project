
class User {
    constructor(email, password, login_state="false") {
        this.email = email;
        this.password = password; //needs encryption
        this.login_state = login_state;
    }
}