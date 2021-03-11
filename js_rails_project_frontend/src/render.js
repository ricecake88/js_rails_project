/* display the header for habit table */
function renderHabitControlHead() {
    const habitTable = document.querySelector("table#habitTable");
    const headRow = document.createElement("tr")
    headRow.setAttribute("id", "headRow");

    const headerNames = {
        "deleteHeadCell": "Delete a Habit",
        "nameHeadCell": "Habit",
        "colorHeadCell": "Represented Color",
        "goalHeadcell": "Goal",
        "last7HeadCell": "Last 7 Days",
        "recordHeadCell": "Log / Remove"
    }
    Object.entries(headerNames).forEach(function([key, value]) {
        const node = document.createElement("th");
        node.id = key;
        node.innerText = value;
        headRow.appendChild(node);
    })
    habitTable.append(headRow);
}

// ------------- for the summary -------------------//
/* show and display the records based on time range */
function filterHabitRecords(e, user) {
    e.preventDefault();
    handleHabitSummary(user);
}

/* get all the habits and then render the habits */
function handleHabitSummary(user) {
    Habit.getHabits(user).then(json => renderHabitSummaryRow(user, json));
}

/* if habits are returned create a row for each table */
function renderHabitSummaryRow(user, json) {
    const habitTableElement = document.getElementById("allHabitsTable");
    habitTableElement.innerHTML = "";
    if (json['status'] && json['habits'] != undefined) {
        json['habits'].forEach(habit => {
            const habitRowElement = document.createElement("tr");
            const habitNameTD = document.createElement("td");
            const recordsTotalTD = document.createElement("td");
            const recordsTD = document.createElement("td");
            const habitSpanElement = document.createElement("span");

            habitRowElement.setAttribute("class", "habit-row");
            habitRowElement.setAttribute("id", "allHabitRow" + habit.id)
            recordsTotalTD.id = "recordsTotalTD" + habit.id;
            recordsTD.id = "recordsTD" + habit.id;
            habitSpanElement.setAttribute("class", "habit-cell");
            habitSpanElement.innerText = habit.name;

            habitNameTD.appendChild(habitSpanElement);
            habitRowElement.append(habitNameTD, recordsTotalTD, recordsTD);
            habitTableElement.append(habitRowElement);
            user.habits.push(habit);

            // display records related to habit
            handleFilteredSummaryRecords(habit);
        })
    }

}

/* retrieve the records based on the time range and the habit related to the record */
function handleFilteredSummaryRecords(habit) {
    // retrieve records related to a habit if habits exist
    if (Habit.all.length !== 0) {

        // search for instance in Habit.all
        const matchedHabit = Habit.all.find(h => h.id === habit['id']);

        // select range in record select drop down, or if there is none selected, default to the last 7 days
        const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
            document.querySelector("select#selectFilterHabits").value;

        // filter records based on select time range, then display them
        HabitRecord.getFilteredRecords(filterRange, matchedHabit).then(json => renderFilteredRecords(json, matchedHabit));
    }
}

/* display the records based on the selected range */
function renderFilteredRecords(json, habit) {

    /* if table summary has not been rendered yet avoid throwing an error */
    if (document.getElementById("allHabitRow" + habit.id) !== null) {

        // reset the records cell and render each record as a form of a box
        const recordsTD = document.getElementById("recordsTD" + habit.id);
        recordsTD.innerHTML = "";
        if (json['status'] && json['records'] != undefined) {
            json['records'].forEach(record => {
                const box = document.createElement("span");
                box.setAttribute("class", "boxAll");
                box.id = "box" + record['id'];
                box.style.backgroundColor = habit.color;
                recordsTD.append(box);
            })

            // display the total number of records related to query
            document.getElementById("recordsTotalTD" + habit.id).innerText = json['records'].length;
        }
    }

}

/* renders the header select element and event listener for the habit summary */
function renderHabitsSummarySelect(user) {
    const allHabitsFilterDiv = document.createElement("allHabitsFilterDiv");

        const logSummaryHeading = document.createElement("h3");
        logSummaryHeading.innerText = "Habit History";

        const allHabitsFilterSelect = document.createElement("select");
        allHabitsFilterSelect.id = "selectFilterHabits";
        allHabitsFilterSelect.innerHTML =
        `
        <option value="" disabled selected>Filter Range
        <option name="last7" value="last7" selected>Last Seven Days
        <option name="lastMonth" value="lastMonth">Last Month
        <option name="currentMonth" value="currentMonth">Current Month
        <option name="currentYear" value="currentYear">Current Year
        <option name="lastYear" value="lastYear">Last Year
        `

        // Update the records view based on the selected range
        allHabitsFilterSelect.addEventListener("click", e => {
                filterHabitRecords(e, user);
        })
        allHabitsFilterDiv.append(logSummaryHeading, allHabitsFilterSelect);

    return allHabitsFilterDiv;
}

/* render the entire summary overview for all the habits */
function renderHabitSummary(user) {
    const allHabitsDivElement = document.getElementById("allHabits");
    allHabitsDivElement.innerHTML = "";

    // display the table if Habit.all is not empty, otherwise don't show
    if (Habit.all.length !== 0) {
        const allHabitsFilterDiv = renderHabitsSummarySelect(user);

        allHabitsDivElement.appendChild(allHabitsFilterDiv);

        const allHabitNamesTableElement = document.createElement("table");
        allHabitNamesTableElement.setAttribute("id", "allHabitsTable");

        allHabitsDivElement.appendChild(allHabitNamesTableElement);

        handleHabitSummary(user);
    }
}