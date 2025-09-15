import { GaWord, DictionaryStats } from '@/lib/types/dictionary';

// Sample dictionary data for development (first 100 words from CSV)
export const sampleDictionaryData: GaWord[] = [
  {
    id: "word_1",
    word: "aabateŋ",
    phoneme: "à à b à t é ŋ̀",
    meaning: "pig-in-the-middle game",
    dateAdded: new Date('2024-01-15'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_2",
    word: "aabia",
    phoneme: "à à b í á",
    meaning: "canna lily",
    dateAdded: new Date('2024-01-14'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_3",
    word: "ahabia",
    phoneme: "à h à b í á",
    meaning: "canna lily",
    dateAdded: new Date('2024-01-13'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_4",
    word: "aadɔŋ",
    phoneme: "á à d ɔ́ ŋ́",
    meaning: "plum",
    dateAdded: new Date('2024-01-12'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_5",
    word: "aaglɛmi",
    phoneme: "á à g l̀ ɛ̀ m í",
    meaning: "a wild fruit",
    dateAdded: new Date('2024-01-11'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_6",
    word: "aaglɛmi",
    phoneme: "á à g l̀ ɛ̀ m í",
    meaning: "a brown seed",
    dateAdded: new Date('2024-01-10'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_7",
    word: "aaglɛmi",
    phoneme: "á à g l̀ ɛ̀ m í",
    meaning: "used as a game piece or counter",
    dateAdded: new Date('2024-01-09'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_8",
    word: "aahi",
    phoneme: "à à h ḭ",
    meaning: "taboo",
    dateAdded: new Date('2024-01-08'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_9",
    word: "aahu",
    phoneme: "à à h ṵ́",
    meaning: "continually",
    dateAdded: new Date('2024-01-07'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_10",
    word: "aakaa",
    phoneme: "à à k à á",
    meaning: "small basket",
    dateAdded: new Date('2024-01-06'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  // Add some incomplete entries for testing
  {
    id: "word_11",
    word: "akpɛ",
    phoneme: "",
    meaning: "thank you",
    dateAdded: new Date('2024-01-05'),
    isVerified: false,
    completionStatus: 'incomplete',
    missingFields: ['phoneme']
  },
  {
    id: "word_12",
    word: "mli",
    phoneme: "m l í",
    meaning: "",
    dateAdded: new Date('2024-01-04'),
    isVerified: false,
    completionStatus: 'incomplete',
    missingFields: ['meaning']
  },
  {
    id: "word_13",
    word: "baabi",
    phoneme: "b à á b í",
    meaning: "somewhere; a place",
    dateAdded: new Date('2024-01-03'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_14",
    word: "dede",
    phoneme: "d é d é",
    meaning: "red; the color red",
    dateAdded: new Date('2024-01-02'),
    isVerified: true,
    completionStatus: 'complete',
    missingFields: []
  },
  {
    id: "word_15",
    word: "efie",
    phoneme: "",
    meaning: "house; home; dwelling place",
    dateAdded: new Date('2024-01-01'),
    isVerified: false,
    completionStatus: 'incomplete',
    missingFields: ['phoneme']
  }
];

// Sample dictionary statistics
export const sampleDictionaryStats: DictionaryStats = {
  totalWords: 9046,
  verifiedWords: 8921,
  incompleteEntries: 125,
  pendingReview: 43,
  activeContributors: 127,
  recentAdditions: 27
};

// Mock data for recent additions
export const recentAdditions = [
  {
    word: "gbɛmɔ",
    meaning: "child",
    timeAgo: "2 hours ago"
  },
  {
    word: "nɔŋmɛi",
    meaning: "knowledge, wisdom",
    timeAgo: "5 hours ago"
  },
  {
    word: "shibi",
    meaning: "peace",
    timeAgo: "1 day ago"
  }
];

// Mock data for pending contributions
export const pendingContributions = [
  {
    word: "mli kɛ",
    type: "new entry",
    contributor: "Anonymous",
    timeAgo: "30 min ago"
  },
  {
    word: "bɔɔlɔ",
    type: "phoneme correction",
    contributor: "Expert User",
    timeAgo: "1 hour ago"
  },
  {
    word: "tsuru",
    type: "new entry",
    contributor: "Community Member",
    timeAgo: "3 hours ago"
  }
];