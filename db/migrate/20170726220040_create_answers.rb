class CreateAnswers < ActiveRecord::Migration[5.1]
  def change
    create_table :answers do |t|
      t.string :direction, null: false
      t.integer :gridnum, null: false
      t.string :clue, null: false
      t.string :answer, null: false
      
      t.belongs_to :puzzle, null: false
    end
  end
end
