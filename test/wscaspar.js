function log(s) {
    console.log(s)
    const li = document.createElement('li');
    li.innerText = s;
    dbg = document.getElementById("debug-window");
    dbg.appendChild(li);
}

window.onerror = function(msg) {
    log('error ' + msg);    
}

function parse_xml(xmlString) {
    var parser = new DOMParser();
    var docError = parser.parseFromString('INVALID', 'text/xml');
    var parsererrorNS = docError.getElementsByTagName("parsererror")[0].namespaceURI;
    var doc = parser.parseFromString(xmlString, 'text/xml');
    if (doc.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
        throw new Error('Error parsing XML');
    }
    return doc;
}

function parse_params(str){
    try {
        return JSON.parse(str)
    } catch (err) {
        try {
            doc = parse_xml(str);
            var result = {};
            var root_element = doc.documentElement;
            var children = root_element.childNodes;
            for(var i =0; i< children.length; i++) {
                var child = children[i];
                var key = child.getAttribute("id");
                var data = child.getElementsByTagName("data")[0];
                var value = data.getAttribute("value");
                result[key] = value;
            }
            return result
        } catch (xmlerr) {
            return {}
        }
    }
}
  

function play() {
    log("Play is not implemented");
}
    
function stop() {
    log("Stop is not implemented");
}
  
function next() {
    log("Next is not implemented");
}
 
function update(data) {
    log("Update is not implemented");
}
  


/*
function wsconnect() {
    var ws;

    ws = new WebSocket("ws://localhost:9000/");

    ws.onopen = function () {
        console.log("WS connection opened");
    };

    ws.onmessage = function (e) {
        console.log("Received: " + e.data);
    };

    ws.onclose = function () {
        console.log("onclose");
    };

    ws.onerror = function (e) {
        console.log(e)
    };
    return ws;
}
*/

var ws_url = "ws://localhost:9001";
var amcp_queue = [];
var ws = null;

function amcp (msg) {
    if (ws == null){
        log("Connecting to " + ws_url);
        ws = new WebSocket(ws_url)
        ws.onopen = function () {
            log("Websocket connection opened");
            while (amcp_queue.length > 0) {
                var m = amcp_queue.pop();
                log("Sending queued " + m );
                ws.send(m)
            }
        }
        ws.onerror = function(error) {
            log("ws error");
            ws = null;
        }
        ws.onclose = function () {
            log("ws closed");
            ws = null;
        };
    } 

    if (ws.readyState !== 1) {
        log("Queuing " + msg);
        amcp_queue.push(msg)
    } else {
        log("Sending " + msg);
        ws.send(msg)
    }
}