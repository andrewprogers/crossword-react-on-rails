require 'rails_helper'

RSpec.describe Puzzle, type: :model do
  it { should have_valid(:created_at).when(Time.now) }
  it { should have_valid(:updated_at).when(Time.now) }
  it { should_not have_valid(:created_at).when('', nil) }
  it { should_not have_valid(:updated_at).when('', nil) }

  it { should have_valid(:size).when(13) }
  it { should_not have_valid(:size).when(nil, '') }
  it { should_not have_valid(:size).when(2.3) }

  it { should have_valid(:grid).when('ASDF.ADF.ASDDDFA.ADFAASD.ASDFAD.ASDFA') }
  it { should_not have_valid(:grid).when(nil, '') }

  it { should have_valid(:date).when(Time.now) }
  it { should_not have_valid(:date).when(nil, '') }

  it { should have_valid(:notes).when('adfasdfasdfsadfsadf', '') }

  it { should belong_to(:user) }
  it { should have_many(:answers) }
  it { should have_many(:solutions) }
end
