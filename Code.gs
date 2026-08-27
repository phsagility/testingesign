function doGet() {
  return jsonResponse({ success: true, message: 'Sagility email service is running.' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No request body received.');
    }

    var data = JSON.parse(e.postData.contents);
    var email = String(data.email || '').trim();
    var name = String(data.name || '').trim();
    var pdfBase64 = String(data.pdfBase64 || '').trim();
    var filename = String(data.filename || 'Sagility-eSign-Forms.pdf').trim();

    if (!email || !name || !pdfBase64) {
      throw new Error('Missing email, name, or PDF data.');
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error('Invalid email address.');
    }

    var attachment = Utilities.newBlob(
      Utilities.base64Decode(pdfBase64),
      'application/pdf',
      filename
    );
    var body = 'Hi ' + name + ',\n\n' +
      'Kindly review the attached PDF file containing your eSign forms. Once completed, please return the signed PDF to the Sagility email thread where you received these eSign forms.\n\n' +
      'Please note that this is an automated email. Do not reply directly to this message.\n\n' +
      'Thank you for your cooperation.\n\n' +
      'Sagility Recruitment Team';

    MailApp.sendEmail({
      to: email,
      subject: 'Sagility eSign Forms',
      body: body,
      attachments: [attachment]
    });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error(error.stack || error.message || error);
    return jsonResponse({ success: false, error: error.message || String(error) });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
