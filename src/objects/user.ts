import Config from "../objects/config"
export default class User {
  public id: string
  public token: string
  public lastMaintained: number
  public images: any

  // Preferences
  public prefMinWidth: number
  public prefMinHeight: number

  constructor(
    token: string,
    prefMinWidth?: number,
    prefMinHeight?: number,
    id?: string
  ) {
    this.token = token
    this.id = id || require("cuid")()
    this.prefMinHeight = prefMinHeight || Config.defaultMinHeight
    this.prefMinWidth = prefMinWidth || Config.defaultMinWidth
  }
}
