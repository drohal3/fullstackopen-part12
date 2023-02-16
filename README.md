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

