import { KafkaClient, Producer, ConsumerGroup } from 'kafka-node';
import env from '../../config/env';

export default class KafkaController {
  // TODO: need to work on topics & groupId
  public consumerTopics: any = ['message-to-user-topic'];

  public consumerOptions = {
    host: '127.0.0.1:2181',  // zookeeper host omit if connecting directly to broker (see kafkaHost below)
    kafkaHost: '127.0.0.1:9092', // connect directly to kafka broker (instantiates a KafkaClient)
    groupId: 'user-service-group',
    protocol: ['roundrobin'],
    fromOffset: 'latest', // default
    commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
    outOfRangeOffset: 'earliest', // default
    migrateHLC: false,    // for details please see Migration section below
    migrateRolling: true,
  };

  constructor() {}

  client() {
    return new KafkaClient({
      kafkaHost: env.kafkaHost,
      connectTimeout: 10000,
      requestTimeout: 30000,
      autoConnect: true,
    });
  }

  /**
   * Pass data through kafka producer with topic
   *
   * @param {*} payloads
   * @returns {Promise<any>}
   * @memberof KafkaController
   */
  passData(payloads: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = this.client();
      const producer = new Producer(client);
      producer.on('ready', () => {
        producer.send(payloads, (err, res) => {
          if (err) {
            console.log('producer errorrrrr!!!');
            return reject(err);
          }
          return resolve(res);
        });
      });
    });
  }

  /**
   * Consumer data from kafka for a topic
   *
   * @param {*} topics
   * @param {*} options
   * @returns {Promise<any>}
   * @memberof KafkaController
   */
  consumer(options: any, topics: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const consumer = new ConsumerGroup(options, topics);
      console.log('all ready to consume data');
      consumer.on('message', (message) => {
        console.log('i guess we are getting message might be after some time----');
        console.log(message);
        // we cannot resolve from here
        // the corresponding events should get triggered from this callback

        return resolve(message);
      });
      consumer.on('error', (err) => {
        console.log('consumer errorrrr!!!');
        return reject(err);
      });
    });
  }
}
