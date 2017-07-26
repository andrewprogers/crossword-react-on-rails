class Answer < ApplicationRecord
  belongs_to :puzzle

  validates :direction, presence: true, inclusion: { in: %w{Across Down} }
  validates :gridnum, presence: true, numericality: { only_integer: true }
  validates :clue, presence: true
  validates :answer, presence: true
  validates :puzzle_id, presence: true
end
