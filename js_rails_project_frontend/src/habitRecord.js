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
        const habitRecordBoxesDiv = document.getElementById("habitRecordBoxes" + habit.id);
        const habitEditRecordsSelect = document.getElementById("habitEditRecord" + habit.id);

        /////TO-DO: FIX ERROR MESSAGES BEING RETURNED AND STATUSES
        console.log(json);
        if (json['status'] && json['record'] != undefined) {
            json['record'].forEach(record => {
                const matchedHabit = Habit.all.find(id => record['habit_id'])
                new HabitRecord(record['id'], matchedHabit, record['time_of_record'])
                //new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
                const box = document.createElement("span");
                box.setAttribute("class", "box");
                box.id = "box" + record['id'];
                habitRecordBoxesDiv.appendChild(box);

                const optionRecord = document.createElement("option");
                optionRecord.setAttribute("value", record['time_of_record']);
                optionRecord.setAttribute("id", "timeRecorded" + record['id'])
                optionRecord.innerText = record['time_of_record'];
                habitEditRecordsSelect.appendChild(optionRecord);


            })
        }
    }

    static handleNewRecord(habit) {
        HabitRecord.createRecord(habit).then(json => {
            HabitRecord.renderNewRecord(json, habit);
        })

    }

    static createRecord(habit) {
        const configObject = HabitRecord.createAddRecordConfig(habit);
        console.log(configObject);
        return fetchJSON(`${BACKEND_URL}/habit_records`, configObject)
        .then(json => json)
    }

    static renderNewRecord(json, habit) {
        const records = document.createElement("p");
        const error = document.getElementById("error");
        const habitRecordBoxesDiv = document.getElementById("habitRecordBoxes" + habit.id)
        if (json['status'] == true) {
            records.innerText = json['record']['time_of_record'];
            //new HabitRecord(json['record']['id'], json['record']['habit_id'], json['record']['user_id'], json['record']['time_of_record']);
            const matchedHabit = Habit.all.find(id => json['record']['habit_id'])
            new HabitRecord(json['record']['id'], matchedHabit, json['record']['time_of_record'])
            const box = document.createElement("span");
            box.setAttribute("class", "box");
            box.id = "box" + json['record']['id'];
            habitRecordBoxesDiv.appendChild(box);
            habitRecordBoxesDiv.appendChild(records);

            const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + habit.id);
            const optionRecord = document.createElement("option");
            optionRecord.setAttribute("value", json['record']['time_of_record']);
            optionRecord.innerText = json['record']['time_of_record'];
            optionRecord.id = "timeRecorded" + json['record']['id'];
            habitEditRecordsSelect.appendChild(optionRecord);
        } else {
            console.log("renderNewRecord");
            console.log(json);
            error.innerText = json['error'];
        }
    }

    static handleDeleteRecord(record) {
        const recordId = parseInt(record.id.match(/[0-9]+/)[0])
        const recordObj = HabitRecord.all.find(r => r.id === recordId)
        recordObj.delete().then(json => recordObj.updateRecords(json))
    }

    delete() {
        console.log("Instance delete");
        const deleteRecordConfig = this.createDeleteRecordsConfig();

        return fetchJSON(`${BACKEND_URL}/habit_records/${this.id}`, deleteRecordConfig)
            .then(json => json)
    }

    updateRecords(json) {
        //TO-DO: ERROR HANDLING STILL NEEDS TO BE DONE
        if (json['status']) {
            const habitEditRecordsSelect = document.getElementById("habitEditRecord" + this.habit.id);
            const boxToRemove = document.querySelector("span#box" + this.id);
            const habitRecordBoxesDiv = document.querySelector("div#habitRecordBoxes" + this.habit.id);
            const habitRecordsOption = document.querySelector("option#timeRecorded" + this.id);

            //TO-DO: ERROR HANDLING
            HabitRecord.all.splice(HabitRecord.all.indexOf(this),1)
            habitRecordBoxesDiv.removeChild(boxToRemove);
            habitEditRecordsSelect.removeChild(habitRecordsOption);
        }
    }

}