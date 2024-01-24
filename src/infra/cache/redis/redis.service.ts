import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    const REDIS_HOST = envService.get('REDIS_HOST')
    const REDIS_PORT = envService.get('REDIS_PORT')
    const REDIS_DB = envService.get('REDIS_DB')

    super({
      host: REDIS_HOST,
      port: REDIS_PORT,
      db: REDIS_DB,
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
