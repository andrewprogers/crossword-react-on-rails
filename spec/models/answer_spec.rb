require 'rails_helper'

RSpec.describe Answer, type: :model do
  it { should have_valid(:direction).when("Across", "Down") }
  it { should_not have_valid(:direction).when("across", "down") }
  it { should_not have_valid(:direction).when("other", "", nil) }

  it { should have_valid(:gridnum).when(1, 2, 45) }
  it { should_not have_valid(:gridnum).when("", nil, 4.5) }

  it { should have_valid(:clue).when("Let it stand") }
  it { should_not have_valid(:clue).when("", nil) }

  it { should have_valid(:answer).when("STET") }
  it { should_not have_valid(:answer).when("", nil) }

  it { should belong_to(:puzzle) }
end
