const EMAIL = "email"; // put email of the alert receipent
const OWNER_EMAIL = "notdarshant@gmal.com";
const SHEET_NAME = "Workflow";

function onEdit(e) {
  const sheet = e.source.getSheetByName(SHEET_NAME);
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();
  const user = Session.getActiveUser().getEmail();

  const colA = 1, colB = 2, colC = 3, colD = 4, colE = 5;

  // 1. Make Columns B, C, E uneditable manually (except owner)
  if ([colB, colC, colE].includes(col) && user !== OWNER_EMAIL) {
    const original = e.oldValue || "";
    range.setValue(original);
    Logger.log(`Edit prevented at row ${row}, col ${col} by ${user}`);
    return;
  }

  // 2. Column A logic: single edit allowed, then locked internally (via note)
  if (col === colA && sheet.getRange(row, col).getValue()) {
    const aCell = sheet.getRange(row, col);

    if (aCell.getNote() === "locked") {
      Logger.log(`Attempt to re-edit locked cell at row ${row}, col A`);
      aCell.setValue(e.oldValue || "");
      return;
    }

    // Auto-fill Column B (Time) and C (Date)
    sheet.getRange(row, colB).setValue(new Date().toLocaleTimeString());
    sheet.getRange(row, colC).setValue(new Date().toLocaleDateString());

    // Lock cell by setting note (invisible to users)
    aCell.setNote("locked");

    // Store timestamp for this row (using 1-based row number)
    PropertiesService.getScriptProperties().setProperty(`timestamp_${row}`, new Date().toISOString());

    Logger.log(`Column A edited and locked at row ${row}`);
  }

  // 3. Column D (link entry) logic: validate link & calculate time taken in col E
  if (col === colD) {
    const link = sheet.getRange(row, col).getValue();
    Logger.log(`Link entered at row ${row}: ${link}`);

    if (isValidLink(link)) {
      const timestampStr = PropertiesService.getScriptProperties().getProperty(`timestamp_${row}`);
      Logger.log(`Timestamp for row ${row}: ${timestampStr}`);

      if (timestampStr) {
        const timestamp = new Date(timestampStr);
        const diffMins = (new Date() - timestamp) / 60000;
        Logger.log(`Time diff for row ${row}: ${diffMins.toFixed(2)} mins`);
        sheet.getRange(row, colE).setValue(diffMins.toFixed(2) + " mins");
      } else {
        Logger.log(`No timestamp found for row ${row}, cannot calculate time taken`);
      }
    } else {
      Logger.log(`Invalid link entered at row ${row}`);
    }
  }
}

// Utility: simple link validation (can be replaced by actual URL fetch if desired)
function isValidLink(url) {
  // For quick testing, just check if string starts with "http"
  return url && url.toString().startsWith("http");
  /*
  // Uncomment below for real URL check (beware of quotas and delays)
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    return response.getResponseCode() === 200;
  } catch (e) {
    return false;
  }
  */
}

// 4. Check rows if link is not entered after 5 mins, then email alert
function checkLinkEntry() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {  // assuming first row = headers
    const option = data[i][0];    // col A
    const link = data[i][3];      // col D
    const rowNum = i + 1;         // actual sheet row number

    if (option && !link) {
      const storedTime = PropertiesService.getScriptProperties().getProperty(`timestamp_${rowNum}`);
      if (storedTime) {
        const timeDiff = (now - new Date(storedTime)) / 60000;
        if (timeDiff > 5) {
          MailApp.sendEmail({
            to: EMAIL,
            subject: `Missing Link Alert (Row ${rowNum})`,
            body: `No link was uploaded within 5 minutes for the task selected in Row ${rowNum}. Please check.`
          });
          // Delete timestamp so email is not repeatedly sent
          PropertiesService.getScriptProperties().deleteProperty(`timestamp_${rowNum}`);
          Logger.log(`Alert email sent for row ${rowNum}`);
        }
      }
    }
  }
}

// 5. Reset function to clear all locked notes and timestamps (for testing)
function resetLocksAndTimestamps() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  for (let row = 2; row <= lastRow; row++) {
    const aCell = sheet.getRange(row, 1);
    aCell.setNote("");               // clear lock note
    PropertiesService.getScriptProperties().deleteProperty(`timestamp_${row}`);
  }
  Logger.log("All locks and timestamps cleared.");
}

// For manual testing from the editor
function testCheckLinkEntry() {
  checkLinkEntry();
}
