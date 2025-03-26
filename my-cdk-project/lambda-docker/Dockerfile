# Use Amazon's official Lambda Python base image
FROM public.ecr.aws/lambda/python:3.10

# Set working directory inside the container
WORKDIR /var/task

# Copy function code and dependencies
COPY app.py requirements.txt ./

# Install dependencies
RUN pip install -r requirements.txt

# Set the Lambda handler (filename.function_name)
CMD ["app.handler"]
