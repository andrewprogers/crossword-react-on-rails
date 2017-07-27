class Puzzle < ApplicationRecord
  belongs_to :user
  has_many :answers
  has_many :solutions

  validates :size, presence: true, numericality: { only_integer: true }
  validates :grid, presence: true
  validates :date, presence: true
end
