require "rails_helper"

RSpec.describe Api::V1::SolutionsController, type: :controller do
  let!(:user1) { FactoryGirl.create(:user) }
  let!(:puzzle1) { FactoryGirl.create(:puzzle) }
  let!(:solution1) { FactoryGirl.create(:solution, user: user1, puzzle: puzzle1) }

  describe 'PATCH#update' do
    it 'should accept an update of user_solution as array when the length matches the current length' do
      user_solution = solution1.user_answers.reverse
      solution_array = user_solution.split('')
      patch :update, params: { user_solution: solution_array, user_id: user1.id, id: solution1.id }

      expect(response.status).to eq(200)
      expect(Solution.where(user: user1, puzzle: puzzle1).first.user_answers).to eq(user_solution)
    end

    it 'should reject an update when incorrect length' do
      original_solution = solution1.user_answers
      user_solution = original_solution + " A"
      solution_array = user_solution.split('')
      patch :update, params: { user_solution: solution_array, user_id: user1.id, id: solution1.id }

      expect(response.status).to eq(409)
      expect(Solution.where(user: user1, puzzle: puzzle1).first.user_answers).to eq(original_solution)
    end

    it 'should return an object containing the updated solution as json array when successful' do
      user_solution = solution1.user_answers.reverse
      solution_array = user_solution.split('')
      patch :update, params: { user_solution: solution_array, user_id: user1.id, id: solution1.id }
      returned_json = JSON.parse(response.body)

      expect(response.content_type).to eq("application/json")
      expect(returned_json).to have_key('user_answers')
      expect(returned_json['user_answers']).to eq(solution_array)
    end

    it 'should updated the solutions correct boolean when given a value for is_solved' do
      user_solution = solution1.user_answers.reverse
      solution_array = user_solution.split('')
      patch :update, params: { user_solution: solution_array, is_solved: true, user_id: user1.id, id: solution1.id }
      expect(Solution.where(user: user1, puzzle: puzzle1).first.correct).to eq(true)

      patch :update, params: { user_solution: solution_array, is_solved: false, user_id: user1.id, id: solution1.id }
      expect(Solution.where(user: user1, puzzle: puzzle1).first.correct).to eq(false)
    end

    it 'updates the solution seconds column' do
      user_solution = solution1.user_answers.reverse
      solution_array = user_solution.split('')
      patch :update, params: { user_solution: solution_array, is_solved: true, user_id: user1.id, id: solution1.id, seconds: 124 }
      expect(Solution.where(user: user1, puzzle: puzzle1).first.seconds).to eq(124)
    end
  end
end
