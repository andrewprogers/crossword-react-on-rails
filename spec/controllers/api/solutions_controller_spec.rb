require "rails_helper"

RSpec.describe Api::V1::SolutionsController, type: :controller do
  let!(:user1) { FactoryGirl.create(:user) }
  let!(:puzzle1) { FactoryGirl.create(:puzzle) }
  let!(:solution1) { FactoryGirl.create(:solution, user: user1, puzzle: puzzle1) }

  describe 'PATCH#update' do
    it 'should accept an update of user_solution when the length matches the current length' do
      user_solution = solution1.user_answers.reverse
      patch :update, params: {user_solution: user_solution, user_id: user1.id, id: solution1.id}

      expect(response.status).to eq(200)
      expect(Solution.where(user: user1, puzzle: puzzle1).first.user_answers).to eq(user_solution)
    end

    it 'should reject an update when incorrect length' do
      original_solution = solution1.user_answers
      user_solution = original_solution + " A"
      patch :update, params: {user_solution: user_solution, user_id: user1.id, id: solution1.id}

      expect(response.status).to eq(409)
      expect(Solution.where(user: user1, puzzle: puzzle1).first.user_answers).to eq(original_solution)
    end

    it 'should return an object containing the updated solution when successful' do
      user_solution = solution1.user_answers.reverse
      patch :update, params: {user_solution: user_solution, user_id: user1.id, id: solution1.id}
      returned_json = JSON.parse(response.body)

      expect(response.content_type).to eq("application/json")
      expect(returned_json).to have_key('user_answers')
      expect(returned_json['user_answers']).to eq(user_solution)
    end
  end
end
