require 'rails_helper'

feature 'user views their puzzles page' do
  scenario "unauthenticated user does not have link" do
    visit root_path
    expect(page).to_not have_content("My Puzzles")
  end

  context "user signed in" do
    before(:each) do
      stub_omniauth
      visit root_path
      click_link("Sign in with Google")
      visit root_path
    end

    scenario "user has list of their own puzzles" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first
      puzzle = FactoryGirl.create(:puzzle, user: user)

      click_link('My Puzzles')
      expect(page).to have_content('Your Puzzles')
      expect(page).to have_content(puzzle.title)
      expect(page).to_not have_content("You haven't created any puzzles yet!")
    end

    scenario "user has not created any puzzles" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first

      click_link('My Puzzles')
      expect(page).to have_content('Your Puzzles')
      expect(page).to have_content("You haven't created any puzzles yet!")
    end

    scenario "user has list of puzzles they are solving" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first
      puzzle = FactoryGirl.create(:puzzle)
      solution = FactoryGirl.create(:solution, user: user, puzzle: puzzle)

      click_link('My Puzzles')
      expect(page).to have_content('Puzzles In Progress')
      expect(page).to have_content(puzzle.title)
      expect(page).to_not have_content("No Unfinished Puzzles!")
    end

    scenario "user has no unfinished puzzles" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first
      puzzle = FactoryGirl.create(:puzzle)

      click_link('My Puzzles')
      expect(page).to have_content('Puzzles In Progress')
      expect(page).to_not have_content(puzzle.title)
      expect(page).to have_content("No Unfinished Puzzles!")
    end

    scenario "user has list of their own drafts" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first
      draft = FactoryGirl.create(:puzzle, user: user, draft: true)

      click_link('My Puzzles')
      expect(page).to have_content('Your Drafts')
      expect(page).to have_content(draft.title)
      expect(page).to_not have_content("You don't have any drafts right now")
    end

    scenario "user has not created any drafts" do
      user = User.where(provider: "google_oauth2", uid: "12345678910").first

      click_link('My Puzzles')
      expect(page).to have_content('Your Drafts')
      expect(page).to have_content("You don't have any drafts right now!")
    end
  end
end
