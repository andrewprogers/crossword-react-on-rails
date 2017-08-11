class Answer < ApplicationRecord
  belongs_to :puzzle

  validates :direction, presence: true, inclusion: { in: %w{Across Down} }
  validates :gridnum, presence: true, numericality: { only_integer: true }
  validates :clue, presence: true
  validates :answer, presence: true
  validates :puzzle_id, presence: true

  def self.days_of_week(answers)
    day_counts = [0, 0, 0, 0, 0, 0, 0]
    days = [:sunday, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday]
    dow_data = {}

    answers.each do |answer|
      day_counts[answer.day_of_week] += 1
    end

    days.each.with_index { |day, idx| dow_data[day] = day_counts[idx] }
    dow_data
  end

  def self.select_random_clues(answers, number)
    random_answers = answers.sample(number)
    random_answers.map(&:clue)
  end

  def self.difficulty_from_frequency(dow_freq)
    easy = dow_freq[:monday] + dow_freq[:tuesday] + dow_freq[:wednesday]
    hard = dow_freq[:sunday] + dow_freq[:thursday] + dow_freq[:friday] + dow_freq[:saturday]
    total = easy + hard
    ((hard - easy).to_f / total).round(2)
  end

  def day_of_week
    puzzle.date.wday
  end
end
