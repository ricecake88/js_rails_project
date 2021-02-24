

class Habit {
    static all = [];

    constructor(id=-1, name, frequency_mode = 0, num_for_streak = 7, streak_counter = 0,
        streak_level = "easy", user=null) {
        this._id = id;
        this._name = name;
        this._frequency_mode = frequency_mode;
        this._num_for_streak = num_for_streak;
        this._streak_counter = streak_counter;
        this._streak_level = streak_level;
        this.user = user;
        Habit.all.push(this);
    }

    /* setter for id */
    set id(num) {
        this._id = num;
    }

    static toggleHabit() {

    }

    deleteHabit(e) {
        console.log(">>>>>>>deleteHabit(e)")
        let delete_id = parseInt(e.target.id.match(/[0-9]+/)[0]);
        console.log(delete_id);
        console.log(this);
        let configObject = {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this.user._authToken
            },
            body: JSON.stringify({
                'id': delete_id,
                'name': this._name
            })
        }

        //console.log(configObject);
        fetchJSON(`${BACKEND_URL}/habits/${delete_id}`, configObject)
        .then(json => {
            //Need to put a confirm window?
            console.log(Habit.all);
            const habitRowToDelete = document.getElementById(`habitRow${delete_id}`);
            habitRowToDelete.remove();
            const habitMarkToDelete = document.getElementById(`habitMark${delete_id}`);
            habitMarkToDelete.remove();
            Habit.all = Habit.all.filter(function(element) {
                return element._id != delete_id;
            })
            console.log(Habit.all)
        })
    }

    renderHabit() {
        console.log(">>>renderHabit()")
        console.log(this);
        let habitGrid = document.querySelector("div.habit-grid-container");

        console.log(this._id);
        let habitRow = document.createElement("div");
        habitRow.setAttribute("class", "habit-row");
        habitRow.setAttribute("id", "habitRow" + this._id);

        let singleHabitName = document.createElement("div");
        singleHabitName.setAttribute("class", "habit-cell");
        singleHabitName.setAttribute("id", "habitInfo" + this._id);
        singleHabitName.innerText = this._name;

        let singleHabitFreq = document.createElement("div");
        singleHabitFreq.setAttribute("class", "habit-cell");
        singleHabitFreq.innerText = this._frequency_mode;

        let singleHabitCell = document.createElement("div");
        singleHabitCell.setAttribute("class", "habit-cell");

        let singleHabitDeleteBtn = document.createElement("button");
        singleHabitDeleteBtn.setAttribute("class", "btn-delete");
        singleHabitDeleteBtn.id = "habitDeleteBtn" + this._id;
        singleHabitDeleteBtn.innerText="X";
        singleHabitDeleteBtn.addEventListener("click", this.deleteHabit.bind(this));
        singleHabitCell.appendChild(singleHabitDeleteBtn);

        habitRow.append(singleHabitName, singleHabitFreq, singleHabitCell);


        // ----------- mark off date -------------------//
        let habitMarkRow = document.createElement("div");
        habitMarkRow.setAttribute("class", "habit-row");
        habitMarkRow.setAttribute("id", "habitMark" + this._id)
        habitMarkRow.style.visibility = "hidden";

        let habitDetails = document.createElement("div");
        habitDetails.setAttribute("class","habit-cell");

        let habitDetailsInput = document.createElement("input");
        habitDetailsInput.setAttribute("type", "date");
        habitDetailsInput.id = "habitEntered" + this._id;

        let habitDetailsBtn = document.createElement("button");
        habitDetailsBtn.id = 'submitRecHabit' + this._id;
        habitDetailsBtn.value = "submit";
        habitDetailsBtn.name = "submit";
        habitDetailsBtn.innerText = "submit";
        habitDetailsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("submitted");
            let record = document.getElementById('habitEntered' + this._id);
            console.log(record.value);
            let configObject = {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.user.authToken
                },
                body: JSON.stringify({
                    'habit_id': this._id,
                    'time_of_record': record.value,
                    'user_id': this.user.id
                })
            }
            console.log(configObject);
            fetchJSON(`${BACKEND_URL}/habit_records`, configObject)
            .then(json => {
                console.log(json);
                const records = document.createElement("p");
                const message = document.getElementById("message");
                if (json['status']) {
                    records.innerText = json['message']['time_of_record'];
                    habitMarkRow.appendChild(records);
                } else {
                    message.innerText = json['errors'];
                }
            })
        })


        const habitInfo = document.createElement("div");
        habitInfo.setAttribute("class", "habit-cell");
        habitInfo.innerText = "Habit Info";

        habitDetails.appendChild(habitDetailsInput);
        habitDetails.appendChild(habitDetailsBtn);
        habitMarkRow.appendChild(habitDetails);
        habitMarkRow.appendChild(habitInfo);

        habitGrid.appendChild(habitRow);
        habitGrid.appendChild(habitMarkRow);
        singleHabitName.innerText = this._name;
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

        const labelForNumStreak = document.createElement("label");
        labelForNumStreak.setAttribute("for", "Streak Number");
        labelForNumStreak.textContent = "Streak Number";

        //const streakElement = document.createElement("select");
        //streakElement.setAttribute("name", "numStreak");
        //streakElement.setAttribute("id", "numStreak");
        //for (let i = 0; i < 30; i++) {
//
        //}

        const submitElement = document.createElement("button");
        submitElement.setAttribute("name", "submit");
        submitElement.setAttribute("id", "submit");
        submitElement.setAttribute("type", "submit");
        submitElement.textContent = "Submit";


        habitForm.append(labelForHabitNameElement,
            inputHabitNameElement, inputHabitNameElement, brElementOne,
            labelForScheduleElement, scheduleElement, brElementTwo,
            labelForNumStreak, submitElement);

        userAreaElement.appendChild(habitForm);
        console.log(habitForm);
    }

    static handleHabitConfig(json, user) {
        console.log(">>> handleHabitConfig");
        console.log("Added Habit")
        console.log(json);
        //This cannot be the only place. It needs to be created upon renderHabits
        document.querySelector("#habitForm input#habitName").value = "";
        let createdHabit = new Habit(json['habit']['id'], json['habit']['name'], json['habit']['frequency_mode'],
            undefined, undefined, json['habit']['streak_level'], user);
        createdHabit.renderHabit();
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
                'streak_counter': 0,
                'streak_level': "easy",
                'num_for_streak': 7,
                'user_id': user.id
            })
        };
        return configObject;
    }

    static getHabits(user) {
        console.log(">>>>>getHabits()");
        let config = user.createAuthConfig(user.authToken);
        return fetchJSON(`${BACKEND_URL}/habits`, config)
        .then(json =>  {
            Habit.renderHabits(json, user);
        })
    }

    static renderHabits(json, user) {
        console.log(">>>>>renderHabits");
        console.log(json);
        console.log(json['habits']);

        const habitGrid = document.querySelector("div#habit-grid-container");
        const message = document.querySelector("div#message");

        if ((json['status'] == true) && (json['habits'])) {
            json['habits'].forEach(x => {

                let habit = new Habit(x.id, x.name, x.frequency_mode, undefined, undefined, x.streak_level, user);
                habit.renderHabit(user);

                console.log(Habit.all);
                console.log(habit);
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
    if (habitShowRow.style.visibility == "hidden") {
       habitShowRow.style.visibility = "visible";
    } else {
        habitShowRow.style.visibility = "hidden";
    }
}