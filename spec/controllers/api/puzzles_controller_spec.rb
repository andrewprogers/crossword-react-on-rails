require "rails_helper"

RSpec.describe Api::V1::PuzzlesController, type: :controller do
  let!(:puzzle1) { FactoryGirl.create(:puzzle) }
  let!(:across1) { FactoryGirl.create(:answer, clue: "A clue", direction: "Across", puzzle: puzzle1) }
  let!(:across2) { FactoryGirl.create(:answer, clue: "A clue2", direction: "Across", puzzle: puzzle1) }
  let!(:down1) { FactoryGirl.create(:answer, clue: "A clue3", direction: "Down", puzzle: puzzle1) }
  let!(:down2) { FactoryGirl.create(:answer, clue: "A clue4", direction: "Down", puzzle: puzzle1) }

  describe 'GET#show' do
    it "should return a json representation of a puzzle" do
      get :show, params: { id: puzzle1.id }
      returned_json = JSON.parse(response.body)

      expect(response.content_type).to eq("application/json")
      expect(returned_json).to have_key('puzzle')
    end

    it "should have a clues object with an arrays of across and down clues" do
      get :show, params: { id: puzzle1.id }
      returned_json = JSON.parse(response.body)
      across = returned_json['puzzle']['clues']['across']
      down = returned_json['puzzle']['clues']['down']

      expect(across).to be_a(Array)
      expect(across.length).to eq(2)
      expect(across).to include("#{across1.gridnum}. #{across1.clue}")

      expect(down).to be_a(Array)
      expect(down.length).to eq(2)
      expect(down).to include("#{down1.gridnum}. #{down1.clue}")
    end

    it "should have an array representation of the grid" do
      get :show, params: { id: puzzle1.id }
      grid = JSON.parse(response.body)['puzzle']['grid']

      expect(grid).to eq(puzzle1.grid.split(''))
    end

    it "should have an array of a users solution for the puzzle if logged in" do
      user1 = FactoryGirl.create(:user)
      solution1 = FactoryGirl.create(:solution, puzzle: puzzle1, user: user1)
      session[:user_id] = user1.id

      get :show, params: { id: puzzle1.id }
      user_solution = JSON.parse(response.body)['puzzle']['user_solution']
      expect(user_solution).to eq(solution1.user_answers.split(''))
    end

    it "should have a nil solution for the puzzle if not logged in" do
      get :show, params: { id: puzzle1.id }
      user_solution = JSON.parse(response.body)['puzzle']['user_solution']
      expect(user_solution).to be_nil
    end

    it "should have a size object with rows and cols properties" do
      get :show, params: { id: puzzle1.id }
      size = JSON.parse(response.body)['puzzle']['size']

      expect(size['rows']).to eq(puzzle1.size)
      expect(size['cols']).to eq(puzzle1.size)
    end

    it "should return a 400 level response if the puzzle id does not exist" do
      get :show, params: {id: puzzle1.id + 10 }
      expect(response.status).to eq(404)
    end
  end
end
