import json

data = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/useridres":{"get":{"summary":"Gets a user by ID multiple responses","parameters":[{"name":"userId","in":"query","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}},"operationId":"useridres-get:undefined"}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}'
data.replace('true','True')
data.replace('false','False')
targetobj= json.loads(data)

data_source = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/users/username":{"get":{"summary":"Creates a user and returns the user ID","operationId":"createUser","parameters":[{"in":"query","name":"username","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","description":"ID of the created user."}}}}}}}}},"/users/userId":{"trace":{"summary":"Gets a user by ID","operationId":"getUser","parameters":[{"in":"query","name":"userId","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}}}},"/users/userIdres":{"get":{"summary":"Gets a user by ID multiple responses","operationId":"getUserres","parameters":[{"in":"query","name":"userId","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}},"201":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","description":"ID of the created user."}}}}}}}}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}'
data_source.replace('true','True')
data_source.replace('false','False')
sourceobj= json.loads(data_source)

def check_value(json):
    for key,value in json.items():
        if key == "type":
            return True
    return False

def get_all_keys(d):
    for key, value in d.items():
        if key == "schema":
            if check_value(value) == False:
                return False
        if isinstance(value, dict):
            if get_all_keys(value) == False:
                return False
    return True
if get_all_keys(targetobj):
    print("success")
else:
    print("Failure")
