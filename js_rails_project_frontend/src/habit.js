class Habit {
    constructor(name, frequency_mode=0, num_for_streak=7, streak_counter=0, streak_level="none") {
        this.name = name;
        this.frequency_mode = frequency_mode;
        this.num_for_streak = num_for_streak;
        this.streak_counter = streak_counter;
        this.streak_level = "none";
    }

    static add_habit_form() {
        console.log("In add_habit_form");
        const bodyElement = document.querySelector("body");

        const habitForm = document.createElement("form")
        habitForm.setAttribute("id", "habitForm");

        const labelForHabitNameElement = document.createElement("label");
        labelForHabitNameElement.setAttribute("for", "habitName");
        labelForHabitNameElement.textContent = "Habit Name: ";

        const inputHabitNameElement = document.createElement("input");
        inputHabitNameElement.setAttribute("id", "habitName");
        inputHabitNameElement.setAttribute("name", "habitName");
        inputHabitNameElement.setAttribute("type", "text");

        const brElementOne = document.createElement("br")

        const labelForScheduleElement = document.createElement("label");
        labelForScheduleElement.setAttribute("for", "frequency");
        labelForScheduleElement.textContent = "Frequency";

        const scheduleElement = document.createElement("select");
        scheduleElement.setAttribute("name", "frequency");
        scheduleElement.setAttribute("id", "frequency");
        const optionOne = document.createElement("option");
        optionOne.setAttribute("value", "1");
        optionOne.textContent = "Everyday";
        const optionTwo = document.createElement("option");
        optionTwo.setAttribute("value", "2");
        optionTwo.textContent = "Every Other Day";
        scheduleElement.appendChild(optionOne);
        scheduleElement.appendChild(optionTwo);

        const brElementTwo = document.createElement("br")

        const submitElement = document.createElement("input");
        submitElement.setAttribute("name", "submitHabit");
        submitElement.setAttribute("id", "submitHabit");
        submitElement.setAttribute("type", "submit");


        habitForm.appendChild(labelForHabitNameElement);
        habitForm.appendChild(inputHabitNameElement);
        habitForm.appendChild(brElementOne)
        habitForm.appendChild(labelForScheduleElement);
        habitForm.appendChild(scheduleElement);
        habitForm.appendChild(brElementTwo)
        habitForm.appendChild(submitElement);

        bodyElement.appendChild(habitForm);

    }

    createHabitConfigObj() {
        //this.hide_login();

        // get info from form
        const habitName = document.querySelector("#habitForm input#habitName").value;
        const frequency = document.querySelector("#habitForm select#frequency").value;

        // create configObject from form input
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                'name': habitName,
                'frequency': frequency,
            }),
        };

        console.log("Printing Config")
        console.log(configObject);
        return configObject;

    }

    static renderAddHabitForm() {
        console.log("In add_habit_form");
        const userAreaElement = document.getElementById("user");
        userAreaElement.innerHTML = "";

        const habitForm = document.createElement("form")
        habitForm.setAttribute("id", "habitForm");
        habitForm.setAttribute("name", "habitForm");

        const labelForHabitNameElement = document.createElement("label");
        labelForHabitNameElement.setAttribute("for", "habitName");
        labelForHabitNameElement.textContent = "Habit Name: ";

        const inputHabitNameElement = document.createElement("input");
        inputHabitNameElement.setAttribute("id", "habitName");
        inputHabitNameElement.setAttribute("name", "habitName");
        inputHabitNameElement.setAttribute("type", "text");

        const brElementOne = document.createElement("br")

        const labelForScheduleElement = document.createElement("label");
        labelForScheduleElement.setAttribute("for", "frequency");
        labelForScheduleElement.textContent = "Frequency";

        const scheduleElement = document.createElement("select");
        scheduleElement.setAttribute("name", "frequency");
        scheduleElement.setAttribute("id", "frequency");
        const optionOne = document.createElement("option");
        optionOne.setAttribute("value", "1");
        optionOne.textContent = "Everyday";
        const optionTwo = document.createElement("option");
        optionTwo.setAttribute("value", "2");
        optionTwo.textContent = "Every Other Day";
        scheduleElement.appendChild(optionOne);
        scheduleElement.appendChild(optionTwo);

        const brElementTwo = document.createElement("br");

        const submitElement = document.createElement("button");
        submitElement.setAttribute("name", "submit");
        submitElement.setAttribute("id", "submit");
        submitElement.setAttribute("type", "submit");
        submitElement.textContent = "Submit";


        habitForm.appendChild(labelForHabitNameElement);
        habitForm.appendChild(inputHabitNameElement);
        habitForm.appendChild(brElementOne)
        habitForm.appendChild(labelForScheduleElement);
        habitForm.appendChild(scheduleElement);
        habitForm.appendChild(brElementTwo)
        habitForm.appendChild(submitElement);

        userAreaElement.appendChild(habitForm);
        console.log(habitForm);
    }

    static handleHabitConfig(json) {
        console.log("handleHabitConfig");
        console.log(json['status'])
        if (json['status'] === true) {
            document.getElementById('habits').innerHTML =  json['name'];
            console.log(json);
        } else {
            document.getElementById('error').innerHTML = json['message'];
            document.getElementById('message').innerHTML = '';
        }
    }

    static createHabitConfig(user) {
        const habitName = document.querySelector("#habitForm input#habitName").value;
        const frequency = document.querySelector("#habitForm select#frequency").value;
        console.log(user)

        // create configObject from form input
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                'name': habitName,
                'frequency_mode': frequency,
                'email': user.email
            })
        };

        return configObject;
    }

    static renderHabits(json) {
        console.log("renderHabits");
        console.log(json);
        const habits = document.querySelector("div#habits");
        const message = document.querySelector("div#message");
        if (json['status'] == true) {
            //habits.innerText = json['habits'];
            habits.innerText = json['habits'];
        } else {
            if (json['message']) {
                message.innerText = json['message'];
                document.querySelector("div#error") = '';
            }
        }
    }
}