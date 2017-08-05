require "rails_helper"

RSpec.describe Api::V1::WordsController, type: :controller do

  describe 'GET#index' do
    it 'should return a json' do
      VCR.use_cassette("sp_AS???") do
        get :index, params: { pattern: "AS???" }

        returned_json = JSON.parse(response.body)
        expect(response.content_type).to eq("application/json")
        expect(response.status).to eq(200)
      end
    end
  end
end
