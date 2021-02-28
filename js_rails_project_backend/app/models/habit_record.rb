class HabitRecord < ApplicationRecord
    belongs_to :habit
    belongs_to :user
    validates :time_of_record, presence: true

    def self.records(params)
        #return HabitRecord.where(habit_id: params[:habit_id], time_of_record: DateTime.1.week.ago..DateTime.current.to_date);
        return HabitRecord.where(habit_id: params[:habit_id], time_of_record: 1.week.ago.to_date..DateTime.current.to_date);
    end
end