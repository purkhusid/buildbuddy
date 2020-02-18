import { buildbuddy } from 'buildbuddy/proto/buildbuddy_service_ts_proto';
import events from 'fbemitter';

class RpcService {
  service: buildbuddy.service.BuildBuddyService;
  events: events.EventEmitter;

  constructor() {
    this.service = new buildbuddy.service.BuildBuddyService(this.rpc.bind(this));
    this.events = new events.EventEmitter();
  }

  rpc(method: any, requestData: any, callback: any) {
    var request = new XMLHttpRequest();
    request.open('POST', `/rpc/BuildBuddyService/${method.name}`, true);

    request.setRequestHeader('Content-Type', 'application/proto');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        request.responseType = 'arraybuffer';
        callback(null, new Uint8Array(request.response));
        this.events.emit(method.name, 'completed');
        console.log(`Emitting event [${method.name}]`);
      } else {
        callback(`Error: ${request.responseText}`);
      }
    };

    request.onerror = () => {
      callback('Error: Connection error');
    };

    request.send(requestData);
  };
}

export default new RpcService();