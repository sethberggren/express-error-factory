# express-error-factory

This is a simple custom error class and middleware for Express to better facilitate error handling in Express.

## Usage

### Installation

```bash
npm install express-error-factory
```

First, generate the custom errors using the CustomErrorThrower class.

```typescript
const customErrors = new CustomErrorThrower({
    rodentError: {
        tooManySquirrels: {
            {
                type: "rodentError",
                statusCode: 400,
                message: "The squirrels have chewed all of your cables."
            }
        },
        possumKingdom : {
            type: "rodentError",
            statusCode: 500,
            message: "The opossums have decreed that your realm is now theirs."
        }
    },
    insectError : {
        bees: {
            type: "insectError",
            statusCode: 404,
            message: "Bees?"
        }
    }
})
```

Errors can then be thrown easily in any Express route. 

```typescript
// generates a function to throw 'rodentError' errors 
const thrower = customErrors.throwCustomError("rodentError");

// throws an error with the information in the tooManySquirrels object.
thrower("tooManySquirrels");
```

Include the middleware as the last  `app.use()`.  The function can be given a custom error message for uncaught errors not specified in the CustomErrorThrower class.

```typescript
app.use(authenticationMiddleware);

app.use(route1);
app.use(route2);

/*
.
.
.
*/

const errorMiddleware = handleCustomError("Uncaught Error Message");

app.use(errorMiddleware);
```

[<span style="font-size:25px">Github</span>](https://github.com/sethberggren/express-error-factory)
