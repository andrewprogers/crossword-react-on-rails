require 'json'

def puzzle_hashes(&block)
  hashes = []

  Dir.glob("**/seed_puzzles/**/*.json") do |filename|
    puts filename
    
    json = JSON.parse(File.read(filename))
    puzzle_hash = {
      author: json['author'],
      title: json['title'],
      clues: json['clues'],
      answers: json['answers'],
      date: json['date'],
      grid: json['grid'],
      size: json['size']['cols'],
      notes: json['notepad']
    }

    if block_given?
      yield(puzzle_hash)
    else
      hashes.push(puzzle_hash)
    end
  end

  hashes unless block_given?
end
