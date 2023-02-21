# FullStack Open - Part12: Introduction to Containers
Part 12 of the Full Stack online course https://fullstackopen.com/en/part12

## Exercise 12.1: Using a computer (without graphical user interface)
**Task:**
Step 1: Read the text below the Warning header.

Step 2: Download this [repository](https://github.com/fullstack-hy2020/part12-containers-applications) and make it your submission repository for this part.

Step 3: Run curl http://helsinki.fi and save the output into a file. Save that file into your repository as file script-answers/exercise12_1.txt. The directory script-answers was created in the previous step.

**Solution:**
Steps performed as instructed.

## Exercise 12.2: Running your second container
**Task:**
Use script to record what you do, save the file as script-answers/exercise12_2.txt

The hello-world output gave us an ambitious task to do. Do the following

Step 1. Run an Ubuntu container with the command given by hello-world

The step 1 will connect you straight into the container with bash. You will have access to all of the files and tools inside of the container. The following steps are run within the container:

Step 2. Create directory /usr/src/app

Step 3. Create a file /usr/src/app/index.js

Step 4. Run exit to quit from the container

Google should be able to help you with creating directories and files.

**Solution:**
container run with
```
docker run -it ubuntu bash
```
app folder in given directory created using mkdir command and index.js file created using touch command.

The file generated using script saved as exercise12_2 in the script-answers.

## Exercise 12.3: Ubuntu 101
**Task:**
Use script to record what you do, save the file as script-answers/exercise12_3.txt

Edit the /usr/src/app/index.js file inside the container with the now installed Nano and add the following line

console.log('Hello World')
If you are not familiar with Nano you can ask for help in the chat or Google.

**Solution:**
Container started in interactive mode using
```
docker start -i musing_goldwasser
```
command.

The container name musing_goldwasser taken from 
```
 docker container ls -a
```
output.

Steps are recorded using script command in script-answers/exercise12_3.txt file.

## Exercise 12.4: Ubuntu 102
**Task:**
Use script to record what you do, save the file as script-answers/exercise12_4.txt

Install Node while inside the container and run the index file with node /usr/src/app/index.js in the container.

The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste:
```
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```
You will need to install the curl into the container. It is installed in the same way as you did with nano.

After the installation, ensure that you can run your code inside the container with command
```
root@b8548b9faec3:/# node /usr/src/app/index.js
Hello World
```

**Solution:**
I did not need curl to install node.

script command output is in script-answers/exercise12_4.txt file.

## Exercise 12.5: Containerizing a Node application
**Task:**
The repository you cloned or copied in the first exercise contains a todo-app. See the todo-app/todo-backend and read through the README. We will not touch the todo-frontend yet.

- Step 1. Containerize the todo-backend by creating a todo-app/todo-backend/Dockerfile and building an image.
- Step 2. Run the todo-backend image with the correct ports open. Make sure the visit counter increases when used through a browser in http://localhost:3000/ (or some other port if you configure so)

Tip: Run the application outside of a container to examine it before starting to containerize.

**Solution:**

todo-app/todo-backend Dockerfile:
```
FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV DEBUG=playground:*

USER node

CMD npm start
```

built and run with
```
docker build -t todo-backend . && docker run -p 3000:3000 todo-backend
```

tested by visiting
```
http://localhost:3000/
```
that outputted
```
{"visits":5}
```
and the number of visits increased by every page reload.

Stopped with:

running 
```
docker container ls
```
to list containers which inputs the following
```
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                    NAMES
ba5ba41e49d6   todo-backend   "docker-entrypoint.s…"   31 seconds ago   Up 31 seconds   0.0.0.0:3000->3000/tcp   festive_noether
```
and using CONTAINER ID to kill the container
```
docker kill 68cbac90f7e2
```

...and copied todo-app/todo-backend/.gitignore content to todo-app/todo-backend/.dockerignore

## Exercise 12.6: Docker compose
**Task:**
Create a todo-app/todo-backend/docker-compose.yml file that works with the node application from the previous exercise.

The visit counter is the only feature that is required to be working.

**Solution:**
created todo-app/todo-backend/docker-compose.yml file with the following content

```
version: '3.8'            # Version 3.8 is quite new and should work

services:
  app:                    # The name of the service, can be anything
    image: todo-backend   # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

and run 
```
docker-compose up
```
to build and run the image... tested by visiting 
```
http://localhost:3000/
```

which showed the counter as expected.

## Exercise 12.7: Little bit of MongoDB coding
**Task:**
Note that this exercise assumes that you have done all the configurations made in the material after exercise 12.5. You should still run the todo-app backend outside a container; just the MongoDB is containerized for now.

The todo application has no proper implementation of routes for getting one todo (GET /todos/:id) and updating one todo (PUT /todos/:id). Fix the code.

**Solution:**

Run 
```
docker-compose -f docker-compose.dev.yml down --volumes
```
to ensure that nothing is left and start from a clean slate.

updated todo-app/todo-backend/docker-compose.dev.yml:

```
version: '3.8'

services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js # bind mount - mongo-init.js in the mongo folder of the host machine is the same as the mongo-init.js file in the container's /docker-entrypoint-initdb.d
      - ./mongo_data:/data/db # to persist data even after stopping and rerunning container / storing data outside of container
```

and run
```
docker-compose -f docker-compose.dev.yml up
```
to initialize the database.

and
```
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

to run the app with the env variable (from different terminal tabs)

Implemented GET and PUT for getting and updating a single TODO and tested it using Postmen. The data persisted after rerunning mongo container.

## Exercise 12.8: Mongo command-line interface
**Task:**
Use script to record what you do, save the file as script-answers/exercise12_8.txt

While the MongoDB from the previous exercise is running, access the database with Mongo command-line interface (CLI). You can do that using docker exec. Then add a new todo using the CLI.

The command to open CLI when inside the container is mongosh

The mongo CLI will require the username and password flags to authenticate correctly. Flags -u root -p example should work, the values are from the docker-compose.dev.yml.

- Step 1: Run MongoDB
- Step 2: Use docker exec to get inside the container
- Step 3: Open Mongo cli

When you have connected to the mongo cli you can ask it to show dbs inside:
```
> show dbs
admin         0.000GB
config        0.000GB
local         0.000GB
the_database  0.000GB
```
To access the correct database:
```
> use the_database
```
And finally to find out the collections:
```
> show collections
todos
```
We can now access the data in those collections:
```
> db.todos.find({})
[
{
_id: ObjectId("633c270ba211aa5f7931f078"),
text: 'Write code',
done: false
},
{
_id: ObjectId("633c270ba211aa5f7931f079"),
text: 'Learn about containers',
done: false
}
]
```
Insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false. Consult the [documentation](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to see how the addition is done.

Ensure that you see the new todo both in the Express app and when querying from Mongo CLI.

**Solution:**
While running
```
docker-compose -f docker-compose.dev.yml up
```
and
```
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```
(not necessary)

listed containers

```
docker container ls
```
giving output
```
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS              PORTS                     NAMES
2ff9444beecd   mongo     "docker-entrypoint.s…"   22 hours ago   Up About a minute   0.0.0.0:3456->27017/tcp   todo-backend-mongo-1
```
Using container name to access it:

```
docker exec -it todo-backend-mongo-1 bash
```

While inside the container:

```
mongosh -u root -p example
```
to access mongo CLI (the flag values are from the docker-compose.dev.yml)

while inside mongo CLI:
```
show dbs
```
outputs
```
admin         100.00 KiB
config         60.00 KiB
local          72.00 KiB
the_database   56.00 KiB
```
To access the correct database running
```
use the_database
```
To show collections:
```
show collections
```
which shows the collections in the_database
```
todos
```
To access data in the todos collection:
```
db.todos.find({})
```
Outputs:
```
[
  {
    _id: ObjectId("63ecd2cf38e94d7904e9fb5e"),
    text: 'Write code - updated',
    done: false
  },
  {
    _id: ObjectId("63ecd2cf38e94d7904e9fb5f"),
    text: 'Learn about containers',
    done: false
  }
]
```
To insert new todo as given in the exercise task:
```
db.todos.insertOne(
   {
      text: 'Increase the number of tools in my toolbelt',
      done: false
   }
)
```
Confirming that new collection was added:
```
db.todos.find({})
```
Returns output containing our new todo:
```
[
  {
    _id: ObjectId("63ecd2cf38e94d7904e9fb5e"),
    text: 'Write code - updated',
    done: false
  },
  {
    _id: ObjectId("63ecd2cf38e94d7904e9fb5f"),
    text: 'Learn about containers',
    done: false
  },
  {
    _id: ObjectId("63ee0d401ffbae05691db828"),
    text: 'Increase the number of tools in my toolbelt',
    done: false
  }
]
```
Visiting
```
http://localhost:3000/todos
```
confirms that
```
[
  {
    "_id": "63ecd2cf38e94d7904e9fb5e",
    "text": "Write code - updated",
    "done": false
  },
  {
    "_id": "63ecd2cf38e94d7904e9fb5f",
    "text": "Learn about containers",
    "done": false
  },
  {
    "_id": "63ee0d401ffbae05691db828",
    "text": "Increase the number of tools in my toolbelt",
    "done": false
  }
]
```

The script output file is script-answers/exercise12_8.txt

## Exercise 12.9: Set up Redis for the project
The Express server has already been configured to use Redis, and it is only missing the REDIS_URL environment variable. The application will use that environment variable to connect to the Redis. Read through the Docker Hub page for Redis, add Redis to the todo-app/todo-backend/docker-compose.dev.yml by defining another service after mongo:
```
services:
mongo:
...
redis:
???
```
Since the Docker Hub page doesn't have all the info, we can use Google to aid us. The default port for Redis is found by doing so:

Port 6379

We won't have any idea if the configuration works unless we try it. The application will not start using Redis by itself, that shall happen in next exercise.

Once Redis is configured and started, restart the backend and give it the REDIS_URL, that has the form redis://host:port
```
$ REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```
You can now test the configuration by adding the line
```
const redis = require('../redis')
```
to the Express server eg. in file routes/index.js. If nothing happens, the configuration is done right. If not, the server crashes:
```
events.js:291
throw er; // Unhandled 'error' event
^

Error: Redis connection to localhost:637 failed - connect ECONNREFUSED 127.0.0.1:6379
at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
Emitted 'error' event on RedisClient instance at:
at RedisClient.on_error (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:342:14)
at Socket.<anonymous> (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:223:14)
at Socket.emit (events.js:314:20)
at emitErrorNT (internal/streams/destroy.js:100:8)
at emitErrorCloseNT (internal/streams/destroy.js:68:3)
at processTicksAndRejections (internal/process/task_queues.js:80:21) {
errno: -61,
code: 'ECONNREFUSED',
syscall: 'connect',
address: '127.0.0.1',
port: 6379
}
[nodemon] app crashed - waiting for file changes before starting...
```

**Solution:**
added
```
const redis = require('../redis')
```
to todo-app/dodo-backend/routes/index.js

re-run
```
docker-compose -f docker-compose.dev.yml up
```

configured redis in todo-app/todo-backend/docker-compose.dev.yaml
```
version: '3.8'

services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js # bind mount - mongo-init.js in the mongo folder of the host machine is the same as the mongo-init.js file in the container's /docker-entrypoint-initdb.d
      - ./mongo_data:/data/db # to persist data even after stopping and rerunning container / storing data outside of container
  redis:
    image: redis
    ports:
      - 6379:6379
```

and started the express app:
```
REDIS_URL=redis://localhost:6379 MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

No error shown in terminal, everything should work as expected.

## Exercise 12.10:
**Task:**
The project already has https://www.npmjs.com/package/redis installed and two functions "promisified" - getAsync and setAsync.

 - setAsync function takes in key and value, using the key to store the value.
 - getAsync function takes in key and returns the value in a promise.

Implement a todo counter that saves the number of created todos to Redis:

- Step 1: Whenever a request is sent to add a todo, increment the counter by one.
- Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON:
```
{
"added_todos": 0
}
```

**Solution:**
Implemented as instructed.

```
http://127.0.0.1:3000/todos/statistics
```

returns number of added todos, i.e.:
```
{"added_todos":32}
```

The number of added todos is saved in redis under key added_todos

usage example:

```
await setAsync('added_todos', Number((await getAsync('added_todos') ?? 0)) + 1);
```

## Exercise 12.11:
**Task:**
Use script to record what you do, save the file as script-answers/exercise12_11.txt

If the application does not behave as expected, a direct access to the database may be beneficial in pinpointing problems. Let us try out how [redis-cli](https://redis.io/topics/rediscli) can be used to access the database.

- Go to the Redis container with docker exec and open the redis-cli.
- Find the key you used with [KEYS *](https://redis.io/commands/keys)
- Check the value of the key with command [GET](https://redis.io/commands/get)
- Set the value of the counter to 9001, find the right command from [here](https://redis.io/commands/)
- Make sure that the new value works by refreshing the page http://localhost:3000/statistics
- Create a new todo with Postman and ensure from redis-cli that the counter has increased accordingly
- Delete the key from cli and ensure that counter works when new todos are added

**Solution**
Running
```
docker container ls
```
To get redis container name. Output:
```
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS          PORTS                     NAMES
91ff2c9afd07   redis     "docker-entrypoint.s…"   2 hours ago    Up 51 minutes   0.0.0.0:6379->6379/tcp    todo-backend-redis-1
2ff9444beecd   mongo     "docker-entrypoint.s…"   25 hours ago   Up 51 minutes   0.0.0.0:3456->27017/tcp   todo-backend-mongo-1
```

Accessing the redis container:
```
docker exec -it todo-backend-redis-1 bash
```

Accessing redis CLI by running:
```
redis-cli
```
inside the container.

Listing all keys and their values saved in redis.

```
KEYS *
```
Output:
```
1) "added_todos"
2) "key"
```
Checking value of "added_todos":
```
GET added_todos
```
Which returns:
```
"32"
```
Using [SET](https://redis.io/commands/set/)
to set "added_todos" to 9001 by running
```
SET added_todos 9001
```
Verifying by running 
```
GET added_todos
```
which outputs correct value
```
"9001"
```
also visiting URL
```
http://localhost:3000/todos/statistics
```
Note: the URL should probably be http://localhost:3000/statistics, but that is probably only a detail. It is only about in which router it is implemented.

```
{"added_todos":9001}
```
New todo created using Postman and the value got incremented by one:
```
{"added_todos":9002}
```

Key deleted with
```
DEL added_todos
```
and verified with
```
KEYS *
```
that did not return the deleted key.

The statistics endpoint returns:
```
{"added_todos":0}
```
which is correct.

## Exercise 12.12: Persisting data in Redis
**Task:**
Check that the data is not persisted by default: after running docker-compose -f docker-compose.dev.yml down and docker-compose -f docker-compose.dev.yml up the counter value is reset to 0.

Then create a volume for Redis data (by modifying todo-app/todo-backend/docker-compose.dev.yml ) and make sure that the data survives after running docker-compose -f docker-compose.dev.yml down and docker-compose -f docker-compose.dev.yml up.

**Solution:**
Created a few todos

Stopped the containers.
```
docker-compose -f docker-compose.dev.yml down
```
Re-run the containers
```
docker-compose -f docker-compose.dev.yml up
```
and the counter was reset to 0 which is correct.

Updated docket-compose.dev.yml
```
version: '3.8'

