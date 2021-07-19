**A Simple Browserless tester**
  Last Modified: 2021-07-19

# Introduction

browserless.io provides a cloud service specialized to run remote-controllable Chrome instances (or bots). Theoretically, anybody can set up a same kind of cloud app on a generic cloud provider like Google, or even on your own server computer. However, it is indeed much easier to just pay a bit of money to browserless.io and be ready to have fun.

You can write a script for the bot and test it on your local computer. When you are ready, you send the script to the browserless.io server to run many clients at once.

# An example

Take a look at `run.js`. It follows the structure described on their page: [browserless /function API](https://docs.browserless.io/docs/function.html).

There is a few restrictions on the style of the script to keep the launcher script `browserless.sh` simple.

  - string constants in the script have to use single quotes.
  - the exported function has to be named "run".
  - the run function is expected to return a promise that resolves to a screenshot object.
  - the API allows the "context" argument, but the launcher below does not support it yet.

# Local Test

  run `npm install` and then run:

~~~~~~~~
        node local.js
~~~~~~~~

Then, if you access the following URL with a regular browser:
~~~~~~~~
        localhost:8080/image
~~~~~~~~

the `run()` function in run.js is invoked.  (Perhaps the function to run should be provided as an argument.)  When the run function returns a screenshot, it is shown in the browser window.

# Deployment

If your test program runs fine. Get a browserless account and put the API key in a file (below, it is called `apiKey.txt`).

You run the `browserless.sh` with three arguments: 1) the key file name, 2) the script file name, and 3) the number of replicas:

~~~~~~~~
        ./browserless.sh apiKey.txt run.js 5
~~~~~~~~
The script minifies the specified script, and issues a `/function` call via curl.
