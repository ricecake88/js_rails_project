function checkIfInRange(time_of_record, range="last7") {
    const record_as_time = new Date(time_of_record).getTime();
    const today = new Date();
     if (range === "lastYear") {
        const beginning_of_last_year = new Date(today.getFullYear()-1, 0, 1);
        const end_of_last_year = new Date(today.getFullYear()-1, 11, 31);
        if ((record_as_time < beginning_of_last_year.getTime()) && (record_as_time > end_of_last_year.getTime())) return true;
     } else if (range === "lastMonth") {
        const beginning_of_last_month = new Date(today.getFullYear(), today.getMonth()-1, 1);
        const end_of_last_month = new Date(today.getFullYear(), today.getMonth()-1, 1);
        if ((record_as_time >= beginning_of_last_month.getTime()) && (record_as_time <= end_of_last_month.getTime())) return true;
     } else if (range === "currentYear") {
        const beginning_of_year = new Date(today.getFullYear(), 0, 1);
        if ((record_as_time > beginning_of_year.getTime()) && (record_as_time <= today.getTime())) return true;
     } else if (range === "currentMonth") {
        const beginning_of_month = new Date(today.getFullYear(), today.getMonth(), 1);
        if ((record_as_time >= beginning_of_month.getTime()) && record_as_time <= today.getTime()) return true;
     } else {
        const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        if (record_as_time > fromDate.getTime()) return true;
     }
     return false;
}

class HabitRecord {

    static all = [];

    constructor(id="", habit=-"", dateOfHabit="") {
        this._id = id,
        this._habit = habit,
        this._timeOfRecord = dateOfHabit,
        HabitRecord.all.push(this)
    }

    set id(habitRecordId) {
        this._id = habitRecordId;
    }

    get id() {
        return this._id;
    }

    get habit() {
        return this._habit;
    }

    set timeOfRecord(date) {
        this._timeOfRecord = date;
    }

    get timeOfRecord() {
        return this._timeOfRecord;
    }

