class Api::V1::WordsController < ApplicationController
  def index
    pattern = params[:pattern]
    datamuse_uri = "https://api.datamuse.com/words?sp=#{pattern}"
    response = HTTParty.get(datamuse_uri)

    binding.pry
    render json: {}
  end
end
