class AddSecondsToSolutions < ActiveRecord::Migration[5.1]
  def change
    add_column :solutions, :seconds, :integer, null: false, default: 0
  end
end
