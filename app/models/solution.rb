class Solution < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle

  validates :user_answers, exclusion: { in: [nil] }
  validates :user_id, presence: true
  validates :puzzle_id, presence: true
  validates :seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
