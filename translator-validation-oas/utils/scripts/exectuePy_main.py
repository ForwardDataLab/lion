import json
def check_print(targetobj):
    print("Return Success",targetobj)
    return 0

data='{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/useridres":{"get":{"summary":"Gets a user by ID multiple responses","parameters":[{"name":"userId","in":"query","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}},"operationId":"useridres-get:undefined"}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}'
data.replace('true','True')
data.replace('false','False')
load_json= json.loads(data)
check_print(load_json)
