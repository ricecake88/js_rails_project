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

    static createPostRecordConfig(habit) {
        console.log("HabitRecord :: createAddRecordConfig");
        let record = document.getElementById('habitRecordDateInput' + habit.id);
        return {
            method: 'POST',
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

    createDeleteRecordsConfig() {
        return {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + this.habit.user.authToken
            },
            body: JSON.stringify({
                'habit_id': this.habit.id,
                'user_id': this.habit.user.id,
                "time_of_record": document.getElementById("habitRemoveRecord" + this.habit.id).value
            })
        }
    }

    render7Day(habitRecordBoxesTD) {
        //const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + this._habit.id);

        if (checkIfInRange(this._timeOfRecord, "last7")) {
            const box = document.createElement("span");
            box.setAttribute("class", "box");
            box.id = "box" + this._id;
            box.style.backgroundColor = this._habit.color;
            habitRecordBoxesTD.appendChild(box);
        }
    }

    static renderSelectRecords(json, selectElement) {
        if (json['status']) {

            selectElement.innerHTML = "";
            if ((json['record'] === undefined) || (json['record'].length === 0)) {
                const optionRecord = document.createElement("option");
                optionRecord.innerText = "No Records";
                optionRecord.value = "";
                optionRecord.setAttribute("disabled", "");
                optionRecord.setAttribute("selected", "");
                selectElement.appendChild(optionRecord);
            } else {
                json['record'].forEach(record => {
                    const optionRecord = document.createElement("option");
                    optionRecord.setAttribute("value", record['time_of_record']);
                    optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                    optionRecord.innerText = record['time_of_record'];
                    selectElement.appendChild(optionRecord);
                })
            }
        }
    }

    static handleAllRecords(habit) {
        HabitRecord.getAllRecords(habit).then(function(json) {
            HabitRecord.initializeRecords(json, habit);
         })
    }

    static get7DayProgress(json, habit) {
        if (json['status'] && json['record'] !== undefined) {
            const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + habit.id);
            habitRecordBoxesTD.innerHTML = "";
            json['record'].forEach(rec => {
                const record = HabitRecord.all.find(r => r.id === rec['id']);
                record.render7Day(habitRecordBoxesTD);
            })
        }
    }

    static getFilteredRecords(range, habit) {
        const habitRecordsConfigObject = HabitRecord.createGetRecordsConfig(habit);
        console.log(habitRecordsConfigObject);
        return fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${range}`, habitRecordsConfigObject)
        .then(json => json);
    }

    static getAllRecords(habit) {
        const habitRecordsConfigObject = this.createGetRecordsConfig(habit);
        console.log(habitRecordsConfigObject);
        return fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=all`, habitRecordsConfigObject)
        .then(json => json);
    }

    static initializeRecords(json, habit) {
        console.log("HabitRecord :: initializeRecords");
        if (json['status'] && json['record'] !== undefined) {
            json['record'].forEach(record => {
                new HabitRecord(record['id'], habit, record['time_of_record'])
            })
        }
    }

    static handleNewRecord(habit) {
        HabitRecord.createRecord(habit).then(json => {
            HabitRecord.newRecord(json, habit);
        })

    }

    static createRecord(habit) {
        const configObject = HabitRecord.createAddRecordConfig(habit);
        return fetchJSON(`${BACKEND_URL}/habit_records`, configObject)
        .then(json => json)
    }

    static newRecord(json, habit) {
        console.log("HabitRecord :: newRecord");
        if (json['status'] == true) {

            // create new Habit Record
            new HabitRecord(json['record']['id'], habit, json['record']['time_of_record'])

            // update last 7 day cell if record is in the last 7 days
            habit.handle7DayRecords();

            habit.handleSelectedRecords();
            renderHabitSummary(habit.user);

        } else {
            document.getElementById("error").innerText = json['errors'];
        }
    }

    static handleDeleteRecord(record) {
        const recordId = parseInt(record.id.match(/[0-9]+/)[0])
        const recordObj = HabitRecord.all.find(r => r.id === recordId)
        recordObj.deleteRecord().then(json => recordObj.renderDeleteRecords(json))
    }

    deleteRecord() {
        const deleteRecordConfig = this.createDeleteRecordsConfig();
        return fetchJSON(`${BACKEND_URL}/habit_records/${this.id}`, deleteRecordConfig)
            .then(json => json)
    }

    renderDeleteRecords(json) {
        if (json['status']) {

            //remove from records
            HabitRecord.all.splice(HabitRecord.all.indexOf(this), 1);

            //render progress and selected drop down
            this.habit.handle7DayRecords();
            this.habit.handleSelectedRecords();

            renderHabitSummary(this.habit.user);

        }
    }

}