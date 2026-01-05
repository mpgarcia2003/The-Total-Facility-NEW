
/**
 * TOTAL FACILITY SERVICES - IMPROVED LEAD CAPTURE
 * Paste this into Google Apps Script (Extensions > App Script)
 */

function doPost(e) {
  try {
    // Open the first sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Get parameters from the Form-Encoded POST
    var timestamp = e.parameter.timestamp || new Date();
    var stage = e.parameter.funnel_stage || "UNKNOWN";
    var name = e.parameter.name || "N/A";
    var email = e.parameter.email || "N/A";
    var company = e.parameter.company || "N/A";
    var phone = e.parameter.phone || "N/A";
    var quote = e.parameter.quote_total || "N/A";
    var notes = e.parameter.notes || "N/A";
    var industry = e.parameter.industry || "N/A";

    // Append to Sheet: [A:Timestamp, B:Stage, C:Name, D:Email, E:Company, F:Phone, G:Quote, H:Notes, I:Industry]
    sheet.appendRow([
      timestamp,
      stage,
      name,
      email,
      company,
      phone,
      quote,
      notes,
      industry
    ]);
    
    // Immediate Gmail Alert to info@thetotalfacility.com
    var subject = "🔥 NEW TFS LEAD: " + company + " (" + stage + ")";
    var body = "A new lead has been synchronized to your Master Sheet.\n\n" +
               "Funnel Stage: " + stage + "\n" +
               "Sector: " + industry + "\n" +
               "Contact: " + name + "\n" +
               "Email: " + email + "\n" +
               "Company: " + company + "\n" +
               "Phone: " + phone + "\n" +
               "Current Quote: " + quote + "\n" +
               "Notes: " + notes + "\n\n" +
               "View Spreadsheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();
               
    GmailApp.sendEmail("info@thetotalfacility.com", subject, body);
    
    // Return a success response
    return ContentService.createTextOutput("Lead Sync Successful").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (err) {
    // Log errors to the sheet for debugging if they happen
    var errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors") || 
                     SpreadsheetApp.getActiveSpreadsheet().insertSheet("Errors");
    errorSheet.appendRow([new Date(), err.toString()]);
    
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
