<h1>Running server</h1>

```
npm i
npm run dev
```

<h1>Running server in docker</h1>

```
1. run docker container (replace <PROJECT_SOURCE_PATH>)

docker run -it --entrypoint sh --rm --name decision-tree-server -p 3000:3000 -v <PROJECT_SOURCE_PATH>:/usr/src/app -w /usr/src/app node:22-alpine3.19

2. install dependencies and run server

npm i
npm run dev
```

<h1>Endpoint description</h1>

```
POST localhost:3000/execute
Send JSON input, examples are bellow
```

<h1>Examples of JSON inputs</h1>

<b>case1</b>
```
{
  "root": {
    "type": "condition",
    "condition": "new Date().toLocaleDateString() === '1.1.2025'",
    "trueAction": {
      "type": "sendSMS",
      "phoneNumber": "+123456789"
    },
    "falseAction": null
  }
}
```
<b>case2</b>
```
{
  "root": {
    "type": "sendEmail",
    "from": "no-reply@company.com",
    "to": "user@example.com",
    "next": {
      "type": "sendSMS",
      "phoneNumber": "+123456789",
      "next": {
        "type": "sendEmail",
        "from": "support@company.com",
        "to": "user@example.com"
      }
    }
  }
}

```
<b>case3</b>
```
{
  "root": {
    "type": "loop",
    "iterations": 10,
    "next": {
      "type": "condition",
      "condition": "Math.random() > 0.5",
      "trueAction": {
        "type": "sendSMS",
        "phoneNumber": "+123456789"
      },
      "falseAction": null
    }
  }
}

```

<b>Complex input</b>
```
{
  "root": {
    "type": "condition",
    "condition": "new Date().getFullYear() === 2024",
    "trueAction": {
      "type": "loop",
      "iterations": 3,
      "next": {
        "type": "condition",
        "condition": "Math.random() > 0.5",
        "trueAction": {
          "type": "loop",
          "iterations": 2,
          "next": {
            "type": "condition",
            "condition": "Math.random() > 0.7",
            "trueAction": {
              "type": "sendSMS",
              "phoneNumber": "+123456789"
            },
            "falseAction": {
              "type": "sendEmail",
              "from": "no-reply@company.com",
              "to": "admin@domain.com"
            }
          }
        },
        "falseAction": {
          "type": "sendEmail",
          "from": "fallback@company.com",
          "to": "support@company.com"
        }
      }
    },
    "falseAction": {
      "type": "loop",
      "iterations": 2,
      "next": {
        "type": "condition",
        "condition": "Math.random() > 0.4",
        "trueAction": {
          "type": "loop",
          "iterations": 3,
          "next": {
            "type": "sendEmail",
            "from": "marketing@company.com",
            "to": "user@company.com"
          }
        },
        "falseAction": {
          "type": "sendSMS",
          "phoneNumber": "+987654321"
        }
      }
    }
  }
}

```