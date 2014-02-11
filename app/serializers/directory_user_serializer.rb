class DirectoryUserSerializer < UserSerializer

  attributes :last_seen_age

  def last_seen_age
    return nil if object.last_seen_at.blank?
    AgeWords.age_words(Time.now - object.last_seen_at)
  end
end