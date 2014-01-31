class DirectoriesController < ApplicationController
  def index
    opts = params.slice(:filter, :page, :user_number)
    @user_view = ::UserView.new(opts)
    #@users = @users.where('username_lower like :filter or email like :filter or name like :filter', filter: "%#{params[:filter]}%") if params[:filter].present?
    #user_view_serializer = UserViewSerializer.new(@user_view)
    render_serialized(@user_view, UserViewSerializer)
    #respond_to do |format|
    #  format.html do
    #    store_preloaded("users", MultiJson.dump(user_view_serializer))
    #  end
    #
    #  format.json do
    #    render_json_dump(user_view_serializer)
    #  end
    #end
  end
end
