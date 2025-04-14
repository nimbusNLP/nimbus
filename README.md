# Nimbus

Nimbus is a serverless ML model deployment platform that simplifies the process of deploying machine learning models to AWS Lambda and making them accessible through API Gateway endpoints.

## Overview

Nimbus streamlines the workflow of deploying ML models (both pre-trained and fine-tuned) to production without requiring extensive DevOps knowledge. The platform consists of two main components:

1. **nimbus-cli**: A command-line interface tool that handles model deployment, management, and configuration.
2. **nimbus-cdk**: An AWS CDK application that creates and manages the cloud infrastructure required for model serving.

## Prerequisites

- Node.js (v14 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)
- Docker (for containerizing models)

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/nimbus.git
   cd nimbus
   ```

2. Install dependencies for the CLI tool:

   ```
   cd nimbus-cli
   npm install
   npm run build
   ```

3. Install dependencies for the CDK application:

   ```
   cd ../nimbus-cdk
   npm install
   npm run build
   ```

4. For local development, create a global symlink for the CLI:
   ```
   cd ../nimbus-cli
   npm link
   ```

## Project Structure

```
nimbus/
├── nimbus-cli/        # CLI tool for model deployment
│   ├── src/           # Source code for CLI commands
│   └── dist/          # Compiled JavaScript code
│
├── nimbus-cdk/        # AWS CDK infrastructure code
│   ├── bin/           # CDK app entry point
│   ├── lib/           # Stack definitions
│   └── test/          # Tests for CDK constructs
│
└── Nimbus_Model_Storage/  # Created during first deployment
    └── finished_dir/      # Contains deployed model artifacts
```

## Using the Nimbus CLI

The Nimbus CLI provides several commands for managing your ML model deployments:

### Deploying a Model

```
nimbusCLI deploy
```

This interactive command will:

1. Set up the API Gateway (if it's your first deployment)
2. Ask for the model type (pre-trained or fine-tuned)
3. Prompt for a model name and description
4. For pre-trained models, ask which model to use
5. For fine-tuned models, ask for the path to your model
6. Generate the necessary Docker and Lambda code
7. Deploy your model to AWS

### Listing Deployed Models

```
nimbusCLI list
```

Lists all currently deployed models with their endpoints.

### Deleting a Model

```
nimbusCLI delete
```

An interactive command to select and delete a specific model from your deployment.

### Destroying the Stack

```
nimbusCLI destroy
```

Removes the entire AWS infrastructure created by Nimbus.

## Model Types Supported

1. **Pre-trained models**: Popular models that can be deployed directly without additional training.
2. **Fine-tuned models**: Your custom-trained models that you've saved locally.

## Architecture

Nimbus uses AWS Lambda with Docker containers to serve ML models and AWS API Gateway to provide HTTP endpoints. Each model is deployed as a separate Lambda function with its own API endpoint.

The system automatically generates the necessary Docker configuration and API integration code based on the model type and specifications.

## Limitations

- Maximum model size is constrained by Lambda's limits (currently up to 10GB container images)
- Cold start times may impact initial request latency
- Default timeout for predictions is 60 seconds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
