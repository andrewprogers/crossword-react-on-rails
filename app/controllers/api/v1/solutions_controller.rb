class Api::V1::SolutionsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def update
    solution = Solution.where(user_id: params[:user_id], id: params[:id]).first
    update = params[:user_solution].flatten.join('')

    if update.length != solution.user_answers.length
      render json: {}, status: 409
    else
      solution.correct = params[:is_solved] unless params[:is_solved].nil?
      solution.user_answers = update
      solution.save!
      render json: { user_answers: params[:user_solution] }
    end
  end
end
