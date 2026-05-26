// Quiz Questions — data file
// Loaded before quiz.js so window.QUIZ_QUESTIONS is available as a global
window.QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Phishing Detection",
    question: "You receive an email from 'support@amaz0n-security.com' asking you to verify your account. What should you do?",
    options: [
      "Click the link immediately to secure your account",
      "Reply with your account information to verify",
      "Delete the email and go directly to Amazon's official website",
      "Forward it to friends to warn them"
    ],
    correctIndex: 2,
    explanation: "This is a classic phishing attempt! The domain 'amaz0n-security.com' uses a zero instead of an 'o' to trick you. Always go directly to official websites by typing the URL yourself or using a bookmarked link. Never click links in suspicious emails.",
    tips: "Red flags: Misspelled domain, urgent security request, unexpected email. Always verify by going to the official site directly."
  },
  {
    id: 2,
    category: "Multi-Factor Authentication (MFA)",
    question: "You receive multiple MFA push notifications late at night that you didn't request. What's happening and what should you do?",
    options: [
      "Approve one notification to see what happens",
      "Ignore all notifications and report this to IT/security immediately",
      "Call the number in the notification to ask about it",
      "Assume it's a glitch and approve to stop the notifications"
    ],
    correctIndex: 1,
    explanation: "This is called 'MFA Fatigue' or 'Push Bombing' - an attack where hackers flood you with notifications hoping you'll approve one by accident or frustration. NEVER approve unexpected MFA requests. Report immediately and change your password.",
    tips: "MFA fatigue attacks are increasing. Always deny unexpected MFA requests and report suspicious activity immediately."
  },
  {
    id: 3,
    category: "Password Security",
    question: "Which of these is the BEST password practice?",
    options: [
      "Using the same strong password across all important accounts",
      "Using unique, long passwords for each account stored in a password manager",
      "Writing passwords on sticky notes hidden under your keyboard",
      "Using patterns like 'Password123!' that are easy to remember"
    ],
    correctIndex: 1,
    explanation: "The best practice is unique, long passwords (12+ characters) for each account, stored securely in a reputable password manager. This way, if one account is compromised, your other accounts remain safe. Password reuse is one of the biggest security risks.",
    tips: "Use a password manager like 1Password, Bitwarden, or LastPass. Enable MFA on all accounts that support it for an extra layer of security."
  },
  {
    id: 4,
    category: "Social Engineering",
    question: "Someone calls claiming to be from your IT department and asks for your password to 'fix a problem.' What should you do?",
    options: [
      "Give them your password since they're from IT",
      "Give them a hint about your password instead",
      "Refuse and verify by calling IT through official channels",
      "Ask them to verify by telling you your current password first"
    ],
    correctIndex: 2,
    explanation: "Legitimate IT departments will NEVER ask for your password. This is a social engineering attack called 'pretexting.' Always verify by calling back through official company phone numbers, not numbers provided by the caller.",
    tips: "Remember: No legitimate organization (IT, bank, government) will ever ask for your password. If in doubt, hang up and call back using official contact information."
  },
  {
    id: 5,
    category: "Safe Browsing",
    question: "You're about to enter sensitive information on a website. Which indicator tells you the connection is secure?",
    options: [
      "The website looks professional and has a logo",
      "The URL starts with 'https://' and shows a padlock icon",
      "The website has a privacy policy page",
      "The site has been shared on social media"
    ],
    correctIndex: 1,
    explanation: "The 'https://' protocol and padlock icon indicate the connection is encrypted, protecting your data in transit. However, note that phishing sites can also have HTTPS - it only means the connection is encrypted, not that the site is legitimate. Always verify the domain name too!",
    tips: "Check for HTTPS AND verify the domain name is correct. Phishers often use HTTPS on fake sites. Look for misspellings in the URL like 'paypa1.com' instead of 'paypal.com'."
  }
];
