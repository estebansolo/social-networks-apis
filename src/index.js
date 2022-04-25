import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import swaggerUi from "swagger-ui-express"

import v1Auth from "auth/v1"
import v2Auth from "auth/v2"
import v1Twitter from "twitter/v1"
import v2Twitter from "twitter/v2"
import facebook from "facebook"
import linkedin from "linkedin"
import swaggerDocument from "swagger"

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// TODO: Deprecated, require to be updated
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss: ".swagger-ui .topbar { display: none }"
    })
)

app.use("/auth/v1", v1Auth)
app.use("/auth/v2", v2Auth)
app.use("/api/facebook", facebook)
app.use("/api/linkedin", linkedin)
app.use("/api/twitter/v1", v1Twitter)
app.use("/api/twitter/v2", v2Twitter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
