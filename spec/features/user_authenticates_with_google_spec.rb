require 'rails_helper'

feature "user authenticates with google" do
  scenario "user signs in" do
    stub_omniauth
    visit root_path
    expect(page).to have_content("Sign in with Google")
    click_link("Sign in with Google")

    expect(page).to have_content("Test User")
    expect(page).to have_content("Sign Out")
  end

  scenario "user signs out" do
    stub_omniauth
    visit root_path
    click_link("Sign in with Google")
    click_link("Sign Out")
    expect(page).to have_content("You have signed out successfully!")
    expect(page).to have_content("Sign in with Google")
  end
end
