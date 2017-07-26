FactoryGirl.define do
  factory :answer do
    sequence :gridnum do |n|
      n
    end
    puzzle
    sequence :direction do |n|
      (n % 2 == 0) ? "Across" : "Down"
    end
    clue "Semper Ubi Sub Ubi"
    answer "UNDERWEAR"
  end
end
