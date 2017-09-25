import { Container } from "inversify"
import "reflect-metadata"
import Maintenance from "../agents/maintenance"
import { TYPES } from "./types"

const iocContainer = new Container()

iocContainer.bind<Maintenance>(TYPES.Maintenance).to(Maintenance)

export { iocContainer }
