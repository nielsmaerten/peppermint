export default class Config {
  // Constants that don't really change
  public static defaultMinHeight = 1080
  public static defaultMinWidth = 1920
  public static masterListsRef = "masterlists"
  public static userListRef = "users"
  public static personalLisRef = "images"
  public static dropbox = {
    oauthUri: "https://api.dropboxapi.com/oauth2/token"
  }

  // Constants that might be set by the environment?
  public static subreddit = process.env.PPM_SUBREDDIT || "r/earthporn"

  public static redditBaseUrl = process.env.PPM_REDDIT_BASE_URL ||
    "https://reddit.com"

  public static topPostCount = parseInt(
    process.env.PPM_TOP_POST_COUNT as string,
    10
  ) || 10
}
