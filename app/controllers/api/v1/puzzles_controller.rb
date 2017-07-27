class Api::V1::PuzzlesController < ApplicationController
  def show
    puzzle = {}
    
    render json: {puzzle: "a"}
  end
end
