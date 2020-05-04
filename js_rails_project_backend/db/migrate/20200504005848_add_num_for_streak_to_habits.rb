class AddNumForStreakToHabits < ActiveRecord::Migration[5.2]
  def change
    add_column :habits, :num_for_streak, :integer
  end
end
