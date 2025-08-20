let _http = null;

export function setHttp(instance) {
  _http = instance;
}

export function http() {
  if (!_http) throw new Error("HTTP not initialized. Call setHttp(...) first.");
  return _http;
}
