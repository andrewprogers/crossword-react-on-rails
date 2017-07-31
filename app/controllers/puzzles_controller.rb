class PuzzlesController < ApplicationController
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
      @puzzle = Puzzle.new()
    end
  end

  def create
    @puzzle = Puzzle.new(puzzle_params)
    @puzzle.user = current_user
    @puzzle.grid = " " * @puzzle.size * @puzzle.size
    @puzzle.date = Date.today()
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

  private

  def puzzle_params
    params.require(:puzzle).permit(:size, :title)
  end
end
