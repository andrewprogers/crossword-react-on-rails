class CreateSolutions < ActiveRecord::Migration[5.1]
  def change
    create_table :solutions do |t|
      t.text :user_answers, null: false
      t.boolean :correct, default: false
      t.belongs_to :user, null: false
      t.belongs_to :puzzle, null: false

      t.timestamps
    end
  end
end
