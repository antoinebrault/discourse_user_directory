class DirectoryUserSerializer < UserSerializer

  attributes :last_seen_age,
             :member_since

  def last_seen_age
    return nil if object.last_seen_at.blank?
    AgeWords.age_words(Time.now - object.last_seen_at)
  end

  def member_since
    return nil if object.created_at.blank?
    AgeWords.age_words(Time.now - object.created_at)
  end
end