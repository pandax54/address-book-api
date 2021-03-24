import { EntityRepository, Repository } from 'typeorm'

import { User } from '../models/User'

@EntityRepository(User)
class UserRepository extends Repository<User> {
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.findOne(id)
    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.findOne({
      where: { email }
    })
    return user
  }
}

export { UserRepository }
