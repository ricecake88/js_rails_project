class RemoveUserIdFromHabitRecord < ActiveRecord::Migration[5.2]
  def change
    remove_column :habit_records, :user_id, :integer
  end
end
