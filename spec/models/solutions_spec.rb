require 'rails_helper'

RSpec.describe Solution, type: :model do
  it { should have_valid(:user_answers).when("", "ASBAS..ASD") }
  it { should_not have_valid(:user_answers).when(nil) }

  it { should have_valid(:seconds).when(0, 1, 5, 1001) }
  it { should_not have_valid(:seconds).when(nil, -1, 3.5) }

  it { should belong_to(:user) }
  it { should belong_to(:puzzle) }
end
