#!/usr/bin/env python3

import os
import json
import time

from nxtools import *
from nxtools.caspar import *

settings = {
        "caspar_host" : "localhost",
        "caspar_port" : 5250
    }

if os.path.exists("settings.json"):
    try:
        settings.update(json.load(open("settings.json")))
    except Exception:
        log_traceback()


c = CasparCG(settings["caspar_host"], settings["caspar_port"])


def q(*args, **kwargs):
    start_time = time.time()
    result = c.query(*args, **kwargs)
    t = time.time() - start_time
    if result.response == 202:
        logging.goodnews("Query executed in {:.03f}s".format(t))
        return True
    elif result.response in [200, 201]:
        logging.goodnews("Query executed in {:.03f}s".format(t))
        return result.data
    else:
        logging.error("Query failed: {}".format(result.data))
        return False

def s(t):
    time.sleep(t)

def cgdata(**kwargs):
    result = "<templateData>"
    for key in kwargs:
        value = kwargs[key]
        value_type = "text" #TODO
        result += "<componentData id=\"{}\">".format(key)
        result += "<data id=\"{}\" value=\"{}\" />".format(value_type, value)
        result += "</componentData>"
    result += "</templateData>"
    return "\"" + result.replace("\"", "\\\"") + "\""


q("CLEAR 1")

q("CG 1-100 ADD 0 index 0 " + cgdata(clip="#00cc00"))
time.sleep(5)
q("CG 1-100 PLAY 0 ")
time.sleep(5)
q("CG 1-100 UPDATE 0 " + cgdata(clip="#cc00cc"))
time.sleep(5)
q("CG 1-100 STOP 0")


input()
q("CLEAR 1")