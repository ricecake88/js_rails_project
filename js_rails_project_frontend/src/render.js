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
    showHabits(user);
}

function showHabits(user) {
    console.log("render :: showHabits");

    const habitTableElement = document.getElementById("allHabitsTable");
    habitTableElement.innerHTML = "";
    fetchJSON(`${BACKEND_URL}/habits`, user.createAuthConfig(user.authToken))
    .then(json => {
        if (json['status'] && json['habits'] != undefined) {
            json['habits'].forEach(habit => {
                const habitRowElement = document.createElement("tr");
                const habitNameTD = document.createElement("td");
                const recordsTotalTD = document.createElement("td");
                const recordsTD = document.createElement("td");
                const habitSpanElement = document.createElement("span");

                habitRowElement.setAttribute("class", "habit-row");
                habitRowElement.setAttribute("id", "allHabitRow" + habit.id)
                habitSpanElement.setAttribute("class", "habit-cell");
                habitSpanElement.innerText = habit.name;
                recordsTD.id = "recordsTD" + habit.id;

                habitNameTD.appendChild(habitSpanElement);
                habitRowElement.append(habitNameTD, recordsTotalTD, recordsTD);
                habitTableElement.append(habitRowElement);
                user.habits.push(habit);

                const filterRange = (document.querySelector("select#selectFilterHabits").value == null) ? "last7" :
                        document.querySelector("select#selectFilterHabits").value;

                    fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${filterRange}`, user.createAuthConfig(user.authToken))
                    .then(json => {
                        if (json['status'] && json['record'] != undefined) {
                            json['record'].forEach(record => {
                                const box = document.createElement("span");
                                box.setAttribute("class", "boxAll");
                                box.id = "box" + record['id'];
                                box.style.backgroundColor = habit.color;
                                recordsTD.append(box);
                            })
                            recordsTotalTD.innerText = json['record'].length;
                            habitRowElement.appendChild(recordsTD);
                        }
                    })

            })


        }
    })
}


function renderHabitSummary(user) {
    console.log("render :: renderHabitSummary");
    const allHabitsDivElement = document.getElementById("allHabits");
    allHabitsDivElement.innerHTML = "";

    const allHabitsFilterDiv = document.createElement("div");

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

    allHabitsFilterDiv.appendChild(allHabitsFilterSelect);
    allHabitsDivElement.appendChild(allHabitsFilterDiv);

    const allHabitNamesTableElement = document.createElement("table");
    allHabitNamesTableElement.setAttribute("id", "allHabitsTable");

    allHabitsDivElement.appendChild(allHabitNamesTableElement);

    showHabits(user);




}