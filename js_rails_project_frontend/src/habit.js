
class Habit {
    static all = [];

    constructor(id = -1, name, frequency_mode = "Everyday", num_for_streak = 7, streak_counter = 0,
        streak_level = "easy", color = "pink", user = null) {
        this._id = id;
        this._name = name;
        this._frequency_mode = frequency_mode;
        this._num_for_streak = num_for_streak;
        this._streak_counter = streak_counter;
        this._streak_level = streak_level;
        this._color = color;
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
        let mainHabitSpan = document.createElement("span");
        mainHabitSpan.contentEditable = true;
        mainHabitSpan.setAttribute("id", "habitNameSpan" + habit._id);
        mainHabitSpan.innerText = habit._name;
        console.log(mainHabitSpan);
        mainHabitSpan.addEventListener("dblclick", (e) => {
            habit.toggleEdit(e, habit)
        })
        return mainHabitSpan;
    }

    createHabitFreqSpan(habit) {
        console.log("createHabitFreqSpan")
        let habitFreqModeSpan = document.createElement("span");
        habitFreqModeSpan.contentEditable = true;
        habitFreqModeSpan.setAttribute("id", "habitFreqModeSpan" + habit._id);
        habitFreqModeSpan.innerText = habit._frequency_mode;
        habitFreqModeSpan.addEventListener("dblclick", (e) => {
            habit.toggleEdit(e, habit)}
        )
        return habitFreqModeSpan;
    }

