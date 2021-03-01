class ChangeFrequencyToBeStringInHabits < ActiveRecord::Migration[5.2]
  def change
    change_column :habits, :frequency_mode, :string
  end
end
