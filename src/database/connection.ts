import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
  getCustomRepository,
  ObjectType
} from 'typeorm'

export class PsQLConnectionManager extends ConnectionManager {
  public connection: Connection = null
  public options: ConnectionOptions = null

  constructor(conOptions?: ConnectionOptions) {
    super()
    this.options = conOptions
  }

  async connect(): Promise<Connection> {
    this.options = await this.getOptions()
    this.connection = await createConnection(
      Object.assign(this.options, {
        database: process.env.ENV === 'test' ? 'addressBook_test' : this.options.database
      })
    )
    return this.connection
  }

  async close(): Promise<void> {
    await this.connection.close()
  }

  private async getOptions(): Promise<ConnectionOptions> {
    this.options = await getConnectionOptions()
    return this.options
  }

  public getCustomRepository<T>(repository: ObjectType<T>): T {
    const customRepository = getCustomRepository(repository)
    return customRepository
  }
}
