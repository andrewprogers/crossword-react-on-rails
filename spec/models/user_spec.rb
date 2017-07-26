require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_valid(:provider).when("google_oauth2") }
  it { should_not have_valid(:provider).when("", nil, "twitter", "google") }

  it { should_not have_valid(:uid).when("", nil) }
  it { should_not have_valid(:name).when("", nil) }
end
