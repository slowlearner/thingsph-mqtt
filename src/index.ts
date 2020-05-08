require("dotenv").config();
const mqtt = require("mqtt");
const client = mqtt.connect(process.env.MQTT_HOST, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});
const interval = parseInt(process.env.REPORT_INTERVAL);
const hardware_serial = "pwx-thermostat-01";
const mqtt_topic = `/${hardware_serial}`;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let isReady = false;
client.on("connect", function (err) {
  client.subscribe(mqtt_topic, function (err) {
    if (err) {
      throw err;
    } else {
      isReady = true;
    }
  });
});

setInterval(() => {
  if (isReady === true) {
    const telemetry = {
      temperature: getRandomInt(100),
      humidity: getRandomInt(100),
    };

    client.publish(mqtt_topic, JSON.stringify(telemetry));
    console.log("telemetry published");
  } else {
    console.log("not ready");
  }
}, interval);
