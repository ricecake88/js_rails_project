function renderHabitControlHead() {
    const habitTable = document.querySelector("table#habitTable");
    const headRow = document.createElement("tr")

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