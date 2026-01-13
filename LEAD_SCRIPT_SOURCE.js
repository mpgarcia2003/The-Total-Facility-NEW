
/**
 * TOTAL FACILITY SERVICES - LEAD CAPTURE + CUSTOMER QUOTE SYSTEM
 * Logs leads to Sheet + Sends Gmail to you + Sends quote to customer
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Get parameters from POST
    var timestamp = e.parameter.timestamp || new Date();
    var stage = e.parameter.funnel_stage || "UNKNOWN";
    var name = e.parameter.name || "N/A";
    var email = e.parameter.email || "N/A";
    var company = e.parameter.company || "N/A";
    var phone = e.parameter.phone || "N/A";
    var quote = e.parameter.quote_total || "N/A";
    var notes = e.parameter.notes || "N/A";
    var industry = e.parameter.industry || "N/A";

    // 1. LOG TO SHEET
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
    
    // 2. SEND INTERNAL NOTIFICATION (to you)
    var internalSubject = "🔥 NEW TFS LEAD: " + company + " (" + stage + ")";
    var internalBody = "A new lead has been captured!\n\n" +
               "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
               "Funnel Stage: " + stage + "\n" +
               "Industry: " + industry + "\n" +
               "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
               "CONTACT INFO:\n" +
               "Name: " + name + "\n" +
               "Email: " + email + "\n" +
               "Company: " + company + "\n" +
               "Phone: " + phone + "\n\n" +
               "QUOTE DETAILS:\n" +
               "Estimated Budget: " + quote + "\n" +
               "Notes: " + notes + "\n\n" +
               "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
               "View All Leads: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();
               
    GmailApp.sendEmail("info@thetotalfacility.com", internalSubject, internalBody);
    
    // 3. SEND CUSTOMER QUOTE EMAIL (only for QUOTE or UNLOCK stages)
    if (email && email !== "N/A" && (stage === "QUOTE" || stage === "UNLOCK")) {
      var customerSubject = "Your TFS Facility Services Quote - " + quote;
      var customerBody = "Hi " + name + ",\n\n" +
        "Thank you for using our Precision Labor Calculator!\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "YOUR ESTIMATED MONTHLY BUDGET\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Industry: " + (industry ? industry.charAt(0).toUpperCase() + industry.slice(1) : "General Facility") + "\n" +
        "Estimated Budget: " + quote + "\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "This is a preliminary estimate based on the parameters you provided. " +
        "An account director will contact you within 24 hours to discuss your " +
        "specific requirements and schedule a site assessment.\n\n" +
        "NEXT STEPS:\n" +
        "• Review your facility's specific needs\n" +
        "• Schedule a walkthrough with our team\n" +
        "• Receive a customized proposal\n\n" +
        "Questions? Call us directly: (844) 454-3101\n\n" +
        "Best regards,\n" +
        "Total Facility Services LLC\n" +
        "Precision Facility Labor\n" +
        "NY • FL • NJ • CT\n\n" +
        "www.thetotalfacility.com";
        
      GmailApp.sendEmail(email, customerSubject, customerBody, {
        name: "Total Facility Services",
        replyTo: "info@thetotalfacility.com"
      });
    }
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (err) {
    var errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors") || 
                     SpreadsheetApp.getActiveSpreadsheet().insertSheet("Errors");
    errorSheet.appendRow([new Date(), err.toString()]);
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

// Test function
function testDoPost() {
  var fakeEvent = {
    parameter: {
      timestamp: new Date().toLocaleString(),
      funnel_stage: "QUOTE",
      name: "Test User",
      email: "your-test-email@gmail.com", // Change this to test
      company: "Test Company",
      phone: "(555) 123-4567",
      quote_total: "$5,000/mo",
      notes: "This is a test",
      industry: "education"
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

// Setup headers
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.getRange(1, 1, 1, 9).setValues([
    ["Timestamp", "Stage", "Name", "Email", "Company", "Phone", "Quote", "Notes", "Industry"]
  ]);
  sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#0d9488").setFontColor("white");
  sheet.setFrozenRows(1);
}