    createHabitColorSpan(habit) {
        console.log("createHabitColorSpan")
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

    updateFreqMode(e, habitCell) {
        e.preventDefault();
        console.log(e.target);
        console.log(this);
        let value = document.querySelector("select#habitFreqModeSpan" + this._id).value;
        let editConfig = {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': this._id,
                'name': this._name,
                'streak_level': this._streak_level,
                'streak_counter': this._streak_counter,
                'frequency_mode': value,
                'user_id': this._user.id
            })
        }
        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, editConfig)
            .then(json => {
                console.log(json);
                this._frequency_mode = json['habit']['frequency_mode'];
                const textAgain = this.createHabitFreqSpan(this);
                habitCell.innerHTML = "";
                habitCell.appendChild(textAgain);
                //value = "";
            })
    }

    updateHabitName(e, habitCell) {
        e.preventDefault();
        let editConfig = {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': this._id,
                'name': document.querySelector("input#habitNameSpan" + this._id).value,
                'streak_level': this._streak_level,
                'num_for_streak': this._num_for_streak,
                'streak_counter': this._streak_counter,
                'frequency_mode': this._frequency_mode,
                'color': this._color,
                'user_id': this._user.id
            })
        }
        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, editConfig)
            .then(json => {
                this._name = json['habit']['name'];
                const textAgain = this.createHabitNameSpan(this);
                habitCell.innerHTML = "";
                habitCell.appendChild(textAgain);
            })
    }

    toggleEdit(e, habit) {
        console.log("Double Click in Toggle Edit");
        e.preventDefault();
        const habitCell = e.target.parentNode;
        habitCell.innerHTML = "";
        switch(e.target.id) {
            case `habitNameSpan${this._id}`: {
                let inputElement = document.createElement("input");
                inputElement.setAttribute("value", this._name);
                inputElement.setAttribute("id", "habitNameSpan" + this._id);
                habitCell.appendChild(inputElement);

                inputElement.focus();
                inputElement.onblur = (e) => {
                    this.updateHabitName(e, habitCell);
                }
                inputElement.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        this.updateHabitName(e, habitCell);
                    }
                })
                console.log(habitCell);
                break;
            }
            case `habitFreqModeSpan${habit._id}`:{
                let selectElement = document.createElement("select");
                selectElement.setAttribute("value", habit._name);
                selectElement.setAttribute("id", "habitFreqModeSpan" + habit._id);
                selectElement.innerHTML =
                `
                    <option value="Everyday">Everyday
                    <option value="Every Other Day">Every Other Day
                `
                habitCell.appendChild(selectElement);

                selectElement.focus();
                selectElement.onblur = (e) => {
                    this.updateFreqMode(e, habitCell);
                }
                console.log(habitCell);
                break;
            }
            default:
                console.log("No Toggle");
                break;

        }
    }

    renderHabit() {
        console.log(">>>renderHabit()")

        const habitTable = document.querySelector("div.habit-table-container");

        // ---- Row where main details for habits are ---//
        const mainHabitRow = document.createElement("div");
        mainHabitRow.setAttribute("class", "habit-row");
        mainHabitRow.setAttribute("id", "habitRow" + this._id);

            const arrowCell = document.createElement("div");
            arrowCell.setAttribute("class", "habit-cell");
            arrowCell.setAttribute("id", "habitArrow" + this._id);

                const arrow = document.createElement("img");
                arrow.src = "http://www.clker.com/cliparts/9/1/9/a/1369857928521711478blue_arrow_down.png";
                arrow.setAttribute("class", "arrow")
                arrowCell.appendChild(arrow);

        //-- Habit Name Cell, editable --//
        let mainHabitCell = document.createElement("div");
        mainHabitCell.setAttribute("class", "habit-cell");
        mainHabitCell.setAttribute("id", "habitCell" + this._id);

            const mainHabitSpan = this.createHabitNameSpan(this);
        mainHabitCell.appendChild(mainHabitSpan);


        let mainHabitFreqCell = document.createElement("div");
        mainHabitFreqCell.setAttribute("class", "habit-cell");
        mainHabitFreqCell.setAttribute("id", "freqCell" + this._id);

        const mainHabitFreqSpan = this.createHabitFreqSpan(this);
        mainHabitFreqSpan.innerText = this._frequency_mode;

        mainHabitFreqCell.appendChild(mainHabitFreqSpan);

        let habitRemove = document.createElement("div");
        habitRemove.setAttribute("class", "habit-cell");

        let habitRemoveDeleteBtn = document.createElement("button");
        habitRemoveDeleteBtn.setAttribute("class", "btn-delete");
        habitRemoveDeleteBtn.id = "habitDeleteBtn" + this._id;
        habitRemoveDeleteBtn.innerText = "X";
        habitRemoveDeleteBtn.addEventListener("click", this.deleteHabit.bind(this));
        habitRemove.appendChild(habitRemoveDeleteBtn);

        mainHabitRow.append(arrowCell, mainHabitCell, mainHabitFreqCell, habitRemove);



        // -------------------- second row  -------------------//
        const habitRecordsRow = document.createElement("div");
        habitRecordsRow.setAttribute("class", "habit-row");
        habitRecordsRow.setAttribute("id", "habitMark" + this._id)
        habitRecordsRow.style.visibility = "hidden";
        habitRecordsRow.style.display = "none";

        //--- empty cell --//
        const habitRecordsEmptyCell = document.createElement("div");
        habitRecordsEmptyCell.setAttribute("class", "habit-cell");

        //--cell with record boxes --//
        const habitRecordBoxesDiv = document.createElement("div");
        habitRecordBoxesDiv.setAttribute("class", "habit-cell");
        habitRecordBoxesDiv.id = "habitRecordBoxes" + this._id;

        //--cell with to submit a record and remove a record --//
        const habitRecordsSubmitDateRecordsCell = document.createElement("div");
        habitRecordsSubmitDateRecordsCell.setAttribute("class", "habit-cell");
        habitRecordsSubmitDateRecordsCell.id = "habitRecordSubmitDateCell" + this._id;

        //-- input element to enter a date --//
        const habitRecordsSubmitDateInput = document.createElement("input");
        habitRecordsSubmitDateInput.type = "date";
        habitRecordsSubmitDateInput.id = "habitRecordDateInput" + this._id;

        const habitRecordsSubmitDateBtn = document.createElement("button");
        habitRecordsSubmitDateBtn.id = 'submitRecHabit' + this._id;
        habitRecordsSubmitDateBtn.value = "submit";
        habitRecordsSubmitDateBtn.name = "submit";
        habitRecordsSubmitDateBtn.innerText = "submit";

        const brElement = document.createElement("br");
        //--filter record elements --//
        const habitRecordsToRemoveSelect = document.createElement("select");
        habitRecordsToRemoveSelect.setAttribute("display", "inline");
        habitRecordsToRemoveSelect.setAttribute("name", "habitFilterRecordsToRemove");
        habitRecordsToRemoveSelect.setAttribute("id", "habitFilterRecordsToRemove" + this._id);
        habitRecordsToRemoveSelect.innerHTML =
        `
            <option value="" disabled selected>Choose Range of Records
            <option name="last7" value="last7">Last Seven Days
            <option name="currentMonth" value="currentMonth">Current Month
            <option name="lastMonth" value="lastMonth">Last Month
            <option name="currentYear" value="currentYear">Current Year
            <option name="lastYear" value="lastYear">Last Year
        `

        //const habitRecordsFilterEmpty = document.createElement("option");
        //habitRecordsFilterEmpty.innerText = "Choose Range of Records";
        //habitRecordsFilterEmpty.value = "";
        //habitRecordsFilterEmpty.setAttribute("disabled", "");
        //habitRecordsFilterEmpty.setAttribute("selected", "");
//
//
        //const habitRecordsFilterLast7Days = document.createElement("option");
        //habitRecordsFilterLast7Days.value = "last7";
        //habitRecordsFilterLast7Days.innerText = "Last 7 Days";
//
        //const habitRecordsFilterCurrentMonth = document.createElement("option")
        //habitRecordsFilterCurrentMonth.value = "currentMonth";
        //habitRecordsFilterCurrentMonth.innerText = "Current Month";
//
        //const habitRecordsFilterLastMonth = document.createElement("option")
        //habitRecordsFilterLastMonth.value = "lastMonth";
        //habitRecordsFilterLastMonth.innerText = "Last Month";
//
        //const habitRecordsFilterCurrentYear = document.createElement("option")
        //habitRecordsFilterCurrentYear.value = "currentYear";
        //habitRecordsFilterCurrentYear.innerText = "Current Year";
//
        //const habitRecordsFilterLastYear = document.createElement("option")
        //habitRecordsFilterLastYear.value = "lastYear";
        //habitRecordsFilterLastYear.innerText = "Last Year"
//
        //habitRecordsToRemoveSelect.append(habitRecordsFilterEmpty,
        //    habitRecordsFilterLast7Days, habitRecordsFilterCurrentMonth,
        //    habitRecordsFilterLastMonth,
        //    habitRecordsFilterCurrentYear, habitRecordsFilterLastYear)


        //--records to remove --//
        const habitEditRecordsSelect = document.createElement("select");
        habitEditRecordsSelect.setAttribute("display", "inline");
        habitEditRecordsSelect.setAttribute("name", "habitEditRecord");
        habitEditRecordsSelect.setAttribute("id", "habitEditRecord" + this._id);

        const habitRemoveRecordsBtn = document.createElement("button");
        habitRemoveRecordsBtn.setAttribute("value", "Remove");
        habitRemoveRecordsBtn.setAttribute("name", "Remove");
        habitRemoveRecordsBtn.innerText = "Remove";

        // THIS WILL ADD ALL RECORDS IN -- AND CREATE NEW INSTANCES
        // MIGHT NEED TO USE THIS TO JUST ADD ALL NEW INSTANCES
        HabitRecord.handleHabitRecords(this);

        habitRecordsRow.append(habitRecordsEmptyCell);
        habitRecordsRow.appendChild(habitRecordBoxesDiv);
        habitRecordsSubmitDateRecordsCell.append(habitRecordsSubmitDateInput, habitRecordsSubmitDateBtn);
        habitRecordsSubmitDateRecordsCell.append(brElement);
        habitRecordsSubmitDateRecordsCell.append(habitRecordsToRemoveSelect, habitEditRecordsSelect, habitRemoveRecordsBtn);
        habitRecordsRow.appendChild(habitRecordsSubmitDateRecordsCell);

        habitTable.appendChild(mainHabitRow);
        habitTable.appendChild(habitRecordsRow);
        arrowCell.addEventListener("click", habitMarkoff);
        habitRecordsSubmitDateBtn.addEventListener("click", () => {
            HabitRecord.handleNewRecord(this);
        })
        habitRemoveRecordsBtn.addEventListener("click", () => {
            console.log("Remove Records Clicked");
            const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + this.id);
            const all = habitEditRecordsSelect.querySelectorAll("option");
            const recordElement = Array.from(all).find(option => {
                return option.value == habitEditRecordsSelect.value;
            }

            )
            HabitRecord.handleDeleteRecord(recordElement);
        });
        habitRecordsToRemoveSelect.addEventListener("change", () => {
            const habitEditRecordsSelect = document.getElementById("habitEditRecord" + this._id);
            const config = HabitRecord.createGetRecordsConfig(this)
            //DISPLAY BASED ON RANGE ONLY, DO NOT MODIFY DATABASES OR CLASS INSTANCES
            fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}&range=${habitRecordsToRemoveSelect.value}`, config)
            .then(json => {
                if (json['status']) {
                    habitEditRecordsSelect.innerHTML = "";
                    if ((json['record'] === undefined) || (json['record'].length === 0)) {
                        const optionRecord = document.createElement("option");
                        optionRecord.innerText = "No Records";
                        optionRecord.value = "";
                        optionRecord.setAttribute("disabled", "");
                        optionRecord.setAttribute("selected", "");
                        habitEditRecordsSelect.appendChild(optionRecord);
                    } else {
                        json['record'].forEach(record => {
                            const optionRecord = document.createElement("option");
                            optionRecord.setAttribute("value", record['time_of_record']);
                            optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                            optionRecord.innerText = record['time_of_record'];
                            habitEditRecordsSelect.appendChild(optionRecord);
                        })
                    }
                }
            });
        })

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

                <label for="habitColor">Habit Color:</label>
                <select name="habitColor" id="habitColor">
                    <option name="pink" value="pink" selected>pink
                    <option name="red" value="red" >red
                    <option name="blue" value="blue">blue
                    <option name="lightblue" value="light blue">light blue
                    <option name="green" value="green">green
                    <option name="black" value="black">black
                    <option name="purple" value="purple">pink
                    <option name="orange" value="orange">orange
                    <option name="yellow" value="yellow">yellow
                    <option name="violet" value="violet">violet
                </select>

                <span class="box" /></span>
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
                    json['habit']['num_for_streak'],
                    json['habit']['streak_counter'],
                    json['habit']['streak_level'],
                    json['habit']['color'],
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
                let habit = new Habit(x.id, x.name, x.frequency_mode, x.num_for_streak, x.streak_counter,
                    x.streak_level, x.color, user);
                habit.renderHabit(user);
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

function filterHabitRecords(e, user) {
    console.log("clicked Filter Submit button");
    console.log(e.target);
    e.preventDefault();
    getAllHabits(user);
}

function getAllHabits(user) {
    console.log("getAllHabits");

    let config = user.createAuthConfig(user.authToken);
    const range = document.querySelectorAll("select").forEach(function(select) {
        return select.id.includes("selectFilterHabits");
    })

    const habitTableElement = document.getElementById("allHabitsTable");
    habitTableElement.innerHTML = "";
    fetchJSON(`${BACKEND_URL}/habits`, config)
    .then(json => {
        console.log("Fetched all habits");
        const pElement = document.createElement("p");
        pElement.id = "test";
        if (json['status'] && json['habits'] != undefined) {
            json['habits'].forEach(habit => {
                const habitRowElement = document.createElement("div");
                habitRowElement.setAttribute("class", "habit-row");
                habitRowElement.setAttribute("id", "allHabitRow" + habit.id)


                const habitSpanElement = document.createElement("span");
                habitSpanElement.setAttribute("class", "habit-cell");
                habitSpanElement.innerText = habit.name;

                habitRowElement.append(habitSpanElement);
                habitTableElement.append(habitRowElement);
                user.habits.push(habit);
                getFilteredHabitRecords(user, habit);

            })


        }
    })
}

function getFilteredHabitRecords(user, habit) {
    let config = user.createAuthConfig(user.authToken);

    const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
            document.querySelector("select#selectFilterHabits").value;
    console.log(filterRange);
    const habitRowElement = document.getElementById("allHabitRow" + habit.id);
        fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${filterRange}`, config)
        .then(json => {
            console.log("going through each habit");
            console.log(json);
            const recordsElement = document.createElement("div");
            recordsElement.setAttribute("class", "habit-cell");

            if (json['status'] && json['record'] != undefined) {
                json['record'].forEach(record => {


                    const box = document.createElement("span");
                    box.setAttribute("class", "boxAll");
                    box.id = "box" + record['id'];
                    recordsElement.append(box);
                })
                habitRowElement.append(recordsElement);
            }
        })

}


