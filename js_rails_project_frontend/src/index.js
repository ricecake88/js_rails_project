const BACKEND_URL = 'https://localhost:3000';
fetch(`${BACKEND_URL}/test`)
  .then(response => response.json())
  .then(parsedResponse => console.log(parsedResponse))
  .catch(error => {
      console.log(error)
  })


  window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM_fully loaded and parsed');
    User.handle_login();
  })