services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js # bind mount - mongo-init.js in the mongo folder of the host machine is the same as the mongo-init.js file in the container's /docker-entrypoint-initdb.d
      - ./mongo_data:/data/db # to persist data even after stopping and rerunning container / storing data outside of container
  redis:
    image: redis
    ports:
      - 6379:6379
    command: [ 'redis-server', '--appendonly', 'yes' ] # Overwrite the CMD
    volumes: # Declare the volume
        - ./redis_data:/data
```

created few todos

statistics endpoint returns

```
{"added_todos":5}
```

shutting down containers
```
docker-compose -f docker-compose.dev.yml down
```
, starting them up
```
docker-compose -f docker-compose.dev.yml up  
```
checking the statistics endpoint  and the output confirms that the redis memory is persistant now
```
{"added_todos":5}
```

## Exercise 12.13: Todo application frontend
**Task:**
Finally, we get to the todo-frontend. View the todo-app/todo-frontend and read through the README.

Start by running the frontend outside the container and ensure that it works with the backend.

Containerize the application by creating todo-app/todo-frontend/Dockerfile and use [ENV](https://docs.docker.com/engine/reference/builder/#env) instruction to pass REACT_APP_BACKEND_URL to the application and run it with the backend. The backend should still be running outside a container. Note that you need to set REACT_APP_BACKEND_URL before running/building the frontend, otherwise it does not get defined in the code!

**Solution:**

Installed dependencies by running
```
npm install
```

and running/testing outside of container by running
```
REACT_APP_BACKEND_URL=http://127.0.0.1:3000/ npm start
```
to ensure everything works ok.

Used ```RUN npm istall``` instead of ```RUN npm ci``` in Dockerfile due to an error.
and ENV <key>=<value> to set the backend URL
Dockerfile:
```
# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm install

