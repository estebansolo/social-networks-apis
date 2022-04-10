import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import swaggerUi  from 'swagger-ui-express'

import swaggerDocument from 'swagger'
import facebookRoute from 'facebook'
import linkedinRoute from 'linkedin'
import twitterRoute from 'twitter'


const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());


app.use("/facebook", facebookRoute);
app.use("/linkedin", linkedinRoute);
app.use("/twitter", twitterRoute);

let options = {
    customCss: '.swagger-ui .topbar { display: none }'
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
