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

function filterHabitRecords(e, user) {
    e.preventDefault();
    handleHabitSummary(user);
}

function handleHabitSummary(user) {
    Habit.getHabits(user).then(json => renderHabitSummaryRow(user, json));
}

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

            handleFilteredSummaryHabits(habit);
        })
    }

}

function handleFilteredSummaryHabits(habit) {
    if (Habit.all.length !== 0) {
        const matchedHabit = Habit.all.find(h => h.id === habit['id']);
        const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
            document.querySelector("select#selectFilterHabits").value;
        HabitRecord.getFilteredRecords(filterRange, matchedHabit).then(json => renderFilteredHabits(json, matchedHabit));
    }
}

function renderFilteredHabits(json, habit) {

    /* if table summary has not been rendered yet avoid throwing an error */
    if (document.getElementById("allHabitRow" + habit.id) !== null) {
        const recordsTD = document.getElementById("recordsTD" + habit.id);
        recordsTD.innerHTML = "";
        if (json['status'] && json['record'] != undefined) {
            json['record'].forEach(record => {
                const box = document.createElement("span");
                box.setAttribute("class", "boxAll");
                box.id = "box" + record['id'];
                box.style.backgroundColor = habit.color;
                recordsTD.append(box);
            })
            document.getElementById("recordsTotalTD" + habit.id).innerText = json['record'].length;
            document.getElementById("allHabitRow" + habit.id).appendChild(recordsTD);
        }
    } else {
        console.log("Habit table summary has not been rendered");
    }

}

function renderHabitsSummarySelect(user) {
    const allHabitsFilterDiv = document.createElement("div");

        const logSummaryHeading = document.createElement("h2");
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

        allHabitsFilterSelect.addEventListener("click", e => {
                filterHabitRecords(e, user);
        })
        allHabitsFilterDiv.append(logSummaryHeading, allHabitsFilterSelect);
    return allHabitsFilterDiv;
}

function renderHabitSummary(user) {
    const allHabitsDivElement = document.getElementById("allHabits");
    allHabitsDivElement.innerHTML = "";

    let allHabitsFilterDiv = document.createElement("div");
    if (Habit.all.length !== 0)
        allHabitsFilterDiv = renderHabitsSummarySelect(user);

    allHabitsDivElement.appendChild(allHabitsFilterDiv);

    const allHabitNamesTableElement = document.createElement("table");
    allHabitNamesTableElement.setAttribute("id", "allHabitsTable");

    allHabitsDivElement.appendChild(allHabitNamesTableElement);

    handleHabitSummary(user);
}