class User < ApplicationRecord
  has_many :puzzles
  has_many :solutions

  validates :provider, presence: true, inclusion: { in: ["google_oauth2"] }
  validates :uid, presence: true
  validates :name, presence: true

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.avatar_url = auth.info.image
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end
end
