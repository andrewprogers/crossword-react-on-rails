class Api::V1::PuzzlesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update, :publish]

  def show
    puzzle = Puzzle.where(id: params[:id]).first
    if puzzle.nil? || (puzzle.draft == true && puzzle.user != current_user)
      render json: {}, status: 404
    else
      puzzle_data = {}
      puzzle_data['clues'] = if puzzle.draft
        puzzle.get_draft_clues
      else
        puzzle.get_clues
      end
      puzzle_data['grid'] = puzzle.grid.split('')
      puzzle_data['size'] = {}
      puzzle_data['size']['rows'] = puzzle.size
      puzzle_data['size']['cols'] = puzzle.size
      puzzle_data['draft'] = puzzle.draft
      puzzle_data['title'] = puzzle.title

      if current_user
        unless puzzle.draft
          solution = Solution.where(puzzle: puzzle, user: current_user).first
          if solution.nil?
            answers = " " * puzzle.grid.length
            solution = Solution.create!(user_answers: answers, user: current_user, puzzle: puzzle)
          end
          puzzle_data['user_solution'] = solution.user_answers.split('')
          puzzle_data['solution_id'] = solution.id
          puzzle_data['is_solved'] = solution.correct
          puzzle_data['solution_seconds'] = solution.seconds
        end

        puzzle_data['user_id'] = current_user.id
      end

      render json: { puzzle: puzzle_data }
    end
  end

  def update
    puzzle = Puzzle.find(params[:id])
    flat_update = params[:grid_update].flatten

    if puzzle.draft && flat_update.length == puzzle.size**2
      puzzle.grid = flat_update.join('')
      puzzle.title = params[:title_update]
      puzzle.title = puzzle.date.strftime('%A, %b %d') if puzzle.title == ""
      puzzle.draft_clues_json = params[:clues_update].to_json
      puzzle.save!
      render json: { grid: params[:grid_update] }, status: 200
    else
      render json: {}, status: 404
    end
  end

  def publish
    @puzzle = Puzzle.find(params[:id])
    if @puzzle.validate_draft(params[:clue_numbers], params[:clue_answers])
      @puzzle.create_answers_from_draft(params[:clue_numbers], params[:clue_answers])
      @puzzle.draft_clues_json = nil
      @puzzle.draft = false
      @puzzle.save
      flash[:notice] = "Your puzzle was successfully saved!"
      render json: { puzzle_id: params[:id] }
    else
      render json: { errors: "Puzzle failed to save." }, status: 404
    end
  end
end
