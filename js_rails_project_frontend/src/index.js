const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM_fully loaded and parsed');
  let new_user = new User();
  new_user.handle_login();
  new_user.monitor_signup_link();
  if (new_user.login_state) {
    // show interface to add a habit
    console.log("yay logged in");
    Habit.add_habit_form();
  }
})