require 'rails_helper'

feature 'user creates a new puzzle' do
  let!(:user) { FactoryGirl.create(:user) }

  scenario "unauthenticated user visits new puzzle page" do
    visit new_puzzle_path
    expect(page).to have_content("You must be signed in to create a new puzzle")
  end

  context "user signed in" do
    before(:each) do
      stub_omniauth
      visit root_path
      click_link("Sign in with Google")
      visit new_puzzle_path
    end

    scenario "authenticated user visits new puzzle page" do
      expect(page).to have_content("New puzzle")
      expect(page).to have_content("Enter a size for a new puzzle (number of rows)")
    end

    scenario "user inputs too small a grid size" do
      fill_in("Size", with: 3)
      fill_in("Draft Name", with: "My puzzle")
      click_button "Create Crossword"

      expect(page).to have_content("Error")
      expect(Puzzle.where(title: "My puzzle").length).to eq(0)
    end

    scenario "user inputs too large a grid size" do
      fill_in("Size", with: 30)
      fill_in("Draft Name", with: "My puzzle")
      click_button "Create Crossword"

      expect(page).to have_content("Error")
      expect(Puzzle.where(title: "My puzzle").length).to eq(0)
    end

    scenario "user inputs valid grid size" do
      fill_in("Size", with: 10)
      fill_in("Draft Name", with: "My puzzle")
      click_button "Create Crossword"
      expect(page).to_not have_content("Error")
      expect(Puzzle.where(title: "My puzzle").length).to eq(1)
    end
  end
end