    static createAddRecordConfig(habit) {
        console.log(">>>>> HabitRecord :: createAddRecordConfig");
        let record = document.getElementById('habitRecordDateInput' + habit.id);
        return {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + habit.user.authToken
            },
            body: JSON.stringify({
                'habit_id': habit.id,
                'time_of_record': record.value,
                'user_id': habit.user.id
            })
        }
    }

    static createGetRecordsConfig(habit) {
        return {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + habit.user.authToken
            },
        }
    }

    static createDeleteRecordsConfig(habit) {
        return {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + habit.user.authToken
            },
            body: JSON.stringify({
                'habit_id': habit.id,
                'user_id': habit.user.id,
                "time_of_record": document.getElementById("habitEditRecord" + habit.id).value
            })
        }
    }

    createDeleteRecordsConfig() {
        return {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this.habit.user.authToken
            },
            body: JSON.stringify({
                'habit_id': this.habit.id,
                'user_id': this.habit.user.id,
                "time_of_record": document.getElementById("habitEditRecord" + this.habit.id).value
            })
        }
    }

    static handleHabitRecords(habit) {

        console.log(">>> renderHabitRecords(habit)");
        HabitRecord.getRecords(habit).then(function(json) {
            HabitRecord.renderRecords(json, habit);
         })
    }

    static getRecords(habit) {
        const habitRecordsConfigObject = HabitRecord.createGetRecordsConfig(habit);

        return fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=all`, habitRecordsConfigObject)
        .then(json => json);
    }

    static renderRecords(json, habit) {
        const habitEditRecordsSelect = document.getElementById("habitEditRecord" + habit.id);
        const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + habit.id);

        /////TO-DO: FIX ERROR MESSAGES BEING RETURNED AND STATUSES
        console.log(json);
        if (json['status'] && json['record'] != undefined) {
            json['record'].forEach(record => {
                const matchedHabit = Habit.all.find(habi => habit.id === record['habit_id']);
                new HabitRecord(record['id'], matchedHabit, record['time_of_record'])
                const box = document.createElement("span");
                box.setAttribute("class", "box");
                box.id = "box" + record['id'];
                box.style.backgroundColor = habit.color;
                habitRecordBoxesTD.appendChild(box);

                const optionRecord = document.createElement("option");
                optionRecord.setAttribute("value", record['time_of_record']);
                optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                optionRecord.innerText = record['time_of_record'];
                habitEditRecordsSelect.appendChild(optionRecord);


            })
        }
    }

    static handleNewRecord(habit) {
        console.log(habit);
        //debugger
        HabitRecord.createRecord(habit).then(json => {
            HabitRecord.renderNewRecord(json, habit);
        })

    }

    static createRecord(habit) {
        const configObject = HabitRecord.createAddRecordConfig(habit);
        return fetchJSON(`${BACKEND_URL}/habit_records`, configObject)
        .then(json => json)
    }

    static renderNewRecord(json, habit) {
        const records = document.createElement("p");
        const error = document.getElementById("error");
        const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + habit.id);
        const range = document.getElementById("habitFilterRecordsToRemove" + habit.id).value;
        const habitEditRecordsSelect = document.getElementById("habitEditRecord" + habit.id);
        if (json['status'] == true) {
            records.innerText = json['record']['time_of_record'];
            const matchedHabit = Habit.all.find(habit => habit.id === json['record']['habit_id'])
            new HabitRecord(json['record']['id'], matchedHabit, json['record']['time_of_record'])

            if (checkIfInRange(json['record']['time_of_record'], "last7")) {
                const box = document.createElement("span");
                box.setAttribute("class", "box");
                box.id = "box" + json['record']['id'];
                box.style.backgroundColor = habit.color;
                habitRecordBoxesTD.appendChild(box);
            }

            const habitRecordsConfigObject = HabitRecord.createGetRecordsConfig(habit);
            console.log(habit.id);
             fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${range}`, habitRecordsConfigObject)
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
/*             if (checkIfInRange(json['record']['time_of_record'], document.getElementById("habitFilterRecordsToRemove" + habit.id).value)) {
                const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + habit.id);
                const optionRecord = document.createElement("option");
                optionRecord.setAttribute("value", json['record']['time_of_record']);
                optionRecord.innerText = json['record']['time_of_record'];
                optionRecord.id = "timeRecorded" + json['record']['id'];
                habitEditRecordsSelect.appendChild(optionRecord);
            } */
            renderAllHabits(habit.user);
        } else {
            error.innerText = json['errors'];
        }
    }

    static handleDeleteRecord(record) {
        const recordId = parseInt(record.id.match(/[0-9]+/)[0])
        const recordObj = HabitRecord.all.find(r => r.id === recordId)
        recordObj.delete().then(json => recordObj.deleteRecords(json))
    }

    delete() {
        console.log("Instance delete");
        const deleteRecordConfig = this.createDeleteRecordsConfig();

        return fetchJSON(`${BACKEND_URL}/habit_records/${this.id}`, deleteRecordConfig)
            .then(json => json)
    }

    deleteRecords(json) {
        console.log("deleteRecords");
        if (json['status']) {
            const habitEditRecordsSelect = document.getElementById("habitEditRecord" + this.habit.id);
            const range = document.getElementById("habitFilterRecordsToRemove" + this.habit.id).value;
            const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + this.habit.id);
            const habitRecordsOption = document.querySelector("option#timeRecorded" + this.id);
            const boxToRemove = document.querySelector("span#box" + this.id);
            //debugger
            HabitRecord.all.splice(HabitRecord.all.indexOf(this), 1);
            //debugger

            // remove box from view if it is within 7 days
            //debugger
            if ((boxToRemove !== null) && (checkIfInRange(this.timeOfRecord, "last7"))) {
                //habitRecordBoxesDiv.removeChild(boxToRemove);
                console.log(habitRecordBoxesTD);
                habitRecordBoxesTD.removeChild(boxToRemove);
            }

            // retrieve records again
            const habitRecordsConfigObject = HabitRecord.createGetRecordsConfig(this.habit);
            console.log(this.habit.id);
             fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${this.habit.id}&range=${range}`, habitRecordsConfigObject)
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
                renderAllHabits(this.habit.user);            
            }); 

/*             if (checkIfInRange(record.timeOfRecord, document.getElementById("habitFilterRecordsToRemove" + this.habit.id).value)) {
                habitEditRecordsSelect.removeChild(habitRecordsOption);
                if (!habitEditRecordsSelect.hasChildNodes()) {
                    const empty = document.createElement("option");
                    empty.innerText = "No Records";
                    empty.id = "optionNoRecords";
                    empty.setAttribute("selected", "");
                    empty.setAttribute("disabled", "");
                    habitEditRecordsSelect.appendChild(empty);
                }
            } */
            
        }
    }

}