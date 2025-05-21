# Google Sheets Automation: Link Tracker & Notification

## Overview
This project is a Google Apps Script designed to automate task tracking and management within a Google Sheet. It streamlines workflows by:

- Locking certain columns to prevent manual edits.
- Automatically recording date and time when a task is selected.
- Validating URLs entered in the sheet.
- Calculating and displaying the time taken to complete a task.
- Sending automated email alerts if a valid link isn’t provided within 5 minutes.

This script is ideal for content calendars, project tracking, or any workflow where timely link submission and task monitoring are critical.

---

## Features

- **Single-edit lock on task selection (Column A)** — prevents changes after the first entry.
- **Auto-fill date (Column C) and time (Column B)** when a task is selected.
- **Manual lock on Columns B, C, and E** to prevent user edits.
- **URL validation for links entered in Column D.**
- **Automatic calculation of time taken (Column E) between task selection and link entry.**
- **Email alert notification** if no valid link is entered within 5 minutes after task selection.
- **Time-based trigger** to regularly check and send alerts.

---

## Setup Instructions

1. Open your Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Copy and paste the provided script code into the editor.
4. Save the project.
5. Set up a time-driven trigger for the function `checkLinkEntry`:
   - In the Apps Script editor, click on the clock icon (Triggers).
   - Add a new trigger:
     - Choose function: `checkLinkEntry`
     - Event source: Time-driven
     - Type of time-based trigger: Minutes timer
     - Select interval: Every 5 minutes
6. Authorize the script to access your Google account when prompted.
7. Test the script by entering data in your sheet as per the instructions.

---

## How It Works

| Column | Purpose                                 | Behavior                                               |
|--------|-----------------------------------------|-------------------------------------------------------|
| A      | Task selection                         | Editable once; locks after first edit.                |
| B      | Time of task selection                 | Auto-filled when column A is edited.                   |
| C      | Date of task selection                 | Auto-filled when column A is edited.                   |
| D      | Link submission                       | User inputs a valid URL here; validated automatically. |
| E      | Time taken for task completion        | Calculates difference between A’s timestamp and D’s entry time. |

---

## Email Alerts

If a valid link is not entered in Column D within 5 minutes of selecting a task in Column A, an automated email alert is sent to notify the responsible party.

---

## Technologies Used

- Google Apps Script (JavaScript)
- Google Sheets
- Google Apps Script Triggers
- UrlFetchApp for URL validation
- MailApp for sending email notifications

---

## Contribution

Feel free to fork this repo and submit pull requests for improvements or new features!

---

## License

This project is open source and available under the MIT License.

---

## Contact

For questions or feedback, please open an issue or contact me directly.

---

*Happy automating! 🚀*

