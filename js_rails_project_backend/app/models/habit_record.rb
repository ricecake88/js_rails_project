class HabitRecord < ApplicationRecord
    belongs_to :habit
    belongs_to :user
    validate :record_cannot_be_in_future
    validates :time_of_record, presence: true


    # TO-DO: FIX LAST MONTH RECORD AND LAST YEAR
    def self.records(params, user_id)
        if params[:range] == "currentMonth"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id, time_of_record: Date.today.beginning_of_month..DateTime.current.to_date).sort_by(&:time_of_record)
        elsif params[:range] == "lastMonth"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id, time_of_record: Date.today.last_month.beginning_of_month..Date.today.last_month.end_of_month).sort_by(&:time_of_record)
        elsif params[:range] == "currentYear"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id, time_of_record: Date.today.beginning_of_year..DateTime.current.to_date).sort_by(&:time_of_record)
        elsif params[:range] == "lastYear"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id, time_of_record: 1.year.ago.beginning_of_year..1.year.ago.end_of_year).sort_by(&:time_of_record)
        elsif params[:range] == "all"
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id).sort_by(&:time_of_record)
        else
            # default is the last 7 days
            return HabitRecord.where(habit_id: params[:habit_id], user_id:user_id, time_of_record: 1.week.ago.to_date..DateTime.current.to_date).sort_by(&:time_of_record)
        end
    end

    def record_cannot_be_in_future
        if time_of_record.present? && time_of_record > Date.today.to_date
            errors.add(:time_of_record, "can't be in the future")
        end
    end
end