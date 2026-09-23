/**
 * ============================================================================
 * GOOGLE APPS SCRIPT FOR LINTO & FEMI WEDDING INVITATION
 * ============================================================================
 * 
 * Features:
 * 1. Google Sheets Wishes Sync:
 *    - doPost(e): Appends incoming blessings/wishes directly to the Google Sheet.
 *    - doGet(e): Returns all approved/active blessings as JSON with CORS enabled.
 * 
 * 2. Google Drive Album Sync:
 *    - doGet(e?action=album): Automatically fetches all high-res photos from
 *      the Google Drive folder (ID: 1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU).
 * 
 * ----------------------------------------------------------------------------
 * HOW TO DEPLOY IN 2 MINUTES:
 * 1. Open your Google Sheet (or go to https://script.google.com).
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete any existing code and paste this entire file.
 * 4. Replace SPREADSHEET_ID and FOLDER_ID below if needed.
 * 5. Click "Deploy" (top right) -> "New deployment".
 * 6. Select type: "Web app".
 *    - Description: "Wedding Wishes & Album API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (VERY IMPORTANT for guest submissions!)
 * 7. Click "Deploy" and authorize permissions.
 * 8. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 9. Paste this URL into index.html and album.html / js/main.js:
 *    window.GOOGLE_SHEETS_SCRIPT_URL = "YOUR_DEPLOYED_URL_HERE";
 * ============================================================================
 */

// Configuration
const SPREADSHEET_ID = '19TFYKdVRnqmQjT_R7n5rOukO1MdpIDj3mjsM3Plu0O0'; // Linto & Femi Google Sheet
const DRIVE_FOLDER_ID = '1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU'; // Celebration Album Google Drive Folder
const SHEET_NAME = 'Sheet1'; // Default Sheet Tab Name

/**
 * Handle GET Requests (Fetch Wishes or Album Images)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'wishes';

    if (action === 'album') {
      return getAlbumImages();
    } else {
      return getWishes();
    }
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Handle POST Requests (Submit New Wish to Google Sheet)
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (_) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    const name = (data.name || 'Well-Wisher').trim();
    const message = (data.message || '').trim();
    const category = (data.category || 'Blessing').trim();
    const showName = data.showName !== false && data.showName !== 'No' ? 'Yes' : 'No';
    const timestamp = data.timestamp || new Date().toLocaleString();

    if (!message) {
      return createJsonResponse({ status: 'error', message: 'Message is required' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Check if headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Your Name', 'Your Blessings & Message', 'Category', 'Show Name', 'Timestamp']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#173F2B').setFontColor('#FFFFFF');
    }

    // Append wish row
    sheet.appendRow([name, message, category, showName, timestamp]);

    return createJsonResponse({
      status: 'success',
      message: 'Blessing recorded successfully!',
      data: { name, message, category, showName, timestamp }
    });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Fetch all wishes from Google Sheet
 */
function getWishes() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) {
    return createJsonResponse({ status: 'success', wishes: [] });
  }

  const wishes = [];
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[0] ? String(row[0]).trim() : 'Well-Wisher';
    const message = row[1] ? String(row[1]).trim() : '';
    const category = row[2] ? String(row[2]).trim() : 'Blessing';
    const showName = row[3] !== 'No';
    const timestamp = row[4] ? String(row[4]).trim() : '';

    if (message) {
      wishes.push({
        id: 'wish-' + i,
        name: showName ? name : 'A Well-Wisher',
        message: message,
        category: category,
        showName: showName,
        timestamp: timestamp
      });
    }
  }

  // Reverse so newest wishes appear first
  wishes.reverse();

  return createJsonResponse({ status: 'success', total: wishes.length, wishes: wishes });
}

/**
 * Fetch all photos from the Google Drive Folder
 */
function getAlbumImages() {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const files = folder.getFiles();
  const images = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();

    if (mimeType.indexOf('image/') !== -1) {
      const fileId = file.getId();
      const fileName = file.getName().replace(/\.[^/.]+$/, ""); // Strip file extension

      images.push({
        id: fileId,
        name: fileName || 'Linto & Femi — Wedding Moment',
        thumbnailUrl: 'https://lh3.googleusercontent.com/d/' + fileId + '=w800',
        fullUrl: 'https://lh3.googleusercontent.com/d/' + fileId + '=w1600',
        downloadUrl: 'https://drive.google.com/uc?export=download&id=' + fileId,
        dateCreated: file.getDateCreated()
      });
    }
  }

  return createJsonResponse({ status: 'success', total: images.length, images: images });
}

/**
 * Helper to return JSON with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
