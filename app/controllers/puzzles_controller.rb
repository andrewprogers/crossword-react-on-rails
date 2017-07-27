class PuzzlesController < ApplicationController
  def show
    @puzzle_id = params[:id]
  end
end
