## yat-runner

This is a quick **Proof of Concept (POC)** I made long time ago.  
I wanted to learn workflow using YAML and NodeJS.

- It uses a pipeline definition similar to AWS CodePipeline
- It launches tasks on the local computer or within a container
- It can pull code from Github (Still commented in the code)
- Handling errors, but unfortunately not all of them
- Using docker volume to setup the tasks

## Usage

**Step 1:**

Install and Start Docker

**Step 2:**

```bash
npm install
npm run build
```

**Step 3:**

Setup a `.env`:

```bash
echo "$(cat ~/.ssh/yat-runner-test-only)" | base64
```

```text
CREDENTIALS="__INSERT_OUTPUT_HERE__"
```

Add the public key to the deploy key in github.

**Step 4:**

```bash
npm run test
```

## Todo

- [] Handling sigterm and all exit signal (CTRL+C and etc.)
- [] Global refactor and split logic and actions for better maintenability
- [] Implement proper way to log events, save those logs locally, add colors
- [] Implement a proper way to monitor the container
- [] Implement a way to test (Dry run)
- [] Handle when git has already clone the repo.
- [] Format logs output and group them to improve lisibilty

## Environment Variables

- CREDENTIALS
- WORKSPACE_DIR
