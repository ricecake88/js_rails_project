class HabitRecord < ApplicationRecord
    belongs_to :habit
    belongs_to :user
    validate :record_cannot_be_in_future
    validates :time_of_record, presence: true

    def self.records(params, user_id)
        if params[:range] == "currentMonth"
            return HabitRecord.where(habit_id: params[:habit_id], time_of_record: Date.today.beginning_of_month..DateTime.current.to_date)
        elsif params[:range] == "currentYear"
            return HabitRecord.where(habit_id: params[:habit_id], time_of_record: Date.today.beginning_of_year..DateTime.current.to_date)
        elsif params[:range] == "all"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id)
        else
            # default is the last 7 days
            return HabitRecord.where(habit_id: params[:habit_id], time_of_record: 1.week.ago.to_date..DateTime.current.to_date)
        end
    end

    def record_cannot_be_in_future
        if time_of_record.present? && time_of_record >= DateTime.current.to_date
            errors.add(:time_of_record, "can't be in the future")
        end
    end
end