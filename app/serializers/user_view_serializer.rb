class UserViewSerializer < ApplicationSerializer

  attributes :users,
             :filtered_ids

  def users
    return @users if @users.present?
    @users = []
    if object.users
      object.users.each_with_index do |u, idx|
        us = UserSerializer.new(u, scope: Guardian.new(nil), root: false)

        @users << us.as_json
      end
    end
    @users
  end

end