
Nimbus is a lightweight, developer-friendly framework designed to help small teams deploy task-focused NLP models to the cloud with minimal friction. It combines the convenience of managed platforms with the affordability and control of DIY approaches.

This guide walks through a typical user journey—from installation to deployment and management of models—using the Nimbus CLI and its web-based Playground.

----

✅ Prerequisites

Before getting started with Nimbus, make sure your environment includes the following:


|Tool	| Description	| Link| 
|--|--|--|
|Node.js v20+	| JavaScript runtime required to run Nimbus CLI. Includes npm.	|[Download Node.js](https://nodejs.org/en/download?utm_source=chatgpt.com)|
|AWS CLI	| Required to authenticate and interact with AWS.	|[Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html?utm_source=chatgpt.com)|
|AWS CDK	| Used to define and deploy cloud infrastructure as code.	|[AWS CDK Guide](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html?utm_source=chatgpt.com)|
|Docker	| Required for building and bundling model containers.	|[Get Docker](https://docs.docker.com/get-started/get-docker/?utm_source=chatgpt.com)|

ℹ️ After installing the AWS CLI, run aws configure to set up your credentials.

----

🚀 Getting Started

Installation

Install Nimbus globally via NPM:

```bash
npm install -g nimbusnlp
```

ℹ️ Upon first use, Nimbus will create a .nimbusStorage directory in your current working directory to store configuration and deployment artifacts. To change its location, simply navigate to your desired directory before running any CLI commands.

----

🔧 CLI Commands

After installation, you can access the CLI by typing:

```bash
nimbusCLI
```

This will display all available subcommands.

Core Commands
- `nimbusCLI deploy`
Deploy a new NLP model. This also provisions the necessary infrastructure if it doesn’t exist.
- `nimbusCLI list`
View all models currently deployed, along with their names, descriptions, and endpoints.
- `nimbusCLI delete`
Delete a specific model and its associated resources, both locally and in the cloud.
- `nimbusCLI destroy`
Tear down the entire Nimbus deployment infrastructure (API Gateway, models, storage, etc.).
- `nimbusCLI ui`
Launch the Nimbus Playground, a local web UI to view and test your deployed models.

----

🧠 Deploying a Model

To deploy a model, run:

```bash
nimbusCLI deploy
```

You will be guided through a series of interactive prompts:
- Model type: pre-trained or fine-tuned
- Unique model name
- Source:
- For pre-trained: a model identifier
- For fine-tuned: a local file path
- Optional description

Upon completion:
- Nimbus will deploy the model to AWS.
- You’ll receive:
- An HTTPS endpoint URL for predictions.
- An API key to access the endpoint.

You can immediately begin sending requests to your deployed endpoint.

----

📋 Listing Deployed Models

To check which models are currently deployed:

```bash
nimbusCLI list
```

You’ll see a list of models with their associated information:
- Model name
- Description
- Endpoint URL

----

🌐 The Nimbus Playground

For a visual interface, run:

```bash
nimbusCLI ui
```

This opens the Nimbus Playground in your browser, where you can:
- View deployed models
- Select a model
- Send prediction requests directly in the UI

It’s a great tool for testing before integrating endpoints into production.

----

🗑️ Deleting a Model

To remove a model:

```bash
nimbusCLI delete
```

You’ll be presented with a list of your deployed models. Select the one you wish to delete.

----

💥 Destroying All Infrastructure

To completely remove your deployment (API Gateway, Lambda functions, models, and storage):

```bash
nimbusCLI destroy
```

⚠️ This action is irreversible. Use it only when you’re done with Nimbus or want to reset everything.

----

📌 Final Notes

Nimbus is designed to make deploying NLP models as simple and cost-effective as possible, without sacrificing power or flexibility. Whether you’re a solo developer or a small team, Nimbus helps you go from model to API in minutes.

----