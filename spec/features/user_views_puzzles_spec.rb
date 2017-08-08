require "rails_helper"

feature "user views puzzles index" do
  let!(:puzzle) { FactoryGirl.create(:puzzle, draft: false) }

  before(:each) do
    visit root_path
    click_link("Play")
  end

  scenario "user sees a list of puzzles on the page" do
    expect(page).to have_content(puzzle.title)
    expect(page).to have_content(puzzle.user.name)
  end

  scenario "user does not see drafts on the page" do
    draft = FactoryGirl.create(:draft_puzzle)
    expect(page).to_not have_content(draft.title)
  end
end
