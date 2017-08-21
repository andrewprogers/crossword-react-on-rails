FactoryGirl.define do
  factory :solution do
    user
    puzzle
    user_answers "FORM.EBD..ASD."
    correct false
    seconds 0
  end
end
