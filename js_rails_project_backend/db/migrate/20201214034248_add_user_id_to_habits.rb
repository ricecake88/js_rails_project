class AddUserIdToHabits < ActiveRecord::Migration[5.2]
  def change
    add_column :habits, :user_id, :integer
  end
end
