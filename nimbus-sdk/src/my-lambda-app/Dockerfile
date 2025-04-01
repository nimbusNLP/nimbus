# Use AWS-provided Lambda base image for Node.js 18
FROM public.ecr.aws/lambda/nodejs:18

# Copy application files
COPY package.json package-lock.json ./
RUN npm install --only=production

COPY handler.js ./

# Command to run the Lambda function
CMD ["handler.handler"]
