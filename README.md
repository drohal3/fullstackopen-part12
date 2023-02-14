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

