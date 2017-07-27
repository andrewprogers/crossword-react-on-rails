# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require_relative 'puzzle_hashes'

puzzle_hashes do |data|
  puzzle = Puzzle.find_or_create_by!({
    title: data[:title],
    size: data[:size],
    grid: data[:grid].join(""),
    date: Date.strptime(data[:date], "%m/%d/%Y"),
    notes: data[:notes],
    user: User.where(uid: 0).first
  })

  directions = ["Across", "Down"]
  directions.each do |direction|
    data[:answers][direction.downcase].each.with_index do |answer, index|
      matchData = data[:clues][direction.downcase][index].match(/^(\d*)\. (.*)$/)
      gridnum = matchData[1]
      clue =  matchData[2]
      Answer.find_or_create_by!({
        direction: direction,
        gridnum: matchData[1],
        clue: matchData[2],
        answer: answer,
        puzzle: puzzle
      })
    end
  end
end
