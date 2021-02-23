class CreateHabitRecord < ActiveRecord::Migration[5.2]
  def change
    create_table :habit_records do |t|
      t.integer :user_id
      t.integer :habit_id
      t.date :time_of_record
    end
  end
end
