# Just For Phishing 🎯

**Interactive Phishing Awareness Training Platform**

> *Hands-on cybersecurity training to recognize and respond to real-world phishing attacks.*

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://scottymker.github.io/just-for-phishing/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange.svg)](CONTRIBUTING.md)

---

## 🎯 Mission Statement

Phishing attacks target everyone—from individuals to corporations, students to executives, healthcare workers to small business owners. This platform provides **hands-on, realistic training** to recognize and respond to the most common (and sophisticated) phishing attacks.

**100% free. No tracking. No signup required.**

---

## 🚀 Features

### Current Training Modules

| Module | Duration | Focus Area | Scenarios |
|--------|----------|------------|-----------|
| **Quick Check** | 5 min | Fundamentals | 5 questions |
| **Phish or Treat** | 3 min | Halloween-themed | 6 scenarios |
| **MFA Fatigue Drill** | 45 sec | Push bombing | Real-time sim |
| **Targeted Phishing** 🆕 | 10 min | Industry-specific attacks | 8 scenarios |
| **Email Phishing Lab** 🆕 | 15 min | Email analysis | 10 scenarios |
| **SMS Smishing** 🆕 | 5 min | Text message threats | 6 scenarios |

### Key Capabilities

✅ **Realistic Scenarios** - Based on actual phishing campaigns
✅ **Instant Feedback** - Learn from mistakes immediately
✅ **Progress Tracking** - Monitor your improvement over time
✅ **Shareable Certificates** - Prove your training completion
✅ **Mobile Responsive** - Train on any device
✅ **Accessibility First** - Screen reader compatible
✅ **Privacy Focused** - All data stored locally, nothing sent to servers

---

## 🎯 Who This Is For

### Primary Audiences

- **Corporate Employees** - Defend against business email compromise
- **Students & Educators** - Learn cybersecurity fundamentals
- **Healthcare Workers** - Protect patient data (HIPAA compliance)
- **Government Employees** - Recognize sophisticated attacks
- **Small Business Owners** - Protect your organization
- **Security Awareness Teams** - Deploy training programs
- **Individuals** - Protect personal accounts and finances

### Use Cases

- 🏢 **Corporate Training** - Fulfill security awareness requirements
- 🎓 **Educational Institutions** - Teach cybersecurity concepts
- 🏥 **Healthcare** - HIPAA compliance training
- 🏛️ **Government Agencies** - Mandate compliance
- 💼 **Onboarding Programs** - Train new employees
- 🏠 **Personal Use** - Protect yourself and family

---

## 📚 Training Modules

### 1️⃣ Quick Check (Beginner)
**5 minute fundamentals quiz**
- Multiple choice, true/false, and multi-select questions
- Core concepts: link safety, MFA, attachments, reporting
- Perfect for onboarding new users

### 2️⃣ Phish or Treat Challenge
**3 minute Halloween-themed scenario drill**
- Identify 6 phishing attempts among legitimate messages
- Time pressure simulates real-world decision-making
- Detailed explanations for each scenario

### 3️⃣ MFA Fatigue Drill
**45 second rapid-fire simulation**
- Experience "push bombing" attacks
- Practice denying, reporting, and resetting credentials
- Builds muscle memory for high-pressure situations

### 4️⃣ 🆕 Targeted Phishing Scenarios (NEW!)
**10 minute industry-specific training**
- Government benefits fraud (VA, Social Security, Medicare)
- Professional networking scams (fake recruiters, job offers)
- Industry-specific attacks (healthcare, finance, military)
- Charity and donation fraud
- Reunion and event phishing
- Credential harvesting attacks
- Spear phishing tactics
- Trust-based manipulation

### 5️⃣ 🆕 Email Phishing Lab (NEW!)
**15 minute interactive analysis**
- Examine full email headers
- Analyze sender domains
- Inspect embedded links
- Review attachment safety
- 10 progressively difficult scenarios

### 6️⃣ 🆕 SMS Smishing Simulator (NEW!)
**5 minute text message drill**
- Package delivery scams
- Bank alert spoofs
- Prize/sweepstakes fraud
- Account suspension threats
- Two-factor authentication bypasses

---

## 🏆 Progress & Achievements

Track your cybersecurity awareness journey:

- 📊 **Dashboard** - View scores across all modules
- 🏅 **Certificates** - Download completion certificates
- 📈 **Progress Tracker** - See improvement over time
- 🎯 **Skill Badges** - Unlock achievements
- 📱 **Shareable Results** - Post to LinkedIn/social media

---

## 🔗 Resources & Reporting

### Report Phishing

