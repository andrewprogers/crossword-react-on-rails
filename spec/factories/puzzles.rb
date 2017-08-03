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
    draft false
    draft_clues_json nil
    created_at Time.now
    updated_at Time.now

    factory :draft_puzzle do
      sequence :title do |n|
        "draft_puzzle_title_#{n}"
      end
      draft true
      json = {
        across: ['across1', 'across2', 'across3', 'across4', 'across5'],
        down: ['down1', 'down2', 'down3', 'down4', 'down5']
      }.to_json
      draft_clues_json json
    end
  end
end
