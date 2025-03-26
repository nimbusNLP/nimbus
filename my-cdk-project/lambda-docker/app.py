import json

def handler(event, context):
    print('I am printing from the lamda function')

    # spacy.load(process.env.MODELTYPE)
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Hello from containerized Lambda!"})
    }
