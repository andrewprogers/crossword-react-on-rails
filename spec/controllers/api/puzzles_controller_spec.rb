require "rails_helper"

RSpec.describe Api::V1::PuzzlesController, type: :controller do
  describe 'GET#show' do
    let!(:puzzle1) { FactoryGirl.create(:puzzle) }
    let!(:across1) { FactoryGirl.create(:answer, clue: "A clue", direction: "Across", puzzle: puzzle1) }
    let!(:across2) { FactoryGirl.create(:answer, clue: "A clue2", direction: "Across", puzzle: puzzle1) }
    let!(:down1) { FactoryGirl.create(:answer, clue: "A clue3", direction: "Down", puzzle: puzzle1) }
    let!(:down2) { FactoryGirl.create(:answer, clue: "A clue4", direction: "Down", puzzle: puzzle1) }

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

    it "should have an is_solved property that reflects if the users answer is correct" do
      user1 = FactoryGirl.create(:user)
      solution1 = FactoryGirl.create(:solution, puzzle: puzzle1, user: user1, correct: true)
      session[:user_id] = user1.id

      get :show, params: { id: puzzle1.id }
      solution_correct = JSON.parse(response.body)['puzzle']['is_solved']
      expect(solution_correct).to eq(true)
    end

    it "creates a solution for the current user if none exists" do
      user1 = FactoryGirl.create(:user)
      session[:user_id] = user1.id

      expect(Solution.where(user: user1).length).to eq(0)
      get :show, params: { id: puzzle1.id }

      expect(Solution.where(user: user1).length).to eq(1)
    end

    it "should have a nil solution for the puzzle if not logged in" do
      get :show, params: { id: puzzle1.id }
      user_solution = JSON.parse(response.body)['puzzle']['user_solution']
      expect(user_solution).to be_nil
    end

    it "should return the current user id and solution id when user is logged in" do
      user1 = FactoryGirl.create(:user)
      session[:user_id] = user1.id

      get :show, params: { id: puzzle1.id }
      user_id = JSON.parse(response.body)['puzzle']['user_id']
      solution_id = JSON.parse(response.body)['puzzle']['solution_id']
      expect(user_id).to eq(user1.id)
      expect(solution_id).to eq(Solution.where(user: user1, puzzle: puzzle1).first.id)
    end

    it "should have a size object with rows and cols properties" do
      get :show, params: { id: puzzle1.id }
      size = JSON.parse(response.body)['puzzle']['size']

      expect(size['rows']).to eq(puzzle1.size)
      expect(size['cols']).to eq(puzzle1.size)
    end

    it "should have a draft property indicating whether the current puzzle is a draft" do
      puzzle1.draft = true
      puzzle1.save
      session[:user_id] = puzzle1.user.id

      get :show, params: { id: puzzle1.id }
      draft = JSON.parse(response.body)['puzzle']['draft']

      expect(draft).to eq(true)
    end

    it "should return a 404 response if the puzzle id does not exist" do
      get :show, params: { id: puzzle1.id + 10 }
      expect(response.status).to eq(404)
    end

    it "should return a 404 response if the puzzle is a draft an not owned by current user" do
      puzzle1.draft = true
      puzzle1.save
      session[:user_id] = FactoryGirl.create(:user).id

      get :show, params: { id: puzzle1.id }
      expect(response.status).to eq(404)
    end
  end

  describe "PATCH#update" do
    let!(:draft) { FactoryGirl.create(:puzzle, draft: true, size: 5) }

    it "should accept a properly formatted update to the puzzle grid" do
      new_grid = ".ABC." * 5
      patch :update, params: { grid_update: new_grid, id: draft.id }
      expect(response.status).to eq(200)
      expect(Puzzle.find(draft.id).grid).to eq(new_grid)
    end

    it "When successful, should return the updated grid value" do
      new_grid = ".ABC." * 5
      patch :update, params: { grid_update: new_grid, id: draft.id }
      returned_json = JSON.parse(response.body)

      expect(returned_json['grid']).to eq(new_grid)
    end

    it "should reject an update to the grid if the puzzle is not a draft" do
      non_draft = FactoryGirl.create(:puzzle, draft: false, size: 5)
      new_grid = ".ABC." * 5
      patch :update, params: { grid_update: new_grid, id: non_draft.id }

      expect(response.status).to eq(404)
      expect(Puzzle.find(non_draft.id).grid).to_not eq(new_grid)
    end

    it "should reject an update to the grid if it is not the correct length" do
      new_grid = ".ABC." * 4
      patch :update, params: { grid_update: new_grid, id: draft.id }
      expect(response.status).to eq(404)
      expect(Puzzle.find(draft.id).grid).to_not eq(new_grid)
    end
  end
end
