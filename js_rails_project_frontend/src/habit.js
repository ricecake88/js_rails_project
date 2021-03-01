
class Habit {
    static all_habits = [];

    constructor(id=-1, name, frequency_mode = 0, num_for_streak = 7, streak_counter = 0,
        streak_level = "easy", user=null) {
        this._id = id;
        this._name = name;
        this._frequency_mode = frequency_mode;
        this._num_for_streak = num_for_streak;
        this._streak_counter = streak_counter;
        this._streak_level = streak_level;
        this._user = user;
        Habit.all_habits.push(this);
    }

    /* setter for id */
    set id(num) {
        this._id = num;
    }

    createHabitNameSpan(habit) {
        console.log(">>>>>createHabitNameSpan");
        console.log(habit);
        let mainHabitSpan = document.createElement("span");
        mainHabitSpan.contentEditable = true;
        mainHabitSpan.setAttribute("id", "habitNameSpan" + habit._id);
        mainHabitSpan.innerText = habit._name;
        console.log(mainHabitSpan);
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
                "Authorization": "Bearer " + this._user._authToken
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
        console.log(">>>>>Double Click");
        console.log(e.target);
        console.log(habit);
        e.preventDefault();
        const habitCell = e.target.parentNode;
        console.log(habitCell);
        let value = "";
        console.log(e.target.id);
        console.log("habitNameSpan" + habit._id);
        if (e.target.id === "habitNameSpan" + habit._id) {
            //const id = parseInt(e.target.id.match(/[0-9]+/)[0])
            //console.log(id);
            console.log("Removing:");
            console.log("\t");
            console.log(e.target);
            habitCell.innerHTML = "";
            console.log(habitCell);

            let inputElement = document.createElement("input");
            inputElement.setAttribute("value", habit._name);
            inputElement.setAttribute("id", "habitNameSpan" + habit._id);
            habitCell.appendChild(inputElement);
            console.log(inputElement);
            inputElement.focus();
            inputElement.addEventListener('change', (e) => {
                e.preventDefault();
                value = document.querySelector("input#habitNameSpan" + habit._id).value;
                console.log(value);
                habitCell.addEventListener("click", (e) => {
                    e.preventDefault();
                    console.log(habit);

                    console.log(">>>>>>>>>>>>>>OffClick");
                    console.log(value);
                    console.log(e.target);
                    if (!e.target.id.includes( "habitNameSpan") && value) {
                        let editConfig = {
                            method: 'put',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + habit.user.authToken
                            },
                            body: JSON.stringify({
                                'habit_id': habit._id,
                                 'name': value,
                                 'user_id': habit.user.id
                             })
                         }
                        fetchJSON(`${BACKEND_URL}/habits/${habit._id}`, editConfig)
                        .then(json => {
                            habit._name = json['habit']['name'];
                            console.log(">>>>>>> ");
                            console.log(habit);
                            const textAgain = habit.createHabitNameSpan(habit);
                            habitCell.innerHTML = "";
                            value = "";
                            habitCell.appendChild(textAgain);
                        })


                    }
                })
            })

            console.log(habitCell);
        }

    }

    addHabitRecord(e) {
        e.preventDefault();
        console.log(">>>>>addHabitRecord")
        console.log(this);
        let record = document.getElementById('habitRecordDateInput' + this._id);
        console.log(record.value);
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': this._id,
                'time_of_record': record.value,
                'user_id': this._user.id
            })
        }
        console.log(configObject);
        fetchJSON(`${BACKEND_URL}/habit_records`, configObject)
        .then(json => {
            console.log(json);
            const records = document.createElement("p");
            const message = document.getElementById("message");
            const habitInfo = document.getElementById("habitInfo" + this._id)
            if (json['status'] == true) {
                records.innerText = json['habit']['time_of_record'];
                new HabitRecord(json['habit']['id'], json['habit']['habit_id'], json['habit']['user_id'], json['habit']['time_of_record']);
                console.log(HabitRecord.all);
                const box = document.createElement("span");
                box.setAttribute("class", "box");
                box.id = "box" + json['habit']['id'];
                console.log(box);
                habitInfo.appendChild(box);
                habitInfo.appendChild(records);


                const habitEditRecordsSelect = document.querySelector("select#habitEditRecord"  + this._id);
                const optionRecord = document.createElement("option");
                optionRecord.setAttribute("value", json['habit']['time_of_record']);
                optionRecord.innerText = json['habit']['time_of_record'];
                optionRecord.id = "timeRecorded" + json['habit']['id'];
                habitEditRecordsSelect.appendChild(optionRecord);
            } else {
                message.innerText = json['errors'];
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
        let habitRecordsRow = document.createElement("div");
        habitRecordsRow.setAttribute("class", "habit-row");
        habitRecordsRow.setAttribute("id", "habitMark" + this._id)
        habitRecordsRow.style.visibility = "hidden";
        habitRecordsRow.style.display = "none";

        let habitRecordsEmptyCell = document.createElement("div");
        habitRecordsEmptyCell.setAttribute("class", "habit-cell");

        const habitInfo = document.createElement("div");
        habitInfo.setAttribute("class", "habit-cell");
        habitInfo.setAttribute("id", "habitInfo" + this._id);

        let habitRecordsSubmitDateRecordsCell = document.createElement("div");
        habitRecordsSubmitDateRecordsCell.setAttribute("class","habit-cell");
        habitRecordsSubmitDateRecordsCell.id = "habitRecordSubmitDateCell" + this._id;

        let habitRecordsSubmitDateInput = document.createElement("input");
        habitRecordsSubmitDateInput.setAttribute("type", "date");
        habitRecordsSubmitDateInput.id = "habitRecordDateInput" + this._id;

        let habitRecordsSubmitDateBtn = document.createElement("button");
        habitRecordsSubmitDateBtn.id = 'submitRecHabit' + this._id;
        habitRecordsSubmitDateBtn.value = "submit";
        habitRecordsSubmitDateBtn.name = "submit";
        habitRecordsSubmitDateBtn.innerText = "submit";
        habitRecordsSubmitDateBtn.addEventListener("click", (e) => {
            this.addHabitRecord(e);
        })

        const habitEditRecordsSelect = document.createElement("select");
        habitEditRecordsSelect.setAttribute("display", "inline");
        habitEditRecordsSelect.setAttribute("name", "habitEditRecord");
        habitEditRecordsSelect.setAttribute("id", "habitEditRecord"  + this._id);

        const habitRemoveRecordsBtn = document.createElement("button");
        habitRemoveRecordsBtn.setAttribute("value", "Remove");
        habitRemoveRecordsBtn.setAttribute("name", "Remove");
        habitRemoveRecordsBtn.innerText = "Remove";
        habitRemoveRecordsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const timeOfRecord = document.getElementById("habitEditRecord" + this._id).value;
            let deleteRecordConfig = {
                method: 'delete',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this._user._authToken
                },
                body: JSON.stringify({
                    'habit_id': this._id,
                    'user_id': this._user.id,
                    "time_of_record": timeOfRecord,
                })

            }
            const habitRecordToDelete = HabitRecord.all_records.find(record => {
                console.log(record);
                console.log(this);
                if (record.user_id == this._user.id &&
                    record.habit_id == this._id &&
                    record.timeOfRecord == timeOfRecord) {
                        return record;
                    }
            })
            console.log(habitRecordToDelete);
            //console.log(configObject);
            fetchJSON(`${BACKEND_URL}/habit_records/${habitRecordToDelete.id}`, deleteRecordConfig)
                .then(json => {
                    console.log(json);
                    if (json['status']) {
                        console.log("Removing a Box and Option")
                    const boxToRemove = document.querySelector("span#box" + json['id']);
                    const habitInfo = document.querySelector("div#habitInfo" + this._id);
                    const habitRecordsOption = document.querySelector("option#timeRecorded" + json['id']);
                    habitInfo.removeChild(boxToRemove);
                    habitEditRecordsSelect.removeChild(habitRecordsOption);
                    }
                })
        })

        let habitRecordsConfigObject = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this._user.authToken
            },
        }
        console.log(habitRecordsConfigObject);
        console.log("Fetching this:")
        console.log(`${BACKEND_URL}/habit_records?habit_id=${this._id}`);
        fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}`, habitRecordsConfigObject)
        .then(json => {
            console.log("RETRIEVING HABIT RECORDS");
            console.log(json);
            if (json['status'] && json['record'] != undefined) {
                json['record'].forEach(record => {
                    new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
                    const box = document.createElement("span");
                    box.setAttribute("class", "box");
                    box.id = "box" + record['id'];
                    habitInfo.appendChild(box);

                    const optionRecord = document.createElement("option");
                    optionRecord.setAttribute("value", record['time_of_record']);
                    optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                    optionRecord.innerText = record['time_of_record'];
                    habitEditRecordsSelect.appendChild(optionRecord);


                })
            }
        })

        habitRecordsRow.append(habitRecordsEmptyCell);
        habitRecordsRow.appendChild(habitInfo);
        habitRecordsSubmitDateRecordsCell.append(habitRecordsSubmitDateInput, habitRecordsSubmitDateBtn);
        habitRecordsSubmitDateRecordsCell.append(habitEditRecordsSelect, habitRemoveRecordsBtn);
        habitRecordsRow.appendChild(habitRecordsSubmitDateRecordsCell);

        habitTable.appendChild(mainHabitRow);
        habitTable.appendChild(habitRecordsRow);
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