class Habit < ApplicationRecord
    belongs_to :user
    validates :name, presence: true, format: {with: /\A[\w\s]+\s*[\w\s\.&!\-]*\Z/ }
    has_many :habit_records
end