# backend URL
ENV REACT_APP_BACKEND_URL=http://127.0.0.1:3000/

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
```
and copied .dockerignore file from the backend

run with the command
```
docker build -t todo-frontend . && docker run -p 8000:80 todo-frontend
```

and accessed from browser under the following URL
```
http://127.0.0.1:8000/
```
which worked.

## Exercise 12.14: Testing during the build process
**Task:**
One interesting possibility to utilize multi-stage builds is to use a separate build stage for [testing](https://docs.docker.com/language/nodejs/run-tests/). If the testing stage fails, the whole build process will also fail. Note that it may not be the best idea to move all testing to be done during the building of an image, but there may be some containerization-related tests where this might be a good idea.

Extract a component Todo that represents a single todo. Write a test for the new component and add running tests into the build process.

Run the tests with CI=true npm test. Without the env CI=true set, the create-react-app will start watching for changes and your pipeline will get stuck.

You can add a new build stage for the test if you wish to do so. If you do so, remember to read the last paragraph before exercise 12.13 again!

**Solution:**

Refactored the TodoList component and extracted a single Todo to its own component:
```
const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map(todo => {
        return (<Todo todo={todo} completeTodo={completeTodo} deleteTodo={deleteTodo} />)
      }).reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
  )
}
```

*NOTE:* Needed to copy build from test stage to the last stage. Otherwise the tests would be skipped (bcs the optimization).
Dockerfile:
```
# The first FROM is now a stage called build-stage
FROM node:16 AS base

