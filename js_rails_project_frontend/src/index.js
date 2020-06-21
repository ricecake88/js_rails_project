const BACKEND_URL = 'http://localhost:3001';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));


window.addEventListener('DOMContentLoaded', (event) => {

  /* check if DOM is loaded */
  console.log('DOM_fully loaded and parsed');

  /* retrieve login HTML form */
  const login = document.getElementById('login');
  let new_user = new User();

  /* check if user already is logged in */
  if (new_user.logged_in) {

    /*if user is logged in, hide the login form */
    login.setAttribute("class", "hidden");

    /* show add new habit */
    Habit.add_habit_form();

    /* display existing habits */
  } else {

    /* new user is not logged in; monitor to see if */
    /* user has pressed submit on login form */
    login.addEventListener('submit', function(e) {
      e.preventDefault();

      /* create configuration object to pass in to
      /* login URL action */
      const login_info = new_user.createLoginConfigObject();
      new_user.fetch_json(`${BACKEND_URL}/login`, login_info)
      .then(login_info => {
        new_user.handle_login_info(login_info);
        new_user.logged_in = login_info['status'];
      })
      .catch(err => console.log(err))
    });

    /* wait until someone has tried to sign up for an account */
    const signup_button = document.querySelector("button#signup_link");

    signup_button.addEventListener("click", function(e) {
      e.preventDefault();

      document.getElementById('user').innerHTML = document.getElementById('signup').innerHTML;
      const signup_form = document.getElementById('signup_form');

      /* user has clicked the signup_button */
      /* hide login_form */
      new_user.hide_login();

        signup_form.addEventListener("submit", function(e){
          e.preventDefault();
          const signup_info = new_user.createSignupConfigObj();
          new_user.fetch_json(`${BACKEND_URL}/signup`, signup_info)
          .then(signup_info => {
            console.log(signup_info);
            new_user.handleSignupInfo(signup_info);
            new_user.logged_in = signup_info['status'];
            if (new_user.logged_in) {
              Habit.add_habit_form();
            }
          })
          .catch(err => console.log(err));

        })

    });
//  new_user.handle_login();
//
// new_user.monitor_signup_link();
// if (new_user.login_state) {
//   // show interface to add a habit
//   console.log("yay logged in");
//   Habit.add_habit_form();
// }
  } // end else
})