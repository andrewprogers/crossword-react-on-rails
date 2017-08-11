# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require_relative 'puzzle_hashes'

User.find_or_create_by!(
  provider: "google_oauth2",
  uid: "0",
  name: "legacy",
  oauth_token: nil,
  avatar_url: nil,
  oauth_expires_at: nil
)

puzzle_hashes do |data|
  begin
    puzzle = Puzzle.find_or_initialize_by(
      title: data[:title],
      size: data[:size],
      grid: data[:grid].join(""),
      date: Date.strptime(data[:date], "%m/%d/%Y"),
      notes: data[:notes],
      user: User.where(uid: "0").first
    )

    if puzzle.new_record?
      puzzle.save

      answers = []
      directions = ["Across", "Down"]
      directions.each do |direction|
        data[:answers][direction.downcase].each.with_index do |answer, index|
          match_data = data[:clues][direction.downcase][index].match(/^(\d*)\. (.*)$/)
          answers << Answer.find_or_initialize_by(
            direction: direction,
            gridnum: match_data[1],
            clue: match_data[2],
            answer: answer,
            puzzle: puzzle
          )
        end
      end
      Answer.import answers
    end
  rescue => e
    puts 'Failed to save record'
  end
end
