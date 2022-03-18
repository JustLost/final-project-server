const router = require("express").Router();
const { google } = require("googleapis");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
//const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const User = require("../models/User.model");
const Project = require("../models/Project.model");

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "http://localhost:3000"
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

        const {summary, description, location, startDateTime, endDateTime, recurring, projectId} = req.body
        const {_id} = req.payload;
        const user = await User.findById(_id)
        oAuth2Client.setCredentials({refresh_token: user.refreshToken})

        let project = await Project.findById(projectId)
        .populate("backlog sprints users")
        .catch((err) => res.json(err));

        console.log("finding project", project)
        let userEmails = project.users.reduce((a, user) => ([ ...a, {email: user.email}]), [])
        
        console.log(`finding useremails`, userEmails)

        const calendar = google.calendar("v3")
        const response = await calendar.events.insert({
            auth: oAuth2Client,
            calendarId: "primary",
            sendUpdates: "all",
            recurrence : recurring ? `RRULE:FREQ=DAILY;COUNT=${recurring*7}` : "",
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
                attendees: userEmails
            }
        })
        res.send(response)
    } catch (error) {
        next (error)
    }
})

module.exports = router