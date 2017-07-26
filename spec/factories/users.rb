FactoryGirl.define do
  factory :user do
    provider "google_oauth2"
    sequence :uid do |n|
      "12345#{n}"
    end
    name "Ashlyn Swenson"
    sequence :oauth_token do |n|
      "67889789#{n}"
    end
    oauth_expires_at "2017-07-24 22:32:03"
    avatar_url "http://img.cool.com/stuff.jpg"
  end
end
