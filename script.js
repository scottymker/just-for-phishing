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
            feedback: 'The link is a spoofed domain designed to steal your credentials. Real services do not threaten lockouts within minutes.',
          },
          {
            id: 'B',
            label: 'Ignore the message and delete it right away',
            description: 'Suspicious emails should be deleted to avoid any risk.',
            isCorrect: false,
            feedback: 'Deleting is safer than clicking, but it is better to report the message so your security team is aware.',
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
          <p><strong>Subject:</strong> HR: Update your benefits profile today</p>
          <p><strong>From:</strong> People Services <code>benefits@company-infoportal.com</code></p>
          <p>"We’re rolling out new benefits. Complete the attached form and send it back with your Social Security number."</p>
          <p>The email references a “secure link” but the button points to <code>http://employee-portal-update.com</code></p>
        `,
        hint: 'Hover links to see the real destination, and beware forms that ask for sensitive info.',
        choices: [
          {
            id: 'A',
            label: 'Download the form and fill out the requested details',
            description: 'You want to keep your benefits current.',
            isCorrect: false,
            feedback: 'Attachments from unexpected senders can deliver malware. Confirm through HR’s official site first.',
          },
          {
            id: 'B',
            label: 'Forward the message to your personal email to review later',
            description: 'You need more time to decide.',
            isCorrect: false,
            feedback: 'Forwarding to personal accounts spreads potential malware and data exposure.',
          },
          {
            id: 'C',
            label: 'Report the message and open your benefits portal via a bookmarked link',
            description: 'Check any updates through known bookmarks.',
            isCorrect: true,
            feedback: 'Correct! Use trusted bookmarks or URLs to verify if changes are real.',
          },
          {
            id: 'D',
            label: 'Reply requesting a confirmation phone call from HR',
            description: 'A phone call might clarify things.',
            isCorrect: false,
            feedback: 'Replying confirms your email is active. Verify through HR’s official directory instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> Internal audit: verify your payroll access</p>
          <p><strong>From:</strong> Audit Support <code>audit-team@company-secure.net</code></p>
          <p>"Click the secure badge below to re-authenticate your payroll account or your access will be disabled today."</p>
          <p>The link preview shows <code>http://company-payroll-review.netlify.app</code></p>
        `,
        hint: 'Threats about losing access are common phishing tactics.',
        choices: [
          {
            id: 'A',
            label: 'Click the badge and log in to keep your payroll access',
            description: 'Avoid losing access during audit season.',
            isCorrect: false,
            feedback: 'Phishers mimic internal teams with fake urgency. Do not enter credentials on unknown sites.',
          },
          {
            id: 'B',
            label: 'Flag the email as spam but take no further action',
            description: 'Let the spam filter handle it.',
            isCorrect: false,
            feedback: 'Reporting as phishing informs the security team and helps protect coworkers.',
          },
          {
            id: 'C',
            label: 'Forward the email to your manager asking what to do',
            description: 'Managers usually know if audits are happening.',
            isCorrect: false,
            feedback: 'Forwarding spreads the attack and does not confirm authenticity. Use security channels.',
          },
          {
            id: 'D',
            label: 'Report the email and verify through the real payroll portal URL',
            description: 'Go to the official site yourself.',
            isCorrect: true,
            feedback: 'Correct! Always authenticate using URLs you trust, not those provided by suspicious messages.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> DocuSign: You have received a new file</p>
          <p><strong>From:</strong> DocuSign <code>notice@docusign-mailer.com</code></p>
          <p>"A document is waiting for your signature. Review and sign within the next hour to avoid delays."</p>
          <p>Hovering over the “Review Document” button reveals <code>http://docusign-review-docs.io</code></p>
        `,
        hint: 'Legitimate services use their exact domain names. Look out for subtle variations.',
        choices: [
          {
            id: 'A',
            label: 'Click the button to review and sign the document',
            description: 'You do not want to hold up a project.',
            isCorrect: false,
            feedback: 'Fake DocuSign links steal credentials. Access documents from your account directly.',
          },
          {
            id: 'B',
            label: 'Take no action—the deadline is short anyway',
            description: 'Maybe someone else will handle it.',
            isCorrect: false,
            feedback: 'Ignoring suspicious emails may be safer than clicking, but reporting helps others stay safe.',
          },
          {
            id: 'C',
            label: 'Use the DocuSign app or bookmark to check for pending documents',
            description: 'Confirm if the document exists.',
            isCorrect: true,
            feedback: 'Correct! Verify pending documents through official apps or bookmarks.',
          },
          {
            id: 'D',
            label: 'Forward the message to the IT help desk for them to log in',
            description: 'Let IT handle the signature.',
            isCorrect: false,
            feedback: 'Forwarding encourages others to interact with the phish. Report instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>Subject:</strong> System update required</p>
          <p><strong>From:</strong> IT Notifications <code>update@intranet-techsupport.com</code></p>
          <p>"Our systems detected your device running outdated security patches. Install the update from the attachment immediately."</p>
          <p>The attachment is a ZIP file named <code>SecurityUpdate.zip</code></p>
        `,
        hint: 'Unexpected attachments claiming to be updates are often malware.',
        choices: [
          {
            id: 'A',
            label: 'Download and run the attachment to stay protected',
            description: 'You want to stay compliant with IT policy.',
            isCorrect: false,
            feedback: 'Running unknown attachments is dangerous. Updates should come from official channels.',
          },
          {
            id: 'B',
            label: 'Reply to ask if the update is mandatory',
            description: 'Maybe it is a legitimate request.',
            isCorrect: false,
            feedback: 'Replying confirms your address. Verify through the IT portal or help desk instead.',
          },
          {
            id: 'C',
            label: 'Report the email and check the official IT status page',
            description: 'IT publishes legitimate alerts there.',
            isCorrect: true,
            feedback: 'Correct! Always confirm update notices through official IT communications.',
          },
          {
            id: 'D',
            label: 'Forward the attachment to your team so they stay updated',
            description: 'Sharing might help others.',
            isCorrect: false,
            feedback: 'Forwarding spreads potential malware. Report it instead.',
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
          <p><strong>SMS:</strong> "Hi Mom, I broke my phone and need help buying a new one. Can you Zelle $300 to 123-555-2210?"</p>
          <p>The sender is saved as "Kiddo 💙" but the number is unfamiliar.</p>
        `,
        hint: 'Spoofed family member texts play on emotions. Always verify using known numbers.',
        choices: [
          {
            id: 'A',
            label: 'Send the money to help them quickly',
            description: 'It is an emergency, and they need help.',
            isCorrect: false,
            feedback: 'Criminals exploit urgency and emotion. Verify by calling your child’s known number first.',
          },
          {
            id: 'B',
            label: 'Reply asking for their new number',
            description: 'Maybe they got a temporary phone.',
            isCorrect: false,
            feedback: 'Any reply confirms your number. Always verify using known contacts.',
          },
          {
            id: 'C',
            label: 'Call your child using their saved contact before sending money',
            description: 'Check the story through a trusted method.',
            isCorrect: true,
            feedback: 'Correct! Always verify requests for money or help through known contact methods.',
          },
          {
            id: 'D',
            label: 'Send a smaller amount to test if it is real',
            description: 'Maybe you can gauge the response.',
            isCorrect: false,
            feedback: 'Sending any funds rewards scammers. Confirm first.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>SMS:</strong> "Urgent! Your company account will be disabled. Log in at <a href="#">http://vpn-update-secure.co</a> to stay connected."</p>
          <p>The message is from an unknown number and references a tool you use daily.</p>
        `,
        hint: 'Companies rarely send VPN alerts via random phone numbers.',
        choices: [
          {
            id: 'A',
            label: 'Tap the link and enter your work credentials',
            description: 'You cannot risk losing VPN access.',
            isCorrect: false,
            feedback: 'Fake VPN alerts are common. Only use official apps or bookmarks to log in.',
          },
          {
            id: 'B',
            label: 'Ignore the message completely',
            description: 'You will wait to see if IT follows up.',
            isCorrect: false,
            feedback: 'Ignoring is safer than clicking, but reporting helps protect others.',
          },
          {
            id: 'C',
            label: 'Report the text and open your VPN through the official app',
            description: 'Validate the claim yourself.',
            isCorrect: true,
            feedback: 'Correct! Use official tools and report the phish to your security team.',
          },
          {
            id: 'D',
            label: 'Share the link in the team chat to warn coworkers',
            description: 'Awareness can help others avoid it.',
            isCorrect: false,
            feedback: 'Sharing the link may tempt others to click. Report instead.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    stage: 'Challenger',
    title: 'Level 3: Fake Support Call',
    description: 'Practice handling phone-based phishing (vishing) attempts.',
    powerUp: 'Unlocked Voice Barrier: Phone imposters cannot pressure you anymore.',
    questions: [
      {
        scenario: `
          <p>The caller says, "We detected malware on your laptop. Give me remote access so I can clean it right now."</p>
          <p>They know your full name and department. They sound urgent and ask for your login details.</p>
        `,
        hint: 'Trusted support teams never demand remote access without prior verification.',
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
          <p>A caller claims to be from the "Payroll Compliance Team" and says payroll will be frozen unless you confirm your employee ID and password.</p>
          <p>They threaten delayed paychecks if you do not cooperate within five minutes.</p>
        `,
        hint: 'Threats and urgency are vishing red flags. Real teams follow established processes.',
        choices: [
          {
            id: 'A',
            label: 'Provide your employee ID but refuse the password',
            description: 'Maybe partial info will satisfy them.',
            isCorrect: false,
            feedback: 'Any personal information can be misused. Do not share anything.',
          },
          {
            id: 'B',
            label: 'Hang up and report the call to payroll through the company portal',
            description: 'Use known channels to alert the real team.',
            isCorrect: true,
            feedback: 'Correct! Report suspicious calls and verify with the real department.',
          },
          {
            id: 'C',
            label: 'Keep the caller talking while you gather more clues',
            description: 'Maybe you can trace their location.',
            isCorrect: false,
            feedback: 'Engaging prolongs exposure and risk. End the call and report it.',
          },
          {
            id: 'D',
            label: 'Ask them to call back later when your manager is present',
            description: 'Maybe the delay will deter them.',
            isCorrect: false,
            feedback: 'They may target others meanwhile. Report immediately instead.',
          },
        ],
      },
      {
        scenario: `
          <p>A voicemail says, "This is the IRS Fraud Division. Call us back immediately or you’ll be arrested for unpaid taxes."</p>
          <p>The callback number is not an official IRS line.</p>
        `,
        hint: 'Government agencies rarely call unannounced or threaten arrest over the phone.',
        choices: [
          {
            id: 'A',
            label: 'Return the call to clear things up',
            description: 'You do not want legal trouble.',
            isCorrect: false,
            feedback: 'Scammers use fear to elicit quick responses. Verify through official government channels instead.',
          },
          {
            id: 'B',
            label: 'Ignore the voicemail entirely',
            description: 'It is obviously fake.',
            isCorrect: false,
            feedback: 'Ignoring is safer than calling back, but reporting helps authorities track scams.',
          },
          {
            id: 'C',
            label: 'Report the voicemail to the IRS phishing address and local authorities',
            description: 'Help stop the scammers.',
            isCorrect: true,
            feedback: 'Correct! Reporting protects others and provides evidence to authorities.',
          },
          {
            id: 'D',
            label: 'Share the voicemail in your company group chat',
            description: 'Warn coworkers to stay alert.',
            isCorrect: false,
            feedback: 'Sharing recordings can spread panic. Report through official channels instead.',
          },
        ],
      },
      {
        scenario: `
          <p>A caller pretends to be your CEO and requests urgent gift cards for a client celebration. They demand codes over the phone.</p>
          <p>The caller ID shows "Unknown," and they refuse to send an email.</p>
        `,
        hint: 'Executives will not demand gift cards or secrecy via phone.',
        choices: [
          {
            id: 'A',
            label: 'Purchase the gift cards to maintain goodwill',
            description: 'It sounds important.',
            isCorrect: false,
            feedback: 'Gift card scams target employees through authority pressure. Verify through known contacts.',
          },
          {
            id: 'B',
            label: 'Ask the caller to email the request from their corporate address',
            description: 'An email trail will prove legitimacy.',
            isCorrect: false,
            feedback: 'They may spoof an email next. End the call and verify independently.',
          },
          {
            id: 'C',
            label: 'Hang up and call the CEO’s assistant using the corporate directory',
            description: 'Confirm before acting.',
            isCorrect: true,
            feedback: 'Correct! Always verify unusual requests with trusted contacts.',
          },
          {
            id: 'D',
            label: 'Tell the caller you will handle it later to buy time',
            description: 'Maybe you can investigate after the call.',
            isCorrect: false,
            feedback: 'Delaying still leaves them thinking you might comply. End and report it instead.',
          },
        ],
      },
      {
        scenario: `
          <p>Someone calls claiming to be IT, saying, "We’re testing multi-factor authentication. Please read the code you just received."</p>
          <p>You did receive a login code moments before the call.</p>
        `,
        hint: 'MFA codes are for you alone. Support staff will never ask for them.',
        choices: [
          {
            id: 'A',
            label: 'Read the code so the test can continue',
            description: 'They need the code to finish the test.',
            isCorrect: false,
            feedback: 'MFA codes protect your account. Never share them, even with supposed IT staff.',
          },
          {
            id: 'B',
            label: 'Hang up and report the call to your security team immediately',
            description: 'Alert them to the attempt.',
            isCorrect: true,
            feedback: 'Correct! Report the attempt so security can monitor for compromise.',
          },
          {
            id: 'C',
            label: 'Ask for the caller’s name and department before sharing the code',
            description: 'Maybe verifying their identity helps.',
            isCorrect: false,
            feedback: 'Attackers can fabricate details. Do not share the code under any circumstances.',
          },
          {
            id: 'D',
            label: 'Ignore the call and delete the MFA message',
            description: 'No need to respond.',
            isCorrect: false,
            feedback: 'Ignoring is better than sharing, but reporting protects others and prompts investigation.',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    stage: 'Guardian',
    title: 'Level 4: Executive Impersonation',
    description: 'Guard against targeted spear-phishing attempts.',
    powerUp: 'Unlocked Guardian Badge: You can stop executive impersonation attacks in their tracks.',
    questions: [
      {
        scenario: `
          <p><strong>From:</strong> "Taylor, CFO" <code>taylor.finance@trustedbiz.co</code></p>
          <p>"Please update my direct deposit info before today’s payroll runs. Use the attached form and confirm once done."</p>
          <p>The email signature looks real, but the reply-to shows <code>taylor.finance@trustedbiz.co-support.com</code></p>
        `,
        hint: 'Check reply-to fields and verify unusual requests through known channels.',
        choices: [
          {
            id: 'A',
            label: 'Open the attachment and process the update immediately',
            description: 'You do not want to delay an executive request.',
            isCorrect: false,
            feedback: 'Attachments and urgent requests from executives are common spear-phishing tactics.',
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
          <p><strong>From:</strong> "CEO Office" <code>ceooffice@trustedbiz.co</code></p>
          <p>"I’m on a flight and need you to send the confidential Q3 report to our partners via this private upload link."</p>
          <p>The link points to <code>http://share-secure-docs.app</code></p>
        `,
        hint: 'Executives use established secure channels for confidential data.',
        choices: [
          {
            id: 'A',
            label: 'Upload the report using the provided link',
            description: 'You do not want to delay the CEO.',
            isCorrect: false,
            feedback: 'Uploading sensitive files to unverified links leaks data. Verify the request first.',
          },
          {
            id: 'B',
            label: 'Reply requesting confirmation once they land',
            description: 'A follow-up email might clarify things.',
            isCorrect: false,
            feedback: 'Attackers can continue the conversation. Verify using known contact methods instead.',
          },
          {
            id: 'C',
            label: 'Call your direct supervisor using a verified number before sending anything',
            description: 'Confirm through the chain of command.',
            isCorrect: true,
            feedback: 'Correct! Verify high-risk requests through trusted leadership channels.',
          },
          {
            id: 'D',
            label: 'Download the link yourself to examine it safely',
            description: 'Maybe you can inspect the contents.',
            isCorrect: false,
            feedback: 'Downloading from unknown links risks malware. Avoid interaction.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>From:</strong> "Board Chair" <code>chair@trustedbiz.co</code></p>
          <p>"I need a list of all employee W-2s for urgent review. Please send them in an encrypted ZIP."</p>
          <p>The request arrives late at night with no prior discussion.</p>
        `,
        hint: 'Bulk data requests should follow formal procedures and approvals.',
        choices: [
          {
            id: 'A',
            label: 'Send the W-2s using the requested method',
            description: 'You want to comply quickly.',
            isCorrect: false,
            feedback: 'Transmitting sensitive data without verification risks data breaches. Confirm first.',
          },
          {
            id: 'B',
            label: 'Reply asking for clarification on the purpose',
            description: 'Maybe they will explain.',
            isCorrect: false,
            feedback: 'Replying does not validate the sender. Verify through official channels.',
          },
          {
            id: 'C',
            label: 'Escalate to the security team and confirm with the board liaison',
            description: 'Use proper governance channels.',
            isCorrect: true,
            feedback: 'Correct! Sensitive data requests must be verified and approved.',
          },
          {
            id: 'D',
            label: 'Forward the email to colleagues for their input',
            description: 'Perhaps others know about it.',
            isCorrect: false,
            feedback: 'Forwarding spreads potential phishing. Report it instead.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>From:</strong> "Vendor Success" <code>success@partner-co.com</code></p>
          <p>"Here is the updated vendor payment schedule. Please review the spreadsheet and update our wire instructions."</p>
          <p>The spreadsheet is hosted on an unfamiliar file-sharing site.</p>
        `,
        hint: 'Confirm any change to payment instructions directly with the vendor.',
        choices: [
          {
            id: 'A',
            label: 'Open the spreadsheet and update the payment details',
            description: 'You want to keep vendors happy.',
            isCorrect: false,
            feedback: 'Attackers often request wire updates. Confirm through known vendor contacts.',
          },
          {
            id: 'B',
            label: 'Forward the spreadsheet to accounts payable for processing',
            description: 'Let the specialists handle it.',
            isCorrect: false,
            feedback: 'Forwarding spreads the risk. Verify before sharing.',
          },
          {
            id: 'C',
            label: 'Call the vendor using a verified phone number before making changes',
            description: 'Confirm authenticity directly.',
            isCorrect: true,
            feedback: 'Correct! Always validate payment changes through trusted contact methods.',
          },
          {
            id: 'D',
            label: 'Reply requesting a PDF instead',
            description: 'Maybe a different format is safer.',
            isCorrect: false,
            feedback: 'File format changes do not guarantee safety. Verify first.',
          },
        ],
      },
      {
        scenario: `
          <p><strong>From:</strong> "Security Operations" <code>soc-alerts@trustedbiz.co</code></p>
          <p>"We detected suspicious activity on your admin account. Confirm your identity by approving the attached mobile push."</p>
          <p>There is an attached QR code to scan.</p>
        `,
        hint: 'Security teams never ask you to approve pushes via email attachments.',
        choices: [
          {
            id: 'A',
            label: 'Scan the QR code to approve the push quickly',
            description: 'You want to secure your account.',
            isCorrect: false,
            feedback: 'Scanning unknown QR codes can install malicious apps. Verify with security first.',
          },
          {
            id: 'B',
            label: 'Ignore the message because you do not see any issues',
            description: 'Maybe it is a false alarm.',
            isCorrect: false,
            feedback: 'Reporting helps the security team respond. Do not ignore suspicious alerts.',
          },
          {
            id: 'C',
            label: 'Report the email and contact the SOC via the official hotline',
            description: 'Use trusted communication channels.',
            isCorrect: true,
            feedback: 'Correct! Verify security alerts using official channels before acting.',
          },
          {
            id: 'D',
            label: 'Forward the QR code to colleagues to see if they received it too',
            description: 'Comparison might help.',
            isCorrect: false,
            feedback: 'Sharing spreads the scam. Report it instead.',
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
const scenarioElement = document.getElementById('scenario');
const questionProgressElement = document.getElementById('questionProgress');
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

let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let selectedChoiceId = null;
let score = 0;
let streak = 0;
let completedLevels = new Set();

const SCORE_REWARD = 25;
const SCORE_PENALTY = -5;
const STREAK_BONUS = 10;

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

    if (completedLevels.has(levels[index].id)) {
      item.classList.add('progress__item--complete');
      status.classList.remove('progress__status--locked');
      status.classList.add('progress__status--complete');
      status.textContent = 'Completed';
    } else if (index === currentLevelIndex) {
      item.classList.add('progress__item--active');
      status.classList.remove('progress__status--locked', 'progress__status--complete');
      status.textContent = 'In progress';
    } else if (index < currentLevelIndex) {
      status.textContent = 'Review available';
      status.classList.remove('progress__status--locked');
    } else {
      status.textContent = 'Locked';
      status.classList.add('progress__status--locked');
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

function renderLevel(index) {
  const level = levels[index];
  currentQuestionIndex = 0;
  selectedChoiceId = null;
  feedbackElement.innerHTML = '';
  feedbackElement.className = 'feedback';
  submitButton.disabled = true;
  hintButton.disabled = false;

  levelBadge.textContent = level.stage;
  levelTitle.textContent = level.title;
  levelDescription.textContent = level.description;
  powerUpDisplay.textContent =
    completedLevels.has(level.id) || currentLevelIndex > index
      ? level.powerUp
      : 'Complete this level to unlock a new power-up.';
  powerUpDisplay.classList.toggle('power-up--earned', completedLevels.has(level.id));

  renderQuestion();
  updateProgress();
  updateScoreboard();
  updateLevelProgressIndicators();
}

function renderQuestion() {
  const level = levels[currentLevelIndex];
  const question = level.questions[currentQuestionIndex];

  if (!question) {
    return;
  }

  scenarioElement.innerHTML = question.scenario.trim();
  questionProgressElement.textContent = `Challenge ${currentQuestionIndex + 1} of ${level.questions.length}`;
  choicesForm.innerHTML = '';
  selectedChoiceId = null;
  feedbackElement.innerHTML = '';
  feedbackElement.className = 'feedback';
  submitButton.disabled = true;

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
  });

  updateLevelProgressIndicators();
  toggleNavigationButtons();
}

function handleChoiceSelection(choiceId, button) {
  selectedChoiceId = choiceId;
  submitButton.disabled = false;

  choicesForm.querySelectorAll('.choice').forEach((choiceButton) => {
    choiceButton.classList.remove('choice--selected');
  });

  button.classList.add('choice--selected');
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
    showFeedback('correct', choice.feedback);
    submitButton.disabled = true;
    hintButton.disabled = true;

    setTimeout(() => {
      moveToNextQuestionOrLevel();
    }, 900);
  } else {
    score = Math.max(score + SCORE_PENALTY, 0);
    streak = 0;
    showFeedback('incorrect', choice.feedback);
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.disabled = false;
      hintButton.disabled = false;
    }, 900);
  }

  updateScoreboard();
}

function showFeedback(result, message) {
  feedbackElement.className = 'feedback';
  feedbackElement.classList.add(
    result === 'correct'
      ? 'feedback--positive'
      : result === 'incorrect'
      ? 'feedback--negative'
      : 'feedback--neutral'
  );

  const title =
    result === 'correct' ? 'Nice catch!' : result === 'incorrect' ? 'Not quite.' : 'Hint';

  feedbackElement.innerHTML = `
    <p class="feedback__title">${title}</p>
    <p class="feedback__message">${message}</p>
  `;
}

function moveToNextQuestionOrLevel() {
  const level = levels[currentLevelIndex];
  if (currentQuestionIndex < level.questions.length - 1) {
    currentQuestionIndex += 1;
    hintButton.disabled = false;
    renderQuestion();
  } else {
    completeLevel();
  }
}

function completeLevel() {
  const level = levels[currentLevelIndex];
  completedLevels.add(level.id);
  powerUpDisplay.textContent = level.powerUp;
  powerUpDisplay.classList.add('power-up--earned');

  if (currentLevelIndex < levels.length - 1) {
    const button = createNavigationButton('Continue to next level', () => {
      currentLevelIndex += 1;
      renderLevel(currentLevelIndex);
    });
    insertNavigationButton(button);
  } else {
    const button = createNavigationButton('Celebrate your mastery', () => {
      document.getElementById('certificate').scrollIntoView({ behavior: 'smooth' });
    });
    insertNavigationButton(button);
  }

  updateProgress();
}

function createNavigationButton(text, onClick) {
  const button = document.createElement('button');
  button.id = 'nextLevelButton';
  button.className = 'btn btn--primary';
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', () => {
    button.remove();
    onClick();
  });
  return button;
}

function insertNavigationButton(button) {
  const existingButton = document.getElementById('nextLevelButton');
  if (existingButton) {
    existingButton.remove();
  }
  choicesForm.after(button);
}

function toggleNavigationButtons() {
  const existingButton = document.getElementById('nextLevelButton');
  if (existingButton) {
    existingButton.remove();
  }
}

function updateLevelProgressIndicators() {
  const level = levels[currentLevelIndex];
  const stepsContainer = document.getElementById('questionSteps');
  if (!stepsContainer) return;

  stepsContainer.innerHTML = '';
  level.questions.forEach((_, index) => {
    const step = document.createElement('div');
    step.className = 'question-step';
    if (index < currentQuestionIndex) {
      step.classList.add('question-step--complete');
    } else if (index === currentQuestionIndex) {
      step.classList.add('question-step--active');
    }
    stepsContainer.appendChild(step);
  });
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

function handleHint() {
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

participantNameInput.addEventListener('input', () => {
  if (!certificateSection.hidden) {
    renderCertificatePreview();
  }
});

downloadCertificateButton.addEventListener('click', () => {
  const name = getCertificateName();
  openCertificateWindow(name);
});

initializeProgress();
renderLevel(currentLevelIndex);
updateScoreboard();
updateProgress();
