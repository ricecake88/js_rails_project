

class Habit {
    static all = [];

    constructor(id=-1, name, frequency_mode = 0, num_for_streak = 7, streak_counter = 0, streak_level = "none") {
        this._id = id;
        this._name = name;
        this._frequency_mode = frequency_mode;
        this._num_for_streak = num_for_streak;
        this._streak_counter = streak_counter;
        this._streak_level = "none";
        Habit.all.push(this);
    }

    /* setter for id */
    set id(num) {
        this._id = num;
    }


    static renderHabit(habit, user) {
        console.log(">>>renderHabit")
        let habitGrid = document.querySelector("div.habit-grid-container");

        console.log(habit.id);
        let habitRow = document.createElement("div");
        habitRow.setAttribute("class", "habit-row");
        habitRow.setAttribute("id", "habitRow" + habit.id);

        let singleHabitName = document.createElement("div");
        singleHabitName.setAttribute("class", "habit-cell habit-name");
        singleHabitName.setAttribute("id", "habitInfo" + habit.id);
        singleHabitName.innerText = habit.name;

        let singleHabitFreq = document.createElement("div");
        singleHabitFreq.setAttribute("class", "habit-cell");
        singleHabitFreq.innerText = habit.frequency_mode;

        let singleHabitDeleteBtn = document.createElement("button");
        singleHabitDeleteBtn.setAttribute("class", "btn-delete");
        singleHabitDeleteBtn.id = "habitDeleteBtn" + habit.id;
        singleHabitDeleteBtn.addEventListener("click", (e) => {
            let delete_id = parseInt(e.target.id.match(/[0-9]+/)[0]);
            let configObject = {
                method: 'delete',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + user.authToken
                },
                body: JSON.stringify({
                    'id': delete_id,
                    'name': habit.name
                })
            };

            console.log(configObject);

            fetchJSON(`${BACKEND_URL}/habits/${delete_id}`, configObject)
            .then(json => {
                //Need to put a confirm window?
                console.log(Habit.all);
                const habitRowToDelete = document.getElementById(`habitRow${delete_id}`);
                habitRowToDelete.remove();
                Habit.all = Habit.all.filter(function(element) {
                    return element._id != delete_id;
                })
                console.log(Habit.all)
            })
        })
        habitRow.append(singleHabitName, singleHabitFreq, singleHabitDeleteBtn);




        let habitMarkRow = document.createElement("div");
        habitMarkRow.setAttribute("class", "habit-row habit-mark");
        habitMarkRow.setAttribute("id", "habitMark" + habit.id)
        habitMarkRow.style.display = "none";

        let habitDetails = document.createElement("p");
        let habitDetailsInput = document.createElement("input");
        habitDetailsInput.setAttribute("type", "date");
        habitDetails.appendChild(habitDetailsInput);
        habitMarkRow.appendChild(habitDetails);

        habitGrid.appendChild(habitRow);
        habitGrid.appendChild(habitMarkRow);
        singleHabitName.innerText = habit.name
        singleHabitName.addEventListener("click", habitMarkoff);
        console.log(habitGrid);
    }

    static renderAddHabitForm() {
        console.log(">>>>>> renderAddHabitForm()");
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


        habitForm.append(labelForHabitNameElement,
            inputHabitNameElement, inputHabitNameElement, brElementOne,
            labelForScheduleElement, scheduleElement, brElementTwo,
            submitElement);

        userAreaElement.appendChild(habitForm);
        console.log(habitForm);
    }

    static handleHabitConfig(json, user) {
        console.log(">>> handleHabitConfig");
        console.log("Added Habit")
        console.log(json);
        //This cannot be the only place. It needs to be created upon renderHabits
        document.querySelector("#habitForm input#habitName").value = "";
        let createdHabit = new Habit(json['habit']['id'], json['habit']['name'], json['habit']['frequency_mode']);
        Habit.renderHabit(json['habit'], user);
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


    static renderHabits(json, user) {
        console.log(">>>>>renderHabits");
        console.log(json['habits']);

        const habitGrid = document.querySelector("div#habit-grid-container");
        const message = document.querySelector("div#message");

        if (json['status'] == true) {
            json['habits'].forEach(x => {
                Habit.renderHabit(x, user);
                new Habit(x.id, x.name, x.frequency_mode);
                console.log(x);
            })

            console.log(habits);

        } else {
            if (json['message']) {
                message.innerText = json['message'];
                document.querySelector("div#error") = '';
            }
        }
    } //end renderHabits


}

function habitMarkoff(e) {

    e.preventDefault();
    const regex = /[0-9]+/;
    let id = e.target.id.match(regex)[0];
    console.log(id);
    let habitShowRow = document.getElementById("habitMark" + id);
    if (habitShowRow.style.display == "none") {
       habitShowRow.style.display = "block";
    } else {
        habitShowRow.style.display = "none";
    }
}