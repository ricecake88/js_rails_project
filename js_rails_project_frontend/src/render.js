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

function renderColorOptions(habitColorSelect, selected_color="pink") {
    
    const colors = ["blue", "black", "green", "lightblue", "orange", "pink", "purple", "red", "yellow", "violet"]
    colors.forEach(color => {
        const option = document.createElement("option");
        option.name = color
        option.value = color
        option.innerText = color
        if (color === selected_color) {
            option.setAttribute("selected", "");
        }
        habitColorSelect.appendChild(option);
    })
    const colorBox = document.createElement("span");
    colorBox.setAttribute("class", "box");
    colorBox.style.backgroundColor = selected_color;

    habitColorSelect.parentNode.append(habitColorSelect, colorBox);
}

function RENDER_renderAddHabitForm() {

    console.log(">>>>>> renderAddHabitForm()");
    const userAreaElement = document.getElementById("user");
    userAreaElement.innerHTML = "";

    const habitForm = document.createElement("form");
    const habitNameLabel = document.createElement("label");
    const habitNameInput = document.createElement("input");
    const frequencyLabel = document.createElement("label");
    const frequencySelect = document.createElement("select");
    const streakLevelLabel = document.createElement("label");
    const streakLevelSelect = document.createElement("select");
    const habitColorLabel = document.createElement("label");
    const habitColorSelect = document.createElement("select");
    const goals = ["Everyday", "Every Other Day"];
    const streakLevels = ["Easy", "Medium", "Hard"];
    

    habitForm.name = "habitForm";
    habitForm.id = "habitForm";
    
    habitNameLabel.innerText = "Habit: ";
    habitNameInput.id = "habitName"
    habitNameInput.type = "text";
    habitNameInput.placeholder = "Enter a habit";

    frequencyLabel.innerText = "Goal: "
    frequencySelect.id = "frequency";
    
    goals.forEach(goal => {
        const optionElement = document.createElement("option");
        optionElement.value = goal;
        optionElement.name = goal;
        optionElement.innerText = goal;
        frequencySelect.appendChild(optionElement);
    })

    
    streakLevelLabel.innerText = "Streak Level: "

    streakLevelSelect.id = "streakLevel";  
    streakLevels.forEach(streakLevel => {
        const optionElement = document.createElement("option");
        optionElement.value = streakLevel;
        optionElement.name = streakLevel;
        optionElement.innerText = streakLevel;
        streakLevelSelect.appendChild(optionElement);
    })

    habitForm.append(habitNameLabel, habitNameInput);
    habitForm.append(frequencyLabel, frequencySelect);
    habitForm.append(streakLevelLabel, streakLevelSelect);
    habitForm.append(habitColorLabel, habitColorSelect);
    habitColorLabel.innerText = "Color: "
    habitColorSelect.id = "habitColor";
    renderColorOptions(habitColorSelect, "pink");
/*     const colors = ["blue", "black", "green", "lightblue", "orange", "pink", "purple", "red", "yellow", "violet"]
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
    colorChoice.style.backgroundColor = "pink"; */

    habitColorSelect.addEventListener("change", function(event) {
        event.preventDefault();
        document.getElementById("colorChoice").style.backgroundColor = document.getElementById("habitColor").value;
    }) 

    const submitHabit = document.createElement("button");
    submitHabit.type = "submit";
    submitHabit.value = "submitNewHabit";
    submitHabit.name = "submitNewHabit";
    submitHabit.innerText = "Add";



    //habitForm.append(habitColorLabel, habitColorSelect, colorChoice);
    habitForm.appendChild(submitHabit);
    userAreaElement.append(habitForm);

}