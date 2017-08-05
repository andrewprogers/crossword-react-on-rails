class Api::V1::WordsController < ApplicationController
  def index
    pattern = params[:pattern]
    if pattern.blank?
      words = []
    else
      datamuse_uri = "https://api.datamuse.com/words?sp=#{pattern}&max=50"
      response = HTTParty.get(datamuse_uri)
      words = JSON.parse(response.body)
      unless pattern.include?("?")
        words = words.select { |w| w["word"] === pattern.downcase }
      end
    end

    if words.length > 0
      render json: { words: words }
    else
      render json: {}, status: 404
    end
  end
end
