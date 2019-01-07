import KafkaController from '../../class/KafkaController';

const kafka = new KafkaController();

export default {
  kafkaConsumers() {
    console.log('kafka started listening to consumerTopics')
    kafka.consumer(kafka.consumerOptions, kafka.consumerTopics);
  },
};
