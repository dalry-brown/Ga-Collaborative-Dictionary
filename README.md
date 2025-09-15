# Ga Language Dictionary

A collaborative digital platform for preserving and expanding the Ga language of Ghana. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Comprehensive Dictionary**: Search through 9,046+ Ga words with meanings and phonemes
- **Advanced Search & Filtering**: Find words by name, meaning, phoneme, or completion status
- **Community Contributions**: Add new words, improve existing entries, and flag issues
- **Expert Verification**: All contributions are reviewed by linguistic experts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, accessible interface built with Tailwind CSS
- **Real-time Stats**: Live dictionary statistics and contribution tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ga-dictionary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables as needed.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ga-dictionary/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── about/              # About page
│   │   ├── contribute/         # Contribution page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # 404 page
│   │   └── page.tsx            # Homepage (Browse)
│   ├── components/             # React components
│   │   ├── dictionary/         # Dictionary-specific components
│   │   │   ├── filter-controls.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── stats-dashboard.tsx
│   │   │   └── word-card.tsx
│   │   ├── layout/             # Layout components
│   │   │   └── header.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── loading.tsx
│   └── lib/                    # Utilities and types
│       ├── data/               # Data processing and samples
│       │   ├── ga-words.ts
│       │   └── sample-data.ts
│       ├── types/              # TypeScript definitions
│       │   └── dictionary.ts
│       └── utils/              # Utility functions
│           └── cn.ts
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 📊 Data Structure

The dictionary uses the following main data structure:

```typescript
interface GaWord {
  id?: string;
  word: string;           // Ga word
  phoneme: string;        // Pronunciation with tone marks
  meaning: string;        // English meaning
  // Future additions:
  partOfSpeech?: string;  // Grammar classification
  usageExample?: string;  // Example sentence in Ga
  usageTranslation?: string; // English translation of example
  // Metadata:
  dateAdded?: Date;
  isVerified?: boolean;
  completionStatus: 'complete' | 'incomplete';
  missingFields?: string[];
}
```

## 🎨 UI Components

The project uses a custom component library built on:
- **Tailwind CSS** for styling
- **Radix UI** for accessible primitives
- **Lucide React** for icons
- **Class Variance Authority** for component variants

## 🌍 Contributing

We welcome contributions from the community! Here's how you can help:

### Types of Contributions

1. **Add New Words** - Contribute Ga words not yet in the dictionary
2. **Improve Entries** - Add missing phonemes, meanings, or examples
3. **Report Issues** - Flag incorrect or inappropriate content
4. **Code Contributions** - Help improve the platform itself

### Contribution Process

1. All content contributions go through expert review
2. Technical contributions should follow our coding standards
3. Create pull requests for code changes
4. Report bugs and feature requests via issues

### Guidelines

- **Accuracy**: Ensure all linguistic information is correct
- **Cultural Sensitivity**: Respect Ga culture and traditions
- **Quality**: Provide clear, helpful examples and definitions
- **Collaboration**: Work respectfully with other contributors

## 🔮 Future Features

- **Audio Pronunciations** - Native speaker recordings
- **Mobile Apps** - iOS and Android applications
- **Advanced Learning Tools** - Quizzes, flashcards, games
- **API Access** - Developer API for research and education
- **Multi-language Support** - Expand to other Ghanaian languages
- **G2P Integration** - Automatic phoneme generation
- **User Profiles** - Track contributions and achievements

## 📚 Data Sources

- Base dataset: 9,046 Ga words with phonemes and meanings
- Community contributions and improvements
- Expert linguistic verification
- Cultural context from native speakers

## 🤝 Community

- **Contributors**: 156+ active community members
- **Experts**: 23+ linguistic experts and native speakers
- **Institutions**: 12+ partner educational institutions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ga language speakers and cultural experts
- University of Ghana linguistics department
- Contributors and community members
- Open source community and tools

## 📞 Support

- **Email**: support@ga-dictionary.org
- **Community Forum**: [Link to forum]
- **GitHub Issues**: For technical problems
- **Documentation**: [Link to docs]

---

**Built with ❤️ for language preservation and cultural heritage.**