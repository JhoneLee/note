var express = require("express");
var router = express.Router();
var kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "192.168.0.107:9092" });

const topics = [
  {
    topic: "test-kafka",
  },
];
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  // encoding: 'buffer'
};

const consumer = new kafka.Consumer(client, topics, options);

consumer.on("message", function (message) {
  // Read string into a buffer.
  console.info(`[message]:==:>${JSON.stringify(message)}`);
  const buf = new Buffer(String(message.value), "binary");
  try {
    const decodedMessage = JSON.parse(buf.toString());
    console.log("decodedMessage: ", decodedMessage);
  } catch (e) {
    console.log(e);
  }
});

consumer.on("error", function (err) {
  console.log("error", err);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express kafka消费者" });
});

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  consumer.on("message", function (message) {
    // Read string into a buffer.
    console.info(`[message]:==:>${JSON.stringify(message)}`);
    const buf = new Buffer(String(message.value), "binary");
    try {
      const decodedMessage = JSON.parse(buf.toString());
      res.write(`data:${buf.toString()}\n\n`);
      console.log("decodedMessage: ", decodedMessage);
    } catch (e) {
      console.log(e);
    }
  });
});

module.exports = router;
