# ProoForm - Validate Your Claims with Zero-Knowledge Proofs

![ProoForm Banner](public/proofrom-banner.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.0.1-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue)](https://tailwindcss.com/)
[![Reclaim Protocol](https://img.shields.io/badge/Reclaim-Protocol-purple)](https://www.reclaimprotocol.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0.1-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

ProoForm is a next-generation form builder that integrates zero-knowledge proofs via Reclaim Protocol to verify claims without compromising privacy. Whether you're a recruiter validating technical skills or a community organizer verifying social influence, ProoForm offers a trusted verification layer.

## 🌟 Overview

ProoForm revolutionizes form validation by letting creators request verifiable proofs from users while respecting their privacy. Built with Next.js, TypeScript, and Firebase, it offers a seamless experience for both form creators and submitters.

**"Prove your skills, not just stories."**

## ✨ Core Features

### Form Creation and Management

- **Drag-and-Drop Form Builder**: Intuitive interface for creating custom forms
- **Multiple Field Types**: Support for text, textarea, checkbox, radio, select, and verification fields
- **Real-time Preview**: See how your form looks as you build it
- **Sharable Links**: Generate unique URLs for distributing your forms
- **Submission Management**: View and manage form responses

### Verification Types

#### Developer Verifications

- **GitHub Followers**: Verify minimum follower count
- **GitHub Email**: Validate GitHub associated email
- **GitHub Contributions**: Confirm contribution activity
- **GitHub Repositories**: Verify number of public repositories
- **LeetCode Problems**: Validate problem-solving capabilities
- **LeetCode Streak**: Verify consistency in coding practice
- **CodeChef Ranking**: Confirm competitive programming skills

#### Social Media Verifications

- **Twitter Followers**: Verify minimum follower count
- **Instagram Story Views**: Validate content reach
- **Instagram Followers**: Confirm social media influence
- **LinkedIn Impressions**: Verify professional network engagement
- **YouTube Views**: Validate content popularity

### Privacy-First Verification

- **Zero-Knowledge Proofs**: Verify claims without revealing sensitive information
- **QR-Code Scanning**: Simple verification flow with mobile device
- **Verification Status Tracking**: Clear indicators of verification progress
- **Criteria-Based Validation**: Set minimum thresholds for verification success

## 🛠️ Technical Architecture

### Frontend Framework

- **Next.js 15.0.1**: Server-side rendering and optimized performance
- **React 18.3.1**: Latest React features for optimal UI/UX
- **TypeScript**: Type-safe code development
- **Framer Motion**: Smooth animations and transitions

### UI Components

- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Accessible component system built on Radix UI
- **Lucide React**: Modern icon library for visual elements
- **Wavy Background**: Custom animated backgrounds for visual appeal

### State Management

- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation library

### Data Storage

- **Firebase Firestore**: Cloud-hosted NoSQL database
- **Document-based Storage**: Efficient storage of forms and submissions

### Authentication & Verification

- **Reclaim Protocol**: Zero-knowledge proof verification system
- **QR Code React**: QR code generation for verification flow

## 📁 Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── form/                 # Form viewing pages
│   │   └── [formId]/         # Dynamic form page
│   ├── formCreate/           # Form creation page
│   ├── submissions/          # Submission viewing pages
│   │   └── [formId]/         # Dynamic submissions page
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home/landing page
│
├── components/               # React components
│   ├── ui/                   # UI components (shadcn)
│   ├── FormField.tsx         # Form field configuration component
│   ├── FormPreview.tsx       # Form preview component
│   ├── FormSubmission.tsx    # Form submission component
│   └── theme-provider.tsx    # Theme context provider
│
├── hooks/                    # Custom React hooks
│   └── use-toast.ts          # Toast notification hook
│
├── lib/                      # Utility libraries
│   ├── firebase.ts           # Firebase configuration
│   └── utils.ts              # Utility functions
```

## 🔄 Data Models

### Form Element Model

```typescript
interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'developer' | 'social';
  label: string;
  options?: string[];
  required?: boolean;
  verificationCriteria?: string;
  developerVerificationType?: 'github_followers' | 'github_email' | 'github_contributions' | 
                              'github_repos' | 'leetcode_problems' | 'leetcode_streak' | 
                              'codechef_ranking';
  socialVerificationType?: 'twitter_followers' | 'instagram_story_views' | 
                           'instagram_followers' | 'linkedin_impressions' | 
                           'youtube_views';
}
```

### Proof Details Model

```typescript
interface ProofDetails {
  value: string | number;
  isVerified: boolean;
  proofObject?: any;
  status: 'idle' | 'verifying' | 'verified' | 'failed';
}
```

### Form Data Model (Firestore)

```typescript
// forms collection
{
  id: string; // Document ID (UUID)
  elements: FormElement[]; // Form elements
  createdAt: string; // ISO timestamp
}

// submissions collection
{
  id: string; // Document ID (UUID)
  formId: string; // Reference to form
  formData: Record<string, any>; // User input data
  proofs: Record<string, {
    value: string | number;
    isVerified: boolean;
    status: string;
    proofObject: any;
    timestamp: string;
  }>;
  submittedAt: string; // ISO timestamp
}
```

## 📊 Verification Flow

ProoForm implements an elegant verification process:

1. **Form Creation**:
   - Creator adds verification fields
   - Sets verification criteria (e.g., minimum follower count)

2. **User Submission**:
   - User encounters verification field
   - Clicks "Prove" button for the specific claim

3. **Verification Process**:
   - QR code is generated with verification link
   - User scans code with mobile device
   - Reclaim Protocol handles authentication with service (GitHub, Twitter, etc.)
   - Data is verified against criteria
   - Result is returned to form with verification status

4. **Submission Completion**:
   - User completes all required fields and verifications
   - Form is submitted with proof objects attached
   - Creator can view submissions with verification evidence

## 🎨 UI/UX Features

- **Responsive Design**: Fully responsive interface that works on all device sizes
- **Dark Mode**: Sleek dark interface with blue accents
- **Animated Elements**: Framer Motion powered animations for engaging interactions
- **Wavy Background**: Dynamic animated background on the landing page
- **Toast Notifications**: Clear feedback for user actions
- **Drag and Drop**: Intuitive form building experience
- **Verification Badges**: Visual indicators of verification status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Firebase account
- Reclaim Protocol credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ProoForm.git

# Navigate to the project directory
cd ProoForm

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Reclaim Protocol credentials

# Start the development server
npm run dev
# or
yarn dev
```

### Environment Variables

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Reclaim Protocol Configuration
NEXT_PUBLIC_RECLAIM_APP_ID=
NEXT_PUBLIC_RECLAIM_APP_SECRET=

# Provider IDs for Developer Verification
NEXT_PUBLIC_GITHUB_PROVIDER_FOLLOWERS=
NEXT_PUBLIC_GITHUB_PROVIDER_EMAIL=
NEXT_PUBLIC_GITHUB_PROVIDER_CONTRIBUTIONS=
NEXT_PUBLIC_GITHUB_PROVIDER_REPOS=
NEXT_PUBLIC_LEETCODE_PROVIDER_PROBLEMS=
NEXT_PUBLIC_LEETCODE_PROVIDER_STREAK=
NEXT_PUBLIC_CODECHEF_PROVIDER_RANKING=

# Provider IDs for Social Media Verification
NEXT_PUBLIC_TWITTER_FOLLOWERS_COUNT=
NEXT_PUBLIC_INSTAGRAM_STORY_VIEW=
NEXT_PUBLIC_INSTAGRAM_FOLLOWERS_COUNT=
NEXT_PUBLIC_LINKEDIN_IMPRESSIONS=
NEXT_PUBLIC_YOUTUBE_VIEWS=
```

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## 🙌 Use Cases

- **Technical Hiring**: Verify programming skills and GitHub contributions
- **Freelancer Platforms**: Validate freelancer claims for better matching
- **Community Access**: Grant access based on verified social influence
- **Scholarship Applications**: Verify academic or competitive programming achievements
- **Event Registration**: Ensure participants meet specific criteria

## 💡 Key Benefits

- **Trust**: Add a verification layer to claims without manual checking
- **Privacy**: Verify without exposing sensitive personal information
- **Flexibility**: Customize verification criteria for your specific needs
- **Security**: Zero-knowledge proofs ensure data integrity
- **User Experience**: Simple verification flow with clear feedback

## 🔄 Future Enhancements

- **Additional Verification Types**: Academic credentials, professional certifications
- **Advanced Form Analytics**: Insights into completion rates and verification success
- **Custom Styling Options**: More personalization for form creators
- **Conditional Logic**: Show/hide fields based on verification results
- **Webhook Integrations**: Connect with external systems on submission

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Reclaim Protocol](https://www.reclaimprotocol.org/) for the zero-knowledge proof technology
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting and deployment infrastructure

---

## 📞 Contact

For questions, feedback, or collaboration opportunities, please reach out:

- GitHub: [AazimAnish](https://github.com/AazimAnish)
- Project Link: [https://github.com/AazimAnish/ProoForm](https://github.com/AazimAnish/ProoForm)

---

Built with ❤️ by [Aazim Anish](https://github.com/AazimAnish)
