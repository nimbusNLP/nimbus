import type { PlatformPath } from 'path/posix';


const generateDockerfile = (
  modelType: string,
  modelNameOrPath: string | symbol,
  platformPath: PlatformPath
) => {
  let dockerfileContent = `
# Use the official AWS Lambda Python 3.12 base image
FROM public.ecr.aws/lambda/python:3.12

# Install system dependencies (gcc may be needed for some spaCy dependencies)
RUN dnf install -y gcc

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
`;

  if (modelType === 'pre-trained') {
    dockerfileContent += `
# Download the spaCy model
RUN python -m spacy download ${String(modelNameOrPath)}
`;
  } else if (modelType === 'fine-tuned') {
    'WORKDIR /var/task'
    const modelDirName = platformPath.basename(modelNameOrPath as string);
    dockerfileContent += `
# Copy the fine-tuned spaCy model into the container
COPY ${String(modelNameOrPath)} /var/task/${modelDirName}
`;
  }

  dockerfileContent += `
# Copy the Lambda function code into the container
COPY lambda_function.py .

# Set the Lambda function handler (module_name.function_name)
CMD [ "lambda_function.lambda_handler" ]
`;

  return dockerfileContent;
};

export default generateDockerfile;