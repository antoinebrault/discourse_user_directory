require_dependency 'user_serializer'

module UserStreamSerializerMixin

  def self.included(klass)
    klass.attributes :user_stream
  end

  def user_stream
    result = { users: users, stream: object.filtered_user_ids }
    result
  end

  def users
    return @users if @users.present?
    @users = []
    if object.users
      object.users.each_with_index do |u, idx|
        us = DirectoryUserSerializer.new(u, scope: Guardian.new(nil), root: false)

        @users << us.as_json
      end
    end
    @users
  end

end
