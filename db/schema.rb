# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170821121557) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", force: :cascade do |t|
    t.string "direction", null: false
    t.integer "gridnum", null: false
    t.string "clue", null: false
    t.string "answer", null: false
    t.bigint "puzzle_id", null: false
    t.index ["puzzle_id"], name: "index_answers_on_puzzle_id"
  end

  create_table "puzzles", force: :cascade do |t|
    t.string "title"
    t.integer "size", null: false
    t.text "grid", null: false
    t.datetime "date", null: false
    t.text "notes"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "draft", default: false, null: false
    t.text "draft_clues_json"
    t.index ["user_id"], name: "index_puzzles_on_user_id"
  end

  create_table "solutions", force: :cascade do |t|
    t.text "user_answers", null: false
    t.boolean "correct", default: false
    t.bigint "user_id", null: false
    t.bigint "puzzle_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "seconds", default: 0, null: false
    t.index ["puzzle_id"], name: "index_solutions_on_puzzle_id"
    t.index ["user_id"], name: "index_solutions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.string "name"
    t.string "oauth_token"
    t.string "avatar_url"
    t.datetime "oauth_expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