function renderAllHabits(user) {
    console.log("renderAllHabits!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const allHabitsDivElement = document.getElementById("allHabits");

    const allHabitsFilterDiv = document.createElement("div");
    const allHabitsFilterSelect = document.createElement("select");
    allHabitsFilterSelect.id = "selectFilterHabits";
    allHabitsFilterSelect.innerHTML =
    `
        <option name="all" value="all">All
        <option name="last7" value="last7" selected>Last Seven Days
        <option name="currentMonth" value="currentMonth">Current Month
        <option name="currentYear" value="currentYear">Current Year
    `

    const allHabitsFilterSubmit = document.createElement("button");
    allHabitsFilterSubmit.setAttribute("class", "filterHabits");
    allHabitsFilterSubmit.value = "filterHabits";
    allHabitsFilterSubmit.name = "filterHabits";
    allHabitsFilterSubmit.innerText = "Filter";
    allHabitsFilterSubmit.addEventListener("click", function(e) { filterHabitRecords(e, user)});

        const allHabitNamesTableElement = document.createElement("div");
        allHabitNamesTableElement.setAttribute("class", "habit-table-container");
        allHabitNamesTableElement.setAttribute("id", "allHabitsTable");

    allHabitsFilterDiv.appendChild(allHabitsFilterSelect);
    allHabitsFilterDiv.appendChild(allHabitsFilterSubmit);
    allHabitsDivElement.appendChild(allHabitsFilterDiv);
    allHabitsDivElement.appendChild(allHabitNamesTableElement);

    getAllHabits(user);




}