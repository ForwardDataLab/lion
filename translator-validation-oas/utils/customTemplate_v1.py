import json
def ${funcname}(targetobj):
    ${code}
    return 0


data = '${targetobj}'
data.replace('true','True')
data.replace('false','False')
load_json= json.loads(data)
${funcname}(load_json)
