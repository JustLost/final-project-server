const router = require("express").Router();
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "http://localhost:3000"
)


router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const response = await oAuth2Client.getToken(code)    
    res.send(response)
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
    try {
        const {summary, description, location, startDateTime, endDateTime} = req.body

        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

        const calendar = google.calendar("v3")
        const response = await calendar.events.insert({
            auth: oAuth2Client,
            calendarId: "primary",
            requestBody: {
                summary: summary,
                description: description,
                location: location,
                colorId: "3",
                start: {
                    dateTime: new Date(startDateTime),
                },
                end: {
                    dateTime: new Date(endDateTime),
                }
            }
        })
        res.send(response)
    } catch (error) {
        next (error)
    }
})

module.exports = router