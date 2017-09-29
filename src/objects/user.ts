import moment from "moment"
import Config from "../objects/config"

export default class User {
  public id: string
  public token: string
  public lastMaintained: number
  public images: any

  // Preferences
  public prefMinWidth: number
  public prefMinHeight: number
  public prefMaxAge: number

  constructor(
    token: string,
    id?: string,
    prefMinWidth?: number,
    prefMinHeight?: number,
    prefMaxAge?: number
  ) {
    this.token = token
    this.id = id || require("cuid")()
    this.lastMaintained = moment()
      .utc()
      .unix()
    this.prefMaxAge = prefMaxAge || Config.defaultMaxAge
    this.prefMinHeight = prefMinHeight || Config.defaultMinHeight
    this.prefMinWidth = prefMinWidth || Config.defaultMinWidth
  }
}
