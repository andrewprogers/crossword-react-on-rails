class CreatePuzzles < ActiveRecord::Migration[5.1]
  def change
    create_table :puzzles do |t|
      t.string :title
      t.integer :size, null: false
      t.text :grid, null: false
      t.datetime :date, null: false
      t.text :notes
      t.belongs_to :user

      t.timestamps
    end
  end
end