| Threat Type | Where to Report |
|-------------|----------------|
| **Email Phishing** | Forward to [spam@uce.gov](mailto:spam@uce.gov) (FTC) |
| **VA-related Scams** | [VA OIG Hotline](https://www.va.gov/oig/hotline/) |
| **Military Impersonation** | [FBI IC3](https://www.ic3.gov/) |
| **Financial Fraud** | [FTC Report Fraud](https://reportfraud.ftc.gov/) |
| **Identity Theft** | [IdentityTheft.gov](https://identitytheft.gov/) |

### Additional Resources

- 🔒 **CISA Cybersecurity Tips** - [cisa.gov/cybersecurity-tips](https://www.cisa.gov/cybersecurity-tips)
- 🎖️ **Military OneSource** - [militaryonesource.mil](https://www.militaryonesource.mil/)
- 📞 **VA Benefits Hotline** - 1-800-827-1000
- 🛡️ **NCSC Cyber Aware** - [ncsc.gov.uk/cyberaware](https://www.ncsc.gov.uk/cyberaware)

---

## 🚀 Quick Start

### For Users

**Option 1: Use the live site**
Visit [https://scottymker.github.io/just-for-phishing/](https://scottymker.github.io/just-for-phishing/)

**Option 2: Run locally**
```bash
# Clone the repository
git clone https://github.com/scottymker/just-for-phishing.git
cd just-for-phishing

# Open in browser (no build required!)
open index.html
# or
python3 -m http.server 8080
# Then visit http://localhost:8080
```

### For Organizations

**Deploy on your network:**

1. **Download** the repository
2. **Host** on your web server or intranet
3. **Customize** scenarios in `scenarios.json` (optional)
4. **Brand** with your logo in `assets/` (optional)
5. **Launch** and track completion

**No backend required. No data sent to third parties.**

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - Zero dependencies
- **Local Storage API** - Progress persistence
- **Web Accessibility** - WCAG 2.1 AA compliant

**Why no frameworks?**
- ⚡ Instant load times
- 🔒 No supply chain attacks
- 📦 No build process
- 🌐 Works offline
- ♿ Better accessibility

---

## 🎨 Customization

### Branding

Replace files in `/assets/` with your organization's branding:
- `logo.png` - Your logo
- `favicon.ico` - Your favicon

### Scenarios

Edit scenario files to add custom content:
```javascript
// phish-or-treat.js
const SCENARIOS = [
  {
    id: 'custom-scenario',
    sender: 'sender@example.com',
    subject: 'Custom scenario',
    preview: 'Your custom content...',
    isPhish: true,
    insights: ['Learning point 1', 'Learning point 2']
  }
];
```

### Styling

Override CSS variables in `styles.css`:
```css
:root {
  --accent: #your-color;
  --bg: #your-background;
}
```

---

## 📊 Analytics & Metrics

### Privacy-First Analytics

All analytics stored in **browser local storage only**:
- No cookies
- No tracking scripts
- No third-party services
- No personal data collection
- No network requests

### What We Track Locally

- Module completion status
- Quiz scores (anonymous)
- Time spent per module
- Achievements unlocked

### Export Your Data

Click "Export Data" to download your training history as JSON.

---

## 🤝 Contributing

We welcome contributions from:
- Cybersecurity professionals
- Educators
- Developers
- UX designers
- Security researchers

**How to contribute:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Contribution ideas:**
- 🌐 Translations
- 📝 New scenarios
- 🎨 UI improvements
- ♿ Accessibility enhancements
- 📚 Documentation
- 🐛 Bug fixes

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file

**This means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed

---

## 🙏 Acknowledgments

**Built with support from:**
- The cybersecurity community
- Open source contributors
- Security awareness educators
- Real-world attack data and threat intelligence

---

## 📞 Support & Contact

- 🐛 **Bug Reports**: [Open an issue](https://github.com/scottymker/just-for-phishing/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/scottymker/just-for-phishing/discussions)
- 📧 **Security Issues**: [security@example.com](mailto:security@example.com)
- 🌟 **Star the repo**: Help others find this tool!

---

## 📈 Roadmap

### Coming Soon
- [ ] Voice phishing (vishing) scenarios
- [ ] QR code safety module
- [ ] Social engineering tactics library
- [ ] Video training content
- [ ] Printable quick reference cards
- [ ] API for LMS integration
- [ ] Admin dashboard for organizations
- [ ] Multi-language support

### Future Enhancements
- [ ] Gamification features
- [ ] Team leaderboards
- [ ] Custom scenario builder
- [ ] Virtual reality training

---

## ⭐ Show Your Support

If this project helps you or your organization:
- ⭐ Star the repository
- 🔗 Share on social media
- 💬 Tell other veterans and organizations
- 🤝 Contribute improvements
- 📣 Write about your experience

---

<div align="center">

**Stay safe online. Train smart. Recognize threats.**

*"Security awareness through hands-on practice"*

[Get Started](https://scottymker.github.io/just-for-phishing/) • [Report Issue](https://github.com/scottymker/just-for-phishing/issues) • [Contribute](CONTRIBUTING.md)

</div>
