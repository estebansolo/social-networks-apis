import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import swaggerUi from "swagger-ui-express"

import swaggerDocument from "swagger"
import authRouter from "auth/router"
import facebookRouter from "facebook/router"
import linkedinRouter from "linkedin/router"
import twitterRouter from "twitter/router"

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss: ".swagger-ui .topbar { display: none }"
    })
)

app.use("/auth", authRouter)
app.use("/api/facebook", facebookRouter)
app.use("/api/linkedin", linkedinRouter)
app.use("/api/twitter", twitterRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
