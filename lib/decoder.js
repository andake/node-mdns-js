var debug = require('debug')('mdns:lib:decoder');
//var sorter = require('./sorter');
var ServiceType = require('./service_type').ServiceType;
var Record = require('mdns-js-packet').DNSRecord;

module.exports.decodeSection = function (packet, sectionName, obj) {
  if (!packet.hasOwnProperty(sectionName)) {
    throw new Error('Section missing from packet:' + sectionName);
  }
  debug('%s has %d records', sectionName, packet[sectionName].length);

  if (typeof obj === 'undefined') {
    throw new Error('Argument obj is missing');
  }

  var records = packet[sectionName].length;
  var processed = 0;
  if (packet[sectionName].length === 0) {
    return false;
  }

  packet.each(sectionName, function (rec) {
    processed++;
    switch (rec.type) {
      case Record.Type.A:
        obj.host = rec.name;
        break;
      case Record.Type.PTR:
        obj.type = obj.type || [];
        if (packet.header.qr === 1 && rec.name.indexOf('_service') === 0) {
          if (rec.data) {
            obj.type.push(new ServiceType(rec.data.replace('.local', '')));
          }
          else {
            processed--;
          }
        }
        else if (rec.name.indexOf('_') === 0) {
          //probably a service of some kind
          obj.type.push(new ServiceType(rec.name.replace('.local', '')));
        }
        else {
          debug('strange PTR record in %s', sectionName, rec);
        }
        break;
      case Record.Type.TXT:
        if (!obj.txt) {obj.txt = [];}
        obj.txt = obj.txt.concat(rec.data);
        break;
      case Record.Type.SRV:
        obj.port = rec.port;
        obj.fullname = rec.name;
        break;
      case Record.Type.NSEC: //just ignore for now. Sent by chromecast for example
        processed--;
        break;
      default:
        processed--;
        debug('section: %s type: %s', sectionName, rec.type, rec);
    }
  });
  return (records > 0 && processed > 0);
};
