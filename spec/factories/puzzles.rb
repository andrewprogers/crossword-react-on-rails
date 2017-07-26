FactoryGirl.define do
  factory :puzzle do
    sequence :title do |n|
      "puzzle_title_#{n}"
    end
    user
    size 5
    grid "..ASD.ASDFASDDFWERT.QWT.."
    date Time.now
    notes "These are the notes"
    created_at Time.now
    updated_at Time.now
  end
end
