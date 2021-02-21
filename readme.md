# Railflow API

### Setting up locally

Pre-requisites:

1. Install node version v14.15.4
2. Install yarn (npm i -g yarn)

```bash
cd <path_to_railflow_api_folder>
yarn install
yarn dev
```

### Configs

The app is heavily config driven, meaning there are a lot of keys for all the services/platforms that the app interacts with.

Check `configs/app.js` folder and define the config as per the environment.

To change the port on which app is running:

> Change the `APP_PORT` variable in `configs/app.js`.

### Deploying to production.

We have set up the gitlab ci/cd which will get triggered when something is pushed to master or if any branch is merged to master.

Ensuring proper keys are getting picked up as per the environment;

For production:

> Set the environment variable APP_ENV in gitlab ci/cd as `production` and it will take the API keys/secrets/urls as defined in the gitlab ci/cd variables.

If no variable called APP_ENV is found, we take the default as `development` and hence the development environment variables from the `configs/app.js` will be picked up.


