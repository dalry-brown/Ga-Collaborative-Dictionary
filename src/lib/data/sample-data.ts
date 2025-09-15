// import { GaWord, DictionaryStats } from '@/lib/types/dictionary';

// // Sample dictionary data for development (first 100 words from CSV)
// export const sampleDictionaryData: GaWord[] = [
//   {
//     id: "word_1",
//     word: "aabateŋ",
//     phoneme: "à à b à t é ŋ̀",
//     meaning: "pig-in-the-middle game",
//     createdAt: new Date('2024-01-15'),
//     updatedAt: new Date('2024-01-15'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_2",
//     word: "aabia",
//     phoneme: "à à b í á",
//     meaning: "canna lily",
//     createdAt: new Date('2024-01-14'),
//     updatedAt: new Date('2024-01-14'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_3",
//     word: "ahabia",
//     phoneme: "à h à b í á",
//     meaning: "canna lily",
//     createdAt: new Date('2024-01-13'),
//     updatedAt: new Date('2024-01-13'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_4",
//     word: "aadɔŋ",
//     phoneme: "á à d ɔ́ ŋ́",
//     meaning: "plum",
//     createdAt: new Date('2024-01-12'),
//     updatedAt: new Date('2024-01-12'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_5",
//     word: "aaglɛmi",
//     phoneme: "á à g l̀ ɛ̀ m í",
//     meaning: "a wild fruit",
//     createdAt: new Date('2024-01-11'),
//     updatedAt: new Date('2024-01-11'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_6",
//     word: "aaglɛmi",
//     phoneme: "á à g l̀ ɛ̀ m í",
//     meaning: "a brown seed",
//     createdAt: new Date('2024-01-10'),
//     updatedAt: new Date('2024-01-10'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_7",
//     word: "aaglɛmi",
//     phoneme: "á à g l̀ ɛ̀ m í",
//     meaning: "used as a game piece or counter",
//     createdAt: new Date('2024-01-09'),
//     updatedAt: new Date('2024-01-09'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_8",
//     word: "aahi",
//     phoneme: "à à h ḭ",
//     meaning: "taboo",
//     createdAt: new Date('2024-01-08'),
//     updatedAt: new Date('2024-01-08'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_9",
//     word: "aahu",
//     phoneme: "à à h ṵ́",
//     meaning: "continually",
//     createdAt: new Date('2024-01-07'),
//     updatedAt: new Date('2024-01-07'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_10",
//     word: "aakaa",
//     phoneme: "à à k à á",
//     meaning: "small basket",
//     createdAt: new Date('2024-01-06'),
//     updatedAt: new Date('2024-01-06'),
//     completionStatus: 'COMPLETE'
//   },
//   // Add some incomplete entries for testing
//   {
//     id: "word_11",
//     word: "akpɛ",
//     phoneme: "",
//     meaning: "thank you",
//     createdAt: new Date('2024-01-05'),
//     updatedAt: new Date('2024-01-05'),
//     completionStatus: 'INCOMPLETE'
//   },
//   {
//     id: "word_12",
//     word: "mli",
//     phoneme: "m l í",
//     meaning: "",
//     createdAt: new Date('2024-01-04'),
//     updatedAt: new Date('2024-01-04'),
//     completionStatus: 'INCOMPLETE'
//   },
//   {
//     id: "word_13",
//     word: "baabi",
//     phoneme: "b à á b í",
//     meaning: "somewhere; a place",
//     createdAt: new Date('2024-01-03'),
//     updatedAt: new Date('2024-01-03'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_14",
//     word: "dede",
//     phoneme: "d é d é",
//     meaning: "red; the color red",
//     createdAt: new Date('2024-01-02'),
//     updatedAt: new Date('2024-01-02'),
//     completionStatus: 'COMPLETE'
//   },
//   {
//     id: "word_15",
//     word: "efie",
//     phoneme: "",
//     meaning: "house; home; dwelling place",
//     createdAt: new Date('2024-01-01'),
//     updatedAt: new Date('2024-01-01'),
//     completionStatus: 'INCOMPLETE'
//   }
// ];

// // Sample dictionary statistics
// export const sampleDictionaryStats: DictionaryStats = {
//   totalWords: 9046,
//   verifiedWords: 8921,
//   incompleteEntries: 125,
//   pendingReview: 43,
//   activeContributors: 127,
//   recentAdditions: 27
// };

// // Mock data for recent additions
// export const recentAdditions = [
//   {
//     word: "gbɛmɔ",
//     meaning: "child",
//     timeAgo: "2 hours ago"
//   },
//   {
//     word: "nɔŋmɛi",
//     meaning: "knowledge, wisdom",
//     timeAgo: "5 hours ago"
//   },
//   {
//     word: "shibi",
//     meaning: "peace",
//     timeAgo: "1 day ago"
//   }
// ];

// // Mock data for pending contributions
// export const pendingContributions = [
//   {
//     word: "mli kɛ",
//     type: "new entry",
//     contributor: "Anonymous",
//     timeAgo: "30 min ago"
//   },
//   {
//     word: "bɔɔlɔ",
//     type: "phoneme correction",
//     contributor: "Expert User",
//     timeAgo: "1 hour ago"
//   },
//   {
//     word: "tsuru",
//     type: "new entry",
//     contributor: "Community Member",
//     timeAgo: "3 hours ago"
//   }
// ];