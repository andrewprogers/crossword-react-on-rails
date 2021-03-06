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
      expect(across).to include(across1.clue)

      expect(down).to be_a(Array)
      expect(down.length).to eq(2)
      expect(down).to include(down1.clue)
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

    it "should have a seconds property with the solution solve time" do
      user1 = FactoryGirl.create(:user)
      solution1 = FactoryGirl.create(:solution, puzzle: puzzle1, user: user1, seconds: 123)
      session[:user_id] = user1.id

      get :show, params: { id: puzzle1.id }
      solution_seconds = JSON.parse(response.body)['puzzle']['solution_seconds']
      expect(solution_seconds).to eq(123)
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

    it "should have a draft property indicating whether the current puzzle is a draft" do
      get :show, params: { id: puzzle1.id }
      title = JSON.parse(response.body)['puzzle']['title']

      expect(title).to eq(puzzle1.title)
    end

    it 'should determine clues property from draft_clues_json when puzzle is a draft' do
      draft_json = {
        across: ['across_clue'],
        down: ['down_clue', 'down2', 'down3']
      }.to_json
      draft = FactoryGirl.create(:puzzle, draft: true, draft_clues_json: draft_json)
      session[:user_id] = draft.user.id

      get :show, params: { id: draft.id }
      returned_json = JSON.parse(response.body)
      across = returned_json['puzzle']['clues']['across']
      down = returned_json['puzzle']['clues']['down']

      expect(across.length).to eq(1)
      expect(down.length).to eq(3)
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
      new_grid = (".ABC." * 5).split('')
      patch :update, params: { grid_update: new_grid, id: draft.id }
      expect(response.status).to eq(200)
      expect(Puzzle.find(draft.id).grid).to eq(new_grid.join(''))
    end

    it "should accept an update to the Puzzle title when not empty" do
      new_grid = (".ABC." * 5).split('')
      new_title = "My new title"
      patch :update, params: { grid_update: new_grid, title_update: new_title, id: draft.id }
      expect(response.status).to eq(200)
      expect(Puzzle.find(draft.id).title).to eq(new_title)
    end

    it "If given a blank string for the title, should store the date as the title" do
      new_grid = (".ABC." * 5).split('')
      new_title = ""
      patch :update, params: { grid_update: new_grid, title_update: new_title, id: draft.id }
      expect(response.status).to eq(200)
      expect(Puzzle.find(draft.id).title).to eq(draft.date.strftime('%A, %b %d'))
    end

    it "should accept an update to the clues property" do
      new_grid = (".ABC." * 5).split('')
      clues_update = { across: ['clue1', 'clue2'], down: ['clue3', 'clue4'] }
      patch :update, params: { grid_update: new_grid, clues_update: clues_update, id: draft.id }
      expect(response.status).to eq(200)
      expect(Puzzle.find(draft.id).draft_clues_json).to eq(clues_update.to_json)
    end

    it "When successful, should return the updated grid value as array" do
      new_grid = (".ABC." * 5).split('')
      patch :update, params: { grid_update: new_grid, id: draft.id }
      returned_json = JSON.parse(response.body)

      expect(returned_json['grid']).to eq(new_grid)
    end

    it "should reject an update to the grid if the puzzle is not a draft" do
      non_draft = FactoryGirl.create(:puzzle, draft: false, size: 5)
      new_grid = (".ABC." * 5).split('')
      patch :update, params: { grid_update: new_grid, id: non_draft.id }

      expect(response.status).to eq(404)
      expect(Puzzle.find(non_draft.id).grid).to_not eq(new_grid.join(''))
    end

    it "should reject an update to the grid if it is not the correct length" do
      new_grid = (".ABC." * 4).split('')
      patch :update, params: { grid_update: new_grid, id: draft.id }
      expect(response.status).to eq(404)
      expect(Puzzle.find(draft.id).grid).to_not eq(new_grid.join(''))
    end
  end

  describe "PATCH#publish" do
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

    it "should respond with status 404 if draft puzzle is not valid and fail to publish" do
      draft.grid = 'ADS.   .ASD'
      draft.save

      patch :publish, params: { clue_numbers: clue_numbers, clue_answers: clue_answers, id: draft.id }
      expect(response.status).to eq(404)
      expect(Puzzle.find(draft.id).draft).to eq(true)
    end

    it "should update valid puzzles to have draft equal false" do
      patch :publish, params: { clue_numbers: clue_numbers, clue_answers: clue_answers, id: draft.id }
      expect(Puzzle.find(draft.id).draft).to eq(false)
    end

    it "should update valid puzzles to have draft_clues_json to be nil" do
      patch :publish, params: { clue_numbers: clue_numbers, clue_answers: clue_answers, id: draft.id }
      expect(Puzzle.find(draft.id).draft_clues_json).to eq(nil)
    end

    it "should create answers for the puzzle" do
      patch :publish, params: { clue_numbers: clue_numbers, clue_answers: clue_answers, id: draft.id }
      expected_answer_nums = clue_numbers[:across] + clue_numbers[:across]
      expect(Answer.where(puzzle: draft).length).to eq(expected_answer_nums.length)
    end
  end
end
