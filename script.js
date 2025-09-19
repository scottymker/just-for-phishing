const levels = [
  {
    id: 1,
    stage: 'Beginner',
    title: 'Level 1: Spot the Phishy Email',
    description: 'Read each message carefully and choose the safest response.',
    powerUp: 'Unlocked Scam Radar: You can now detect urgent language traps.',
    questions: [
      {
        scenario: `
          <p><strong>Subject:</strong> Security Alert - Immediate Action Required</p>
          <p><strong>From:</strong> TrustPay Support <code>account-security@support-paypai.com</code></p>
          <p>"We noticed suspicious activity on your account. Your access will be suspended within <strong>12 minutes</strong> unless you verify your identity."</p>
          <p><strong>Link preview:</strong> <code>http://trustpay-verify-info.com/login</code></p>
        `,
        hint: 'Look for urgency and unfamiliar sender domains in the email.',
        choices: [
          {
            id: 'A',
            label: 'Click the link and verify immediately',
            description: 'Avoid losing access by confirming your identity as soon as possible.',
            isCorrect: false,
            feedback:
              'The link is a spoofed domain designed to steal your credentials. Real services do not threaten lockouts within minutes.',
          },
          {
            id: 'B',
            label: 'Ignore the message and delete it right away',
            description: 'Suspicious emails should be deleted to avoid any risk.',
            isCorrect: false,
            feedback:
              'Deleting is safer than clicking, but it is better to report the message so your security team is aware.',
          },
          {
            id: 'C',
            label: 'Forward the message to a colleague to double-check',
            description: 'Sharing the email could help confirm if it is legitimate.',
            isCorrect: false,
            feedback: 'Forwarding spreads the phishing attempt. Report it instead.',
          },
          {
            id: 'D',
            label: 'Report the email using the phishing button',
            description: 'Use your organization’s phishing reporting tool so the security team can investigate.',
            isCorrect: true,
            feedback: 'Correct! Report the message through the official channel and warn your team.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Overdue Invoice #44721</p>
          <p><strong>From:</strong> Billing Department <code>accounts@payables-alert.net</code></p>
          <p>"Hi, your vendor invoice is <strong>15 days past due</strong>. Please open the attached spreadsheet to review the balance and submit payment today."</p>
          <p><strong>Attachment:</strong> <code>Invoice_44721.xlsm</code></p>
        `,
        hint: 'Unexpected payment demands should be confirmed with the vendor using trusted contact details.',
        choices: [
          {
            id: 'A',
            label: 'Open the spreadsheet and pay the invoice immediately',
            description: 'Avoid late fees by settling the balance right away.',
            isCorrect: false,
            feedback: 'Opening unknown attachments can deliver malware. Always verify first.',
          },
          {
            id: 'B',
            label: 'Reply asking the sender for the original purchase order',
            description: 'If they send proof, you can process the payment.',
            isCorrect: false,
            feedback: 'Replying exposes your mailbox and still trusts an unknown sender.',
          },
          {
            id: 'C',
            label: 'Contact the vendor using a known phone number before acting',
            description: 'Use information from your vendor directory or past invoices.',
            isCorrect: true,
            feedback: 'Correct! Validate payment changes using known contact details before sending money.',
          },
          {
            id: 'D',
            label: 'Forward the message to the finance distribution list',
            description: 'Someone else might recognize the invoice.',
            isCorrect: false,
            feedback: 'Forwarding spreads the malicious attachment. Report the phish instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Document share request</p>
          <p><strong>From:</strong> CloudDocs <code>share@clouddocs-secure.org</code></p>
          <p>"A teammate shared <strong>Budget_Q3.xlsx</strong> with you. Sign in with your work email to view the document."</p>
          <p><strong>Button:</strong> <code>Open in CloudDocs</code></p>
        `,
        hint: 'Spoofed document shares often impersonate real services but use unfamiliar domains.',
        choices: [
          {
            id: 'A',
            label: 'Click the button and sign in with your credentials',
            description: 'You do not want to block the project.',
            isCorrect: false,
            feedback: 'Fake portals capture your password. Use official bookmarks instead of email links.',
          },
          {
            id: 'B',
            label: 'Reply asking who sent the document and why',
            description: 'More context could prove it is real.',
            isCorrect: false,
            feedback: 'Replying confirms your email address and still trusts the suspicious link.',
          },
          {
            id: 'C',
            label: 'Open your usual cloud storage app directly to check for new files',
            description: 'Use a trusted path to confirm the share.',
            isCorrect: true,
            feedback: 'Correct! Navigate directly to the known service instead of following unexpected email links.',
          },
          {
            id: 'D',
            label: 'Download the document to scan it locally',
            description: 'A scan could reveal whether it is malicious.',
            isCorrect: false,
            feedback: 'Downloading gives the attacker a foothold. Verify legitimacy first.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Urgent favor</p>
          <p><strong>From:</strong> "Taylor - CEO" <code>taylor.ceo@outlook.com</code></p>
          <p>"Are you in the office? I need <strong>six $100 gift cards</strong> for a client event. Scratch and send the codes within the next hour and I will reimburse you."</p>
        `,
        hint: 'Leaders rarely request gift cards over email—verify unexpected favors.',
        choices: [
          {
            id: 'A',
            label: 'Purchase the gift cards to be helpful',
            description: 'You want to impress leadership.',
            isCorrect: false,
            feedback: 'Gift card scams rely on urgency. Never send card codes via email.',
          },
          {
            id: 'B',
            label: 'Reply asking if someone else can complete the errand',
            description: 'Maybe the task can be delegated.',
            isCorrect: false,
            feedback: 'Replying confirms your address and still assumes the request is valid.',
          },
          {
            id: 'C',
            label: 'Report the message and call the CEO’s assistant using a known number',
            description: 'Verify the request through trusted internal contacts.',
            isCorrect: true,
            feedback: 'Correct! Verify the request offline and alert security to the attempted scam.',
          },
          {
            id: 'D',
            label: 'Send a calendar invite to confirm the details',
            description: 'A quick meeting could clarify expectations.',
            isCorrect: false,
            feedback: 'Phishers will ignore calendar invites. Focus on reporting the attempt.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Mailbox quota exceeded</p>
          <p><strong>From:</strong> IT Service Desk <code>support@inbox-reset.co</code></p>
          <p>"Your mailbox is over the storage limit. Download the attached tool to expand your inbox before <strong>5:00 PM today</strong>."</p>
          <p><strong>Attachment:</strong> <code>MailboxFix.exe</code></p>
        `,
        hint: 'IT never distributes executable fixes through email attachments.',
        choices: [
          {
            id: 'A',
            label: 'Download and run the tool so email keeps working',
            description: 'Avoid missing messages by fixing the issue quickly.',
            isCorrect: false,
            feedback: 'Running unknown executables can install malware. Use official IT channels instead.',
          },
          {
            id: 'B',
            label: 'Forward the email to your teammate who knows about storage limits',
            description: 'Maybe they can validate it.',
            isCorrect: false,
            feedback: 'Forwarding spreads malicious files. Report it instead.',
          },
          {
            id: 'C',
            label: 'Submit a ticket through the real IT help portal to confirm',
            description: 'Use the established request process.',
            isCorrect: true,
            feedback: 'Correct! Use known support channels and ignore suspicious attachments.',
          },
          {
            id: 'D',
            label: 'Delete a few emails and then run the tool',
            description: 'A hybrid approach might be safer.',
            isCorrect: false,
            feedback: 'Deleting emails does not make the attachment safe. Report the message instead.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    stage: 'Apprentice',
    title: 'Level 2: Text Message Trap',
    description: 'Decide how to handle suspicious texts that try to hook you.',
    powerUp: 'Unlocked SMS Shield: Your phone filters sketchy links like a pro.',
    questions: [
      {
        scenario: `
          <p><strong>SMS:</strong> "Hi! Your package is pending delivery. Please <a href="#">confirm your details</a> to avoid return."</p>
          <p>The link shows <code>http://fast-shipping-confirm.com</code></p>
          <p>You were not expecting any deliveries today.</p>
        `,
        hint: 'Unexpected requests with unfamiliar links are strong warning signs.',
        choices: [
          {
            id: 'A',
            label: 'Tap the link to check what package it is',
            description: 'You do not want to miss the delivery.',
            isCorrect: false,
            feedback: 'Never tap unknown links. They can install malware or steal data.',
          },
          {
            id: 'B',
            label: 'Reply asking the courier for more information',
            description: 'Maybe they will identify the package.',
            isCorrect: false,
            feedback: 'Responding confirms your number is active. Phishers thrive on engagement.',
          },
          {
            id: 'C',
            label: 'Ignore the message and block the number',
            description: 'Stops future messages from this sender.',
            isCorrect: true,
            feedback: 'Correct! Block and delete suspicious texts to avoid tapping risky links.',
          },
          {
            id: 'D',
            label: 'Take a screenshot and post it on social media',
            description: 'Warn your friends so they stay alert.',
            isCorrect: false,
            feedback: 'Sharing publicly could expose private info and encourage others to engage.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>SMS:</strong> "Bank Alert: Did you just authorize a $950 transfer? Reply YES or NO to stop the transaction."</p>
          <p>The message comes from <code>39852</code> and includes a short link.</p>
        `,
        hint: 'Banks do not ask you to confirm transactions by replying to random numbers.',
        choices: [
          {
            id: 'A',
            label: 'Reply NO so the transfer gets blocked',
            description: 'Protect your money immediately.',
            isCorrect: false,
            feedback: 'Replying hands the attacker confirmation that your number is real.',
          },
          {
            id: 'B',
            label: 'Call the bank using the number on the back of your card',
            description: 'Use a trusted contact method to verify the alert.',
            isCorrect: true,
            feedback: 'Correct! Reach out through official bank channels instead of replying to the text.',
          },
          {
            id: 'C',
            label: 'Click the short link to review the transfer details',
            description: 'You need more info before acting.',
            isCorrect: false,
            feedback: 'Short links hide malicious sites designed to steal credentials.',
          },
          {
            id: 'D',
            label: 'Forward the text to your team chat to ask for advice',
            description: 'Maybe someone else has seen it.',
            isCorrect: false,
            feedback: 'Forwarding spreads the scam. Report it to the bank’s fraud line instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>SMS:</strong> "Congratulations! You won a $500 shopping spree. Claim now: <a href="#">http://shop-prize.cc</a>"</p>
          <p>You never entered a contest with the retailer mentioned.</p>
        `,
        hint: 'Free prizes that require quick action are almost always scams.',
        choices: [
          {
            id: 'A',
            label: 'Click the link and enter your details to redeem the prize',
            description: 'No one wants to miss free money.',
            isCorrect: false,
            feedback: 'Giveaways that demand personal data are phishing attempts. Skip them.',
          },
          {
            id: 'B',
            label: 'Reply STOP to unsubscribe from future texts',
            description: 'Maybe the spam will end.',
            isCorrect: false,
            feedback: 'Replying confirms your number. Block the sender instead.',
          },
          {
            id: 'C',
            label: 'Delete the text and report it to your mobile carrier',
            description: 'Forward to 7726 (SPAM) if supported.',
            isCorrect: true,
            feedback: 'Correct! Reporting to your carrier helps filter future scams.',
          },
          {
            id: 'D',
            label: 'Share the link with friends to see if it works for them',
            description: 'Maybe it is a real promotion.',
            isCorrect: false,
            feedback: 'Sharing spreads the scam. Delete it instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>SMS:</strong> "Your verification code is 228991. <strong>Do not share</strong>." Seconds later another text says, "This is IT, send me the MFA code now so we can finish setup."</p>
        `,
        hint: 'Real support teams never ask for your multi-factor authentication codes.',
        choices: [
          {
            id: 'A',
            label: 'Send the code to finish the setup quickly',
            description: 'They sound like they need it urgently.',
            isCorrect: false,
            feedback: 'Sharing MFA codes lets attackers bypass your account protections.',
          },
          {
            id: 'B',
            label: 'Ignore the texts and report the incident to IT security',
            description: 'Let the professionals know about the attempt.',
            isCorrect: true,
            feedback: 'Correct! Report the social engineering attempt and keep the code private.',
          },
          {
            id: 'C',
            label: 'Change your password immediately and then send the code',
            description: 'Maybe it will be safe after resetting.',
            isCorrect: false,
            feedback: 'Changing your password does not make sharing the code safe. Never share MFA codes.',
          },
          {
            id: 'D',
            label: 'Call the number that texted you to confirm the request',
            description: 'Maybe it really is IT.',
            isCorrect: false,
            feedback: 'Calling back still connects you with the attacker. Use official support numbers.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>SMS:</strong> "Hey it’s Alex from the office. Can you buy me two prepaid cards before the meeting? I’ll pay you back today."</p>
          <p>The number is unfamiliar and lacks company caller ID.</p>
        `,
        hint: 'Spoofed coworker requests often dodge normal communication channels.',
        choices: [
          {
            id: 'A',
            label: 'Ask which meeting they mean to confirm identity',
            description: 'A quick question could test them.',
            isCorrect: false,
            feedback: 'Attackers will improvise answers. Do not continue the conversation.',
          },
          {
            id: 'B',
            label: 'Buy the cards and send the numbers to be helpful',
            description: 'You want to support your teammate.',
            isCorrect: false,
            feedback: 'Gift card requests over text are a classic scam. Do not comply.',
          },
          {
            id: 'C',
            label: 'Call Alex using the number saved in your corporate directory',
            description: 'Verify using a trusted channel.',
            isCorrect: true,
            feedback: 'Correct! Confirm through known contact details and report the fake text.',
          },
          {
            id: 'D',
            label: 'Send back a selfie to confirm your identity first',
            description: 'Maybe they will do the same.',
            isCorrect: false,
            feedback: 'Engaging keeps the scam going. Stop contact and verify independently.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    stage: 'Challenger',
    title: 'Level 3: Fake Support Call',
    description: 'Practice how you respond when someone phones you with urgent demands.',
    powerUp: 'Unlocked Voice Barrier: Phone imposters cannot pressure you anymore.',
    questions: [
      {
        scenario: `
          <p>The caller says, "We detected malware on your laptop. Give me remote access so I can clean it right now."</p>
          <p>They know your full name and department. They sound urgent and ask for your login details.</p>
        `,
        hint: 'When in doubt, call back through a verified number before taking action.',
        choices: [
          {
            id: 'A',
            label: 'Give the caller remote access right away',
            description: 'They sound official and have your info.',
            isCorrect: false,
            feedback: 'Unverified callers should never receive remote access. It is a classic social engineering trick.',
          },
          {
            id: 'B',
            label: 'Hang up, then call IT using the known internal number',
            description: 'Confirm if the request is legitimate through a trusted channel.',
            isCorrect: true,
            feedback: 'Correct! Always verify by contacting the official help desk through published channels.',
          },
          {
            id: 'C',
            label: 'Ask the caller to email you instructions',
            description: 'Written steps might help confirm the request.',
            isCorrect: false,
            feedback: 'They could send phishing links. Verify first instead of asking for more contact.',
          },
          {
            id: 'D',
            label: 'Do nothing but keep the caller on the line',
            description: 'Maybe you can gather more information from them.',
            isCorrect: false,
            feedback: 'Staying on the line wastes time and they might gather details from you.',
          },
        ],
      },
      {
        scenario: `
          <p>A caller claims to be from the national tax agency and says you owe back taxes. They demand payment via <strong>gift cards</strong> within the hour or you will be arrested.</p>
        `,
        hint: 'Government agencies never demand payment through gift cards or threaten arrest over the phone.',
        choices: [
          {
            id: 'A',
            label: 'Drive to the store to buy the gift cards before time runs out',
            description: 'Avoid legal trouble at all costs.',
            isCorrect: false,
            feedback: 'This is a scare tactic. Government payments never happen via gift cards.',
          },
          {
            id: 'B',
            label: 'Stay calm, hang up, and look up the agency’s official number',
            description: 'Verify the claim independently.',
            isCorrect: true,
            feedback: 'Correct! Use official contact numbers if you ever need to confirm a government notice.',
          },
          {
            id: 'C',
            label: 'Ask the caller for their badge number to keep on record',
            description: 'Maybe it will help confirm authenticity.',
            isCorrect: false,
            feedback: 'Attackers will invent badge numbers. Do not engage further.',
          },
          {
            id: 'D',
            label: 'Conference in a coworker to listen to the caller',
            description: 'They might help you decide.',
            isCorrect: false,
            feedback: 'Adding others wastes time and still keeps you on the line with a scammer.',
          },
        ],
      },
      {
        scenario: `
          <p>Someone calls from "Tech Support" saying they noticed failed login attempts on your account. They ask you to read out the <strong>multi-factor authentication</strong> code you just received.</p>
        `,
        hint: 'Legitimate staff will never ask for MFA codes over the phone.',
        choices: [
          {
            id: 'A',
            label: 'Read the MFA code so they can stop the hacker',
            description: 'They already know about the attack.',
            isCorrect: false,
            feedback: 'Sharing the code lets them hijack your account.',
          },
          {
            id: 'B',
            label: 'Decline, hang up, and report the call to security',
            description: 'Alert the team that someone is trying to bypass MFA.',
            isCorrect: true,
            feedback: 'Correct! End the call and notify security immediately.',
          },
          {
            id: 'C',
            label: 'Keep the caller talking while you look up their name in the directory',
            description: 'You want proof they work there.',
            isCorrect: false,
            feedback: 'Stalling gives them more chances to manipulate you. Just hang up.',
          },
          {
            id: 'D',
            label: 'Ask them to send the request in a text message',
            description: 'Written proof might help.',
            isCorrect: false,
            feedback: 'They could send malicious links. Do not interact further.',
          },
        ],
      },
      {
        scenario: `
          <p>A caller pretends to represent a charity and pressures you to donate immediately because "children will lose care tonight" if you do not help.</p>
        `,
        hint: 'Emotional pressure plus urgency is a sign of social engineering.',
        choices: [
          {
            id: 'A',
            label: 'Give them your credit card number to help right away',
            description: 'You do not want to let anyone down.',
            isCorrect: false,
            feedback: 'Never share payment info with unsolicited callers. Research charities on your own.',
          },
          {
            id: 'B',
            label: 'Politely decline and research the charity on verified websites',
            description: 'Donate only through trustworthy channels.',
            isCorrect: true,
            feedback: 'Correct! Legitimate charities will let you donate on your own terms.',
          },
          {
            id: 'C',
            label: 'Offer to mail cash instead of sharing card details',
            description: 'Maybe that feels safer.',
            isCorrect: false,
            feedback: 'Scammers will take any form of payment. Do not comply.',
          },
          {
            id: 'D',
            label: 'Ask for their supervisor to prove they are real',
            description: 'Perhaps a manager can confirm.',
            isCorrect: false,
            feedback: 'They can fake a supervisor. End the call and verify independently.',
          },
        ],
      },
      {
        scenario: `
          <p>A vendor you work with calls about an "unpaid invoice" and requests that you log into a website they provide while on the phone.</p>
        `,
        hint: 'Even familiar names can be spoofed—validate payment details using stored records.',
        choices: [
          {
            id: 'A',
            label: 'Follow their instructions so the account does not go on hold',
            description: 'Keep the partnership smooth.',
            isCorrect: false,
            feedback: 'Rushing to log in from their link risks credential theft.',
          },
          {
            id: 'B',
            label: 'Tell them you will call back using the vendor phone number on file',
            description: 'Verify through a known contact path.',
            isCorrect: true,
            feedback: 'Correct! Contact the vendor through information you already trust.',
          },
          {
            id: 'C',
            label: 'Ask them to email you the login page so you can inspect it',
            description: 'Maybe a screenshot will help.',
            isCorrect: false,
            feedback: 'Attackers can design convincing pages. Avoid their links entirely.',
          },
          {
            id: 'D',
            label: 'Provide your username but not the password yet',
            description: 'A compromise might feel safer.',
            isCorrect: false,
            feedback: 'Sharing any account detail helps attackers build trust. Decline the request.',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    stage: 'Guardian',
    title: 'Level 4: Payroll Change Request',
    description: 'Tackle advanced spear-phishing aimed at finances and leadership.',
    powerUp: 'Unlocked Guardian Badge: You can stop executive impersonation attacks in their tracks.',
    questions: [
      {
        scenario: `
          <p><strong>From:</strong> "Taylor, CFO" <code>taylor.finance@trustedbiz.co</code></p>
          <p>"Please update my direct deposit info before today’s payroll runs. Use the attached form and confirm once done."</p>
          <p>The email signature looks real, but the reply-to shows <code>taylor.finance@trustedbiz.co-support.com</code></p>
        `,
        hint: 'Mismatch between sender and reply-to domains is a serious warning sign.',
        choices: [
          {
            id: 'A',
            label: 'Open the attachment and process the update immediately',
            description: 'You do not want to delay an executive request.',
            isCorrect: false,
            feedback: 'Attachments and urgent requests from executives are a common spear-phishing tactic.',
          },
          {
            id: 'B',
            label: 'Reply asking for confirmation from their assistant',
            description: 'Maybe the assistant can confirm the change.',
            isCorrect: false,
            feedback: 'Replying exposes your email and does not confirm legitimacy. Call a known number instead.',
          },
          {
            id: 'C',
            label: 'Call the executive using a known company number before acting',
            description: 'Verify the request through another channel.',
            isCorrect: true,
            feedback: 'Correct! Cross-check unusual requests through trusted channels before making changes.',
          },
          {
            id: 'D',
            label: 'Forward the email to the whole finance team for visibility',
            description: 'Sharing the request could get it done faster.',
            isCorrect: false,
            feedback: 'Forwarding spreads the phishing attempt. Report it through official channels instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Updated wiring instructions</p>
          <p><strong>From:</strong> Supplier Accounts <code>remit@vendor-payments.cc</code></p>
          <p>"Effective immediately, please send all future invoice payments to our new bank account in another country. The attached PDF has the routing details."</p>
        `,
        hint: 'Always verify bank changes directly with the supplier using previously known contacts.',
        choices: [
          {
            id: 'A',
            label: 'Update the bank information so payments are not delayed',
            description: 'You want to maintain a good relationship.',
            isCorrect: false,
            feedback: 'Unverified bank changes are a prime wire fraud tactic. Confirm before altering records.',
          },
          {
            id: 'B',
            label: 'Reply requesting a confirmation code from the supplier portal',
            description: 'Maybe they can prove it is real.',
            isCorrect: false,
            feedback: 'Attackers can fake confirmations. Use trusted contact info.',
          },
          {
            id: 'C',
            label: 'Call your supplier rep using the number saved in your vendor file',
            description: 'Validate the change through a known person.',
            isCorrect: true,
            feedback: 'Correct! Independent verification prevents fraudulent transfers.',
          },
          {
            id: 'D',
            label: 'Process one small payment to test the new account',
            description: 'A trial run could expose issues.',
            isCorrect: false,
            feedback: 'Even a small transfer sends money to criminals. Verify first.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Action required: Sign updated contract</p>
          <p><strong>From:</strong> Legal Team <code>legal-docs@trustedbiz.co.dropbox-mailer.com</code></p>
          <p>"We uploaded the new vendor contract. Log in with your work credentials to sign before end of day."</p>
          <p><strong>Button:</strong> <code>View document</code></p>
        `,
        hint: 'Check sender domains carefully—look for extra words or unfamiliar services tacked on.',
        choices: [
          {
            id: 'A',
            label: 'Click the button and sign the contract right away',
            description: 'Deadlines matter for compliance.',
            isCorrect: false,
            feedback: 'The domain is suspicious. Fake signing portals steal credentials.',
          },
          {
            id: 'B',
            label: 'Open the company’s official contract management system directly',
            description: 'Use your bookmarks or intranet links.',
            isCorrect: true,
            feedback: 'Correct! Access sensitive documents through trusted systems, not unexpected emails.',
          },
          {
            id: 'C',
            label: 'Forward the email to another department to see if they received it',
            description: 'A second opinion could help.',
            isCorrect: false,
            feedback: 'Forwarding increases exposure. Report the suspicious email instead.',
          },
          {
            id: 'D',
            label: 'Download the PDF and upload it to a secure folder',
            description: 'Maybe storing it safely is enough.',
            isCorrect: false,
            feedback: 'Downloading could install malware. Verify the request first.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Travel reimbursement upgrade</p>
          <p><strong>From:</strong> Finance Concierge <code>expenses@finance-concierge.io</code></p>
          <p>"We noticed your travel receipts are missing. Sign in with your corporate credentials through this form so we can release your reimbursement."</p>
        `,
        hint: 'Legitimate finance teams route you through the company expense portal—never a random form.',
        choices: [
          {
            id: 'A',
            label: 'Sign in through the provided form to upload receipts',
            description: 'Get reimbursed quickly.',
            isCorrect: false,
            feedback: 'Entering credentials on unverified forms hands them to attackers.',
          },
          {
            id: 'B',
            label: 'Report the email and log in through the official expense system',
            description: 'Verify whether any tasks await you.',
            isCorrect: true,
            feedback: 'Correct! Use trusted portals and alert security to suspicious forms.',
          },
          {
            id: 'C',
            label: 'Reply asking what receipts are missing',
            description: 'Maybe they can clarify.',
            isCorrect: false,
            feedback: 'Attackers will invent details to keep you engaged.',
          },
          {
            id: 'D',
            label: 'Forward to your travel buddy to see if they received the same note',
            description: 'You want to compare experiences.',
            isCorrect: false,
            feedback: 'Forwarding spreads malicious links. Report and delete instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Audit data request</p>
          <p><strong>From:</strong> Compliance Partner <code>audit@trustedbiz.co-review.com</code></p>
          <p>"We are preparing for a surprise audit. Send the employee payroll list and Social Security numbers via the secure link below within 2 hours."</p>
        `,
        hint: 'Sensitive data requests deserve slow, careful verification—especially with strange domains.',
        choices: [
          {
            id: 'A',
            label: 'Upload the data immediately to stay compliant',
            description: 'You want to avoid audit penalties.',
            isCorrect: false,
            feedback: 'Never transmit sensitive data through unverified links. This is a high-risk phish.',
          },
          {
            id: 'B',
            label: 'Confirm the request with your compliance officer using official channels',
            description: 'Double-check before sharing sensitive records.',
            isCorrect: true,
            feedback: 'Correct! Validate high-risk data requests with trusted leaders first.',
          },
          {
            id: 'C',
            label: 'Send a password-protected zip file to the sender instead',
            description: 'Maybe that keeps the data safe.',
            isCorrect: false,
            feedback: 'A password does not make sharing with an attacker safe. Verify before sending anything.',
          },
          {
            id: 'D',
            label: 'Ignore the email because audits are optional',
            description: 'If it is real, someone else will follow up.',
            isCorrect: false,
            feedback: 'Ignoring without reporting leaves others exposed. Verify and escalate.',
          },
        ],
      },
    ],
  },
];

const progressLevelsList = document.getElementById('progressLevels');
const progressFill = document.getElementById('progressFill');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const powerUpDisplay = document.getElementById('powerUp');

const levelBadge = document.getElementById('levelBadge');
const levelTitle = document.getElementById('levelTitle');
const levelDescription = document.getElementById('levelDescription');
const questionProgressElement = document.getElementById('questionProgress');
const scenarioElement = document.getElementById('scenario');
const choicesForm = document.getElementById('choices');
const feedbackElement = document.getElementById('feedback');
const hintButton = document.getElementById('hintButton');
const submitButton = document.getElementById('submitButton');

const certificateSection = document.getElementById('certificate');
const certificateStatus = document.getElementById('certificateStatus');
const certificatePreview = document.getElementById('certificatePreview');
const participantNameInput = document.getElementById('participantName');
const downloadCertificateButton = document.getElementById('downloadCertificate');
const certificateTemplate = document.getElementById('certificateTemplate');

const startAdventureButton = document.getElementById('startAdventure');
const resetProgressButton = document.getElementById('resetProgress');

let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let selectedChoiceId = null;
let score = 0;
let streak = 0;
let hasViewedHint = false;
const completedLevels = new Set();
let pendingSelections = {};

const STORAGE_KEY = 'justforphishing-progress-v1';

const SCORE_REWARD = 25;
const SCORE_PENALTY = -5;
const STREAK_BONUS = 10;

function clearProgressStorage() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear saved progress.', error);
  }
}

function loadProgressFromStorage() {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Saved progress is not an object.');
    }

    const {
      currentLevelIndex: storedLevelIndex,
      currentQuestionIndex: storedQuestionIndex,
      score: storedScore,
      streak: storedStreak,
      completedLevels: storedCompletedLevels,
      pendingSelections: storedSelections,
    } = parsed;

    if (Number.isInteger(storedLevelIndex) && storedLevelIndex >= 0 && storedLevelIndex < levels.length) {
      currentLevelIndex = storedLevelIndex;
    }

    const activeLevel = levels[currentLevelIndex];
    if (
      Number.isInteger(storedQuestionIndex) &&
      storedQuestionIndex >= 0 &&
      storedQuestionIndex < activeLevel.questions.length
    ) {
      currentQuestionIndex = storedQuestionIndex;
    } else {
      currentQuestionIndex = 0;
    }

    if (Number.isFinite(storedScore) && storedScore >= 0) {
      score = Math.floor(storedScore);
    }

    if (Number.isFinite(storedStreak) && storedStreak >= 0) {
      streak = Math.floor(storedStreak);
    }

    completedLevels.clear();
    if (Array.isArray(storedCompletedLevels)) {
      storedCompletedLevels.forEach((levelId) => {
        if (levels.some((level) => level.id === levelId)) {
          completedLevels.add(levelId);
        }
      });
    }

    pendingSelections = {};
    if (storedSelections && typeof storedSelections === 'object') {
      Object.entries(storedSelections).forEach(([levelKey, questionMap]) => {
        const level = levels.find((entry) => String(entry.id) === String(levelKey));
        if (!level || !questionMap || typeof questionMap !== 'object') {
          return;
        }

        const validSelections = {};
        Object.entries(questionMap).forEach(([questionIndexKey, choiceId]) => {
          const questionIndex = Number(questionIndexKey);
          const question = level.questions[questionIndex];
          if (
            Number.isInteger(questionIndex) &&
            questionIndex >= 0 &&
            questionIndex < level.questions.length &&
            question &&
            question.choices.some((choice) => choice.id === choiceId)
          ) {
            validSelections[questionIndexKey] = choiceId;
          }
        });

        if (Object.keys(validSelections).length > 0) {
          pendingSelections[String(level.id)] = validSelections;
        }
      });
    }

    return true;
  } catch (error) {
    console.warn('Failed to load saved progress. Resetting storage.', error);
    clearProgressStorage();
    return false;
  }
}

function saveProgressToStorage() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    const payload = {
      currentLevelIndex,
      currentQuestionIndex,
      score,
      streak,
      completedLevels: Array.from(completedLevels),
      pendingSelections,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Unable to save training progress.', error);
  }
}

function setPendingSelection(levelId, questionIndex, choiceId) {
  const levelKey = String(levelId);
  const questionKey = String(questionIndex);

  if (!pendingSelections[levelKey]) {
    pendingSelections[levelKey] = {};
  }

  pendingSelections[levelKey][questionKey] = choiceId;
}

function removePendingSelection(levelId, questionIndex) {
  const levelKey = String(levelId);
  const questionKey = String(questionIndex);

  if (!pendingSelections[levelKey]) {
    return;
  }

  delete pendingSelections[levelKey][questionKey];

  if (Object.keys(pendingSelections[levelKey]).length === 0) {
    delete pendingSelections[levelKey];
  }
}

function getPendingSelection(levelId, questionIndex) {
  const levelKey = String(levelId);
  const questionKey = String(questionIndex);
  return pendingSelections[levelKey]?.[questionKey] ?? null;
}

function initializeProgress() {
  progressLevelsList.innerHTML = '';
  levels.forEach((level, index) => {
    const li = document.createElement('li');
    li.classList.add('progress__item');
    if (index === currentLevelIndex) {
      li.classList.add('progress__item--active');
    }
    li.dataset.levelId = level.id;

    const title = document.createElement('h4');
    title.textContent = level.title;

    const description = document.createElement('p');
    description.textContent = level.description;

    const status = document.createElement('span');
    status.classList.add('progress__status');
    status.textContent = index === currentLevelIndex ? 'In progress' : 'Locked';

    li.appendChild(title);
    li.appendChild(description);
    li.appendChild(status);
    progressLevelsList.appendChild(li);
  });
}

function updateProgress() {
  const completionPercentage = (completedLevels.size / levels.length) * 100;
  progressFill.style.width = `${completionPercentage}%`;

  progressLevelsList.querySelectorAll('.progress__item').forEach((item, index) => {
    const status = item.querySelector('.progress__status');
    item.classList.remove('progress__item--active', 'progress__item--complete');
    status.classList.remove('progress__status--complete', 'progress__status--locked');

    if (completedLevels.has(levels[index].id)) {
      item.classList.add('progress__item--complete');
      status.classList.add('progress__status--complete');
      status.textContent = 'Completed';
    } else if (index === currentLevelIndex) {
      item.classList.add('progress__item--active');
      status.textContent = 'In progress';
    } else if (index < currentLevelIndex) {
      status.textContent = 'Review available';
    } else {
      status.classList.add('progress__status--locked');
      status.textContent = 'Locked';
    }
  });

  if (completedLevels.size === levels.length) {
    unlockCertificate();
  }
}

function updateScoreboard() {
  scoreDisplay.textContent = score;
  streakDisplay.textContent = streak;
}

function updatePowerUpDisplay(level) {
  if (completedLevels.has(level.id)) {
    powerUpDisplay.textContent = level.powerUp;
    powerUpDisplay.classList.add('power-up--earned');
  } else {
    powerUpDisplay.textContent = `Complete every challenge in this level to unlock: ${level.powerUp}`;
    powerUpDisplay.classList.remove('power-up--earned');
  }
}

function renderLevel(index) {
  const level = levels[index];
  levelBadge.textContent = level.stage;
  levelTitle.textContent = level.title;
  levelDescription.textContent = level.description;
  updatePowerUpDisplay(level);
  renderQuestion();
}

function renderQuestion() {
  const level = levels[currentLevelIndex];
  const question = level.questions[currentQuestionIndex];
  const existingAdvanceButton = document.getElementById('advanceButton');
  if (existingAdvanceButton) {
    existingAdvanceButton.remove();
  }

  questionProgressElement.textContent = `Challenge ${currentQuestionIndex + 1} of ${level.questions.length}`;
  scenarioElement.innerHTML = question.scenario.trim();
  choicesForm.innerHTML = '';
  selectedChoiceId = null;
  feedbackElement.innerHTML = '';
  feedbackElement.className = 'feedback';
  submitButton.disabled = true;
  hintButton.disabled = false;
  hasViewedHint = false;

  const storedChoiceId = getPendingSelection(level.id, currentQuestionIndex);

  question.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.dataset.choiceId = choice.id;

    const label = document.createElement('div');
    label.className = 'choice__label';

    const icon = document.createElement('div');
    icon.className = 'choice__icon';
    icon.textContent = choice.id;

    const text = document.createElement('span');
    text.textContent = choice.label;

    label.appendChild(icon);
    label.appendChild(text);

    const description = document.createElement('p');
    description.className = 'choice__description';
    description.textContent = choice.description;

    button.appendChild(label);
    button.appendChild(description);

    button.addEventListener('click', () => handleChoiceSelection(choice.id, button));

    choicesForm.appendChild(button);

    if (storedChoiceId && storedChoiceId === choice.id) {
      selectedChoiceId = choice.id;
      submitButton.disabled = false;
      button.classList.add('choice--selected');
    }
  });
}

function handleChoiceSelection(choiceId, button) {
  selectedChoiceId = choiceId;
  submitButton.disabled = false;

  choicesForm.querySelectorAll('.choice').forEach((choiceButton) => {
    choiceButton.classList.remove('choice--selected');
  });

  button.classList.add('choice--selected');
  const level = levels[currentLevelIndex];
  setPendingSelection(level.id, currentQuestionIndex, choiceId);
  saveProgressToStorage();
}

function showFeedback(result, message) {
  feedbackElement.className = 'feedback';
  if (result === 'correct') {
    feedbackElement.classList.add('feedback--positive');
  } else if (result === 'incorrect') {
    feedbackElement.classList.add('feedback--negative');
  } else {
    feedbackElement.classList.add('feedback--neutral');
  }

  const titleText =
    result === 'correct' ? 'Nice catch!' : result === 'incorrect' ? 'Not quite.' : 'Hint';

  feedbackElement.innerHTML = `
    <p class="feedback__title">${titleText}</p>
    <p class="feedback__message">${message}</p>
  `;
}

function handleSubmission() {
  const level = levels[currentLevelIndex];
  const question = level.questions[currentQuestionIndex];
  const choice = question.choices.find((c) => c.id === selectedChoiceId);

  if (!choice) {
    showFeedback('neutral', question.hint);
    return;
  }

  if (choice.isCorrect) {
    score += SCORE_REWARD;
    streak += 1;
    if (streak > 1) {
      score += STREAK_BONUS;
    }

    const isLastQuestion = currentQuestionIndex === level.questions.length - 1;
    if (isLastQuestion) {
      completedLevels.add(level.id);
      updatePowerUpDisplay(level);
    }

    removePendingSelection(level.id, currentQuestionIndex);

    showFeedback('correct', choice.feedback);
    submitButton.disabled = true;
    hintButton.disabled = true;
    revealAdvanceButton(isLastQuestion);
  } else {
    score = Math.max(score + SCORE_PENALTY, 0);
    streak = 0;
    showFeedback('incorrect', choice.feedback);
  }

  updateScoreboard();
  updateProgress();
  saveProgressToStorage();
}

function revealAdvanceButton(isLastQuestion) {
  const existingButton = document.getElementById('advanceButton');
  if (existingButton) {
    existingButton.remove();
  }

  const level = levels[currentLevelIndex];
  const button = document.createElement('button');
  button.id = 'advanceButton';
  button.className = 'btn btn--primary';
  button.type = 'button';

  if (!isLastQuestion) {
    button.textContent = 'Next challenge';
    button.addEventListener('click', () => {
      currentQuestionIndex += 1;
      renderQuestion();
      button.remove();
      saveProgressToStorage();
    });
  } else if (currentLevelIndex < levels.length - 1) {
    button.textContent = 'Continue to next level';
    button.addEventListener('click', () => {
      currentLevelIndex += 1;
      currentQuestionIndex = 0;
      renderLevel(currentLevelIndex);
      updateProgress();
      updateScoreboard();
      button.remove();
      saveProgressToStorage();
    });
  } else {
    button.textContent = 'Celebrate your mastery';
    button.addEventListener('click', () => {
      document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
      button.remove();
    });
  }

  choicesForm.after(button);
}

function lockCertificate() {
  certificateSection.hidden = true;
  certificateStatus.textContent = 'Locked — finish every level to claim your reward.';
  certificateStatus.classList.remove('certificate__status--unlocked');
  downloadCertificateButton.disabled = true;
  certificatePreview.innerHTML = '';
  certificatePreview.classList.remove('certificate__preview--ready');
}

function unlockCertificate() {
  certificateSection.hidden = false;
  certificateStatus.textContent = 'Unlocked — download your Cyber Hygiene Certificate!';
  certificateStatus.classList.add('certificate__status--unlocked');
  downloadCertificateButton.disabled = false;
  renderCertificatePreview();
}

function renderCertificatePreview() {
  certificatePreview.innerHTML = '';
  const name = participantNameInput.value.trim() || 'Ada Lovelace';
  const template = certificateTemplate.content.cloneNode(true);
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  template.querySelector('[data-field="name"]').textContent = name;
  template.querySelector('[data-field="date"]').textContent = today;

  const sheet = template.querySelector('.certificate-sheet');
  certificatePreview.appendChild(sheet);
  certificatePreview.classList.add('certificate__preview--ready');
}

function getCertificateName() {
  return participantNameInput.value.trim() || 'Cyber Defender';
}

function openCertificateWindow(name) {
  const certWindow = window.open('', '_blank', 'width=900,height=650');
  if (!certWindow) {
    alert('Please allow pop-ups to download your certificate.');
    return;
  }

  const template = certificateTemplate.content.cloneNode(true);
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  template.querySelector('[data-field="name"]').textContent = name;
  template.querySelector('[data-field="date"]').textContent = today;

  certWindow.document.write(`
    <html>
      <head>
        <title>Cyber Hygiene Certificate</title>
        <style>
          body {
            margin: 0;
            padding: 2rem;
            font-family: 'Montserrat', 'Segoe UI', sans-serif;
            background: #f1f5f9;
            color: #0f172a;
          }
          .certificate-sheet {
            max-width: 720px;
            margin: 0 auto;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.92));
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 40px 80px rgba(15, 23, 42, 0.2);
            border: 1px solid rgba(148, 163, 184, 0.35);
          }
          h1 {
            font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
            font-size: 2.4rem;
            margin-bottom: 1rem;
          }
          h2 {
            font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
            font-size: 2rem;
            margin: 1.5rem 0;
            color: #0ea5e9;
          }
          p {
            font-size: 1.05rem;
            margin: 0.85rem 0;
            color: #334155;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 2.5rem;
            font-weight: 600;
          }
          button {
            margin-top: 2rem;
            padding: 0.85rem 1.75rem;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, #38bdf8, #0ea5e9);
            color: #041021;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        ${template.firstElementChild.outerHTML}
        <div style="text-align:center;">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
      </body>
    </html>
  `);
  certWindow.document.close();
}

function resetProgress() {
  currentLevelIndex = 0;
  currentQuestionIndex = 0;
  selectedChoiceId = null;
  score = 0;
  streak = 0;
  hasViewedHint = false;
  completedLevels.clear();
  pendingSelections = {};

  clearProgressStorage();
  lockCertificate();

  initializeProgress();
  renderLevel(currentLevelIndex);
  updateScoreboard();
  updateProgress();

  feedbackElement.innerHTML = '';
  feedbackElement.className = 'feedback';
}

function handleHint() {
  hasViewedHint = true;
  const level = levels[currentLevelIndex];
  const question = level.questions[currentQuestionIndex];
  showFeedback('neutral', question.hint);
}

function startJourney() {
  document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
}

choicesForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

submitButton.addEventListener('click', handleSubmission);
hintButton.addEventListener('click', handleHint);
startAdventureButton.addEventListener('click', startJourney);
resetProgressButton.addEventListener('click', resetProgress);

participantNameInput.addEventListener('input', () => {
  if (!certificateSection.hidden) {
    renderCertificatePreview();
  }
});

downloadCertificateButton.addEventListener('click', () => {
  const name = getCertificateName();
  openCertificateWindow(name);
});

lockCertificate();
const progressRestored = loadProgressFromStorage();
initializeProgress();
renderLevel(currentLevelIndex);
updateScoreboard();
updateProgress();

if (!progressRestored) {
  saveProgressToStorage();
}
