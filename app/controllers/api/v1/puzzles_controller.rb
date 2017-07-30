class Api::V1::PuzzlesController < ApplicationController
  def show
    puzzle = Puzzle.where(id: params[:id]).first
    if puzzle.nil?
      render json: {}, status: 404
    else
      puzzle_data = {}
      puzzle_data['clues'] = puzzle.get_clues
      puzzle_data['grid'] = puzzle.grid.split('')
      puzzle_data['size'] = {}
      puzzle_data['size']['rows'] = puzzle.size
      puzzle_data['size']['cols'] = puzzle.size

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
end
