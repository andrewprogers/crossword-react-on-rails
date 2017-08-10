class Api::V1::WordsController < ApplicationController
  def index
    threshold = 250
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
      words = words.select { |w| w["score"] > threshold }
    end

    if words.length > 0
      render json: { words: words }
    else
      render json: {}, status: 404
    end
  end

  def analyze
    word = params[:word].upcase
    answers = Answer.includes(:puzzle).where(answer: word)

    response = {}
    response[:word] = word
    
    dow_frequency = Answer.days_of_week(answers)
    response[:days] = dow_frequency

    response[:clues] = Answer.select_random_clues(answers, 20)
    response[:difficulty_score] = Answer.difficulty_from_frequency(dow_frequency)

    render json: response, status: 200
  end
end
