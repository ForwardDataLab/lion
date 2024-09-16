import json

# JSON data that comes through in OAS may not always be compatible with how Python handle JSON
# For example OAS schema uses true in smallcase but python need CamelCase- True.

data = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/useridres":{"get":{"summary":"Gets a user by ID multiple responses","parameters":[{"name":"userId","in":"query","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object"},"201":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","description":"ID of the created user."}}}}}}},"operationId":"useridres-get:undefined"}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}'
data.replace('true','True')
data.replace('false','False')
targetobj= json.loads(data)

data_source = '{"openapi":"3.0.0","info":{"version":"0.0.0","title":"Links example"},"paths":{"/users/username":{"get":{"summary":"Creates a user and returns the user ID","operationId":"createUser","parameters":[{"in":"query","name":"username","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","description":"ID of the created user."}}}}}}}}},"/users/userId":{"trace":{"summary":"Gets a user by ID","operationId":"getUser","parameters":[{"in":"query","name":"userId","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}}}},"/users/userIdres":{"get":{"summary":"Gets a user by ID multiple responses","operationId":"getUserres","parameters":[{"in":"query","name":"userId","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"A User object","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}},"201":{"description":"Created","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","format":"int64","description":"ID of the created user."}}}}}}}}}},"components":{"schemas":{"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64","readOnly":true},"name":{"type":"string"}}}}}}'
data_source.replace('true','True')
data_source.replace('false','False')
sourceobj= json.loads(data_source)

from jsonpath_ng import jsonpath, parse
def check_required_params(s_value,e_value):
    jsonpath_expression = parse('$..parameters')
    match_s=jsonpath_expression.find(s_value)
    match_e= jsonpath_expression.find(e_value)
    required_param_list=[]
    for record in match_e[0].value:
        required_param_list.append(record["name"])
    for record in match_s[0].value:
        if record['required'] == True:
            # check if it is in list of endpoint param values
            if record['name'] not in required_param_list:
                return False
            
    return True
    

def check_param_exists_source(sourceobj,endpoint_name,endpoint_name_value):
    jsonpath_expression = parse('$..paths')
    match=jsonpath_expression.find(sourceobj)
    
    for key,value in match[0].value.items():
        s_endpoint_name = key.replace('}','').replace('{','').split('/')[-1].lower()
        if s_endpoint_name == endpoint_name:
            # Return check required params
            s_endpoint_name_value = value
            if check_required_params(s_endpoint_name_value,endpoint_name_value) == False:
                return False
    
    
jsonpath_expression = parse('$..paths')
match=jsonpath_expression.find(targetobj)
for idx in range(0,len(match)):
    for key,value in match[idx].value.items():
        endpoint_name = key.split('/')[-1].replace('}','').replace('{','').lower()
        endpoint_name_value= value
        if check_param_exists_source(sourceobj,endpoint_name,endpoint_name_value) == False:
            print("Failure")

print("Success")
