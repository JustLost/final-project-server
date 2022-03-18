const router = require("express").Router();
const { google } = require("googleapis");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
//const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const User = require("../models/User.model");

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    // "http://localhost:3000"
    "https://agilize-we-app.netlify.app"
)


router.post("/create-tokens", isAuthenticated, async (req, res, next) => {
  try {
    const {_id} = req.payload;
    const { code } = req.body;
    const response = await oAuth2Client.getToken(code)
    console.log("tokensss", response.tokens)
    const updatedUser = await User.findByIdAndUpdate(_id, {refreshToken: response.tokens.refresh_token}, {new: true})
    console.log("useeeeer:", updatedUser)    
    res.send(response)
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", isAuthenticated, async (req, res, next) => {
    try {

        const {summary, description, location, startDateTime, endDateTime} = req.body
        const {_id} = req.payload;
        const user = await User.findById(_id)
        oAuth2Client.setCredentials({refresh_token: user.refreshToken})

        const calendar = google.calendar("v3")
        const response = await calendar.events.insert({
            auth: oAuth2Client,
            calendarId: "primary",
            sendUpdates: "all",
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
                },
                attendees: [{email: "a.rita.cunha.ts@gmail.com"}]
            }
        })
        res.send(response)
    } catch (error) {
        next (error)
    }
})

module.exports = router