# my-lambda-app/Dockerfile
FROM public.ecr.aws/lambda/nodejs:18

# Copy package files and install dependencies (if any)
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the Lambda handler code
COPY handler.js ./

# Set the Lambda entry point
CMD [ "handler.handler" ]
