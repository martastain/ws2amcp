#!/usr/bin/env python3

import os
import json

from nxtools import *
from nxtools.caspar import *

from websockets import WebsocketServer

settings = {
    "ws_host" : "0.0.0.0",
    "ws_port" : 9001,
    "amcp_host" : "localhost",
    "amcp_port" : 5250
}

if os.path.exists("settings.json"):
    try:
        settings.update(json.load(open("settings.json")))
    except Exception:
        critical_error("Unable to parse settings.json")


caspar = CasparCG(settings["amcp_host"], settings["amcp_port"])

def relay_message(client, server, message):
    res = caspar.query(message)
    if res:
        logging.goodnews(res)
    else:
        logging.error(res)


class WS2AMCP(object):
    def __init__(self):
        self.server = WebsocketServer(host=settings["ws_host"], port=settings["ws_port"])
        self.server.set_fn_message_received(relay_message)
        self.server.run_forever()

if __name__ == "__main__":
    r = WS2AMCP()
