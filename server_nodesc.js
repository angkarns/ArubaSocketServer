var mysql = require('mysql');
const WebSocket = require('ws');
const protobuf = require('protobufjs');
const aruba_telemetry_proto = require('./aruba_iot_proto.js').aruba_telemetry;
const wss = new WebSocket.Server({ port: 3001 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let telemetryReport = aruba_telemetry_proto.Telemetry.decode(message);
    let myobj = JSON.stringify(telemetryReport);
    let obj = JSON.parse(myobj);
    if (obj["reported"] == null) {
      console.log("Aruba Websocket Established");
    } else {
      console.log(myobj);
      console.log(obj["reporter"]["name"]);
      console.log(obj["reported"]);
      add_sensors(obj["reporter"]["name"], obj.reported);
    }
  });
  ws.on('close', function close() {
    console.log('disconnected');
  });
  ws.send('init message to client');
});

async function beacon(report) {
  var c = 0;
  for (k of report) {
    c += 1;
    console.log(c);
    console.log(k.beacons);
  }
}

function add_sensors(location, sensor) {
  let count = 0;
  for (k of sensor) {
    console.log("===================================");
    if (sensor[count]["deviceClass"].includes('iBeacon') == true && sensor[count]["deviceClass"].includes('arubaBeacon') == false && sensor[count]['rssi'] != null) {
      let sql = "";
      let param = {};
      param[0] = sensor[count]['mac'];
      param[1] = 'iBeacon';
      console.log(sensor[count]['rssi']['last']);
      param[2] = sensor[count]['rssi']['last'];
      param[3] = new Date().toISOString();
      param[4] = sensor[count]["beacons"][0]['ibeacon']['major'];
      param[5] = sensor[count]["beacons"][0]['ibeacon']['minor'];
      sql = "INSERT INTO sensors (s_mac_address, s_device_type, s_minor, s_major, s_rssi, s_timestamp, s_location) VALUES ('" + param[0] + "', '" + param[1] + "', " + param[5] + ", " + param[4] + ", " + param[2] + ", " + 'NOW()' + ", '" + location + "')";
      add_db(sql);
    }
    else if (sensor[count]["deviceClass"] == 'arubaTag' && sensor[count]['rssi'] != null) {
      let sql = "";
      let param = {};
      param[0] = sensor[count]['mac'];
      param[1] = 'arubaTag';
      console.log(sensor[count]['rssi']['last']);
      param[2] = sensor[count]['rssi']['last'];
      param[3] = new Date().toISOString();
      param[4] = sensor[count]['sensors']['battery'];
      sql = "INSERT INTO sensors (s_mac_address, s_device_type, s_battery, s_rssi, s_timestamp, s_location) VALUES ('" + param[0] + "', '" + param[1] + "', " + param[4] + ", " + param[2] + ", " + 'NOW()' + ", '" + location + "')";
      add_db(sql);

    } else if (sensor[count]["deviceClass"] == 'eddystone' && sensor[count]['rssi'] != null) {
      let sql = "";
      let param = {};
      param[0] = sensor[count]['mac'];
      param[1] = 'eddystone';
      param[2] = sensor[count]['rssi']['last'];
      param[3] = new Date().toISOString();
      param[4] = sensor[count]['sensors']['temperatureC'];
      sql = "INSERT INTO sensors (s_mac_address, s_device_type, s_dynamic_value, s_rssi, s_timestamp, s_location) VALUES ('" + param[0] + "', '" + param[1] + "', " + param[4] + ", " + param[2] + ", " + 'NOW()' + ", '" + location + "')";
      add_db(sql);
    }
    count += 1;
  }
}

function add_db(sql) {
  var con = mysql.createConnection({
    host: "10.10.10.99",
    user: "root",
    password: "password",
    database: "iot"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Insert Data >> " + sql);
      con.end();
      console.log("Closed Connections");
    });
  });
}