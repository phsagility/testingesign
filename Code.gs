function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data.email || !data.name || !data.pdfBase64) {
      throw new Error('Missing email, name, or PDF data.');
    }

    var filename = data.filename || 'Sagility-eSign-Forms.pdf';
    var attachment = Utilities.newBlob(
      Utilities.base64Decode(data.pdfBase64),
      'application/pdf',
      filename
    );
    var body = 'Hi ' + data.name + ',\n\n' +
      'Kindly review the attached PDF file containing your eSign forms. Please return it by replying to the email thread where you received this esign forms.\n\n' +
      'Please check your email inbox where you received the PDF file.\n\n' +
      'Please note that this is an automated email. Do not reply directly to this message.\n\n' +
      'Thank you for your cooperation.\n\n' +
      'Sagility Recruitment Team';

    MailApp.sendEmail({
      to: data.email,
      subject: 'Sagility eSign Forms',
      body: body,
      attachments: [attachment]
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
