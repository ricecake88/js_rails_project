
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

    createHabitNameSpan(habit) {
        console.log(habit);
        let mainHabitSpan = document.createElement("span");
        mainHabitSpan.contentEditable = true;
        mainHabitSpan.setAttribute("id", "habitName" + habit._id);
        mainHabitSpan.innerText = habit._name;
        mainHabitSpan.addEventListener("dblclick", (e) => {
            habit.toggleEditName(e, habit)
        })
        return mainHabitSpan;
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

    toggleEditName(e, habit) {
        console.log("Double Click");
        const event = e.target;
        console.log(e);

        let name = event.innerText;
        let id = event.id;
        let wheee = habit;
        console.log("habitCell" + parseInt(e.target.id.match(/[0-9]+/)[0]));
        const habitCell = document.getElementById("habitCell" + parseInt(e.target.id.match(/[0-9]+/)[0]))
        habitCell.removeChild(e.target);

        const inputElement = document.createElement("input");
        inputElement.setAttribute("value", name);
        habitCell.appendChild(inputElement);

           document.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(habit);
            if (!e.target.id.includes( "habitName")) {
                   const textAgain = habit.createHabitNameSpan(this);
                habitCell.removeChild(inputElement);
                habitCell.appendChild(textAgain);
            }
        })

    }



    renderHabit() {
        console.log(">>>renderHabitTest()")
        console.log(this);

        let habitTable = document.querySelector("div.habit-table-container");

        let mainHabitRow = document.createElement("div");
        mainHabitRow.setAttribute("class", "habit-row");
        mainHabitRow.setAttribute("id", "habitRow" + this._id);

        let arrowCell = document.createElement("div");
        arrowCell.setAttribute("class", "habit-cell");
        arrowCell.setAttribute("id", "habitArrow" + this._id);

        let arrow = document.createElement("img");
        arrow.src = "http://www.clker.com/cliparts/9/1/9/a/1369857928521711478blue_arrow_down.png";
        arrow.setAttribute("class", "arrow")
        arrowCell.appendChild(arrow);

        let mainHabitCell = document.createElement("div");
        mainHabitCell.setAttribute("class", "habit-cell");
        mainHabitCell.setAttribute("id", "habitCell" + this._id);

        const mainHabitSpan = this.createHabitNameSpan(this);
        //let mainHabitSpan = document.createElement("span");
        //mainHabitSpan.contentEditable = true;
        //mainHabitSpan.setAttribute("id", "habitName" + this._id);
        //mainHabitSpan.innerText = this._name;
        mainHabitCell.appendChild(mainHabitSpan);


        let habitFreqMode = document.createElement("div");
        habitFreqMode.setAttribute("class", "habit-cell");
        habitFreqMode.innerText = this._frequency_mode;

        let habitRemove = document.createElement("div");
        habitRemove.setAttribute("class", "habit-cell");

        let habitRemoveDeleteBtn = document.createElement("button");
        habitRemoveDeleteBtn.setAttribute("class", "btn-delete");
        habitRemoveDeleteBtn.id = "habitDeleteBtn" + this._id;
        habitRemoveDeleteBtn.innerText="X";
        habitRemoveDeleteBtn.addEventListener("click", this.deleteHabit.bind(this));
        habitRemove.appendChild(habitRemoveDeleteBtn);

        mainHabitRow.append(arrowCell, mainHabitCell, habitFreqMode, habitRemove);



        // ----------- mark off date -------------------//
        let habitMarkRow = document.createElement("div");
        habitMarkRow.setAttribute("class", "habit-row");
        habitMarkRow.setAttribute("id", "habitMark" + this._id)
        habitMarkRow.style.visibility = "hidden";
        habitMarkRow.style.display = "none";

        let habitDetailsEmptyCell = document.createElement("div");
        habitDetailsEmptyCell.setAttribute("class", "habit-cell");

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
        //habitInfo.innerText = "Habit Info";
        let habitRecordsConfigObject = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.user.authToken
            },
        }
        fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}`, habitRecordsConfigObject)
        .then(json => {
            console.log(json);
            let recordString = "";
            if (json['status'] && json['record'] != undefined) {
                json['record'].forEach(record => {
                    const box = document.createElement("span");
                    box.setAttribute("class", "box");
                    habitInfo.appendChild(box);

                })
            }
        })

        habitDetails.appendChild(habitDetailsInput);
        habitDetails.appendChild(habitDetailsBtn);
        habitMarkRow.appendChild(habitDetailsEmptyCell);
        habitMarkRow.appendChild(habitDetails);
        habitMarkRow.appendChild(habitInfo);

        habitTable.appendChild(mainHabitRow);
        habitTable.appendChild(habitMarkRow);
        arrowCell.addEventListener("click", habitMarkoff);



        console.log(habitTable);
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

    console.log(e.target);
    e.preventDefault();
    const regex = /[0-9]+/;
    let id = e.target.id.match(regex)[0];
    //let habitShowRow = document.getElementById("habitMark" + id);
    let habitShowRow = document.getElementById("habitMark" + id);
    if (habitShowRow.style.visibility == "hidden") {
       habitShowRow.style.visibility = "visible";
       habitShowRow.style.display = 'table-row'
    } else {
        habitShowRow.style.visibility = "hidden";
        habitShowRow.style.display = 'none';
    }
}