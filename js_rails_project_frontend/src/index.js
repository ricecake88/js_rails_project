const BACKEND_URL = 'http://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(json => console.log(json));


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM_fully loaded and parsed');
  User.handle_login();
  User.monitor_signup_link();
})