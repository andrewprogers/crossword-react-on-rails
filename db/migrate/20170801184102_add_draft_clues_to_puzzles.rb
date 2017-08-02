class AddDraftCluesToPuzzles < ActiveRecord::Migration[5.1]
  def change
    add_column :puzzles, :draft_clues_json, :text
  end
end
