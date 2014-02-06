class DirectoryViewSerializer < ApplicationSerializer
  include UserStreamSerializerMixin

  attributes :filtered_ids

end