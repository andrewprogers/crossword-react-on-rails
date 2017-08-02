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
end
