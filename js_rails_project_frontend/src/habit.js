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
        if (json['status'] === true) {
            document.getElementById('habits').innerHTML =  json['name'];
            console.log(json);
        } else {
            console.log(json);
            document.getElementById('error').innerHTML = json['message'];
            document.getElementById('message').innerHTML = '';
        }
    }

    static createHabitConfig(user) {
        const habitName = document.querySelector("#habitForm input#habitName").value;
        const frequency = document.querySelector("#habitForm select#frequency").value;

        console.log(">>>> createHabitConfig");
        // create configObject from form input
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + user.authToken
            },
            body: JSON.stringify({
                'name': habitName,
                'frequency_mode': frequency,
                'user_id': user.id
            })
        };
        return configObject;
    }

    static renderHabits(json) {
        console.log(">>>>>renderHabits");
        console.log(json['habits']);
        const habits = document.querySelector("div#habits");
        const message = document.querySelector("div#message");
        if (json['status'] == true) {

            // habit display container
            const habitGrid = document.createElement("div");
            habitGrid.setAttribute("class", "habit-grid-container");

            // habit table row
            const habitGridRow = document.createElement("div");
            habitGridRow.setAttribute("class", "habit-row");

            const habitGridHeadName = document.createElement("div");
            habitGridHeadName.setAttribute("class", "habit-head-cell");
            habitGridHeadName.innerText = "Name";

            const habitGridHeadFreq = document.createElement("div");
            habitGridHeadFreq.setAttribute("class", "habit-head-cell");
            habitGridHeadFreq.innerText = "Frequency";


            habitGrid.appendChild(habitGridRow);
            habitGridRow.append(habitGridHeadName);
            habitGridRow.appendChild(habitGridHeadFreq);

            json['habits'].forEach(x => {
                const habitRow = document.createElement("div");
                habitRow.setAttribute("class", "habit-row");

               const singleHabitName = document.createElement("div");
               singleHabitName.setAttribute("class", "habit-cell");
               singleHabitName.innerText = x.name;
               habitRow.appendChild(singleHabitName);

               const singleHabitFreq = document.createElement("div");
               singleHabitFreq.setAttribute("class", "habit-cell");
               singleHabitFreq.innerText = x.frequency_mode;
               habitRow.appendChild(singleHabitFreq);

               habitGrid.appendChild(habitRow);

            })
            habits.appendChild(habitGrid);
            console.log(habits);
        } else {
            if (json['message']) {
                message.innerText = json['message'];
                document.querySelector("div#error") = '';
            }
        }
    }
}