WORKDIR /usr/src/app

COPY . .

RUN npm instal

# backend URL
ENV REACT_APP_BACKEND_URL=http://127.0.0.1:3000/

RUN npm run build

FROM base as test

COPY . .

RUN CI=true npm run test

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=test /usr/src/app/build /usr/share/nginx/html
# build copied from test to force docker to not skip the stage and run the tests
```

Both, failed and successful tests worked as expected. Failed tests prevented the final stage from being executed.

## Exercise 12.15: Set up a frontend development environment
**Task:**
Create todo-frontend/docker-compose.dev.yml and use volumes to enable the development of the todo-frontend while it is running inside a container.

**Solution:**
Created docker-compose.dev.yml and dev.Dockerfile for the todo-frontend app enabling running it in developer mode. 

*Frontend and backend in containers are not communicating with each other yet.*

## Exercise 12.16: Run todo-backend in a development container
**Task:**
Use volumes and Nodemon to enable the development of the todo app backend while it is running inside a container. Create a todo-backend/dev.Dockerfile and edit the todo-backend/docker-compose.dev.yml.

You will also need to rethink the connections between backend and MongoDB / Redis. Thankfully Docker Compose can include environment variables that will be passed to the application:
```
services:
server:
image: ...
volumes:
- ...
ports:
- ...
environment:
- REDIS_URL=redisurl_here
- MONGO_URL=mongourl_here
```
The URLs are purposefully wrong, you will need to set the correct values. Remember to look all the time what happens in console. If and when things blow up, the error messages hint at what might be broken.

**Solution:**
Updated docker-compose.dev.yaml for the backend application.

```
version: '3.8'

