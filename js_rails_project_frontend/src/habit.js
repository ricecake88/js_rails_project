
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

    get color() {
        return this._color;
    }

    get user() {
        return this._user;
    }

    createHabitNameSpan(habit) {
        console.log(">>>>>createHabitNameSpan");
        let mainHabitSpan = document.createElement("span");
        mainHabitSpan.contentEditable = true;
        mainHabitSpan.setAttribute("id", "habitNameSpan" + habit._id);
        mainHabitSpan.setAttribute("class", "habitNameSpan");
        mainHabitSpan.innerText = habit._name;
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
                'color': document.querySelector("#habitForm select#habitColor").value,
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
                const recordToDelete = document.getElementById(`habitRecordsControl${this._id}`);
                recordToDelete.remove();
                const habitRowToDelete = document.getElementById(`habitRow${this._id}`);
                habitRowToDelete.remove();
                // delete instances from Habit class array
                Habit.all = Habit.all.filter(element => {
                    return element._id != this._id;
                })
            })
    }

    updateHabit(e, habitCell, copiedHabit) {
        e.preventDefault();
        let editConfig = {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this._user.authToken
            },
            body: JSON.stringify({
                'habit_id': copiedHabit._id,
                'name': copiedHabit._name,
                'streak_level': copiedHabit._streak_level,
                'num_for_streak': copiedHabit._num_for_streak,
                'streak_counter': copiedHabit._streak_counter,
                'frequency_mode': copiedHabit._frequency_mode,
                'color': copiedHabit._color,
                'user_id': copiedHabit._user.id
            })
        }
        fetchJSON(`${BACKEND_URL}/habits/${this._id}`, editConfig)
            .then(json => {
                let textAgain = null
                if (habitCell.firstChild.id.includes("habitNameSpan")) {
                    this._name = json['habit']['name'];
                    textAgain = this.createHabitNameSpan(this);
                    habitCell.innerHTML = "";
                    habitCell.appendChild(textAgain);
                } else if (habitCell.firstChild.id.includes("habitFreqModeSpan")) {
                    this._frequency_mode = json['habit']['frequency_mode'];
                    textAgain = this.createHabitFreqSpan(this);
                    habitCell.innerHTML = "";
                    habitCell.appendChild(textAgain);
                } else if (habitCell.firstChild.id.includes("editColorSelect")) {
                    this._color = json['habit']['color'];
                    const textAgain = document.getElementById("editColorBox" + json['habit']['id'])
                    textAgain.style.backgroundColor = this._color;
                    const recordsTD = document.getElementById("recordsTD" + json['habit']['id'])
                    const boxes = recordsTD.getElementsByClassName("boxAll");
                    Array.from(boxes).forEach(function(box) {box.style.backgroundColor = json['habit']['color']});
                }
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
                    const tmpHabit = Object.assign({}, this);
                    tmpHabit._name = document.querySelector("input#habitNameSpan" + this._id).value;
                    this.updateHabit(e, habitCell, tmpHabit);
                }
                inputElement.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        const tmpHabit = Object.assign({}, this);
                        tmpHabit._name = document.querySelector("input#habitNameSpan" + this._id).value;
                        this.updateHabit(e, habitCell, tmpHabit);
                    }
                })
                break;
            }
            case `habitFreqModeSpan${this._id}`:{
                let selectElement = document.createElement("select");
                selectElement.setAttribute("value", habit._name);
                selectElement.setAttribute("id", "habitFreqModeSpan" + this._id);
                selectElement.innerHTML =
                `
                    <option value="Everyday">Everyday
                    <option value="Every Other Day">Every Other Day
                `
                habitCell.appendChild(selectElement);

                selectElement.focus();
                selectElement.onblur = (e) => {
                    const tmpHabit = Object.assign({}, habit);
                    tmpHabit._frequency_mode = document.querySelector("select#habitFreqModeSpan" + this._id).value;
                    this.updateHabit(e, habitCell, tmpHabit);
                }
                break;
            }
            default:
                console.log("No Toggle");
                break;

        }
    }

    renderColorSelect(element, habit) {
        // -- Color Box Field -- //
        const colorSelect = document.createElement("select");
        colorSelect.id = "editColorSelect" + habit.id;
        const colors = ["blue", "black", "green", "lightblue", "orange", "pink", "purple", "red", "yellow", "violet"]
        colors.forEach(color => {
            const option = document.createElement("option");
            option.name = color
            option.value = color
            option.innerText = color
            if (color === habit.color) {
                option.setAttribute("selected", "");
            }
            colorSelect.appendChild(option);
        })

        const colorBox = document.createElement("span");
        colorBox.setAttribute("class", "box");
        colorBox.id = "editColorBox" + habit.id;
        colorBox.style.backgroundColor = habit.color;

        element.append(colorSelect, colorBox);
        colorSelect.addEventListener("click", (e) => {
            console.log(e.target);
            e.preventDefault();
            e.target.focus();
            colorBox.style.backgroundColor = colorSelect.value;
            e.target.onblur = (e) => {
                console.log("test");
                const tmpHabit = Object.assign({}, habit);
                tmpHabit._color = colorSelect.value;
                console.log(tmpHabit);
                const progress = document.getElementById("habit7DayProgressDiv" + habit.id);
                const boxes = progress.getElementsByClassName("box");
                Array.from(boxes).forEach(function(box) { box.style.backgroundColor = colorSelect.value});
                this.updateHabit(e, element, tmpHabit);
            }
        });

    }

    renderHabit2() {
        console.log(">>>renderHabit2()");

        const habitTable = document.querySelector("table#habitTable");

        // ---- Row where main details for habits are ---//
        const firstHabitRow = document.createElement("tr");
        firstHabitRow.setAttribute("class", "habit-row");
        firstHabitRow.setAttribute("id", "habitRow" + this._id);

            //--- div element to show delete button --//
            const habitRemoveTD = document.createElement("td");
            habitRemoveTD.setAttribute("class", "X");

                // -- delete button --//
                const habitRemoveDeleteBtn = document.createElement("button");
                habitRemoveDeleteBtn.setAttribute("class", "btn-delete");
                habitRemoveDeleteBtn.id = "habitDeleteBtn" + this._id;
                habitRemoveDeleteBtn.innerText = "X";

                habitRemoveTD.appendChild(habitRemoveDeleteBtn)

            //-- Habit Name Cell, editable?--//
            const habitNameTD = document.createElement("td");
            habitNameTD.setAttribute("class", "habit-name");
            habitNameTD.setAttribute("id", "habitNameDiv" + this._id);

                // --- Name Field -- //
                const mainHabitSpan = this.createHabitNameSpan(this);

            habitNameTD.appendChild(mainHabitSpan);

            // -- Habit Color Cell ----//
            const colorChoiceTD = document.createElement("td");
            colorChoiceTD.setAttribute("class", "habit-color");
            colorChoiceTD.setAttribute("id", "chooseColor" + this._id);

                /* // -- Color Box Field -- //
                const colorSelect = document.createElement("select");
                const colors = ["blue", "black", "green", "lightblue", "orange", "pink", "purple", "red", "yellow", "violet"]
                colors.forEach(color => {
                    const option = document.createElement("option");
                    option.name = color
                    option.value = color
                    option.innerText = color
                    if (color === this._color) {
                        option.setAttribute("selected", "");
                    }
                    colorSelect.appendChild(option);
                })

                const colorBox = document.createElement("span");
                colorBox.setAttribute("class", "box");
                colorBox.style.backgroundColor = this._color; */

            this.renderColorSelect(colorChoiceTD, this);
            //renderColorOptions(colorSelect, this);
            // colorChoiceTD.append(colorSelect, colorBox);

            // -- Goal/Frequency Mode Div -- //
            const mainHabitFreqTD = document.createElement("td");
            mainHabitFreqTD.setAttribute("class", "habit-cell");
            mainHabitFreqTD.setAttribute("id", "freqCell" + this._id);

                //-- Goal/Frequency Span Element -- //
                const mainHabitFreqSpan = this.createHabitFreqSpan(this); // TO-DO: why isn't the sameas createHabitNameSpan?? - same method possible?
                mainHabitFreqSpan.innerText = this._frequency_mode;

                mainHabitFreqTD.appendChild(mainHabitFreqSpan);

            // -- Progress from Last Week -- //
            const sevenDayProgressTD = document.createElement("td");
            sevenDayProgressTD.setAttribute("class", "habit-progress");
            sevenDayProgressTD.setAttribute("id", "habit7DayProgressDiv" + this._id);


            // -- Cell that Contains Logging a Record and Deleting a Record --//
            const logAndDeleteHabitRecordTD = document.createElement("td");
            logAndDeleteHabitRecordTD.setAttribute("class", "habit-cell");
            logAndDeleteHabitRecordTD.setAttribute("id", "logDeleteHR" + this._id);

                const logRecordSpan = document.createElement("span");
                logRecordSpan.setAttribute("class", "material-icons-outlined mdIcon");
                logRecordSpan.innerText = "add";
                logRecordSpan.setAttribute("id", "logRecordSpan" + this._id);
                logRecordSpan.addEventListener("click", (event) => {
                    event.preventDefault();
                    document.getElementById("habitRecordsSubmitCell" + this._id).style.visibility = "visible";
                    document.getElementById("habitRecordsSubmitCell" + this._id).style.display = "block";
                    document.getElementById("habitRecordsRemoveDateCell" + this._id).style.visibility = "hidden";
                    document.getElementById("habitRecordsRemoveDateCell" + this._id).style.display = "none";
                })

                const slash = document.createElement("span");
                slash.innerText = "/";

                const removeRecordSpan = document.createElement("span");
                removeRecordSpan.setAttribute("class", "material-icons-outlined mdIcon");
                removeRecordSpan.innerText = "remove";
                removeRecordSpan.id = "removeRecordSpan" + this._id;
                removeRecordSpan.addEventListener("click", (event) => {
                    event.preventDefault();
                    document.getElementById("habitRecordsRemoveDateCell" + this._id).style.visibility = "visible";
                    document.getElementById("habitRecordsRemoveDateCell" + this._id).style.display = "block";
                    document.getElementById("habitRecordsSubmitCell" + this._id).style.visibility = "hidden";
                    document.getElementById("habitRecordsSubmitCell" + this._id).style.display = "none";
                })

            logAndDeleteHabitRecordTD.append(logRecordSpan, slash, removeRecordSpan);

        // ---- add listeners for elements in row one ----------//
        logAndDeleteHabitRecordTD.addEventListener("click", toggleRecordsControl2);
        habitRemoveDeleteBtn.addEventListener("click", this.deleteHabit.bind(this));
        habitRemoveDeleteBtn.addEventListener("click", renderAllHabits(this._user));
        firstHabitRow.append(habitRemoveTD, habitNameTD, colorChoiceTD, mainHabitFreqTD, sevenDayProgressTD, logAndDeleteHabitRecordTD);



        // -------------------- second row  -------------------//
        //const secondHabitRow = document.createElement("div");
        //secondHabitRow.setAttribute("class", "habit-row");
        //secondHabitRow.setAttribute("id", "habitRecordsControl" + this._id)
        //secondHabitRow.style.visibility = "hidden";
        //secondHabitRow.style.display = "none";

        const secondHabitRow = document.createElement("tr");
        //secondHabitRow.setAttribute("class", "habit-row");
        secondHabitRow.setAttribute("id", "habitRecordsControl" + this._id)
        secondHabitRow.style.visibility = "hidden";
        secondHabitRow.style.display = "none";

        //--cell with to submit a record and remove a record --//
        const habitRecordsControlTD = document.createElement("td");
        habitRecordsControlTD.setAttribute("class", "habit-cell");
        habitRecordsControlTD.id = "habitRecordSubmitDateCell" + this._id;
        habitRecordsControlTD.setAttribute("colspan", "6");

            const habitRecordsSubmitDateToggleCell = document.createElement("div");
            habitRecordsSubmitDateToggleCell.id = "habitRecordsSubmitCell" + this._id;
            habitRecordsSubmitDateToggleCell.style.visibility = "visible";
            //habitRecordsSubmitDateToggleCell.style.display = "none";

                //-- input element to enter a date --//
                const habitRecordsSubmitDateInput = document.createElement("input");
                habitRecordsSubmitDateInput.type = "date";
                habitRecordsSubmitDateInput.id = "habitRecordDateInput" + this._id;

                const habitRecordsSubmitDateBtn = document.createElement("button");
                habitRecordsSubmitDateBtn.id = 'submitRecHabit' + this._id;
                habitRecordsSubmitDateBtn.value = "submit";
                habitRecordsSubmitDateBtn.name = "submit";
                habitRecordsSubmitDateBtn.innerText = "submit";

            habitRecordsSubmitDateToggleCell.append(habitRecordsSubmitDateInput, habitRecordsSubmitDateBtn);

            const habitRecordsRemoveDateToggleCell = document.createElement("div");
            habitRecordsRemoveDateToggleCell.id = "habitRecordsRemoveDateCell" + this._id;
            habitRecordsRemoveDateToggleCell.style.visibility = "visible";
            //habitRecordsRemoveDateToggleCell.style.display = "none";

                //--filter record elements --//
                const habitRecordsToRemoveSelect = document.createElement("select");
                habitRecordsToRemoveSelect.setAttribute("display", "inline");
                habitRecordsToRemoveSelect.setAttribute("name", "habitFilterRecordsToRemove");
                habitRecordsToRemoveSelect.setAttribute("id", "habitFilterRecordsToRemove" + this._id);
                habitRecordsToRemoveSelect.innerHTML =
                    `
                    <option value="" disabled>Choose Range of Records
                    <option name="last7" value="last7" selected>Last Seven Days
                    <option name="currentMonth" value="currentMonth">Current Month
                    <option name="lastMonth" value="lastMonth">Last Month
                    <option name="currentYear" value="currentYear">Current Year
                    <option name="lastYear" value="lastYear">Last Year
                `

                //--records to remove --//
                const habitEditRecordsSelect = document.createElement("select");
                habitEditRecordsSelect.setAttribute("display", "inline");
                habitEditRecordsSelect.setAttribute("name", "habitEditRecord");
                habitEditRecordsSelect.setAttribute("id", "habitEditRecord" + this._id);

                const habitRemoveRecordsBtn = document.createElement("button");
                habitRemoveRecordsBtn.setAttribute("value", "Remove");
                habitRemoveRecordsBtn.setAttribute("name", "Remove");
                habitRemoveRecordsBtn.innerText = "Remove";

            habitRecordsRemoveDateToggleCell.append(habitRecordsToRemoveSelect, habitEditRecordsSelect, habitRemoveRecordsBtn);

        // THIS WILL ADD ALL RECORDS IN -- AND CREATE NEW INSTANCES
        // MIGHT NEED TO USE THIS TO JUST ADD ALL NEW INSTANCES
        HabitRecord.handleHabitRecords(this);

        habitRecordsControlTD.append(habitRecordsSubmitDateToggleCell);
        habitRecordsControlTD.append(habitRecordsRemoveDateToggleCell);
        secondHabitRow.appendChild(habitRecordsControlTD);

        habitTable.appendChild(firstHabitRow);
        habitTable.appendChild(secondHabitRow);

        habitRecordsSubmitDateBtn.addEventListener("click", () => {
            HabitRecord.handleNewRecord(this);
        })
        habitRemoveRecordsBtn.addEventListener("click", () => {
            console.log("Remove Records Clicked");
            const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + this.id);
            const all = habitEditRecordsSelect.querySelectorAll("option");
            const recordElement = Array.from(all).find(option => {
                return option.value == habitEditRecordsSelect.value;
            })
            HabitRecord.handleDeleteRecord(recordElement);
        });
         habitRecordsToRemoveSelect.addEventListener("change", () => {
            const habitEditRecordsSelect = document.getElementById("habitEditRecord" + this._id);
            const config = HabitRecord.createGetRecordsConfig(this);
            // check if No Records exist
            //DISPLAY BASED ON RANGE ONLY, DO NOT MODIFY DATABASES OR CLASS INSTANCES
            fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this._id}&range=${habitRecordsToRemoveSelect.value}`, config)
            .then(json => {
                if (json['status']) {
                    habitEditRecordsSelect.innerHTML = "";
                    //debugger
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

        const habitForm = document.createElement("form");
        habitForm.name = "habitForm";
        habitForm.id = "habitForm";

        const habitNameLabel = document.createElement("label");
        habitNameLabel.innerText = "Habit: ";
        const habitNameInput = document.createElement("input");
        habitNameInput.id = "habitName"
        habitNameInput.type = "text";
        habitNameInput.placeholder = "Enter a habit";

        const frequencyLabel = document.createElement("label");
        frequencyLabel.innerText = "Goal: "
        const frequencySelect = document.createElement("select");
        frequencySelect.id = "frequency";
        const goals = ["Everyday", "Every Other Day"];
        goals.forEach(goal => {
            const optionElement = document.createElement("option");
            optionElement.value = goal;
            optionElement.name = goal;
            optionElement.innerText = goal;
            frequencySelect.appendChild(optionElement);
        })

        const streakLevelLabel = document.createElement("label");
        streakLevelLabel.innerText = "Streak Level: "
        const streakLevelSelect = document.createElement("select");
        streakLevelSelect.id = "streakLevel";
        const streakLevels = ["Easy", "Medium", "Hard"];
        // CAN REDUCE THIS IF NEEDED - TO SEPARATE FUNCTION
        streakLevels.forEach(streakLevel => {
            const optionElement = document.createElement("option");
            optionElement.value = streakLevel;
            optionElement.name = streakLevel;
            optionElement.innerText = streakLevel;
            streakLevelSelect.appendChild(optionElement);
        })

        const habitColorLabel = document.createElement("label");
        habitColorLabel.innerText = "Color: "
        const habitColorSelect = document.createElement("select");
        habitColorSelect.id = "habitColor";
        const colors = ["blue", "black", "green", "lightblue", "orange", "pink", "purple", "red", "yellow", "violet"]
        colors.forEach(color => {
            const option = document.createElement("option");
            option.name = color
            option.value = color
            option.innerText = color
            if (color === "pink") {
                option.setAttribute("selected", "");
            }
            habitColorSelect.appendChild(option);
        })

        const colorChoice = document.createElement("span");
        colorChoice.id = "colorChoice";
        colorChoice.setAttribute("class", "box");
        colorChoice.style.backgroundColor = "pink";

        habitColorSelect.addEventListener("change", function(event) {
            event.preventDefault();
            document.getElementById("colorChoice").style.backgroundColor = document.getElementById("habitColor").value;
        })

        const submitHabit = document.createElement("button");
        submitHabit.type = "submit";
        submitHabit.value = "submitNewHabit";
        submitHabit.name = "submitNewHabit";
        submitHabit.innerText = "Add";


        habitForm.append(habitNameLabel, habitNameInput);
        habitForm.append(frequencyLabel, frequencySelect);
        habitForm.append(streakLevelLabel, streakLevelSelect);
        habitForm.append(habitColorLabel, habitColorSelect, colorChoice);
        habitForm.appendChild(submitHabit);
        userAreaElement.append(habitForm);
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
                createdHabit.renderHabit2();
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
                Habit.renderHabits2(json, user);
            })
    }

    static renderHabits2(json, user) {
        console.log(">>>>>renderHabits2");
        const message = document.querySelector("div#message");

        renderHabitControlHead();

        if ((json['status'] == true) && (json['habits'])) {
            json['habits'].forEach(x => {
                let habit = new Habit(x.id, x.name, x.frequency_mode, x.num_for_streak, x.streak_counter,
                    x.streak_level, x.color, user);
                habit.renderHabit2(user);
            })
        } else {
            if (json['message']) {
                message.innerText = json['message'];
                document.querySelector("div#error") = '';
            }
        }
    } //end renderHabits
}


function toggleRecordsControl2(e) {

    console.log(e.target);
    e.preventDefault();
    const regex = /[0-9]+/;
    let id = e.target.id.match(regex)[0];

    let habitShowRow = document.getElementById("habitRecordsControl" + id);
    if (habitShowRow.style.visibility == "hidden") {
        habitShowRow.style.visibility = "visible";
        habitShowRow.style.display = 'table-row'
    } else {
        habitShowRow.style.visibility = "hidden";
        habitShowRow.style.display = 'none';
    }
}

function toggleRecordsControl(e) {

    console.log(e.target);
    e.preventDefault();
    const regex = /[0-9]+/;
    let id = e.target.id.match(regex)[0];
    let habitShowRow = document.getElementById("habitRecordsControl" + id);
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
    showHabits(user);
}

function showHabits(user) {
    console.log("showHabits");

    let config = user.createAuthConfig(user.authToken);
    const range = document.querySelectorAll("select").forEach(function(select) {
        return select.id.includes("selectFilterHabits");
    })
    const habitTableElement = document.getElementById("allHabitsTable");
    habitTableElement.innerHTML = "";
    fetchJSON(`${BACKEND_URL}/habits`, config)
    .then(json => {
        if (json['status'] && json['habits'] != undefined) {
            json['habits'].forEach(habit => {
                const habitRowElement = document.createElement("tr");
                const habitNameTD = document.createElement("td");
                const recordsTD = document.createElement("td");
                const habitSpanElement = document.createElement("span");

                habitRowElement.setAttribute("class", "habit-row");
                habitRowElement.setAttribute("id", "allHabitRow" + habit.id)
                habitSpanElement.setAttribute("class", "habit-cell");
                habitSpanElement.innerText = habit.name;
                recordsTD.id = "recordsTD" + habit.id;
                habitNameTD.appendChild(habitSpanElement);
                habitRowElement.append(habitNameTD, recordsTD);
                habitTableElement.append(habitRowElement);
                user.habits.push(habit);


                let config = user.createAuthConfig(user.authToken);

                const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
                        document.querySelector("select#selectFilterHabits").value;

                console.log(habit.id);
                    fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${filterRange}`, config)
                    .then(json => {
                        console.log("going through each habit");
                        console.log(json);
                        if (json['status'] && json['record'] != undefined) {
                            json['record'].forEach(record => {
                                const box = document.createElement("span");
                                box.setAttribute("class", "boxAll");
                                box.id = "box" + record['id'];
                                console.log(habit.color);
                                box.style.backgroundColor = habit.color;
                                recordsTD.append(box);
                            })
                            habitRowElement.appendChild(recordsTD);
                        }
                    })

            })


        }
    })
}

