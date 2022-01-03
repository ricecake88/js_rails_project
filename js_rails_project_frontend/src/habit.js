
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

    set id(num) {
        this._id = num;
    }

    get color() {
        return this._color;
    }

    get user() {
        return this._user;
    }

    /* called from main page to get all habits
    to display */
    static handleHabits(user) {
        Habit.getHabits(user).then(json => this.renderHabits(json, user))
    }

    /* send request to server to retrieve habits for user */
    static getHabits(user) {
        return fetchJSON(`${BACKEND_URL}/habits`, user.createAuthConfig(user.authToken))
        .then(json => json);
    }

    /* render all habits retrieved from server */
    static renderHabits(json, user) {
        if ((json['status'] == true) && (json['habits'])) {
            if (json['habits'].length !== 0) {
                renderHabitControlHead();
                json['habits'].forEach(habit => {
                    const newHabit = new Habit(habit.id, habit.name, habit.frequency_mode, habit.num_for_streak, habit.streak_counter,
                        habit.streak_level, habit.color, user);
                    newHabit.renderHabit("get");

                    // initialize and fill up HabitRecord with records related to habit
                    HabitRecord.handleAllRecords(newHabit);

                    // render drop down menu to filter out records to remove
                    newHabit.handleSelectedRecords();

                    // render the record boxes to display last 7 days
                    newHabit.handle7DayRecords();
                })
            }
        } else {
            displayError(json['errors']);
        }
    } //end renderHabits

    /* create cfg to retrieve habits */
    createCfgGetAuth() {
        return {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this._user.authToken
            },
        }
    }

    /* render form to add habit */
    static renderAddHabitForm() {
        const userAreaElement = document.getElementById("user");
        userAreaElement.innerHTML = "";

        const addHeader = document.createElement("h3");
        addHeader.innerText = "Add a Habit";

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
        // TO-DO: CAN REDUCE THIS IF NEEDED - TO SEPARATE FUNCTION
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
        colorChoice.style.marginRight = "10px";

        /* change color box to match selected color */
        habitColorSelect.addEventListener("change", function(event) {
            event.preventDefault();
            document.getElementById("colorChoice").style.backgroundColor = document.getElementById("habitColor").value;
        })

        const submitHabit = document.createElement("button");
        submitHabit.type = "submit";
        submitHabit.value = "submitNewHabit";
        submitHabit.name = "submitNewHabit";
        submitHabit.innerText = "Add";

        habitForm.appendChild(addHeader);
        habitForm.append(habitNameLabel, habitNameInput);
        habitForm.append(frequencyLabel, frequencySelect);
        habitForm.append(streakLevelLabel, streakLevelSelect);
        habitForm.append(habitColorLabel, habitColorSelect, colorChoice);
        habitForm.appendChild(submitHabit);
        userAreaElement.append(habitForm);
    } // end renderAddHabitForm

    /* create config to add a habit */
    static createCfgPost(user) {
        /* STRETCH GOAL: NEED TO CHANGE HABIT_CONTROLLER TO HANDLE NUM FOR STREAK BASED ON STREAK LEVEL */
        return {
            method: 'POST',
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
                'num_for_streak': 7, /* STRETCH GOAL: DONT'T SET THIS WHEN PASSING THROUGH, DON'T PASS THROUGH
                            - TO DEAL WITH STREAK LEVELS */
                'color': document.querySelector("#habitForm select#habitColor").value,
                'user_id': user.id
            })
        };
    }

    /* event listener method when adding Habit */
    static handleAddHabit(user) {
        this.postHabit(user).then(json => this.handleNewHabit(json, user));
    }

    /* POST request to server to create a new Habit */
    static postHabit(user) {
        return fetchJSON(`${BACKEND_URL}/habits`, Habit.createCfgPost(user))
        .then(json => json);
    }

    /* create new instance of Habit and handle rendering of new habit */
    static handleNewHabit(json, user) {
        if (json['status'] == true) {

            // clear any errors that are displayed
            clearError();

            // clear habit name field
            document.querySelector("#habitForm input#habitName").value = "";

            // if no habits
            if (this.all.length === 0) {
                renderHabitControlHead();
            }

            // create new Habit in all Habits
            const createdHabit = new Habit(json['habit']['id'],
                json['habit']['name'],
                json['habit']['frequency_mode'],
                json['habit']['num_for_streak'],
                json['habit']['streak_counter'],
                json['habit']['streak_level'],
                json['habit']['color'],
                user);

            // render habit
            createdHabit.renderHabit("add");
        } else {
            document.getElementById("error").innerText = json['errors'];
        }
    }

    /* retrieve 7 day records and then render the records as boxes */
    handle7DayRecords() {
        HabitRecord.getFilteredRecords("last7", this).then(json => HabitRecord.render7DayProgress(json, this))
    }

    /* retrieve records based on select range and then render the selection of records */
    handleSelectedRecords() {
        const habitRemoveRecordsSelect = document.getElementById("habitRemoveRecord" + this._id);
        const range = document.getElementById("habitFilterRecordsToRemove" + this._id).value;
        if (range === undefined) range = "last7";
        HabitRecord.getFilteredRecords(range, this).then(json => HabitRecord.renderSelectRecords(json, habitRemoveRecordsSelect))
    }

    /* create config to update a habit */
    createCfgPatch(updatedHabit) {
        return {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + updatedHabit._user.authToken
            },
            body: JSON.stringify({
                'habit_id': updatedHabit._id,
                'name': updatedHabit._name,
                'streak_level': updatedHabit._streak_level,
                'num_for_streak': updatedHabit._num_for_streak,
                'streak_counter': updatedHabit._streak_counter,
                'frequency_mode': updatedHabit._frequency_mode,
                'color': updatedHabit._color,
                'user_id': updatedHabit._user.id
            })
        }
    }

    /* method that is called when user tries to modify a habit */
    handleUpdatedHabit(habitCell, copiedHabit) {
        this.patchHabit(copiedHabit).then(json => this.renderUpdatedHabit(habitCell, json))
    }

    /* send patch request to server to modify a changed field of habit */
    patchHabit(copiedHabit) {
        return fetchJSON(`${BACKEND_URL}/habits/${this._id}`, this.createCfgPatch(copiedHabit))
        .then(json => json);
    }

    /* render the updated field or display an error if there is an error in modifying habit
        and also updates the habit instance */
    renderUpdatedHabit(habitCell, json) {
        if (json['status']) {
            let originalSpanElement = null;

            if (habitCell.firstChild.id.includes("habitNameSpan")) {

                // render the original text field with modified habit name
                // and update the instance with entered name
                this._name = json['habit']['name'];
                originalSpanElement = this.createEditableSpanElement("habitNameSpan", this._name);
                habitCell.innerHTML = "";
                habitCell.appendChild(originalSpanElement);

            } else if (habitCell.firstChild.id.includes("habitFreqModeSpan")) {

                // render text field with modified frequency mode / goal of habit
                // and update the instance with selected goal
                this._frequency_mode = json['habit']['frequency_mode'];
                originalSpanElement = this.createEditableSpanElement("habitFreqModeSpan", this._frequency_mode);
                habitCell.innerHTML = "";
                habitCell.appendChild(originalSpanElement);

            } else if (habitCell.firstChild.id.includes("editColorSelect")) {

                // update instance with color selected
                this._color = json['habit']['color'];
                originalSpanElement = document.getElementById("editColorBox" + json['habit']['id'])

                // render the 7 day progress cell with updated color
                this.handle7DayRecords();

                // update the summary with the updated summary
                renderHabitSummary(this._user);
            }
            clearError();
        } else {
            displayError(json['errors'])
        }
    }

    /* changes from a text field to an input or select field when user wants to edit a habit
        depending on field being modified */
    renderToggleEdit(e) {
        e.preventDefault();
        const habitCell = e.target.parentNode;
        habitCell.innerHTML = "";
        const swapElement = (typeOfElement, name) =>{
            let element = document.createElement(typeOfElement);
            element.setAttribute("value", this._name);
            element.setAttribute("id", name + this._id);
            habitCell.appendChild(element);
            return element;
        }
        const onBlurElement = (e, typeOfElement, name) => {
            const copyOfHabit = Object.assign({}, this);
            if (name === "habitNameSpan")
                copyOfHabit._name = document.querySelector(`${typeOfElement}#${name}` + this._id).value;
            else
                copyOfHabit._frequency_mode = document.querySelector(`${typeOfElement}#${name}` + this._id).value;
            this.handleUpdatedHabit(habitCell, copyOfHabit)
            renderHabitSummary(this._user);
        }
        switch(e.target.id) {
            case `habitNameSpan${this._id}`: {
                const inputElement = swapElement("input", "habitNameSpan");
                inputElement.focus();
                inputElement.onblur = (e) => {
                    onBlurElement(e, "input", "habitNameSpan");
                }
                inputElement.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        onBlurElement(e, "input", "habitNameSpan");
                    }
                })
                break;
            }
            case `habitFreqModeSpan${this._id}`:{
                const selectElement = swapElement("select", "habitFreqModeSpan");
                selectElement.innerHTML =
                `
                    <option value="Everyday">Everyday
                    <option value="Every Other Day">Every Other Day
                `
                selectElement.focus();
                selectElement.onblur = (e) => {
                    onBlurElement(e, "select", "habitFreqModeSpan");
                }
                break;
            }
            default:
                console.log("No Toggle");
                break;

        }

    }

    /* function that shows the second row to record/log or remove a record depending on which
        was requested */
    renderToggleRecordsControl(e) {
        const id = e.target.id.match(/[0-9]+/)[0];
        const habitShowRow = document.getElementById("habitRecordsControl" + id);
        if (e.target.id.includes("logRecordSpan")) {
                habitShowRow.setAttribute("class", "show");
                document.getElementById("habitRecordsSubmitCell" + id).setAttribute("class", "show");
                document.getElementById("habitRecordsRemoveDateCell" + id).setAttribute("class", "hidden");
        }
        if (e.target.id.includes("removeRecordSpan")) {
                habitShowRow.setAttribute("class", "show");
                document.getElementById("habitRecordsSubmitCell" + id).setAttribute("class", "hidden");
                document.getElementById("habitRecordsRemoveDateCell" + id).setAttribute("class", "show");
        }
    }

    /* create editable span element to edit a habit */
    createEditableSpanElement(name, text) {
        const spanElement = document.createElement("span");
        spanElement.contentEditable = true;
        spanElement.setAttribute("id", name + this._id);
        spanElement.setAttribute("class", name);
        spanElement.innerText = text;
        spanElement.addEventListener("click", (e) => {
            this.renderToggleEdit(e);
        })
        return spanElement;
    }

    /* create config to delete a habit */
    createCfgDelete() {
        return {
            method: 'DELETE',
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

    /* event listener method when deleting a Habit */
    handleDeleteHabit() {
        this.deleteHabit().then(json => this.renderDeletedHabit(json));
    }

    /* DELETE request to server to delete a Habit */
    deleteHabit() {
        return fetchJSON(`${BACKEND_URL}/habits/${this._id}`, this.createCfgDelete())
            .then(json => json)
    }

    /* delete records of deleted habit and remove instance from all Habits
     and update page based on deleted habit */
    renderDeletedHabit(json) {
        if (json['status']) {
            clearError();

            //remove record row associated with habit
            document.getElementById(`habitRecordsControl${this._id}`).remove();

            //remove main habit row
            document.getElementById(`habitRow${this._id}`).remove();

            // delete habit from all instances of Habit
            const habit_removed = Habit.all.splice(Habit.all.indexOf(this), 1);

            this._user.habits = this._user.habits.filter(habit => {
                return habit.id === habit_removed._id })

            // delete all records associated with instance of deleted habit
            HabitRecord.all.filter(record => {
                return record.habit === habit_removed})

            // if no habits
            if (this._user.habits.length === 0) document.getElementById("headRow").remove();

            // render update summary of habits
            renderHabitSummary(this._user);
        } else {
            document.getElementById('error').innerText = json['errors'];
        }

    }

    /* function that renders the select menu for color of habit and shows
    renders all color boxes that show the color */
    renderColorSelect(colorChoiceTD) {
        // -- Color Box Select Field -- //
        const colorSelect = document.createElement("select");
        colorSelect.id = "editColorSelect" + this._id;
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

        // colorBox to show what the color is from the select menu
        const colorBox = document.createElement("span");
        colorBox.setAttribute("class", "box");
        colorBox.id = "editColorBox" + this._id;
        colorBox.style.backgroundColor = this._color;

        colorChoiceTD.append(colorSelect, colorBox);

        // when a color has been selected from the menu,
        // update color of habit and render all related color rendering
        colorSelect.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.focus();
            colorBox.style.backgroundColor = colorSelect.value;
            e.target.onblur = (e) => {
                const copyOfHabit = Object.assign({}, this);
                copyOfHabit._color = colorSelect.value;
                this.handleUpdatedHabit(colorChoiceTD, copyOfHabit);
            }
        });

    }

    /* renders a habit either by logging in or by adding a new habit
        which includes all listeners for elements in the two rows related
        to the habit */
    renderHabit(action) {
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
                const mainHabitSpan = this.createEditableSpanElement("habitNameSpan", this._name);

            habitNameTD.appendChild(mainHabitSpan);

            // -- Habit Color Cell ----//
            const colorChoiceTD = document.createElement("td");
            colorChoiceTD.setAttribute("class", "habit-color");
            colorChoiceTD.setAttribute("id", "chooseColor" + this._id);
            this.renderColorSelect(colorChoiceTD);

            // -- Goal/Frequency Mode Div -- //
            const mainHabitFreqTD = document.createElement("td");
            mainHabitFreqTD.setAttribute("class", "habit-freq");
            mainHabitFreqTD.setAttribute("id", "freqCell" + this._id);

                //-- Goal/Frequency Span Element -- //
                const mainHabitFreqSpan = this.createEditableSpanElement("habitFreqModeSpan", this._frequency_mode);

                mainHabitFreqTD.appendChild(mainHabitFreqSpan);

            // -- Progress from Last Week -- //
            const sevenDayProgressTD = document.createElement("td");
            sevenDayProgressTD.setAttribute("class", "habit-progress");
            sevenDayProgressTD.setAttribute("id", "habit7DayProgressDiv" + this._id);


            // -- Cell that Contains Logging a Record and Deleting a Record --//
            const logAndDeleteHabitRecordTD = document.createElement("td");
            logAndDeleteHabitRecordTD.setAttribute("class", "habit-cell");
            logAndDeleteHabitRecordTD.setAttribute("id", "logDeleteHR" + this._id);

                // "+" element to log a habit
                const logRecordSpan = document.createElement("span");
                logRecordSpan.setAttribute("class", "material-icons-outlined mdIcon");
                logRecordSpan.innerText = "add";
                logRecordSpan.setAttribute("id", "logRecordSpan" + this._id);

                const slash = document.createElement("span");
                slash.innerText = "/";

                // "-" element to remove a log
                const removeRecordSpan = document.createElement("span");
                removeRecordSpan.setAttribute("class", "material-icons-outlined mdIcon");
                removeRecordSpan.innerText = "remove";
                removeRecordSpan.id = "removeRecordSpan" + this._id;

            logAndDeleteHabitRecordTD.append(logRecordSpan, slash, removeRecordSpan);

        firstHabitRow.append(habitRemoveTD, habitNameTD, colorChoiceTD, mainHabitFreqTD, sevenDayProgressTD,
            logAndDeleteHabitRecordTD);

        // -------------------- second row  -------------------//
        const secondHabitRow = document.createElement("tr");
        secondHabitRow.setAttribute("id", "habitRecordsControl" + this._id)
        secondHabitRow.setAttribute("class", "hidden");

        // listens for a click that occurs outside of secondHabitRow and
        // will hide the row if target clicked is not to log or remove a log or
        // within the second row
        window.addEventListener("click", event => {
            if ((!secondHabitRow.contains(event.target)) &&
               ((!event.target.id.includes("logRecordSpan") && (!event.target.id.includes("removeRecordSpan"))))) {
                 if (secondHabitRow.className === "show") {
                    secondHabitRow.setAttribute("class", "hidden");
                    document.getElementById("habitRecordsSubmitCell" + this._id).setAttribute("class", "hidden");
                    document.getElementById("habitRecordsRemoveDateCell" + this._id).setAttribute("class", "hidden");
                    clearError();
                }
            }
        })

            //--cell with to submit a record and remove a record --//
            const habitRecordsControlTD = document.createElement("td");
            habitRecordsControlTD.id = "habitRecordSubmitDateCell" + this._id;
            habitRecordsControlTD.setAttribute("colspan", "6");


                const habitRecordsSubmitDateToggleCell = document.createElement("div");
                habitRecordsSubmitDateToggleCell.id = "habitRecordsSubmitCell" + this._id;
                habitRecordsSubmitDateToggleCell.setAttribute("class", "hidden");


                    //-- input element to enter a date --//
                    const habitRecordsSubmitDateInput = document.createElement("input");
                    habitRecordsSubmitDateInput.type = "date";
                    habitRecordsSubmitDateInput.id = "habitRecordDateInput" + this._id;
                    habitRecordsSubmitDateInput.setAttribute("class", "habitRecordInput");

                    const habitRecordsSubmitDateBtn = document.createElement("button");
                    habitRecordsSubmitDateBtn.id = 'submitRecHabit' + this._id;
                    habitRecordsSubmitDateBtn.value = "submit";
                    habitRecordsSubmitDateBtn.name = "submit";
                    habitRecordsSubmitDateBtn.innerText = "submit";

                habitRecordsSubmitDateToggleCell.append(habitRecordsSubmitDateInput, habitRecordsSubmitDateBtn);

                const habitRecordsRemoveDateToggleCell = document.createElement("div");
                habitRecordsRemoveDateToggleCell.id = "habitRecordsRemoveDateCell" + this._id;
                habitRecordsRemoveDateToggleCell.setAttribute("class", "hidden");


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
                    const habitRemoveRecordsSelect = document.createElement("select");
                    habitRemoveRecordsSelect.setAttribute("display", "inline");
                    habitRemoveRecordsSelect.setAttribute("name", "habitRemoveRecord");
                    habitRemoveRecordsSelect.setAttribute("id", "habitRemoveRecord" + this._id);

                    //-- if action was to add a habit, start off with selection with "no records"
                    if (action === "add") {
                        const optionRecord = document.createElement("option");
                        optionRecord.innerText = "No Records";
                        optionRecord.value = "";
                        optionRecord.setAttribute("disabled", "");
                        optionRecord.setAttribute("selected", "");
                        habitRemoveRecordsSelect.appendChild(optionRecord);
                    }

                    //--button to remove a record --/
                    const habitRemoveRecordsBtn = document.createElement("button");
                    habitRemoveRecordsBtn.setAttribute("value", "Remove");
                    habitRemoveRecordsBtn.setAttribute("name", "Remove");
                    habitRemoveRecordsBtn.innerText = "Remove";

                habitRecordsRemoveDateToggleCell.append(habitRecordsToRemoveSelect, habitRemoveRecordsSelect,
                    habitRemoveRecordsBtn);

           habitRecordsControlTD.append(habitRecordsSubmitDateToggleCell, habitRecordsRemoveDateToggleCell);
        secondHabitRow.appendChild(habitRecordsControlTD);
        habitTable.append(firstHabitRow, secondHabitRow);

        // ---- add event listeners for elements in row one ----------//
        logRecordSpan.addEventListener("click", (event) => { this.renderToggleRecordsControl(event) })
        removeRecordSpan.addEventListener("click", (event) => { this.renderToggleRecordsControl(event) })
        habitRemoveDeleteBtn.addEventListener("click", this.handleDeleteHabit.bind(this));
        habitRemoveDeleteBtn.addEventListener("click", renderHabitSummary(this._user));

        // ---- add event listeners for elements in row two ----------//
        habitRecordsSubmitDateBtn.addEventListener("click", () => {HabitRecord.handleNewRecord(this)})
        habitRemoveRecordsBtn.addEventListener("click", () => {
            const habitRemoveRecordsSelect = document.querySelector("select#habitRemoveRecord" + this.id);
            const allOptions = habitRemoveRecordsSelect.querySelectorAll("option");
            const recordToRemove = Array.from(allOptions).find(option => {
                return option.value == habitRemoveRecordsSelect.value;
            })
            HabitRecord.handleDeleteRecord(recordToRemove);
        });
        habitRecordsToRemoveSelect.addEventListener("change", () => {this.handleSelectedRecords()})

        // ---- clear error messages --- //
        clearError();
    } // end render Habit

}
