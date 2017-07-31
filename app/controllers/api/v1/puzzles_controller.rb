class Api::V1::PuzzlesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update]

  def show
    puzzle = Puzzle.where(id: params[:id]).first
    if puzzle.nil? || (puzzle.draft == true && puzzle.user != current_user)
      render json: {}, status: 404
    else
      puzzle_data = {}
      puzzle_data['clues'] = puzzle.get_clues
      puzzle_data['grid'] = puzzle.grid.split('')
      puzzle_data['size'] = {}
      puzzle_data['size']['rows'] = puzzle.size
      puzzle_data['size']['cols'] = puzzle.size
      puzzle_data['draft'] = puzzle.draft

      if current_user
        solution = Solution.where(puzzle: puzzle, user: current_user).first
        if solution.nil?
          answers = " " * puzzle.grid.length
          solution = Solution.create!(user_answers: answers, user: current_user, puzzle: puzzle)
        end
        puzzle_data['user_solution'] = solution.user_answers.split('')
        puzzle_data['user_id'] = current_user.id
        puzzle_data['solution_id'] = solution.id
        puzzle_data['is_solved'] = solution.correct
      end

      render json: { puzzle: puzzle_data }
    end
  end

  def update
    puzzle = Puzzle.find(params[:id])
    unless puzzle.draft
      render json: {}, status: 404
    else
      flat_update = params[:grid_update].flatten
      unless flat_update.length == puzzle.size ** 2
        render json: {}, status: 404
      else
        puzzle.grid = flat_update.join('')
        puzzle.save!
        render json: { grid: params[:grid_update] }, status: 200
      end
    end
  end
end
