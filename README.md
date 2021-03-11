# Habit Tracker

This is a JS/Rails API project that is a small little habit tracker app! A user can enter the habits they want to track and mark off the dates that they have completed.

## How to Install from the repo

In the terminal command line first clone the application:

* `git clone https://github.com/ricecake88/js_rails_project.git <folder_you_would_like_to_call_it>`
* `bundle install`
* `rake db:migrate RAILS_ENV=test`

## This application uses Postgres, and runs on localhost. 

### To modify the port that localhost runs on one can change the following file:

  `js_rails_project_backend/config/environment/development.rb`

and add the following:

  `config.action_mailer.default_url_options = { host: 'localhost', port:3000}`

### Postgres SQL instructions (Note these are instructions for using with the pgAdmin4.exe on Windows)

* Start a new database, and name it where you will use it to create your tables and records of data
* Create a user and add it to to the default role of admin for the database.
* Modify js_rails_project_backend/config/database.yml by changing the following lines:
*   `database`
*   `username`
*   if `localhost` is commented out, uncomment it.

## To start the server enter into the terminal (which will run on port 3000):
* `rails s`

## View the application

* Open up your browser
* Drag `js_rails_project_frontend/index.html` to the browser.

## Built With

* Learn Online IDE
* [Sinatra Gem](https://rubygems.org/gems/sinatra-activerecord/versions/2.0.9)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/ricecake88/sinatra_project. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](contributor-covenant.org) code of conduct.

## Authors

* Grace Shih - Initial work for basic habit application.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

## Acknowledgments

* [Geniuses at StackOverflow](http://stackoverflow.com) for their never ending help when I encounter any problems
* [W3Schools](https://www.w3schools.com)