function getFilteredHabitRecords(user, habit) {
    let config = user.createAuthConfig(user.authToken);

    const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
            document.querySelector("select#selectFilterHabits").value;

    console.log(habit.id);
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
                    box.style.backgroundColor = habit.color;
                    recordsElement.append(box);
                })
                const allHabitsDivElement = document.getElementById("allHabits");
                const habitRowElement = document.getElementById("allHabitRow" + habit.id);
                console.log(allHabitsDivElement);
                console.log(habitRowElement);
                habitRowElement.appendChild(recordsElement);
            }
        })

}

function renderAllHabits(user) {
    console.log("renderAllHabits!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const allHabitsDivElement = document.getElementById("allHabits");
    allHabitsDivElement.innerHTML = "";

    const allHabitsFilterDiv = document.createElement("div");

        const allHabitsFilterSelect = document.createElement("select");
        allHabitsFilterSelect.id = "selectFilterHabits";
        allHabitsFilterSelect.innerHTML =
        `
        <option value="" disable selected>Filter Range
        <option name="last7" value="last7" selected>Last Seven Days
        <option name="lastMonth" value="lastMonth">Last Month
        <option name="currentMonth" value="currentMonth">Current Month
        <option name="currentYear" value="currentYear">Current Year
        <option name="lastYear" value="lastYear">Last Year
        `
        const allHabitsFilterSubmit = document.createElement("button");
        allHabitsFilterSubmit.setAttribute("class", "filterHabits");
        allHabitsFilterSubmit.value = "filterHabits";
        allHabitsFilterSubmit.name = "filterHabits";
        allHabitsFilterSubmit.innerText = "Filter";
        allHabitsFilterSubmit.addEventListener("click", function (e) { filterHabitRecords(e, user) });

    allHabitsFilterDiv.appendChild(allHabitsFilterSelect);
    allHabitsFilterDiv.appendChild(allHabitsFilterSubmit);

    allHabitsDivElement.appendChild(allHabitsFilterDiv);

    const allHabitNamesTableElement = document.createElement("table");
    allHabitNamesTableElement.setAttribute("id", "allHabitsTable");

    allHabitsDivElement.appendChild(allHabitNamesTableElement);

    showHabits(user);




}