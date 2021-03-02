class HabitRecord {

    static all = [];

    constructor(id="", habit_id=-"", user_id=-"", dateOfHabit="") {
        this._id = id,
        this._habit_id = habit_id,
        this._user_id = user_id,
        this._timeOfRecord = dateOfHabit,
        HabitRecord.all.push(this)
    }

    set id(habitRecordId) {
        this._id = habitRecordId;
    }

    get id() {
        return this._id;
    }

    set habit_id(habitId) {
        this._habit_id = habitId;
    }

    get habit_id() {
        return this._habit_id;
    }

    set user_id(userId) {
        this._user_id = userId;
    }

    get user_id() {
        return this._user_id;
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
            return  {
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
                new HabitRecord(record['id'], record['habit_id'], record['user_id'], record['time_of_record'])
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
        const message = document.getElementById("message");
        const habitRecordBoxesDiv = document.getElementById("habitRecordBoxes" + habit.id)
        if (json['status'] == true) {
            records.innerText = json['habit']['time_of_record'];
            new HabitRecord(json['habit']['id'], json['habit']['habit_id'], json['habit']['user_id'], json['habit']['time_of_record']);
            const box = document.createElement("span");
            box.setAttribute("class", "box");
            box.id = "box" + json['habit']['id'];
            habitRecordBoxesDiv.appendChild(box);
            habitRecordBoxesDiv.appendChild(records);

            const habitEditRecordsSelect = document.querySelector("select#habitEditRecord" + habit.id);
            const optionRecord = document.createElement("option");
            optionRecord.setAttribute("value", json['habit']['time_of_record']);
            optionRecord.innerText = json['habit']['time_of_record'];
            optionRecord.id = "timeRecorded" + json['habit']['id'];
            habitEditRecordsSelect.appendChild(optionRecord);
        } else {
            message.innerText = json['errors'];
        }
    }

    static handleDeleteRecord(habit) {
        HabitRecord.delete(habit).then((json) => {
            this.updateRecords(json, habit);
        });
    }

    static habitRecordToDelete(habit) {
        return HabitRecord.all.find(record => {
            if (record.user_id == habit.user.id &&
                record.habit_id == habit.id &&
                record.timeOfRecord == document.getElementById("habitEditRecord" + habit.id).value) {
                    return record;
            }
        })
    }

    static delete(habit) {

        const deleteRecordConfig = HabitRecord.createDeleteRecordsConfig(habit);
        const record = HabitRecord.habitRecordToDelete(habit);

        return fetchJSON(`${BACKEND_URL}/habit_records/${record.id}`, deleteRecordConfig)
            .then(json => json)
    }

    static updateRecords(json, habit) {
        //TO-DO: ERROR HANDLING STILL NEEDS TO BE DONE
        if (json['status']) {
            const record = HabitRecord.habitRecordToDelete(habit);
            const habitEditRecordsSelect = document.getElementById("habitEditRecord" + habit.id);
            const boxToRemove = document.querySelector("span#box" + json['id']);
            const habitRecordBoxesDiv = document.querySelector("div#habitRecordBoxes" + habit.id);
            const habitRecordsOption = document.querySelector("option#timeRecorded" + json['id']);

            //TO-DO: ERROR HANDLING
            HabitRecord.all.splice(HabitRecord.all.indexOf(record),1)
            habitRecordBoxesDiv.removeChild(boxToRemove);
            habitEditRecordsSelect.removeChild(habitRecordsOption);
        }
    }
}