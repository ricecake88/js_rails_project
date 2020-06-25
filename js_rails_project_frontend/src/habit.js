class Habit {
    constructor(name, frequency_mode=0, num_for_streak=7, streak_counter=0, streak_level="none") {
        this.name = name;
        this.frequency_mode = frequency_mode;
        this.num_for_streak = num_for_streak;
        this.streak_counter = streak_counter;
        this.streak_level = "none";
    }

    static add_habit_form() {
        console.log("In add_habit_form");
        const bodyElement = document.querySelector("body");

        const habitForm = document.createElement("form")

        const labelForHabitNameElement = document.createElement("label");
        labelForHabitNameElement.setAttribute("for", "habitName");
        labelForHabitNameElement.textContent = "Habit Name: ";

        const inputHabitNameElement = document.createElement("input");
        inputHabitNameElement.setAttribute("id", "habitName");
        inputHabitNameElement.setAttribute("name", "habitName");
        inputHabitNameElement.setAttribute("type", "text");

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


        const submitElement = document.createElement("submit");
        submitElement.setAttribute("name", "submitHabit");
        submitElement.setAttribute("id", "submitHabit");


        habitForm.appendChild(labelForHabitNameElement);
        habitForm.appendChild(inputHabitNameElement);
        habitForm.appendChild(labelForScheduleElement);
        habitForm.appendChild(scheduleElement);
        habitForm.appendChild(submitElement);

        bodyElement.appendChild(habitForm);
        console.log(habitForm);
    }

}