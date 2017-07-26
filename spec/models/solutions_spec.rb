require 'rails_helper'

RSpec.describe Solution, type: :model do
  it { should have_valid(:created_at).when(Time.now) }
  it { should have_valid(:updated_at).when(Time.now) }
  it { should_not have_valid(:created_at).when('', nil) }
  it { should_not have_valid(:updated_at).when('', nil) }

  it { should have_valid(:user_answers).when("", "ASBAS..ASD") }
  it { should_not have_valid(:user_answers).when(nil) }

  it { should belong_to(:user) }
  it { should belong_to(:puzzle) }
end
