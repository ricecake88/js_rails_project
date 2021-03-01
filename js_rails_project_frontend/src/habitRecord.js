class HabitRecord {

    static all_records = [];

    constructor(id="", habit_id=-"", user_id=-"", dateOfHabit="") {
        this._id = id,
        this._habit_id = habit_id,
        this._user_id = user_id,
        this._timeOfRecord = dateOfHabit,
        HabitRecord.all_records.push(this)
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


    static createGetRecordsConfig() {
        let habitRecordsConfigObject = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this._user.authToken
            },
        }
        return habitRecordsConfigObject;
    }
}