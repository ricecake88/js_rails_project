class Habit_Record < ApplicationRecord
    belongs_to :habit
    belongs_to :user
    validates :time_of_record, presence: true
end