class Api::V1::PuzzlesController < ApplicationController
  def show
    puzzle = Puzzle.where(id: params[:id]).first
    if puzzle.nil?
      render json: {}, status: 404
    else
      puzzle_data = {}
      puzzle_data['clues'] = puzzle.get_clues
      puzzle_data['grid'] = puzzle.grid.split('')
      if current_user
        solution = Solution.where(puzzle: puzzle, user: current_user).first
        puzzle_data['user_solution'] = solution.user_answers.split('')
      end
      puzzle_data['size'] = {}
      puzzle_data['size']['rows'] = puzzle.size
      puzzle_data['size']['cols'] = puzzle.size

      render json: { puzzle: puzzle_data }
    end
  end
end
