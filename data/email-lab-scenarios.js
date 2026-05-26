// Email Lab Scenarios — data file
// Loaded before email-lab-new.js so window.EMAIL_LAB_SCENARIOS is available
window.EMAIL_LAB_SCENARIOS = [
  {
    id: 'password-reset',
    brand: 'microsoft',
    from: 'Microsoft Account Team <account-security@micros0ft-verify.com>',
    replyTo: 'noreply@micros0ft-verify.com',
    to: 'you@yourcompany.com',
    subject: 'Security Alert: Unusual sign-in activity',
    date: 'Thu, 7 Nov 2025 03:42:18 +0000',
    body: 'Dear Valued Customer,\n\nWe detected an unusual sign-in attempt to your Microsoft account from:\n\nLocation: Lagos, Nigeria\nDevice: Linux PC\nTime: November 7, 2025 3:15 AM\n\nIf this wasn\'t you, your account may be compromised. Verify your identity immediately to prevent account suspension.\n\nClick here to secure your account: http://verify-microsoft-account.com/security\n\nYou have 24 hours to respond. Failure to verify will result in permanent account lockdown.\n\nThank you,\nMicrosoft Security Team',
    links: ['http://verify-microsoft-account.com/security'],
    attachments: [],
    isPhish: true,
    redFlags: [
      'Domain is "micros0ft-verify.com" (zero instead of O) - not microsoft.com',
      'Urgent threat of "permanent account lockdown" creates panic',
      'Link goes to http (not https) and suspicious domain',
      'Generic greeting "Dear Valued Customer" instead of your name',
      'Grammar issues and artificial urgency'
    ],
    htmlBody: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#0078d4;padding:20px 32px;display:flex;align-items:center;gap:12px;">
    <div style="width:32px;height:32px;background:#ffffff;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#0078d4;line-height:1;">M</div>
    <span style="color:#ffffff;font-weight:700;font-size:18px;letter-spacing:.01em;">Microsoft</span>
  </div>
  <!-- Body -->
  <div style="padding:32px;">
    <h2 style="font-size:20px;font-weight:600;color:#323130;margin:0 0 6px;">Microsoft account</h2>
    <p style="font-size:22px;font-weight:700;color:#0078d4;margin:0 0 24px;">Unusual sign-in activity</p>
    <p style="font-size:15px;color:#323130;line-height:1.6;margin:0 0 18px;">Dear Valued Customer,</p>
    <p style="font-size:15px;color:#323130;line-height:1.6;margin:0 0 20px;">We detected an unusual sign-in attempt to your Microsoft account. Please review the activity below.</p>
    <!-- Details table -->
    <table style="width:100%;border-collapse:collapse;background:#f3f2f1;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#605e5c;width:130px;">Location</td><td style="padding:12px 16px;font-size:14px;color:#323130;">Lagos, Nigeria</td></tr>
      <tr style="background:#edebe9;"><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#605e5c;">Device</td><td style="padding:12px 16px;font-size:14px;color:#323130;">Linux PC</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#605e5c;">Date &amp; Time</td><td style="padding:12px 16px;font-size:14px;color:#323130;">November 7, 2025 — 3:15 AM UTC</td></tr>
    </table>
    <p style="font-size:15px;color:#323130;line-height:1.6;margin:0 0 8px;">If this wasn't you, your account may be compromised. Verify your identity <strong>immediately</strong> to prevent account suspension.</p>
    <p style="font-size:13px;color:#a4262c;font-weight:600;margin:0 0 24px;">You have 24 hours to respond. Failure to verify will result in permanent account lockdown.</p>
    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="http://verify-microsoft-account.com/security" style="display:inline-block;background:#0078d4;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:3px;font-size:15px;font-weight:600;">Review recent activity</a>
    </div>
    <p style="font-size:13px;color:#605e5c;line-height:1.6;margin:0;">If you're having trouble with the button above, copy and paste this URL into your browser:<br><span style="color:#0078d4;">http://verify-microsoft-account.com/security</span></p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #edebe9;padding:20px 32px;background:#f3f2f1;">
    <p style="font-size:12px;color:#605e5c;margin:0 0 4px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>
    <p style="font-size:12px;color:#605e5c;margin:0;">This is an automated message. Please do not reply to this email.</p>
  </div>
</div>`
  },
  {
    id: 'payroll-update',
    brand: 'hr',
    from: 'HR Department <hr@yourcompany.com>',
    replyTo: 'hr@yourcompany.com',
    to: 'employees@yourcompany.com',
    subject: '[All Staff] Payroll System Upgrade - Action Required',
    date: 'Mon, 11 Nov 2025 09:15:33 -0500',
    body: 'Dear Team,\n\nOur payroll system is being upgraded this week. To ensure uninterrupted direct deposits, please verify your banking information by Friday, Nov 15.\n\nWhat you need to do:\n1. Log into the HR Portal at https://hrportal.yourcompany.com/payroll\n2. Navigate to "My Pay" → "Direct Deposit"\n3. Verify your account and routing numbers are correct\n4. Submit confirmation by clicking "Verify"\n\nIf you have questions, contact HR at ext. 5555 or hr@yourcompany.com\n\nBest regards,\nSarah Johnson\nDirector of Human Resources',
    links: ['https://hrportal.yourcompany.com/payroll'],
    attachments: [],
    isPhish: false,
    legitimateSignals: [
      'Sender domain matches your company domain',
      'Links point to company\'s actual HR portal over HTTPS',
      'Provides alternative contact methods (phone extension)',
      'Professional tone without urgency or threats',
      'Reasonable deadline (4 days notice)',
      'Signed with real person\'s name and title'
    ],
    htmlBody: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#1f5c99;padding:18px 32px;display:flex;align-items:center;gap:12px;">
    <div style="width:32px;height:32px;background:#ffffff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#1f5c99;">HR</div>
    <span style="color:#ffffff;font-weight:700;font-size:17px;">Your Company — Human Resources</span>
  </div>
  <!-- Banner -->
  <div style="background:#e8f0fb;border-left:4px solid #1f5c99;padding:12px 20px;margin:0;">
    <p style="font-size:13px;font-weight:600;color:#1f5c99;margin:0;">[All Staff] Action Required by Friday, Nov 15</p>
  </div>
  <!-- Body -->
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 18px;">Dear Team,</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 18px;">Our payroll system is being upgraded this week. To ensure your direct deposits continue without interruption, please verify your banking information by <strong>Friday, November 15</strong>.</p>
    <p style="font-size:15px;font-weight:600;color:#1f5c99;margin:0 0 14px;">What you need to do:</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:10px 14px;border-bottom:1px solid #e8e8e8;"><span style="display:inline-flex;width:24px;height:24px;background:#1f5c99;color:#fff;border-radius:50%;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-right:10px;">1</span><span style="font-size:14px;color:#333;">Log into the HR Portal at <a href="https://hrportal.yourcompany.com/payroll" style="color:#1f5c99;font-weight:600;">hrportal.yourcompany.com/payroll</a></span></td></tr>
      <tr><td style="padding:10px 14px;border-bottom:1px solid #e8e8e8;background:#f9f9f9;"><span style="display:inline-flex;width:24px;height:24px;background:#1f5c99;color:#fff;border-radius:50%;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-right:10px;">2</span><span style="font-size:14px;color:#333;">Navigate to <strong>"My Pay"</strong> → <strong>"Direct Deposit"</strong></span></td></tr>
      <tr><td style="padding:10px 14px;border-bottom:1px solid #e8e8e8;"><span style="display:inline-flex;width:24px;height:24px;background:#1f5c99;color:#fff;border-radius:50%;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-right:10px;">3</span><span style="font-size:14px;color:#333;">Verify your account and routing numbers are correct</span></td></tr>
      <tr><td style="padding:10px 14px;background:#f9f9f9;"><span style="display:inline-flex;width:24px;height:24px;background:#1f5c99;color:#fff;border-radius:50%;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-right:10px;">4</span><span style="font-size:14px;color:#333;">Click <strong>"Verify"</strong> to submit your confirmation</span></td></tr>
    </table>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://hrportal.yourcompany.com/payroll" style="display:inline-block;background:#1f5c99;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:5px;font-size:15px;font-weight:600;">Go to HR Portal</a>
    </div>
    <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 6px;">Questions? Contact us:</p>
    <p style="font-size:14px;color:#333;margin:0 0 4px;">Phone: ext. 5555 | Email: <a href="mailto:hr@yourcompany.com" style="color:#1f5c99;">hr@yourcompany.com</a></p>
    <p style="font-size:14px;color:#333;margin:24px 0 0;">Best regards,<br><strong>Sarah Johnson</strong><br><span style="color:#555;">Director of Human Resources</span></p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #e0e0e0;padding:16px 32px;background:#f4f4f4;">
    <p style="font-size:12px;color:#777;margin:0;">Your Company, Inc. — 1000 Corporate Drive, Suite 500 — hr@yourcompany.com</p>
  </div>
</div>`
  },
  {
    id: 'package-delivery',
    brand: 'ups',
    from: 'UPS Delivery Service <tracking@ups-delivery-notice.com>',
    replyTo: 'support@ups-delivery-notice.com',
    to: 'you@gmail.com',
    subject: 'UPS: Package Delivery Attempted - Rescheduling Required',
    date: 'Tue, 12 Nov 2025 14:23:09 -0800',
    body: 'Dear Customer,\n\nWe attempted to deliver package #1Z999AA10123456784 but no one was available to receive it.\n\nPackage Details:\nTracking: 1Z999AA10123456784\nWeight: 3.2 lbs\nSender: Amazon.com\n\nTo reschedule delivery or arrange pickup, download your delivery notice:\nhttp://bit.ly/ups-delivery-notice\n\nYour package will be returned to sender if not claimed within 5 days.\n\nThank you,\nUPS Customer Service',
    links: ['http://bit.ly/ups-delivery-notice'],
    attachments: ['UPS_Delivery_Notice.pdf.exe'],
    isPhish: true,
    redFlags: [
      'Domain "ups-delivery-notice.com" is NOT ups.com',
      'Uses bit.ly shortened URL hiding the real destination',
      'Attachment is .exe disguised as PDF (malware)',
      'Real UPS leaves physical notices and sends texts with real tracking links',
      'Generic "Dear Customer" greeting',
      'Creates urgency with 5-day deadline'
    ],
    htmlBody: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#351c15;padding:16px 32px;display:flex;align-items:center;gap:14px;">
    <div style="background:#ffb500;color:#351c15;font-weight:900;font-size:22px;padding:4px 10px;border-radius:3px;letter-spacing:.02em;">UPS</div>
    <span style="color:#ffb500;font-weight:700;font-size:16px;letter-spacing:.04em;">UNITED PARCEL SERVICE</span>
  </div>
  <!-- Alert banner -->
  <div style="background:#fff3cd;border-bottom:3px solid #ffb500;padding:12px 24px;">
    <p style="font-size:14px;font-weight:700;color:#7a5200;margin:0;">&#9888; Delivery Attempted — Action Required Within 5 Days</p>
  </div>
  <!-- Body -->
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 20px;">Dear Customer,</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">We attempted to deliver your package but <strong>no one was available</strong> to receive it. Please reschedule your delivery or arrange a pickup at your nearest UPS location.</p>
    <!-- Tracking block -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#351c15;"><td colspan="2" style="padding:10px 16px;font-size:13px;font-weight:700;color:#ffb500;text-transform:uppercase;letter-spacing:.06em;">Package Details</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;width:140px;border-bottom:1px solid #f0f0f0;">Tracking Number</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;font-family:monospace;">1Z999AA10123456784</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Weight</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">3.2 lbs</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;">Sender</td><td style="padding:10px 16px;font-size:13px;color:#333;">Amazon.com</td></tr>
    </table>
    <!-- CTA -->
    <div style="text-align:center;margin:20px 0 24px;">
      <a href="http://bit.ly/ups-delivery-notice" style="display:inline-block;background:#ffb500;color:#351c15;text-decoration:none;padding:14px 36px;border-radius:4px;font-size:15px;font-weight:700;">Reschedule Delivery</a>
    </div>
    <p style="font-size:13px;color:#777;margin:0 0 6px;">Or download your delivery notice:</p>
    <p style="font-size:13px;margin:0;"><a href="http://bit.ly/ups-delivery-notice" style="color:#351c15;font-weight:600;">http://bit.ly/ups-delivery-notice</a></p>
    <p style="font-size:13px;color:#a4262c;font-weight:600;margin:20px 0 0;">Your package will be returned to sender if not claimed within 5 days.</p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #e0e0e0;padding:16px 32px;background:#f4f4f4;">
    <p style="font-size:12px;color:#777;margin:0;">UPS Customer Service — 55 Glenlake Pkwy NE, Atlanta, GA 30328</p>
    <p style="font-size:12px;color:#777;margin:4px 0 0;">© 2025 United Parcel Service of America, Inc. All rights reserved.</p>
  </div>
</div>`
  },
  {
    id: 'bank-fraud-alert',
    brand: 'chase',
    from: 'Chase Fraud Alerts <fraud-alert@chase.com>',
    replyTo: 'alerts@alertcenter.chase.com',
    to: 'you@gmail.com',
    subject: 'Fraud Alert: Unusual Transaction Detected',
    date: 'Wed, 13 Nov 2025 16:07:42 -0500',
    body: 'Dear John Smith,\n\nWe detected a potentially fraudulent transaction on your Chase account ending in 7891:\n\nTransaction Details:\nMerchant: WALMART.COM\nAmount: $847.32\nLocation: Online\nDate: Nov 13, 2025\n\nDid you authorize this transaction?\n• If YES, no action needed\n• If NO, call us immediately at 1-800-935-9935 (24/7)\n\nYou can also review this in your Chase Mobile app or at chase.com.\n\nFor your security, this alert was sent to the email on file. Do not reply to this email.\n\nSincerely,\nChase Fraud Prevention Team',
    links: ['https://www.chase.com'],
    attachments: [],
    isPhish: false,
    legitimateSignals: [
      'Sender domain is legitimate chase.com',
      'Uses your actual name (personalized)',
      'Provides official Chase fraud phone number (verifiable)',
      'Links point to real chase.com website only',
      'Does NOT ask you to click links to "verify" anything',
      'Professional formatting and branding',
      'Tells you not to reply to the email (proper security practice)'
    ],
    htmlBody: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#117ace;padding:18px 32px;display:flex;align-items:center;gap:12px;">
    <div style="width:36px;height:36px;background:#ffffff;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#117ace;letter-spacing:-.03em;">CHASE</div>
    <span style="color:#ffffff;font-weight:700;font-size:17px;">Chase Fraud Alerts</span>
  </div>
  <!-- Alert label -->
  <div style="background:#d32f2f;padding:10px 24px;">
    <p style="font-size:13px;font-weight:700;color:#ffffff;margin:0;text-transform:uppercase;letter-spacing:.08em;">&#9888; Fraud Alert — Unusual Transaction Detected</p>
  </div>
  <!-- Body -->
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 18px;">Dear John Smith,</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">We detected a potentially fraudulent transaction on your Chase account ending in <strong>7891</strong>. Please review the details below.</p>
    <!-- Transaction table -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#117ace;"><td colspan="2" style="padding:10px 16px;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:.06em;">Transaction Details</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;width:130px;border-bottom:1px solid #f0f0f0;">Merchant</td><td style="padding:10px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;font-weight:600;">WALMART.COM</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Amount</td><td style="padding:10px 16px;font-size:14px;color:#d32f2f;border-bottom:1px solid #f0f0f0;font-weight:700;">$847.32</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Location</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">Online</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;">Date</td><td style="padding:10px 16px;font-size:13px;color:#333;">November 13, 2025</td></tr>
    </table>
    <!-- Action prompt -->
    <div style="background:#f5f9ff;border:1px solid #cce0ff;border-radius:6px;padding:18px 20px;margin-bottom:20px;">
      <p style="font-size:14px;font-weight:700;color:#117ace;margin:0 0 12px;">Did you authorize this transaction?</p>
      <p style="font-size:14px;color:#333;margin:0 0 6px;"><strong>Yes</strong> — No action needed. This alert will be closed automatically.</p>
      <p style="font-size:14px;color:#d32f2f;margin:0;"><strong>No</strong> — Call us immediately at <strong>1-800-935-9935</strong> (available 24/7)</p>
    </div>
    <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 14px;">You can also review this in your <strong>Chase Mobile app</strong> or at <a href="https://www.chase.com" style="color:#117ace;font-weight:600;">chase.com</a>.</p>
    <p style="font-size:13px;color:#777;font-style:italic;margin:0;">For your security, this alert was sent to the email on file. <strong>Do not reply to this email.</strong></p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #e0e0e0;padding:16px 32px;background:#f4f4f4;">
    <p style="font-size:12px;color:#777;margin:0;">JPMorgan Chase Bank, N.A. — 270 Park Ave, New York, NY 10172</p>
    <p style="font-size:12px;color:#777;margin:4px 0 0;">This email was sent from an automated system. Please do not reply.</p>
  </div>
</div>`
  },
  {
    id: 'invoice-payment',
    brand: 'corporate',
    from: '"Accounts Receivable" <invoices@company-name.com>',
    replyTo: 'ar-dept@tempmail.net',
    to: 'accounting@yourcompany.com',
    subject: 'OVERDUE INVOICE #84721 - FINAL NOTICE',
    date: 'Thu, 14 Nov 2025 08:41:55 -0800',
    body: 'URGENT PAYMENT REQUIRED\n\nOur records show Invoice #84721 is 45 days overdue. Payment of $4,832.50 is required immediately to avoid legal action.\n\nInvoice Date: September 30, 2025\nDue Date: October 30, 2025\nAmount Due: $4,832.50\n\nPlease review the attached invoice and remit payment via wire transfer within 48 hours.\n\nWire transfer details:\nBank: International Commerce Bank\nAccount: 8274910573\nRouting: 021000021\nBeneficiary: Corporate Services Ltd.\n\nReply with wire confirmation receipt. Failure to pay will result in collection agency involvement and damage to your business credit rating.\n\nAccounts Receivable Department',
    links: [],
    attachments: ['Invoice_84721.zip'],
    isPhish: true,
    redFlags: [
      'Reply-to email (tempmail.net) doesn\'t match sender domain',
      'You don\'t recognize the company or have any business relationship',
      'Extreme urgency and threats of legal action',
      'Requests wire transfer (irreversible payment method)',
      'No company letterhead, phone number, or verifiable contact info',
      'ZIP attachment likely contains malware',
      'Poor formatting and unprofessional tone'
    ],
    htmlBody: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#2c3e50;padding:18px 32px;display:flex;align-items:center;gap:12px;">
    <div style="width:32px;height:32px;background:#e74c3c;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#ffffff;">AR</div>
    <span style="color:#ffffff;font-weight:700;font-size:17px;">Accounts Receivable — company-name.com</span>
  </div>
  <!-- Urgent banner -->
  <div style="background:#e74c3c;padding:10px 24px;">
    <p style="font-size:13px;font-weight:700;color:#ffffff;margin:0;text-transform:uppercase;letter-spacing:.08em;">FINAL NOTICE — PAYMENT 45 DAYS OVERDUE</p>
  </div>
  <!-- Body -->
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 18px;">To the Accounts Payable Department,</p>
    <p style="font-size:15px;color:#c0392b;font-weight:700;margin:0 0 18px;">URGENT PAYMENT REQUIRED — IMMEDIATE ACTION NEEDED</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">Our records indicate that Invoice <strong>#84721</strong> remains unpaid and is now <strong>45 days past due</strong>. Failure to remit payment within 48 hours will result in referral to our collections department and legal action.</p>
    <!-- Invoice table -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #e0e0e0;margin-bottom:24px;">
      <tr style="background:#2c3e50;"><td colspan="2" style="padding:10px 16px;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:.06em;">Invoice Summary</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;width:150px;border-bottom:1px solid #f0f0f0;">Invoice Number</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">#84721</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Invoice Date</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">September 30, 2025</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Due Date</td><td style="padding:10px 16px;font-size:13px;color:#c0392b;border-bottom:1px solid #f0f0f0;font-weight:600;">October 30, 2025 (OVERDUE)</td></tr>
      <tr style="background:#fff5f5;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;">Amount Due</td><td style="padding:10px 16px;font-size:16px;color:#c0392b;font-weight:700;">$4,832.50</td></tr>
    </table>
    <!-- Wire details -->
    <div style="background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:18px 20px;margin-bottom:20px;">
      <p style="font-size:13px;font-weight:700;color:#2c3e50;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em;">Wire Transfer Instructions</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:5px 0;font-size:13px;font-weight:600;color:#555;width:120px;">Bank</td><td style="padding:5px 0;font-size:13px;color:#333;">International Commerce Bank</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;font-weight:600;color:#555;">Account</td><td style="padding:5px 0;font-size:13px;color:#333;font-family:monospace;">8274910573</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;font-weight:600;color:#555;">Routing</td><td style="padding:5px 0;font-size:13px;color:#333;font-family:monospace;">021000021</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;font-weight:600;color:#555;">Beneficiary</td><td style="padding:5px 0;font-size:13px;color:#333;">Corporate Services Ltd.</td></tr>
      </table>
    </div>
    <p style="font-size:14px;color:#c0392b;font-weight:600;margin:0;">Please reply with your wire confirmation receipt. Failure to pay will result in collection agency involvement and damage to your business credit rating.</p>
    <p style="font-size:14px;color:#333;margin:20px 0 0;">Accounts Receivable Department<br><span style="color:#777;font-size:13px;">company-name.com</span></p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #e0e0e0;padding:16px 32px;background:#f4f4f4;">
    <p style="font-size:12px;color:#777;margin:0;">Corporate Services Ltd. — Reply to: ar-dept@tempmail.net</p>
  </div>
</div>`
  },
  {
    id: 'security-training',
    brand: 'itsec',
    from: 'IT Security Team <security@yourcompany.com>',
    replyTo: 'security@yourcompany.com',
    to: 'allstaff@yourcompany.com',
    subject: 'Mandatory Cybersecurity Training - Due Nov 30',
    date: 'Fri, 15 Nov 2025 10:30:12 -0500',
    body: 'Dear Colleagues,\n\nAs part of our annual security awareness program, all employees must complete the cybersecurity training module by November 30, 2025.\n\nTraining Details:\n• Platform: Learning Management System (LMS)\n• Duration: 45 minutes\n• Topics: Phishing, passwords, data protection\n• Certificate: Issued upon completion\n\nHow to Access:\n1. Go to lms.yourcompany.com\n2. Log in with your network credentials\n3. Find "2025 Cybersecurity Essentials" under "My Courses"\n4. Complete all modules and pass the quiz (80% required)\n\nIf you have technical issues, contact the IT Help Desk at ext. 4357 or helpdesk@yourcompany.com.\n\nThank you for helping keep our organization secure.\n\nMarcus Chen\nChief Information Security Officer\nIT Security Team',
    links: ['https://lms.yourcompany.com'],
    attachments: [],
    isPhish: false,
    legitimateSignals: [
      'Sender matches your company\'s IT security domain',
      'Links to your company\'s actual LMS platform',
      'Provides clear instructions with alternative contact methods',
      'Reasonable deadline (2 weeks away)',
      'Professional tone and proper formatting',
      'Signed with real name and title',
      'Typical of annual compliance training requirements'
    ],
    htmlBody: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:#1a6b3a;padding:18px 32px;display:flex;align-items:center;gap:12px;">
    <div style="width:32px;height:32px;background:#ffffff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:16px;">&#128737;</div>
    <span style="color:#ffffff;font-weight:700;font-size:17px;">IT Security Team — Your Company</span>
  </div>
  <!-- Label -->
  <div style="background:#e8f5e9;border-left:4px solid #1a6b3a;padding:12px 20px;">
    <p style="font-size:13px;font-weight:600;color:#1a6b3a;margin:0;">Annual Compliance Training — Completion Required by November 30, 2025</p>
  </div>
  <!-- Body -->
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 18px;">Dear Colleagues,</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">As part of our annual security awareness program, all employees must complete the cybersecurity training module by <strong>November 30, 2025</strong>.</p>
    <!-- Training details -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#1a6b3a;"><td colspan="2" style="padding:10px 16px;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:.06em;">Training Details</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;width:130px;border-bottom:1px solid #f0f0f0;">Platform</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">Learning Management System (LMS)</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Duration</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">45 minutes</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;border-bottom:1px solid #f0f0f0;">Topics</td><td style="padding:10px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">Phishing, passwords, data protection</td></tr>
      <tr style="background:#fafafa;"><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;">Certificate</td><td style="padding:10px 16px;font-size:13px;color:#1a6b3a;font-weight:600;">Issued upon completion</td></tr>
    </table>
    <p style="font-size:14px;font-weight:700;color:#1a6b3a;margin:0 0 14px;">How to Access:</p>
    <ol style="margin:0 0 24px;padding-left:20px;color:#333;font-size:14px;line-height:2;">
      <li>Go to <a href="https://lms.yourcompany.com" style="color:#1a6b3a;font-weight:600;">lms.yourcompany.com</a></li>
      <li>Log in with your network credentials</li>
      <li>Find <strong>"2025 Cybersecurity Essentials"</strong> under "My Courses"</li>
      <li>Complete all modules and pass the quiz <em>(80% required)</em></li>
    </ol>
    <div style="text-align:center;margin:20px 0 24px;">
      <a href="https://lms.yourcompany.com" style="display:inline-block;background:#1a6b3a;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:5px;font-size:15px;font-weight:600;">Launch Training</a>
    </div>
    <p style="font-size:13px;color:#555;margin:0 0 20px;">Technical issues? Contact the IT Help Desk at <strong>ext. 4357</strong> or <a href="mailto:helpdesk@yourcompany.com" style="color:#1a6b3a;">helpdesk@yourcompany.com</a>.</p>
    <p style="font-size:14px;color:#333;margin:0;">Thank you for helping keep our organization secure.<br><br><strong>Marcus Chen</strong><br><span style="color:#555;">Chief Information Security Officer</span><br><span style="color:#555;font-size:13px;">IT Security Team — security@yourcompany.com</span></p>
  </div>
  <!-- Footer -->
  <div style="border-top:1px solid #e0e0e0;padding:16px 32px;background:#f4f4f4;">
    <p style="font-size:12px;color:#777;margin:0;">Your Company, Inc. — IT Security Department — security@yourcompany.com</p>
    <p style="font-size:12px;color:#777;margin:4px 0 0;">This is a mandatory compliance communication sent to all staff.</p>
  </div>
</div>`
  }
];
