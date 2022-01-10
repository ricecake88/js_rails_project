/* checks if a record is within the range requested */
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

    /* create config to send to a post request to log a record */
    static createPostRecordConfig(habit) {
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

    /* create config to send a get request */
    static createGetRecordsConfig(habit) {
        return {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + habit.user.authToken
            },
        }
    }

    /* create a config to delete a record */
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

    /* if a record is within the last 7 days, create a box
       and append it to parent element */
    renderColorBoxIfLast7(habitRecordBoxesTD) {
        if (checkIfInRange(this._timeOfRecord, "last7")) {
            const box = document.createElement("span");
            box.setAttribute("class", "box");
            box.id = "box" + this._id;
            box.style.backgroundColor = this._habit.color;
            habitRecordBoxesTD.appendChild(box);
        }
    }

    /* render the select records returned from server */
    static renderSelectRecords(json, selectElement) {

        if (json['status']) {

            // reset select
            selectElement.innerHTML = "";

            // if no records, display no records in select
            if ((json['records'] === undefined) || (json['records'].length === 0)) {
                const optionRecord = document.createElement("option");
                optionRecord.innerText = "No Records";
                optionRecord.value = "";
                optionRecord.setAttribute("disabled", "");
                optionRecord.setAttribute("selected", "");
                selectElement.appendChild(optionRecord);
            } else {

                // render all the records in select
                json['records'].forEach(record => {
                    const optionRecord = document.createElement("option");
                    optionRecord.setAttribute("value", record['time_of_record']);
                    optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                    optionRecord.innerText = record['time_of_record'];
                    selectElement.appendChild(optionRecord);
                })

                clearError();
            }
        }
    }

    /* upon login, get all records from server and create
      new instances of habit records */
    static handleAllRecords(habit) {
        HabitRecord.getFilteredRecords("all", habit).then(function(json) {
            HabitRecord.initializeRecords(json, habit);
         })
    }


    /* display a record for the cell that shows records from
       the last 7 days */
    static render7DayProgress(json, habit) {
        if (json['status'] && json['records'] !== undefined) {
            const habitRecordBoxesTD = document.getElementById("habit7DayProgressDiv" + habit.id);
            habitRecordBoxesTD.innerHTML = "";
            json['records'].forEach(rec => {

                // retrieve related record instance
                // TO-DO: Update HabitRecord.all so that it associated with a habit, this will take too long

                const record = habit.habit_records.find(r => r.id == rec['id']);

                /* only render if record is found in Habit Record list*/
                if (record !== undefined)
                    record.renderColorBoxIfLast7(habitRecordBoxesTD);
            })
        }
    }

    /* send request to server to retrieve records for a habit based on a time range */
    static getFilteredRecords(range, habit) {
        const habitRecordsConfigObject = HabitRecord.createGetRecordsConfig(habit);
        return fetchJSON(`${BACKEND_URL}/habit_records?habit_id=${habit.id}&range=${range}`, habitRecordsConfigObject)
        .then(json => json);
    }

    /* initialize instances of existing records upon login */
    static initializeRecords(json, habit) {
        if (json['status'] && json['records'] !== undefined) {
            json['records'].forEach(record => {
                const habitRecordInstance = new HabitRecord(record['id'], habit, record['time_of_record'])
                habit.habit_records.push(habitRecordInstance);

            })
        }
    }

    /* when adding a new record, send request to create a new record to server
      then render views based on new record */
    static handleNewRecord(habit) {
        HabitRecord.createRecord(habit).then(json => {
            HabitRecord.newRecord(json, habit);
        })

    }

    /* post server request to create a new record */
    static createRecord(habit) {
        return fetchJSON(`${BACKEND_URL}/habit_records`, HabitRecord.createPostRecordConfig(habit))
        .then(json => json)
    }

    /* render new record by creating a new habit record instance, then updating
        last 7 day column, list of records and summary based on the new record information */
    static newRecord(json, habit) {
        if (json['status'] == true) {

            // create new Habit Record
            new HabitRecord(json['record']['id'], habit, json['record']['time_of_record'])

            // update last 7 day cell if record is in the last 7 days
            habit.handle7DayRecords();

            // render list of records again after creation if in
            // selected range
            habit.handleSelectedRecords();

            renderHabitSummary(habit.user);
            clearError();

        } else {
            document.getElementById("error").innerText = json['errors'];
        }
    }

    /* delete record based on record passed in and update views based on deleted record */
    static handleDeleteRecord(record) {
        const recordId = parseInt(record.id.match(/[0-9]+/)[0])
        const recordObj = HabitRecord.all.find(r => r.id === recordId)
        recordObj.deleteRecord().then(json => recordObj.renderDeleteRecords(json))
    }

    /* delete request for a record to server */
    deleteRecord() {
        const deleteRecordConfig = this.createDeleteRecordsConfig();
        return fetchJSON(`${BACKEND_URL}/habit_records/${this.id}`, deleteRecordConfig)
            .then(json => json)
    }

    /* render the page based on the deleted record */
    renderDeleteRecords(json) {
        if (json['status']) {

            //remove from records
            HabitRecord.all.splice(HabitRecord.all.indexOf(this), 1);

            //render progress and selected drop down
            this.habit.handle7DayRecords();
            this.habit.handleSelectedRecords();

            renderHabitSummary(this.habit.user);
        } else {
            displayError(json['errors']);
        }
    }

}