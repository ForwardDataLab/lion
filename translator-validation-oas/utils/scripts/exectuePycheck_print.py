import json

data = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/username/{username}":{"post":{"summary":"Creates a user and returns the user ID","parameters":[{"name":"username","in":"path","required":true,"content":{"application/json":{"schema":{"type":"string"}}}}],"responses":{"200":{"description":"Created"},"201":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}},"operationId":"username-post:undefined"}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}'
data.replace('true','True')
data.replace('false','False')
targetobj= json.loads(data)

data_source = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/users/{username}":{"post":{"summary":"Creates a user and returns the user ID","operationId":"createUser","parameters":[{"in":"path","name":"username","required":true,"content":{"application/json":{"schema":{"type":"string"}}}},{"in":"query","name":"userquery","required":true,"content":{"application/json":{"schema":{"type":"integer"}}}}],"responses":{"200":{"description":"Created"},"201":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}}}},"/usersdesc":{"patch":{"summary":"Patch User desc","operationId":"PatchUserDesc","requestBody":{"required":true,"description":"A JSON object that contains the user name and desc.","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}},"responses":{"200":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}}}},"/users/userdesc/":{"post":{"summary":"Post User desc","operationId":"usersUserdesc","requestBody":{"required":true,"description":"A JSON object that contains the user name and desc","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}},"responses":{"200":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}}}},"/users/{userId}":{"get":{"summary":"Gets a user by ID","operationId":"getUser","parameters":[{"in":"path","name":"userId","required":true,"content":{"application/json":{"schema":{"type":"integer"}}}}],"responses":{"default":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}}}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"integer","format":"int64"}}}}}}'
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
