class DirectoriesController < ApplicationController

  skip_before_filter :check_xhr, only: [:index]

  def index
    opts = params.slice(:filter, :query)
    @directory_view = DirectoryView.new(opts)

    directory_view_serializer = DirectoryViewSerializer.new(@directory_view, scope: guardian, root: false)
    respond_to do |format|
      format.html do
        store_preloaded("user_directory", MultiJson.dump(directory_view_serializer))
      end
      format.json do
        render_json_dump(directory_view_serializer)
      end
    end
  end

  def users
    params.require(:user_ids)
    opts = params.slice(:filter, :user_ids, :query)
    @directory_view = DirectoryView.new(opts)
    directory_view_serializer = DirectoryViewSerializer.new(@directory_view, scope: guardian, root: false)
    render_json_dump(directory_view_serializer)
  end

end
