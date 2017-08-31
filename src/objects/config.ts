export default class Config {
  public static subreddit = process.env.PPM_SUBREDDIT || "r/earthporn"
  public static masterListsRef = "masterlists"

  public static redditBaseUrl = process.env.PPM_REDDIT_BASE_URL ||
    "https://reddit.com"

  public static topPostCount = parseInt(
    process.env.PPM_TOP_POST_COUNT as string,
    10
  ) || 10
}
