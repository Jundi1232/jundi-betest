import { Kafka, Producer, logLevel } from 'kafkajs'

let kafka: Kafka | null = null
let producer: Producer | null = null

export const isKafkaEnabled = () =>
  String(process.env.KAFKA_ENABLED || 'false').toLowerCase() === 'true'

export const connectKafka = async () => {
  if (!isKafkaEnabled()) {
    console.log('[kafka] disabled')
    return
  }

  const brokers = String(process.env.KAFKA_BROKERS || 'localhost:9092')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean)

  kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'ms-yourname-betest',
    brokers,
    logLevel: logLevel.NOTHING,
  })

  producer = kafka.producer()
  try {
    await producer.connect()
    console.log('[kafka] producer connected')
  } catch (err: any) {
    console.error('[kafka] producer connect error:', err.message)
    producer = null
  }
}

export const getKafkaProducer = (): Producer | null => producer
