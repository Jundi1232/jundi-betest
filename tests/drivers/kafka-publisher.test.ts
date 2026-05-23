import KafkaPublisher from '../../src/drivers/kafka/publisher'

describe('KafkaPublisher', () => {
  const originalEnabled = process.env.KAFKA_ENABLED

  afterEach(() => {
    process.env.KAFKA_ENABLED = originalEnabled
  })

  it('does nothing when kafka is disabled', async () => {
    process.env.KAFKA_ENABLED = 'false'
    const send = jest.fn()
    const publisher = new KafkaPublisher({ send } as any)

    await publisher.publish({ topic: 't', value: { hello: 'world' } })
    expect(send).not.toHaveBeenCalled()
  })

  it('does nothing when producer is null', async () => {
    process.env.KAFKA_ENABLED = 'true'
    const publisher = new KafkaPublisher(null)
    await expect(
      publisher.publish({ topic: 't', value: { a: 1 } }),
    ).resolves.toBeUndefined()
  })

  it('serializes object value as JSON when enabled', async () => {
    process.env.KAFKA_ENABLED = 'true'
    const send = jest.fn().mockResolvedValue([])
    const publisher = new KafkaPublisher({ send } as any)

    await publisher.publish({
      topic: 'kafka_yourname_betest',
      key: 'u1',
      value: { event: 'user.created', id: 'u1' },
    })

    expect(send).toHaveBeenCalledWith({
      topic: 'kafka_yourname_betest',
      messages: [
        {
          key: 'u1',
          value: JSON.stringify({ event: 'user.created', id: 'u1' }),
        },
      ],
    })
  })

  it('passes string value through unchanged', async () => {
    process.env.KAFKA_ENABLED = 'true'
    const send = jest.fn().mockResolvedValue([])
    const publisher = new KafkaPublisher({ send } as any)

    await publisher.publish({ topic: 't', value: 'plain' })
    expect(send).toHaveBeenCalledWith({
      topic: 't',
      messages: [{ key: undefined, value: 'plain' }],
    })
  })

  it('swallows producer errors silently', async () => {
    process.env.KAFKA_ENABLED = 'true'
    const send = jest.fn().mockRejectedValue(new Error('boom'))
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const publisher = new KafkaPublisher({ send } as any)

    await expect(
      publisher.publish({ topic: 't', value: { a: 1 } }),
    ).resolves.toBeUndefined()

    errSpy.mockRestore()
  })
})
