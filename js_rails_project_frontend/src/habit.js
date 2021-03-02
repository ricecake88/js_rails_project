
class Habit {
    static all = [];

    constructor(id = -1, name, frequency_mode = "Everyday", num_for_streak = 7, streak_counter = 0,
        streak_level = "easy", user = null) {
        this._id = id;
        this._name = name;
        this._frequency_mode = frequency_mode;
        this._num_for_streak = num_for_streak;
        this._streak_counter = streak_counter;
        this._streak_level = streak_level;
        this._user = user;
        Habit.all.push(this);
    }

    get id() {
        return this._id;
    }

    /* setter for id */
    set id(num) {
        this._id = num;
    }


    get user() {
        return this._user;
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
            habit.toggleEditNameTest(e, habit)
        })
        return mainHabitSpan;
    }

    static createCfgAdd(user, habit) {
        /* TO-DO: NEED TO CHANGE HABIT_CONTROLLER TO HANDLE NUM FOR STREAK BASED ON STREAK LEVEL */
        let configObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + user.authToken
            },
            body: JSON.stringify({
                'name': document.querySelector("#habitForm input#habitName").value,
                'frequency_mode': document.querySelector("#habitForm select#frequency").value,
                'streak_counter': 0,
                'streak_level': document.querySelector("#habitForm select#streakLevel").value,
                'num_for_streak': 7, /* TO-DO: DONT'T SET THIS WHEN PASSING THROUGH, DON'T PASS THROUGH */
                'user_id': user.id
            })
        };
        return configObject;
    }

    createCfgGetAuth() {
        return {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this._user.authToken
            },
        }
    }

    createCfgUpdateName() {
        return {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': this._id, /////this needs to be changed, the body, to match every change of habit
                'name': value,
                'user_id': this._user.id
            })
        }
    }

    createCfgUpdateFrequency() {
        let editConfig = {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': this._id, /////this needs to be changed, the body, to match every change of habit
                'name': value,
                'user_id': this._user.id
            })
        }
        return editConfig;
    }

    createCfgNewRecord() { // TO-DO: move this to HabitRecord?
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
        return configObject;
    }

    createCfgDelete() {
        return {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user._authToken
            },
            body: JSON.stringify({
                'id': this._id,
                'name': this._name
            })
        }
    }

    deleteHabit(e) {
        console.log(">>>>>>>deleteHabit(e)")
        const configObject = this.createCfgDelete();
        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, configObject)
            .then(json => {
                //Need to put a confirm window?
                const habitMarkToDelete = document.getElementById(`habitMark${this._id}`);
                habitMarkToDelete.remove();
                const habitRowToDelete = document.getElementById(`habitRow${this._id}`);
                habitRowToDelete.remove();
                // delete instances from Habit class array
                Habit.all = Habit.all.filter(element => {
                    return element._id != this._id;
                })
            })
    }

    toggleEditNameTest(e, habit) {
        console.log(">>>>>Double Click");
        e.preventDefault();
        const habitCell = e.target.parentNode;
        let value = "";
        if (e.target.id === "habitNameSpan" + habit._id) {
            //const id = parseInt(e.target.id.match(/[0-9]+/)[0])
            //console.log(id);
            console.log("Removing:");
            console.log("\t");
            console.log(e.target);
            habitCell.innerHTML = "";

            let inputElement = document.createElement("input");
            inputElement.setAttribute("value", habit._name);
            inputElement.setAttribute("id", "habitNameSpan" + habit._id);
            habitCell.appendChild(inputElement);

            inputElement.focus();
            inputElement.onblur = (e) => {
                e.preventDefault();
                value = document.querySelector("input#habitNameSpan" + this._id).value;
                //habitCell.addEventListener("click", (e) => {
                //    e.preventDefault();
                //    if (!e.target.id.includes("habitNameSpan") && value) {
                        let editConfig = {
                            method: 'put',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + this._user.authToken
                            },
                            body: JSON.stringify({
                                'habit_id': this._id,
                                'name': value,
                                'user_id': this._user.id
                            })
                        }
                        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, editConfig)
                            .then(json => {
                                this._name = json['habit']['name'];
                                const textAgain = habit.createHabitNameSpan(this);
                                habitCell.innerHTML = "";
                                value = "";
                                habitCell.appendChild(textAgain);
                            })


                    }
                //})
            //}
            console.log(habitCell);
        }

    }

    toggleEditName(e, habit) {
        console.log(">>>>>Double Click");
        e.preventDefault();
        const habitCell = e.target.parentNode;
        let value = "";
        if (e.target.id === "habitNameSpan" + habit._id) {
            //const id = parseInt(e.target.id.match(/[0-9]+/)[0])
            //console.log(id);
            console.log("Removing:");
            console.log("\t");
            console.log(e.target);
            habitCell.innerHTML = "";

            let inputElement = document.createElement("input");
            inputElement.setAttribute("value", habit._name);
            inputElement.setAttribute("id", "habitNameSpan" + habit._id);
            habitCell.appendChild(inputElement);

            inputElement.focus();
            inputElement.onblur = (e) => {
                e.preventDefault();
                value = document.querySelector("input#habitNameSpan" + this._id).value;
                habitCell.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (!e.target.id.includes("habitNameSpan") && value) {
                        let editConfig = {
                            method: 'put',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + this._user.authToken
                            },
                            body: JSON.stringify({
                                'habit_id': this._id,
                                'name': value,
                                'user_id': this._user.id
                            })
                        }
                        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, editConfig)
                            .then(json => {
                                this._name = json['habit']['name'];
                                const textAgain = habit.createHabitNameSpan(this);
                                habitCell.innerHTML = "";
                                value = "";
                                habitCell.appendChild(textAgain);
                            })


                    }
                })
            }
            console.log(habitCell);
        }

    }

    addHabitRecord(e) { //TO-DO - move this to HabitRecord???
        e.preventDefault();
        console.log(">>>>>addHabitRecord")
        let record = document.getElementById('habitRecordDateInput' + this._id);
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
                const records = document.createElement("p");
                const message = document.getElementById("message");
                const habitRecordBoxesDiv = document.getElementById("habitRecordBoxes" + this._id)
                if (json['status'] == true) {
                    records.innerText = json['habit']['time_of_record'];
                    new HabitRecord(json['habit']['id'], json['habit']['habit_id'], json['habit']['user_id'], json['habit']['time_of_record']);
                    const box = document.createElement("span");
                    box.setAttribute("class", "box");
                    box.id = "box" + json['habit']['id'];
                    habitRecordBoxesDiv.appendChild(box);
                    habitRecordBoxesDiv.appendChild(records);


                    const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + this._id);
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

    removeHabitRecord(e) {
        e.preventDefault();

        const timeOfRecord = document.getElementById("habitEditRecord" + this._id).value;
        const habitEditRecordsSelect = document.getElementById("habitEditRecord" + this._id);
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
        const habitRecordToDelete = HabitRecord.all.find(record => {
            if (record.user_id == this._user.id &&
                record.habit_id == this._id &&
                record.timeOfRecord == timeOfRecord) {
                return record;
            }
        })
        console.log(habitRecordToDelete);
        fetchJSON(`${BACKEND_URL}/habit_records/${habitRecordToDelete.id}`, deleteRecordConfig)
            .then(json => {
                if (json['status']) {
                    const boxToRemove = document.querySelector("span#box" + json['id']);
                    const habitRecordBoxesDiv = document.querySelector("div#habitRecordBoxes" + this._id);
                    const habitRecordsOption = document.querySelector("option#timeRecorded" + json['id']);
                    habitRecordBoxesDiv.removeChild(boxToRemove);
                    habitEditRecordsSelect.removeChild(habitRecordsOption);
                }
            })
    }

    renderHabit() {
        console.log(">>>renderHabit()")

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
        mainHabitCell.appendChild(mainHabitSpan);


        let habitFreqMode = document.createElement("div");
        habitFreqMode.setAttribute("class", "habit-cell");
        habitFreqMode.innerText = this._frequency_mode;

        let habitRemove = document.createElement("div");
        habitRemove.setAttribute("class", "habit-cell");

        let habitRemoveDeleteBtn = document.createElement("button");
        habitRemoveDeleteBtn.setAttribute("class", "btn-delete");
        habitRemoveDeleteBtn.id = "habitDeleteBtn" + this._id;
        habitRemoveDeleteBtn.innerText = "X";
        habitRemoveDeleteBtn.addEventListener("click", this.deleteHabit.bind(this));
        habitRemove.appendChild(habitRemoveDeleteBtn);

        mainHabitRow.append(arrowCell, mainHabitCell, habitFreqMode, habitRemove);



        // -------------------- second row  -------------------//
        const habitRecordsRow = document.createElement("div");
        habitRecordsRow.setAttribute("class", "habit-row");
        habitRecordsRow.setAttribute("id", "habitMark" + this._id)
        habitRecordsRow.style.visibility = "hidden";
        habitRecordsRow.style.display = "none";

        const habitRecordsEmptyCell = document.createElement("div");
        habitRecordsEmptyCell.setAttribute("class", "habit-cell");

        const habitRecordBoxesDiv = document.createElement("div");
        habitRecordBoxesDiv.setAttribute("class", "habit-cell");
        habitRecordBoxesDiv.id = "habitRecordBoxes" + this._id;
        //habitInfo.innerHTML = "Last 7 Days:<br/>";

        const habitRecordsSubmitDateRecordsCell = document.createElement("div");
        habitRecordsSubmitDateRecordsCell.setAttribute("class", "habit-cell");
        habitRecordsSubmitDateRecordsCell.id = "habitRecordSubmitDateCell" + this._id;

        const habitRecordsSubmitDateInput = document.createElement("input");
        habitRecordsSubmitDateInput.type = "date";
        habitRecordsSubmitDateInput.id = "habitRecordDateInput" + this._id;

        const habitRecordsSubmitDateBtn = document.createElement("button");
        //habitRecordsSubmitDateBtn.id = 'submitRecHabit' + this._id;
        habitRecordsSubmitDateBtn.setAttribute("id", "submitRecHabit" + this._id);
        habitRecordsSubmitDateBtn.value = "submit";
        habitRecordsSubmitDateBtn.name = "submit";
        habitRecordsSubmitDateBtn.innerText = "submit";


        const habitEditRecordsSelect = document.createElement("select");
        habitEditRecordsSelect.setAttribute("display", "inline");
        habitEditRecordsSelect.setAttribute("name", "habitEditRecord");
        habitEditRecordsSelect.setAttribute("id", "habitEditRecord" + this._id);

        const habitRemoveRecordsBtn = document.createElement("button");
        habitRemoveRecordsBtn.setAttribute("value", "Remove");
        habitRemoveRecordsBtn.setAttribute("name", "Remove");
        habitRemoveRecordsBtn.innerText = "Remove";

        HabitRecord.handleHabitRecords(this);
        //const habitRecordsConfigObject = this.createCfgGetAuth();
    //
        //fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}&range=all`, habitRecordsConfigObject)
        //.then(json => {
        //    /////TO-DO: FIX ERROR MESSAGES BEING RETURNED AND STATUSES
        //    console.log(json);
        //    if (json['status'] && json['record'] != undefined) {
        //        json['record'].forEach(record => {
        //            new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
        //            const box = document.createElement("span");
        //            box.setAttribute("class", "box");
        //            box.id = "box" + record['id'];
        //            habitInfo.appendChild(box);
//
        //            const optionRecord = document.createElement("option");
        //            optionRecord.setAttribute("value", record['time_of_record']);
        //            optionRecord.setAttribute("id", "timeRecorded" + record['id'])
        //            optionRecord.innerText = record['time_of_record'];
        //            habitEditRecordsSelect.appendChild(optionRecord);
//
//
        //        })
        //    }
        //})
        /* need to restructure in creating boxes based on the date range I query, but show a separate query
        of .. the past 30 days perhaps? */
        //fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}&range=all`, habitRecordsConfigObject)
        //.then(json => {
        //    console.log(json);
        //    if (json['status'] && json['record'] != undefined) {
        //        json['record'].forEach(record => {
        //            new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
//
        //            const optionRecord = document.createElement("option");
        //            optionRecord.setAttribute("value", record['time_of_record']);
        //            optionRecord.setAttribute("id", "timeRecorded" + record['id'])
        //            optionRecord.innerText = record['time_of_record'];
        //            habitEditRecordsSelect.appendChild(optionRecord);
//
//
        //        })
        //    }
        //})
        //fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}&range=7`, habitRecordsConfigObject)
        //    .then(json => {
        //        console.log(json);
        //        if (json['status'] && json['record'] != undefined) {
        //            json['record'].forEach(record => {
        //                //new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
        //                const box = document.createElement("span");
        //                box.setAttribute("class", "box");
        //                box.id = "box" + record['id'];
        //                habitInfo.appendChild(box);
        //            })
        //        }
        //    })
//
        habitRecordsRow.append(habitRecordsEmptyCell);
        habitRecordsRow.appendChild(habitRecordBoxesDiv);
        habitRecordsSubmitDateRecordsCell.append(habitRecordsSubmitDateInput, habitRecordsSubmitDateBtn);
        habitRecordsSubmitDateRecordsCell.append(habitEditRecordsSelect, habitRemoveRecordsBtn);
        habitRecordsRow.appendChild(habitRecordsSubmitDateRecordsCell);

        habitTable.appendChild(mainHabitRow);
        habitTable.appendChild(habitRecordsRow);
        arrowCell.addEventListener("click", habitMarkoff);
        //habitRecordsSubmitDateBtn.addEventListener("click", this.addHabitRecord.bind(this));
        //habitRecordsSubmitDateBtn.addEventListener("click", () => {
        //    HabitRecord.handleNewRecord(this);
        //});
        habitRecordsSubmitDateBtn.addEventListener("click", () => {
            HabitRecord.handleNewRecord(this);
        })
        //habitRemoveRecordsBtn.addEventListener("click", this.removeHabitRecord.bind(this));
        habitRemoveRecordsBtn.addEventListener("click", () => {
            HabitRecord.handleDeleteRecord(this);
        });


        console.log("Habit Table")
        console.log(habitTable);
    }

    static renderAddHabitForm() {
        console.log(">>>>>> renderAddHabitForm()");
        const userAreaElement = document.getElementById("user");
        userAreaElement.innerHTML = "";

        let htmlString = `
            <form id="habitForm" name="habitForm">
                <label for="habitName">Habit Name:</label>
                <input id="habitName" name="habitName" type="text" placeholder="Enter a habit">
                <br/>

                <label for="frequency">Goal:</label>
                <select name="frequency" id="frequency">
                    <option name="Everyday" value="Everyday" selected>Everyday
                    <option name="Every Other Day" value="Every Other Day">Every Other Day
                </select>
                <br/>

                <label for="streakLevel">Streak Level:</label>
                <select name="streakLevel" id="streakLevel">
                    <option name="Easy" value="Easy" selected>Easy
                    <option name="Medium" value="Medium">Medium
                    <option name="Hard" value="Hard">Hard
                </select>
                <br/>
                <button type="submit" name="submitNewHabit" value="submitNewHabit">Submit
            </form>
        `
        userAreaElement.innerHTML = htmlString;
    }

    static createHabit(user) {
        console.log(">>> createHabit()")
        const addConfigObject = Habit.createCfgAdd(user);
        fetchJSON(`${BACKEND_URL}/habits`, addConfigObject)
        .then(json => {
            /* TO-DO NEED TO FIX THIS UP WITH PROPER ERROR MESSAGE HANDLING */
            if (json['status'] == true) {
                console.log("Status is true, why not stop");
                document.querySelector("#habitForm input#habitName").value = "";
                const createdHabit = new Habit(json['habit']['id'],
                    json['habit']['name'],
                    json['habit']['frequency_mode'],
                    undefined,
                    undefined,
                    json['habit']['streak_level'],
                     user);
                createdHabit.renderHabit();
            } else {
                document.getElementById("error").innerText = json['errors'];
            }
        })
    }

    static getHabits(user) {
        console.log(">>>> getHabits()");
        let config = user.createAuthConfig(user.authToken);
        return fetchJSON(`${BACKEND_URL}/habits`, config)
            .then(json => {
                Habit.renderHabits(json, user);
            })
    }

    static renderHabits(json, user) {
        console.log(">>>>>renderHabits");
        const habitGrid = document.querySelector("div#habit-grid-container");
        const message = document.querySelector("div#message");

        if ((json['status'] == true) && (json['habits'])) {
            json['habits'].forEach(x => {

                let habit = new Habit(x.id, x.name, x.frequency_mode, 7, 0, x.streak_level, user);
                habit.renderHabit(user);
/*                 console.log("Does this ever get here?");
                const buttons = document.querySelectorAll("button");
                buttons.forEach(button =>
                    {
                        button.addEventListener("click", () => {
                            if (button.id.includes("habitRemoveRecordsBtn")) {
                                button.addEventListener("click"), this.removeHabitRecord.bind(this);

                            }
                        })
                    }
                )
*/
            })
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

function renderAllHabits(user) {
    console.log("renderAllHabits!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const allHabitsDivElement = document.getElementById("allHabits");
    const allHabitNamesDivElement = document.createElement("div");
    allHabitNamesDivElement.setAttribute("class", "blah");

    const allHabitsFilterSelect = document.createElement("div");
    allHabitsFilterSelect.setAttribute("id", "habitsFilterSelect");

    const colorHabitsDivElement = document.createElement("div");
    colorHabitsDivElement.setAttribute("class", "blah");

    let config = user.createAuthConfig(user.authToken);
    allHabitsDivElement.appendChild(allHabitsFilterSelect);
    allHabitsDivElement.appendChild(allHabitNamesDivElement);
    allHabitsDivElement.appendChild(colorHabitsDivElement);
    allHabitsFilterSelect.innerHTML =
    `
    <select name="filter">
        <option name="all" value="all">All
        <option name="last7" value="last 7" selected>Last Seven Days
        <option name="currentMonth" value="currentMonth">Current Month
        <option name="currentYear" value="currentYear">Current Year
    </select>`

    fetchJSON(`${BACKEND_URL}/habits`, config)
    .then(json => {
        console.log(json);
        let htmlString = "";
        if (json['status'] && json['habits'] != undefined) {
            json['habits'].forEach(habit => {
                htmlString += `${habit.name}<br/>`;
                //need to change location of where this is pushed this is temporary
                //need to add when adding a habit, not here
                user.habits.push(habit);
            })
            allHabitNamesDivElement.innerHTML = htmlString;
        }
        const filterRange = (document.querySelector("div#habitsFilterSelect").value !== null) ? "last7" : document.querySelector("div#habitsFilterSelect").value;
        user.habits.forEach(habit => {
            fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${filterRange}`, config)
            .then(json => {
                console.log("going through each habit");
                console.log(json);
                if (json['status'] && json['record'] != undefined) {
                    json['record'].forEach(record => {
                        //onst optionRecord = document.createElement("option");
                        //ptionRecord.setAttribute("value", record['time_of_record']);
                        //ptionRecord.setAttribute("id", "timeRecorded" + record['id'])
                        //ptionRecord.innerText = record['time_of_record'];
                        //llHabitsFilterSelect.appendChild(optionRecord);

                        const box = document.createElement("span");
                        box.setAttribute("class", "boxAll");
                        box.id = "box" + record['id'];
                        colorHabitsDivElement.append(box);

                    })
                    const brElement = document.createElement("br");
                    brElement.id = "habitBr" + habit.id;
                    colorHabitsDivElement.appendChild(brElement);
                }
            })
        })

        console.log(allHabitsDivElement);
    })




}