services:
  mongo:
    image: mongo
    container_name: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js # bind mount - mongo-init.js in the mongo folder of the host machine is the same as the mongo-init.js file in the container's /docker-entrypoint-initdb.d
      - ./mongo_data:/data/db # to persist data even after stopping and rerunning container / storing data outside of container
  redis:
    image: redis
    ports:
      - 6379:6379
    command: [ 'redis-server', '--appendonly', 'yes' ] # Overwrite the CMD
    volumes: # Declare the volume
        - ./redis_data:/data
  debug-helper:
    image: busybox
  server:
    image: todo-backend-dev
    ports:
      - 3000:3000
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    environment:
      REDIS_URL: redis://redis:6379
      MONGO_URL: mongodb://the_username:the_password@mongo:27017/the_database # THE port mapping - container port must be used!
    volumes: # Declare the volume
      - ./:/usr/src/app
    container_name: todo-backend-dev

```
Launched with ```docker-compose -f docker-compose.dev.yml up``` in the todo-backend root directory.

*Note:* Did not manage to make debug-helper work.

***Note:*** Notice the REDIS_URL and MONGO_URL, especially their ports!
i.e. ```mongodb://the_username:the_password@mongo:27017/the_database``` uses 27017, which is port used inside the container. The containers share network and hence can communicate with each other.

Other parts of the URLs are also worth inspecting!

