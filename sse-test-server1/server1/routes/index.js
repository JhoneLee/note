var express = require("express");
const moment = require("moment");
const kafka = require("kafka-node");
var router = express.Router();

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "192.168.0.107:9092" });
const producerOption = {
  requireAcks: 1,
  ackTimeoutMs: 100,
  partitionerType: 0, //默认为第一个分区
};
var producer = new Producer(client, producerOption);
producer.on("ready", function () {
  console.log("Kafka Producer is connected and ready.");
});

// For this demo we just log producer errors to the console.
producer.on("error", function (error) {
  console.error(error);
});

const sendRecord = (objData, cb) => {
  const buffer = Buffer.from(JSON.stringify(objData));

  // Create a new payload
  const record = [
    {
      topic: "test-kafka",
      messages: buffer,
      attributes: 1 /* Use GZip compression for the payload */,
    },
  ];

  // Send record to Kafka and log result/error
  producer.send(record, cb);
};
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express kafka 生产者" });
});

router.get("/product", (req, res) => {
  const message = `send time:${moment().format("yyyy-MM-DD HH:mm:ss")}`;
  sendRecord(
    {
      msg: message,
    },
    (err, data) => {
      if (err) {
        console.log(`err: ${err}`);
      }
      console.log(`data: ${JSON.stringify(data)}`);
    }
  );
  res.json({
    status: 1,
    message,
  });
});

module.exports = router;
