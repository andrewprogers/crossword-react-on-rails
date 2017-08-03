class Puzzle < ApplicationRecord
  belongs_to :user
  has_many :answers
  has_many :solutions

  validates :size, presence: true, numericality: { only_integer: true }
  validates :size, inclusion: { in: 5..25 }
  validates :date, presence: true
  validate :grid_cant_be_empty
  validate :draft_cant_be_empty

  def get_clues
    clues = {}
    across_answers = Answer.where(puzzle: self, direction: "Across").sort_by { |answer| answer.gridnum }
    clues['across'] = across_answers.map { |answer| answer.clue }

    down_answers = Answer.where(puzzle: self, direction: "Down").sort_by { |answer| answer.gridnum }
    clues['down'] = down_answers.map { |answer| answer.clue }

    clues
  end

  def get_draft_clues
    JSON.parse(draft_clues_json)
  rescue
    return { 'across' => [], 'down' => [] }
  end

  def grid_cant_be_empty
    if grid.nil? || grid == ""
      errors.add(:grid, "can't be empty")
    end
  end

  def draft_cant_be_empty
    if draft.nil? || draft == ""
      errors.add(:draft, "can't be empty")
    end
  end

  def validate_draft(clue_numbers, clue_answers)
    return false if grid.length != size * size
    return false if grid.split('').any? { |char| char == " " }
    return false if title.blank?
    clues = JSON.parse(draft_clues_json)
    return false if clues['across'].length < clue_numbers[:across].length
    return false if clues['down'].length < clue_numbers[:down].length
    return false if clue_answers[:across].length != clue_numbers[:across].length
    return false if clue_answers[:down].length != clue_numbers[:down].length
    return true
  end

  def create_answers_from_draft(clue_numbers, clue_answers)
    clues = JSON.parse(draft_clues_json)
    clue_numbers.each do |direction, grid_nums|
      grid_nums.each.with_index do |grid_num, idx|
        Answer.create!(
          puzzle: self,
          direction: direction.capitalize,
          gridnum: grid_num,
          answer: clue_answers[direction][0],
          clue: clues[direction.to_s][0]
        )
      end
    end
  end
end
