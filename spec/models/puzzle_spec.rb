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

  it { should have_valid(:draft).when(true, false) }
  it { should_not have_valid(:draft).when(nil, '') }

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
      expect(puzzle1.get_clues['across']).to include(across1.clue)
      expect(puzzle1.get_clues['across']).to_not include(down1.clue)
    end

    it "has an array of down clues" do
      expect(puzzle1.get_clues['down']).to_not include(across1.clue)
      expect(puzzle1.get_clues['down']).to include(down1.clue)
    end
  end

  describe '#get_draft_clues' do
    draft_json = {
      across: ['across_clue'],
      down: ['down_clue', 'down2'],
    }.to_json

    let!(:draft) { FactoryGirl.create(:puzzle, draft: true, draft_clues_json: draft_json) }

    it 'returns a clues hash' do
      expect(draft.get_draft_clues['across'].length).to eq(1)
      expect(draft.get_draft_clues['down'].length).to eq(2)
      expect(draft.get_draft_clues['down'][0]).to eq('down_clue')
    end

    it 'returns an empty clues hash when it fails to parse the json' do
      draft2 = FactoryGirl.create(:puzzle, draft: true, draft_clues_json: "2vas3/<")

      expect(draft2.get_draft_clues['across']).to be_a(Array)
      expect(draft2.get_draft_clues['across'].length).to eq(0)
      expect(draft2.get_draft_clues['down'].length).to eq(0)
    end
  end
end
