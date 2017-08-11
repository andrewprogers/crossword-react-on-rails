class PuzzlesController < ApplicationController
  def index
    @columns = {}
    if params[:user_id].nil?
      @user = nil
      @puzzles = Puzzle.includes(:user).where(draft: false).limit(20).reverse_order
    else
      @user = User.find(params[:user_id])
      @created_puzzles = Puzzle.includes(:user).where(user: @user, draft: false).limit(20).reverse_order
      @draft_puzzles = Puzzle.includes(:user).where(user: @user, draft: true).limit(20).reverse_order
      user_solutions = Solution.includes(puzzle: :user).where(user: @user, correct: false).limit(20).reverse_order
      @puzzles_in_progress = user_solutions.map { |solution| solution.puzzle}.reject { |el| el.nil? || el.draft } || []
    end
  end

  def show
    if Puzzle.where(id: params[:id]).first.draft
      flash[:error] = "That page is unavailable"
      redirect_to root_path
    end
  end

  def new
    if current_user.nil?
      flash[:error] = "You must be signed in to create a new puzzle"
      redirect_to root_path
    else
      @puzzle = Puzzle.new
    end
  end

  def create
    @puzzle = Puzzle.new(puzzle_params)
    @puzzle.user = current_user
    @puzzle.grid = " " * @puzzle.size * @puzzle.size
    @puzzle.date = Date.today
    @puzzle.draft = true

    if @puzzle.save
      redirect_to edit_puzzle_path(@puzzle)
    else
      flash[:error] = "Error: " + @puzzle.errors.full_messages.to_sentence
      render :new
    end
  end

  def edit
    @puzzle = Puzzle.where(id: params[:id]).first
    if !@puzzle.draft || @puzzle.user != current_user
      flash[:error] = "That page is unavailable"
      redirect_to root_path
    end
  end

  def random
    random_puzzle = Puzzle.where(draft: false).sample
    redirect_to puzzle_path(random_puzzle)
  end

  private

  def puzzle_params
    params.require(:puzzle).permit(:size, :title)
  end
end
