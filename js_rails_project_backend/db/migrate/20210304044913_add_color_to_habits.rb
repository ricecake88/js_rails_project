class AddColorToHabits < ActiveRecord::Migration[5.2]
  def change
    add_column :habits, :color, :string
  end
end
