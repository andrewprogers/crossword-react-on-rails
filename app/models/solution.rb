class Solution < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle

  validates :user_answers, exclusion: { in: [nil] }
  validates :user_id, presence: true
  validates :puzzle_id, presence: true
end
