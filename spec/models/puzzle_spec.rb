require 'rails_helper'

RSpec.describe Puzzle, type: :model do
  it { should have_valid(:size).when(13) }
  it { should_not have_valid(:size).when(nil, '') }
  it { should_not have_valid(:size).when(2.3) }

  it { should have_valid(:grid).when('ASDF.ADF.ASDDDFA.ADFAASD.ASDFAD.ASDFA') }
  it { should_not have_valid(:grid).when(nil, '') }

  it { should have_valid(:date).when(Time.now) }
  it { should_not have_valid(:date).when(nil, '') }

  it { should have_valid(:notes).when('adfasdfasdfsadfsadf', '') }

  it { should belong_to(:user) }
  it { should have_many(:answers) }
  it { should have_many(:solutions) }

  describe "#get_clues" do
    let!(:puzzle1) { FactoryGirl.create(:puzzle) }
    let!(:across1) { FactoryGirl.create(:answer, clue: "A clue", direction: "Across", puzzle: puzzle1) }
    let!(:across2) { FactoryGirl.create(:answer, clue: "A clue2", direction: "Across", puzzle: puzzle1) }
    let!(:down1) { FactoryGirl.create(:answer, clue: "A clue3", direction: "Down", puzzle: puzzle1) }
    let!(:down2) { FactoryGirl.create(:answer, clue: "A clue4", direction: "Down", puzzle: puzzle1) }

    it "returns a hash of across and down clues" do
      expect(puzzle1.get_clues).to be_a(Hash)
      expect(puzzle1.get_clues).to have_key("across")
      expect(puzzle1.get_clues).to have_key("down")
    end

    it "has an array of across clues" do
      expect(puzzle1.get_clues['across']).to include(across1.formatted_clue)
      expect(puzzle1.get_clues['across']).to_not include(down1.formatted_clue)
    end

    it "has an array of down clues" do
      expect(puzzle1.get_clues['down']).to_not include(across1.formatted_clue)
      expect(puzzle1.get_clues['down']).to include(down1.formatted_clue)
    end
  end
end
