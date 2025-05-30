import path from "path/posix";

const generateLambdaFile = (
  modelType: string,
  modelNameOrPath: string | symbol,
) => {
  return `import json
import spacy
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Load the spaCy model
try:
    nlp = spacy.load("${String(modelType) === "pre-trained" ? String(modelNameOrPath) : "/var/task/" + path.basename(modelNameOrPath as string)}")
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

def lambda_handler(event, context):
    logger.info(f"Received event: {event}")
    
    # Parse input
    try:
        body = json.loads(event.get("body", "{}"))
        text = body.get("text", "")
        logger.info(f"Extracted text: {text}")
    except Exception as e:
        logger.error(f"Invalid JSON input: {e}")
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Invalid JSON input", "message": str(e)})
        }

    if not text:
        logger.warning("No text provided")
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "No text provided"})
        }

    # Process text with spaCy
    try:
        doc = nlp(text)
        logger.info("Text processed successfully")
    except Exception as e:
        logger.error(f"Error processing text: {e}")
        raise

    # Serialize output
    try:
        doc_json = doc.to_json()
        logger.info("Doc serialized successfully")
    except Exception as e:
        logger.error(f"Error serializing doc: {e}")
        raise

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(doc_json)
    }`;
};

export default generateLambdaFile;