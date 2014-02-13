class DirectoryView
  include ActiveModel::Serialization

  attr_reader :users, :filtered_users, :filtered_ids

  def initialize(options={})
    @limit ||= SiteSetting.users_per_page

    setup_filter(options[:query])

    filter_users_by_search_string(options[:filter]) unless options[:filter].blank?

    filter_users(options)
  end

  def filter_users(opts = {})
    return filter_users_by_ids(opts[:user_ids]) if opts[:user_ids].present?

    filter_users_for_first_page
  end

  def filter_users_for_first_page
    user_count = (filtered_user_ids.length - 1)
    @users = filter_users_by_ids(filtered_user_ids[0..[@limit, user_count].min])
  end

  def filtered_user_ids
    @filtered_user_ids ||= @filtered_users.pluck(:id)
  end

  private

  def filter_users_by_search_string(filter = nil)
    return if filter.blank?
    @filtered_users = @filtered_users.where('lower(username_lower) like :filter or lower(name) like :filter', filter: "%#{filter.downcase}%")
  end

  def filter_users_by_ids(user_ids)
    @users = @filtered_users.where(id: user_ids)
  end

  def setup_filter(query)
    public_users = User.real.not_blocked.not_suspended
    return @filtered_users = public_users.order(order_by_newest).limit(SiteSetting.users_show_limit) if query == "newest"
    @filtered_users = public_users.order(order_by_active).limit(SiteSetting.users_show_limit)
  end

  def order_by_active
    "COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username"
  end

  def order_by_newest
    "created_at DESC, username"
  end

end