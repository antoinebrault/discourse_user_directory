require_dependency 'guardian'

class DirectoryView
  include ActiveModel::Serialization

  attr_reader :users, :filtered_users, :guardian, :filtered_ids

  def initialize(user=nil, options={})
    @guardian = Guardian.new(user)

    @limit ||= SiteSetting.users_per_page

    setup_filtered_users

    @initial_load = true
    @index_reverse = false

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
    @filtered_user_ids ||= filter_user_ids_by(order_by_active)
  end

  private

  def filter_users_by_ids(user_ids)
    # TODO: Sort might be off
    @users = User.where(id: user_ids)
                 .order(order_by_active)
                 .limit(SiteSetting.users_show_limit)
  end

  def filter_user_ids_by(sort_order)
    @filtered_users.order(sort_order).limit(SiteSetting.users_show_limit).pluck(:id)
  end

  def setup_filtered_users
    @filtered_users = User.order(order_by_active).limit(SiteSetting.users_show_limit)
  end

  def order_by_active
    "COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC, username"
  end

end