## Exercise 12.17: Set up an Nginx reverse proxy server in front of todo-frontend
**Task:**
We are going to put the nginx server in front of both todo-frontend and todo-backend. Let's start by creating a new docker-compose file todo-app/docker-compose.dev.yml and todo-app/nginx.conf.
```
todo-app
├── todo-frontend
├── todo-backend
├── nginx.conf
└── docker-compose.dev.yml
```
Add the services nginx and todo-frontend built with todo-app/todo-frontend/dev.Dockerfile into the todo-app/docker-compose.dev.yml.

**Solution:**
Created docket-compose.dev.yaml
```
services:
  app:
    image: todo-frontend-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: ./todo-frontend/dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./todo-frontend/:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3001:3000
    container_name: todo-frontend-dev # This will name the container hello-front-dev
  nginx: # reverse proxy
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app
```
and nginx.conf
```
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      # Requests are directed to http://localhost:3000
      proxy_pass http://app:3000;
    }
  }
}
```
in todo-app root nd started with ```docker-compose -f docker-compose.dev.yml up``` run from the todo-app root directory.

frontend app is accessible from http://127.0.0.1:8080/ . However, it does not communicate with the backend yet.

## Exercise 12.18: Configure the Nginx server to be in front of todo-backend
Add the service todo-backend to the docker-compose file todo-app/docker-compose.dev.yml in development mode.

Add a new location to the nginx.conf so that requests to /api are proxied to the backend. Something like this should do the trick:
```
server {
listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }

    # Requests starting with /api/ are handled
    location /api/ {
      ...
    }
}
```
The proxy_pass directive has an interesting feature with a trailing slash. As we are using the path /api for location but the backend application only answers in paths / or /todos we will want the /api to be removed from the request. In other words, even though the browser will send a GET request to /api/todos/1 we want the Nginx to proxy the request to /todos/1. Do this by adding a trailing slash / to the URL at the end of proxy_pass.

This is a [common issue](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

**Solution:**
updated docker-compose.dev.yaml in the root todo-app directory
```
services:
#  frontend
  app:
    image: todo-frontend-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: ./todo-frontend/dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./todo-frontend/:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3001:3000
    container_name: todo-frontend-dev # This will name the container hello-front-dev
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8080/api

#  backend
  mongo:
    image: mongo
    container_name: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./todo-backend/mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js # bind mount - mongo-init.js in the mongo folder of the host machine is the same as the mongo-init.js file in the container's /docker-entrypoint-initdb.d
      - ./mongo_data:/data/db # to persist data even after stopping and rerunning container / storing data outside of container
  redis:
    image: redis
    ports:
      - 6379:6379
    command: [ 'redis-server', '--appendonly', 'yes' ] # Overwrite the CMD
    volumes: # Declare the volume
      - ./todo-backend/redis_data:/data
#  debug-helper:
#    image: busybox
  server:
    image: todo-backend-dev
    ports:
      - 3000:3000
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: ./todo-backend/dev.Dockerfile # This will simply tell which dockerfile to read
    environment:
      REDIS_URL: redis://redis:6379
      MONGO_URL: mongodb://the_username:the_password@mongo:27017/the_database # THE port mapping - container port must be used!
    volumes: # Declare the volume
      - ./todo-backend/:/usr/src/app
    container_name: todo-backend-dev


#  reverse proxy
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app
      - server
```

and updated nginx.conf in the same location
```
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      # Requests are directed to http://localhost:3000
      proxy_pass http://app:3000;
    }
    # Requests starting with /api/ are handled
    location /api/ {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      proxy_pass http://server:3000/; # the / behind URL is important
    }
  }
}
```
started with ```docker-compose -f docker-compose.dev.yml up``` from the todo-app root directory
frontend accessed under http://127.0.0.1:8080/
backend statistics accessed via http://127.0.0.1:8080/api/todos/statistics/
the nginx recognises /api part and passes request to the backend. The / at the end of the configured url takes care of passing the path that follows after it.

## Exercise 12.19: Connect the services, todo-frontend with todo-backend
**Task:**
In this exercise, submit the entire development environment, including both Express and React applications, Dockerfiles and docker-compose.yml.

Make sure that the todo-frontend works with todo-backend. It will require changes to the REACT_APP_BACKEND_URL environmental variable.

If you already got this working during a previous exercise you may skip this.

Make sure that the development environment is now fully functional, that is:
- all features of the todo app work
- you can edit the source files and the changes take effect through hot reload in case of frontend and by reloading the app in case of backend

**Solution:**
Already done while working on the previous exercises. Tested the functionality of the frontend and it worked well. The frontend also communicated with the backend.
