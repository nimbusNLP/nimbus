
# Use the official AWS Lambda Python 3.12 base image
FROM public.ecr.aws/lambda/python:3.12

# Install system dependencies (gcc may be needed for some spaCy dependencies)
RUN dnf install -y gcc

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Download the spaCy model
RUN python -m spacy download en_core_web_sm

# Copy the Lambda function code into the container
COPY lambda_function.py .

# Set the Lambda function handler (module_name.function_name)
CMD [ "lambda_function.lambda_handler" ]
