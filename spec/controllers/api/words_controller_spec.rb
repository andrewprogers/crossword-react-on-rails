require "rails_helper"

RSpec.describe Api::V1::WordsController, type: :controller do

  describe 'GET#index' do
    it 'should return a json' do
      VCR.use_cassette("sp_AS???") do
        get :index, params: { pattern: "AS???" }

        expect(response.content_type).to eq("application/json")
        expect(response.status).to eq(200)
      end
    end

    it 'should parse to an object with array of word hashes' do
      VCR.use_cassette("sp_AS???") do
        get :index, params: { pattern: "AS???" }
        words = JSON.parse(response.body)["words"]

        expect(words).to be_a(Array)
        expect(words[0]).to be_a(Hash)
        expect(words[0]['word']).to be_a(String)
      end
    end

    it 'should have word hashes with scores' do
      VCR.use_cassette("sp_AS???") do
        get :index, params: { pattern: "AS???" }
        words = JSON.parse(response.body)["words"]

        expect(words[0]['score']).to be_a(Integer)
      end
    end

    it 'should return an array with a single word object if no blanks' do
      VCR.use_cassette("sp_ASKED") do
        get :index, params: { pattern: "ASKED" }
        words = JSON.parse(response.body)["words"]

        expect(words.length).to eq(1)
      end
    end

    it 'should give an error if no match can be made' do
      VCR.use_cassette("JUNK") do
        get :index, params: { pattern: "AVSRFDSV" }

        expect(response.status).to eq(404)
      end
    end

    it 'should give an error if no pattern is given' do
      VCR.use_cassette("BLANK") do
        get :index, params: { pattern: "" }

        expect(response.status).to eq(404)
      end
    end
  end
end
