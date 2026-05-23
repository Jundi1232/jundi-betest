import { Producer } from 'kafkajs'
import { getKafkaProducer, isKafkaEnabled } from './index'

type PublishParams = {
  topic: string
  key?: string
  value: unknown
}

class KafkaPublisher {
  producer: Producer | null

  constructor(producer?: Producer | null) {
    this.producer = producer === undefined ? getKafkaProducer() : producer
  }

  async publish(params: PublishParams): Promise<void> {
    if (!isKafkaEnabled() || !this.producer) return

    try {
      await this.producer.send({
        topic: params.topic,
        messages: [
          {
            key: params.key,
            value:
              typeof params.value === 'string'
                ? params.value
                : JSON.stringify(params.value),
          },
        ],
      })
    } catch (err: any) {
      console.error('[kafka] publish error:', err.message)
    }
  }
}

export = KafkaPublisher
