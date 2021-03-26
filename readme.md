# Railflow API

### Setting up locally

Pre-requisites:

1. Install node version v14.15.4
2. Install yarn (npm i -g yarn)
3. npm i -g nodemon

```bash
cd <path_to_railflow_api_folder>
yarn install
yarn dev
```

### Local Docker
1. Install docker on your local `https://docs.docker.com/get-docker/`
2. Build your docker image locally and run docker-compose Up by running below command
```bash
cd <path_to_railflow_api_folder>
docker-compose up -d --build
```

### Updating Swagger Documentation
1. The swagger documents are stored in `/src/swagger`. 
2. Follow below example to update the swagger document for Contact API.
    * The contact api swagger will be `/src/swagger/contact.js`. The schema, description and parameters will be stored in this file. 
    * Update the Contact category as following example
    ```yaml
    /**
    * @swagger
    * tags:
    *   - name: Contact
    *     description: Contact API
    */
    ```
    * Update the schema as following example
    ``` yaml
    /**
    * @swagger
    * components:
    *   schemas:
    *     Contact:
    *       type: object
    *       properties:
    *         firstName:
    *           type: string
    *           description: The contact's first name.
    *           example: John
    *         lastName:
    *           type: string
    *           description: The contact's last name.
    *           example: Doe
    *           .....
    */
    ```
    * Update the POST function as following example
    ```yaml
    /**
    * @swagger
    * /api/register:
    *    post:
    *      tags:
    *        - Contact
    *      summary: Register a contact
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: Contact
    *            description: Contact information
    *            in: body
    *            required: true
    *            schema:
    *              $ref: '#/components/schemas/Contact'
    *      responses:
    *          200:
    *              description: Returns created contract
    *              content:
    *                application/json:
    *                  schema:
    *                    $ref: '#/components/schemas/Contact'
    */
    ```

### Configs

The app is heavily config driven, meaning there are a lot of keys for all the services/platforms that the app interacts with.

Check `configs/app.js` folder and define the config as per the environment.

To change the port on which app is running:

> Change the `APP_PORT` variable in `configs/app.js`.

> Change the `ALLOWED_PARTY_SECRET` variable in `configs/app.js`. This is allow you to secure the api endpoints by enabling the token middleware.
>> You can temporary disable the middleware by set `ALLOWED_PARTY_SECRET = ALL`

> Add token to your request header `token: your_token_here`.
> If the token is missing or missmatch, system will return the 400 error `token invalid or missing`

### Deploying to production.

We have set up the gitlab ci/cd which will get triggered when something is pushed to master or if any branch is merged to master.

Ensuring proper keys are getting picked up as per the environment;

For production:

> Set the environment variable APP_ENV in gitlab ci/cd as `production` and it will take the API keys/secrets/urls as defined in the gitlab ci/cd variables.

If no variable called APP_ENV is found, we take the default as `development` and hence the development environment variables from the `configs/app.js` will be picked up.


