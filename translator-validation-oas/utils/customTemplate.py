import json

# JSON data that comes through in OAS may not always be compatible with how Python handle JSON
# For example OAS schema uses true in smallcase but python need CamelCase- True.

data = '${targetobj}'
data.replace('true','True')
data.replace('false','False')
targetobj= json.loads(data)

data_source = '${sourceobj}'
data_source.replace('true','True')
data_source.replace('false','False')
sourceobj= json.loads(data_source)

${code}
