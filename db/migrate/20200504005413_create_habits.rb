class CreateHabits < ActiveRecord::Migration[5.2]
  def change
    create_table :habits do |t|
      t.string :name
      t.integer :frequency_mode
      t.integer :streak_counter
      t.integer :streak_level
    end
  end
end
