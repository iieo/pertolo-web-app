# Next.js Template v15

## Requirements

- nvm
- [docker compose](https://docs.docker.com/compose/install/)

## Basic Tools

Before the application can be started, you need to install the necessary tools.

```sh
nvm use # sets up the node version
corepack enable # sets up the proper package manager
corepack prepare
pnpm i # installs the dependencies
```

## Local Database

For local development it makes sense to spin up a local postgresql database

```sh
docker compose -f devops/docker/docker-compose.db.local.yml up -d
```

Check that you can access it:

```sh
psql "postgresql://postgres:test1234@127.0.0.1:5432/postgres"
```

## Environment variables

The environment variables can be fetched from AWS secrets manager. Before this you need the aws-cli installed.

An example for the current env variabels can be found inside the `.env.example`

After configuring your user via `aws configure`, you can fetch the secrets and put them into the `.env` file.

```sh
aws secretsmanager get-secret-value --secret-id <secret-name> --query 'SecretString' --output text | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env
```

For starters, you can just copy the `.env.example` file:

```sh
cp .env.example .env
```

If you want to start with a fresh database, do not forget to apply migrations, otherwise the application will not work.

```sh
pnpm db:migrate
```

You can now start the application:

```sh
pnpm dev
```
