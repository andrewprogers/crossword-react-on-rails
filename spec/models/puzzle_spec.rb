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

  describe '#validate_draft' do
    let!(:draft) { FactoryGirl.create(:draft_puzzle) }
    let!(:clue_numbers) do
      {
        across: [1, 4, 5, 6, 7],
        down: [1, 2, 3, 4, 5]
      }
    end
    let!(:clue_answers) do
      {
        across: ['aans1', 'aans2', 'aans3', 'aans4', 'aans5'],
        down: ['dans1', 'dans2', 'dans3', 'dans4', 'dans5']
      }
    end

    it "should return false if grid is wrong length" do
      draft.grid = '..ASDFSF.AD.AF'
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if grid has spaces" do
      draft.grid[3] = ' '
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if the Title is not present" do
      draft.title = ''
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if all across clues are not complete" do
      json = {
        across: ['across1', 'across2', 'across3', 'across4'],
        down: ['down1', 'down2', 'down3', 'down4', 'down5']
      }.to_json
      draft.draft_clues_json = json
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if all down clues are not complete" do
      json = {
        across: ['across1', 'across2', 'across3', 'across4', 'across5'],
        down: ['down1', 'down2', 'down3', 'down4']
      }.to_json
      draft.draft_clues_json = json
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if the number of across answers does not match across clues" do
      clue_answers[:across].pop
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it "should return false if the number of across answers does not match across clues" do
      clue_answers[:down].pop
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(false)
    end

    it 'should return true otherwise' do
      expect(draft.validate_draft(clue_numbers, clue_answers)).to eq(true)
    end
  end

  describe '#create_answers_from_json' do
    let!(:draft) { FactoryGirl.create(:draft_puzzle) }
    let!(:clue_numbers) do
      {
        across: [1, 4, 5, 6, 7],
        down: [1, 2, 3, 4, 5]
      }
    end
    let!(:clue_answers) do
      {
        across: ['aans1', 'aans2', 'aans3', 'aans4', 'aans5'],
        down: ['dans1', 'dans2', 'dans3', 'dans4', 'dans5']
      }
    end

    it "creates one answer for the puzzle for each across clue number" do
      draft.create_answers_from_draft(clue_numbers, clue_answers)
      across_answers = Answer.where(puzzle: draft, direction: "Across")
      expect(across_answers.length).to eq(clue_numbers[:across].length)
    end

    it "creates one answer for the puzzle for each down clue number" do
      draft.create_answers_from_draft(clue_numbers, clue_answers)
      down_answers = Answer.where(puzzle: draft, direction: "Down")
      expect(down_answers.length).to eq(clue_numbers[:down].length)
    end

    it "creates an across answer with correct values" do
      draft.create_answers_from_draft(clue_numbers, clue_answers)
      answer = Answer.where(
        puzzle: draft,
        direction: "Across",
        gridnum: clue_numbers[:across][0],
        answer: clue_answers[:across][0],
        clue: JSON.parse(draft.draft_clues_json)["across"][0]
      )
      expect(answer.length).to eq(1)
    end

    it "creates an down answer with correct values" do
      draft.create_answers_from_draft(clue_numbers, clue_answers)
      answer = Answer.where(
        puzzle: draft,
        direction: "Down",
        gridnum: clue_numbers[:down][0],
        answer: clue_answers[:down][0],
        clue: JSON.parse(draft.draft_clues_json)["down"][0]
      )
      expect(answer.length).to eq(1)
    end
  end
end
