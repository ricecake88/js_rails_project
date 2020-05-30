const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));


function habit_interface() {
  const bodyElement = document.querySelectorTag("body");

  const habitForm = document.createElement("form")
  bodyElement.appendChild(habitForm);

}

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM_fully loaded and parsed');
  User.handle_login();
  User.monitor_signup_link();
  if (User.logged_in()) {
    // show interface to add a habit
    habit_interface();
  }
})