module Discourse

  class << self

    def top_menu_items_with_directory
      @top_menu_items = top_menu_items_without_directory
      unless @top_menu_items.include?(:directory)
        @top_menu_items << :directory
      end
      @top_menu_items
    end

    alias_method_chain :top_menu_items, :directory

    def anonymous_top_menu_items_with_directory
      @anonymous_top_menu_items = anonymous_top_menu_items_without_directory
      unless @anonymous_top_menu_items.include?(:directory)
        @anonymous_top_menu_items << :directory
      end
      @anonymous_top_menu_items
    end

    alias_method_chain :anonymous_top_menu_items, :directory

  end


end
