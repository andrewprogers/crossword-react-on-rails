require "rails_helper"

feature "user views a puzzles play page" do
  let!(:draft) { FactoryGirl.create(:puzzle, draft: true) }

  scenario "user tries to view draft puzzle on play page" do
    visit puzzle_path(draft)
    expect(page).to have_content("That page is unavailable")
  end

  scenario "unauthenticated user tries to view draft puzzle on play page" do
    visit edit_puzzle_path(draft)
    expect(page).to have_content("That page is unavailable")
  end

  scenario "user who is not owner tries to view draft puzzle on play page" do
    stub_omniauth
    visit root_path
    click_link("Sign in with Google")
    user = User.where(provider: "google_oauth2", uid: "12345678910").first
    draft2 = FactoryGirl.create(:puzzle, draft: true)

    visit edit_puzzle_path(draft2)
    expect(page).to have_content("That page is unavailable")
  end

  scenario "owner tries to view draft puzzle on play page" do
    stub_omniauth
    visit root_path
    click_link("Sign in with Google")
    user = User.where(provider: "google_oauth2", uid: "12345678910").first
    draft2 = FactoryGirl.create(:puzzle, draft: true, user: user)

    visit edit_puzzle_path(draft2)
    expect(page).to_not have_content("That page is unavailable")
  end
end
