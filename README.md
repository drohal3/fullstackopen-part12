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

