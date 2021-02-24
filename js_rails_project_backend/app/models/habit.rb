class Habit < ApplicationRecord
    belongs_to :user
    validates :name, presence: true, uniqueness: true
    has_many :habit_records
end