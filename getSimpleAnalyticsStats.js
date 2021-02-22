const SA_USER_ID = "sa_user_id_...."
const SA_API_KEY = "sa_api_key_...."
const DOMAIN_TO_TRACK = "example.com"


const api = await getPageStats()
const widget = await createWidget(api)
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // When running the script inside the Scriptable app it will presented as a small widget
  widget.presentSmall()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  const title = api.url
  const widget = new ListWidget()
  widget.backgroundColor = Color.black()
  // Show app icon and title
  const titleStack = widget.addStack()
  titleStack.addSpacer(4)
  const titleElement = titleStack.addText(title)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(13)
  widget.addSpacer(12)
  // Show API Results
  const pageViewElementHeader = widget.addText("🔎 | Views:")
  pageViewElementHeader.textColor = Color.white()
  pageViewElementHeader.font = Font.boldSystemFont(16)
  widget.addSpacer(2)
  const pageViewElementContent = widget.addText(api.pageViews.toString())
  pageViewElementContent.minimumScaleFactor = 0.5
  pageViewElementContent.textColor = Color.white()
  pageViewElementContent.font = Font.systemFont(16)
  widget.addSpacer(2)
  const visitorsElementHeader = widget.addText("📊 | Visitors:")
  visitorsElementHeader.textColor = Color.white()
  visitorsElementHeader.font = Font.boldSystemFont(16)
  widget.addSpacer(2)
  const visitorsElementContent = widget.addText(api.visitors.toString())
  visitorsElementContent.minimumScaleFactor = 0.5
  visitorsElementContent.textColor = Color.white()
  visitorsElementContent.font = Font.systemFont(16)
  return widget
}

async function getPageStats() {
  const stats = await loadStats()
  const {pageviews, visitors} = stats
  return {
    name: "Pageviews:",
    pageViews: pageviews,
    visitors: visitors,
    url: DOMAIN_TO_TRACK
  }
}

async function loadStats() {
  const url = "https://simpleanalytics.com/" + DOMAIN_TO_TRACK + ".json?version=4&fields=pageviews,visitors"
  const req = new Request(url)
  req.headers = {
    "Api-Key": SA_API_KEY,
    "Content-Type": "application/json",
    "User-Id": SA_USER_ID,
  }
  return await req.loadJSON()
}