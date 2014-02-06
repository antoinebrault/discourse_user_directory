require_dependency 'guardian'

class DirectoryView
  include ActiveModel::Serialization

  attr_reader :users, :filtered_users, :guardian, :filtered_ids

  def initialize(user=nil, options={})
    @guardian = Guardian.new(user)

    @page = @page.to_i
    @page = 1 if @page.zero?
    @limit ||= SiteSetting.posts_per_page

    setup_filtered_users

    @initial_load = true
    @index_reverse = false

    filter_users(options)
  end

  def filter_users(opts = {})
    return filter_users_by_ids(opts[:user_ids]) if opts[:user_ids].present?

    filter_users_paged(opts[:page].to_i)
  end

  def filter_users_paged(page)
    page = [page, 1].max
    min = @limit * (page - 1)

    # Sometimes we don't care about the OP, for example when embedding comments
    min = 1 if min == 0 && @exclude_first

    max = (min + @limit) - 1

    filter_users_in_range(min, max)
  end

  def filtered_user_ids
    @filtered_user_ids ||= filter_user_ids_by("COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username")
  end

  private

  def filter_users_by_ids(user_ids)
    # TODO: Sort might be off
    @users = User.where(id: user_ids)
                 .order("COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username")
                 .limit(1000)
    @users
  end

  def filter_user_ids_by(sort_order)
    @filtered_users.order(sort_order).limit(1000).pluck(:id)
  end

  def filter_users_in_range(min, max)
    user_count = (filtered_user_ids.length - 1)

    max = [max, user_count].min

    return @users = [] if min > max

    min = [[min, max].min, 0].max

    @users = filter_users_by_ids(filtered_user_ids[min..max])
    @users
  end

  def setup_filtered_users
    @filtered_users = unfiltered_users
  end

  def unfiltered_users
    result = User.order("COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username").limit(1000)
    result
  end

  def filter_user_by_ids(user_ids)
    # TODO: Sort might be off
    @users = User.where(id: user_ids)
                 .order("COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username")
                 .limit(1000)
    @users
  end

end