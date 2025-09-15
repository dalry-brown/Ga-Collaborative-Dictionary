import { GaWord } from '@/lib/types/dictionary';

// This will be our processed dictionary data cache
const dictionaryDataCache: GaWord[] = [];

/**
 * Process CSV data into structured GaWord objects
 */
export function processCsvData(csvContent: string): GaWord[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const words: GaWord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV line (handle quotes properly)
    const values = parseCsvLine(line);
    
    if (values.length >= 3) {
      const word: GaWord = {
        id: `word_${i}`,
        word: values[0]?.trim() || '',
        phoneme: values[1]?.trim() || '',
        meaning: values[2]?.trim() || '',
        dateAdded: new Date(),
        isVerified: true, // Assume CSV data is verified
        completionStatus: getCompletionStatus(values[0], values[1], values[2]),
        missingFields: getMissingFields(values[0], values[1], values[2])
      };
      
      words.push(word);
    }
  }
  
  return words;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.replace(/"/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.replace(/"/g, ''));
  return values;
}

/**
 * Determine completion status based on current CSV fields (word, phoneme, meaning)
 * In the future, this will include partOfSpeech and usageExample
 */
function getCompletionStatus(word: string, phoneme: string, meaning: string): 'complete' | 'incomplete' {
  const hasWord = word && word.trim().length > 0;
  const hasPhoneme = phoneme && phoneme.trim().length > 0;
  const hasMeaning = meaning && meaning.trim().length > 0;
  
  // Currently complete = all three basic fields present
  // Future: will also check partOfSpeech and usageExample
  return (hasWord && hasPhoneme && hasMeaning) ? 'complete' : 'incomplete';
}

/**
 * Get list of missing fields for incomplete entries
 * Currently checking: word, phoneme, meaning
 * Future: will also check partOfSpeech, usageExample
 */
function getMissingFields(word: string, phoneme: string, meaning: string): string[] {
  const missing: string[] = [];
  
  if (!word || word.trim().length === 0) missing.push('word');
  if (!phoneme || phoneme.trim().length === 0) missing.push('phoneme');
  if (!meaning || meaning.trim().length === 0) missing.push('meaning');
  
  // Future additions:
  // if (!partOfSpeech) missing.push('partOfSpeech');
  // if (!usageExample) missing.push('usageExample');
  
  return missing;
}

/**
 * Load dictionary data (in a real app, this would be from a database)
 */
export async function loadDictionaryData(): Promise<GaWord[]> {
  if (dictionaryDataCache.length > 0) {
    return dictionaryDataCache;
  }
  
  try {
    // In development, we'll simulate loading from the CSV
    // In production, this would be a database query
    return [];
  } catch (error) {
    console.error('Error loading dictionary data:', error);
    return [];
  }
}

/**
 * Get dictionary statistics
 */
export function getDictionaryStats(words: GaWord[]) {
  const totalWords = words.length;
  const verifiedWords = words.filter(w => w.isVerified).length;
  const incompleteEntries = words.filter(w => w.completionStatus === 'incomplete').length;
  const recentAdditions = words.filter(w => {
    const daysSinceAdded = w.dateAdded ? 
      Math.floor((Date.now() - w.dateAdded.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    return daysSinceAdded <= 7;
  }).length;
  
  return {
    totalWords,
    verifiedWords,
    incompleteEntries,
    pendingReview: 0, // This would come from pending contributions
    activeContributors: 0, // This would come from user data
    recentAdditions
  };
}

/**
 * Search and filter words
 */
export function searchWords(
  words: GaWord[], 
  query: string = '', 
  filters: {
    sortBy?: string;
    filterBy?: string;
    startingWith?: string;
  } = {}
): GaWord[] {
  let results = [...words];
  
  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    results = results.filter(word => 
      word.word.toLowerCase().includes(searchTerm) ||
      word.meaning.toLowerCase().includes(searchTerm) ||
      word.phoneme.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by completion status
  if (filters.filterBy) {
    switch (filters.filterBy) {
      case 'complete':
        results = results.filter(w => w.completionStatus === 'complete');
        break;
      case 'incomplete':
        results = results.filter(w => w.completionStatus === 'incomplete');
        break;
      case 'missing-phoneme':
        results = results.filter(w => w.missingFields?.includes('phoneme'));
        break;
      case 'missing-usage':
        // Future: when usageExample is added to CSV
        results = results.filter(w => !w.usageExample);
        break;
    }
  }
  
  // Filter by starting letter
  if (filters.startingWith) {
    results = results.filter(w => 
      w.word.toLowerCase().startsWith(filters.startingWith!.toLowerCase())
    );
  }
  
  // Sort results
  switch (filters.sortBy) {
    case 'alphabetical':
      results.sort((a, b) => a.word.localeCompare(b.word));
      break;
    case 'newest':
      results.sort((a, b) => (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0));
      break;
    case 'oldest':
      results.sort((a, b) => (a.dateAdded?.getTime() || 0) - (b.dateAdded?.getTime() || 0));
      break;
    case 'most-complete':
      results.sort((a, b) => {
        const aScore = a.completionStatus === 'complete' ? 1 : 0;
        const bScore = b.completionStatus === 'complete' ? 1 : 0;
        return bScore - aScore;
      });
      break;
    default:
      results.sort((a, b) => a.word.localeCompare(b.word));
  }
  
  return results;
}

/**
 * Get available letters (for alphabet navigation)
 */
export function getAvailableLetters(words: GaWord[]): string[] {
  const letters = new Set<string>();
  
  words.forEach(word => {
    if (word.word && word.word.length > 0) {
      letters.add(word.word[0].toUpperCase());
    }
  });
  
  return Array.from(letters).sort();
}