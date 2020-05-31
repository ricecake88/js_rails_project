class Habit {
    constructor(name, frequency_mode=0, num_for_streak=7, streak_counter=0, streak_level="none") {
        this.name = name;
        this.frequency_mode = frequency_mode;
        this.num_for_streak = num_for_streak;
        this.streak_counter = streak_counter;
        this.streak_level = "none";
    }

    static add_habit_form() {
        const bodyElement = document.querySelectorTag("body");

        const habitForm = document.createElement("form")

        const labelForHabitNameElement = document.createElement("label");
        labelForHabitNameElement = document.setAttribute("for", "habitName");

        const inputHabitNameElement = document.createElement("input")
        inputHabitNameElement.setAttribute("id", "habitName");
        inputHabitNameElement.setAttribute("name", "habitName");

        habitForm.appendChild(labelForHabitNameElement);
        habitForm.appendChild(inputHabitNameElement);
      
        bodyElement.appendChild(habitForm);
    }

}