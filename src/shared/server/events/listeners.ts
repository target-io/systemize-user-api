import KafkaController from '../../class/KafkaController';
// import OrganisationEvents from '../../../entities/Organisation/OrganisationEvents';

const kafka = new KafkaController();

// TODO: need to work on topics & groupId
const topicsToListen = ['message-to-user-topic'];

const listenerOptions = {
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

export default {
  async startListening() {
    try {
      console.log('organisatin listerner started listening');
      kafka.consumer(listenerOptions, topicsToListen);
      console.log('---i hope to get the consuming message');
    } catch (err) {
      console.log('Something goes wrong in the lister');
      console.log(err);
    }
  }
}