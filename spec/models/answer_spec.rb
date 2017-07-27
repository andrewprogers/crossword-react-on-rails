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

  describe "#formatted_clue" do
    it "returns a clue with gridnum and clue text in proper format" do
      answer = FactoryGirl.create(:answer, gridnum: 5, clue: "Desktop critter")
      expect(answer.formatted_clue).to eq("5. Desktop critter")
    end
  end
end
