class AddDraftToPuzzles < ActiveRecord::Migration[5.1]
  def change
    add_column :puzzles, :draft, :boolean, default: false, null: false
  end
end
