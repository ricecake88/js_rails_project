const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));


function loginEvent(loginElement, user) {

    /* new user is not logged in; monitor to see if */
    /* user has pressed submit on login form */
    loginElement.addEventListener('submit', function(e) {
      e.preventDefault();

      /* create configuration object to pass in to
      /* login URL action */
      const login_info = user.createLoginConfigObject();
      user.fetch_json(`${BACKEND_URL}/login`, login_info)
      .then(login_info => {
        user.handle_login_info(login_info);
        user.loggedIn = login_info['status'];
        user.firstName = login_info['first_name'];
        user.email = login_info['email'];
        if (user.loggedIn) {
          Habit.add_habit_form();
        }
      })
      .catch(err => console.log(err))
    });
}
function signupEvent(signupElement, user) {

  signupElement.addEventListener("click", function(e) {
    e.preventDefault();

    document.getElementById('user').innerHTML = document.getElementById('signup').innerHTML;
    const signup_form = document.getElementById('signup_form');

    /* user has clicked the signup_button */
    /* hide login_form */
    user.hide_login();

    signup_form.addEventListener("submit", function(e){
      e.preventDefault();
      const signup_info = user.createSignupConfigObj();
      user.fetch_json(`${BACKEND_URL}/signup`, signup_info)
      .then(signup_info => {
        console.log(signup_info);
        user.handleSignupInfo(signup_info);
        user.loggedIn = signup_info['status'];
        user.firstName = signup_info['first_name'];
        user.email = signup_info['email'];
        if (user.loggedIn) {
          Habit.add_habit_form();
        }
      })
      .catch(err => console.log(err))
    });
  })
}

function addHabitEvent(addHabitElement, user) {
  console.log("Monitoring submit");
  if (!Object.is(addHabitElement, null)) {
    console.log(addHabitElement);
  addHabitElement.addEventListener("submit", function(e) {
    e.preventDefault();
    let habit = new Habit();
    const newHabitInfo = habit.createHabitConfigObj();
    habit.fetch_json(`${BACKEND_URL}/habit`, newHabitInfo)
  })}

}

window.addEventListener('DOMContentLoaded', (event) => {

  /* check if DOM is loaded */
  console.log('DOM_fully loaded and parsed');

  /* retrieve login HTML form */
  const login = document.getElementById('login');

  /* wait until someone has tried to sign up for an account */
  const signupBtn = document.querySelector("button#signup_link");

  const submitNewHabit = document.querySelector("button#submitHabit");

  let new_user = new User();

  loginEvent(login, new_user);
  signupEvent(signupBtn, new_user);
  addHabitEvent(submitNewHabit, new_user);

})