import { AptitudeQuestion } from '../types';

export const aptitudeData: AptitudeQuestion[] = [
  // --- QUANTITATIVE APTITUDE ---
  {
    id: 'apt-1',
    category: 'Quantitative',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['89 seconds', '100 seconds', '65 seconds', '75 seconds'],
    correctAnswer: '89 seconds',
    solution: 'Speed of train = Distance / Time = 240 m / 24 s = 10 m/s.\nTotal distance to cross the platform = Length of train + Length of platform = 240 m + 650 m = 890 m.\nTime required = Total distance / Speed = 890 / 10 = 89 seconds.',
    shortcutTip: 'Time to cross pole gives speed directly: 240/24 = 10 m/s. Then just divide (240 + 650) / 10.'
  },
  {
    id: 'apt-2',
    category: 'Quantitative',
    question: 'A and B together can do a piece of work in 12 days, while B alone can finish it in 30 days. In how many days can A alone finish the same work?',
    options: ['15 days', '18 days', '20 days', '24 days'],
    correctAnswer: '20 days',
    solution: 'Total work = LCM(12, 30) = 60 units.\nEfficiency of (A + B) = 60 / 12 = 5 units/day.\nEfficiency of B = 60 / 30 = 2 units/day.\nEfficiency of A = (A + B) - B = 5 - 2 = 3 units/day.\nTime taken by A alone = Total work / Efficiency of A = 60 / 3 = 20 days.',
    shortcutTip: 'Formula shortcut: (X * Y) / (Y - X) = (12 * 30) / (30 - 12) = 360 / 18 = 20 days.'
  },
  {
    id: 'apt-3',
    category: 'Quantitative',
    question: 'If the price of petrol increases by 25%, by how much percentage must a motorist reduce his consumption so that expenditure remains unchanged?',
    options: ['20%', '25%', '16.66%', '30%'],
    correctAnswer: '20%',
    solution: 'Let initial price = 100 and consumption = 100. Initial expenditure = 10,000.\nNew price = 125. New expenditure must remain 10,000.\nNew consumption = 10,000 / 125 = 80.\nReduction in consumption = 100 - 80 = 20%.',
    shortcutTip: 'Percentage reduction formula: [R / (100 + R)] * 100 = [25 / 125] * 100 = 1/5 * 100 = 20%.'
  },
  {
    id: 'apt-4',
    category: 'Quantitative',
    question: 'A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times of itself at the same rate of interest?',
    options: ['16 years', '24 years', '32 years', '20 years'],
    correctAnswer: '24 years',
    solution: 'Let Principal = P. In 8 years, Amount = 2P, so Simple Interest SI = 2P - P = P.\nSI for 8 years = P. That means P interest is earned every 8 years.\nTo become 4 times itself, Amount = 4P, which means required SI = 4P - P = 3P.\nTime required = 3 * 8 years = 24 years.',
    shortcutTip: 'Formula: (T2 / T1) = (N2 - 1) / (N1 - 1) => T2 / 8 = (4 - 1) / (2 - 1) = 3/1 => T2 = 24.'
  },
  {
    id: 'apt-5',
    category: 'Quantitative',
    question: 'A shopkeeper marks an article at 40% above the cost price and allows a discount of 25% on the marked price. What is his net profit or loss percentage?',
    options: ['5% Profit', '5% Loss', '10% Profit', '15% Profit'],
    correctAnswer: '5% Profit',
    solution: 'Let Cost Price (CP) = 100.\nMarked Price (MP) = 100 + 40% of 100 = 140.\nDiscount = 25% of 140 = 35.\nSelling Price (SP) = 140 - 35 = 105.\nProfit = SP - CP = 105 - 100 = 5% Profit.',
    shortcutTip: 'Net change = a + b + (ab/100) = +40 - 25 - (40*25/100) = 15 - 10 = +5% profit.'
  },
  {
    id: 'apt-6',
    category: 'Quantitative',
    question: 'The average age of a class of 30 students is 14 years. If the age of the teacher is included, the average age increases by 1 year. What is the age of the teacher?',
    options: ['45 years', '40 years', '35 years', '44 years'],
    correctAnswer: '45 years',
    solution: 'Sum of ages of 30 students = 30 * 14 = 420.\nWhen teacher is included, total members = 31, and new average = 15.\nNew total sum = 31 * 15 = 465.\nAge of teacher = 465 - 420 = 45 years.',
    shortcutTip: 'Shortcut: New Average + (Previous count * Increase) = 15 + (30 * 1) = 45 years.'
  },
  {
    id: 'apt-7',
    category: 'Quantitative',
    question: 'Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, in how many minutes will the tank be full?',
    options: ['12 minutes', '10 minutes', '15 minutes', '25 minutes'],
    correctAnswer: '12 minutes',
    solution: 'Total tank capacity = LCM(20, 30) = 60 units.\nPipe A efficiency = 60 / 20 = 3 units/min.\nPipe B efficiency = 60 / 30 = 2 units/min.\nCombined efficiency = 3 + 2 = 5 units/min.\nTime = 60 / 5 = 12 minutes.',
    shortcutTip: 'Formula: (A * B) / (A + B) = (20 * 30) / (20 + 30) = 600 / 50 = 12 minutes.'
  },
  {
    id: 'apt-8',
    category: 'Quantitative',
    question: 'In how many different ways can the letters of the word "LEADING" be arranged such that the vowels always come together?',
    options: ['720', '360', '1440', '5040'],
    correctAnswer: '720',
    solution: 'Word: "LEADING" (7 letters).\nVowels: E, A, I (3 vowels). Consonants: L, D, N, G (4 consonants).\nTreat the 3 vowels as one single entity/block: {E, A, I}.\nNow we have 4 consonants + 1 vowel block = 5 entities, which can be arranged in 5! ways.\nThe 3 vowels inside the block can be arranged among themselves in 3! ways.\nTotal ways = 5! * 3! = 120 * 6 = 720 ways.',
    shortcutTip: 'Always tie grouped items into 1 bundle: (remaining + 1)! * (internal group)!'
  },

  // --- LOGICAL REASONING ---
  {
    id: 'apt-9',
    category: 'Logical Reasoning',
    question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['127', '125', '128', '95'],
    correctAnswer: '127',
    solution: 'Pattern is (x * 2) + 1:\n3 * 2 + 1 = 7\n7 * 2 + 1 = 15\n15 * 2 + 1 = 31\n31 * 2 + 1 = 63\n63 * 2 + 1 = 127.\nAlternatively, differences are powers of 2: +4, +8, +16, +32, +64 (63 + 64 = 127).',
    shortcutTip: 'Notice each number is 2^(n+1) - 1. For n=7, 2^7 - 1 = 128 - 1 = 127.'
  },
  {
    id: 'apt-10',
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: ['Brother', 'Uncle', 'Father', 'Grandfather'],
    correctAnswer: 'Father',
    solution: '"My mother\'s only son" -> Since Suresh is male speaking, his mother\'s only son is Suresh himself.\n"He is the son of Suresh" -> The boy in the photograph is Suresh\'s son.\nTherefore, Suresh is the father of the boy.',
    shortcutTip: 'Break backward: Mother -> Only son = Self -> Son of self = Father relation.'
  },
  {
    id: 'apt-11',
    category: 'Logical Reasoning',
    question: 'If \'WATER\' is coded as \'YCVGT\', how is \'FIRE\' coded in the same language?',
    options: ['HKTG', 'GKTH', 'HJTF', 'HKUG'],
    correctAnswer: 'HKTG',
    solution: 'Each letter is shifted forward by +2 positions in the alphabet:\nW (+2) -> Y\nA (+2) -> C\nT (+2) -> V\nE (+2) -> G\nR (+2) -> T.\nApplying same +2 logic to FIRE:\nF (+2) -> H\nI (+2) -> K\nR (+2) -> T\nE (+2) -> G.\nResult = HKTG.',
    shortcutTip: 'Check the first and last letters: F+2 = H, E+2 = G. Matches option HKTG.'
  },
  {
    id: 'apt-12',
    category: 'Logical Reasoning',
    question: 'A person walks 5 km North, turns right and walks 3 km, turns right again and walks 5 km. In which direction and how far is he from his starting point?',
    options: ['3 km East', '3 km West', '5 km South', '8 km East'],
    correctAnswer: '3 km East',
    solution: 'Starting at (0, 0):\n1) 5 km North -> (0, 5)\n2) Right turn (East) 3 km -> (3, 5)\n3) Right turn (South) 5 km -> (3, 0).\nFinal position is (3, 0), which is 3 km East of starting point (0, 0).',
    shortcutTip: 'North 5 km cancels with South 5 km. Only East 3 km remains.'
  },
  {
    id: 'apt-13',
    category: 'Logical Reasoning',
    question: 'Statements: (1) All mangoes are golden. (2) No golden things are cheap. Conclusions: (I) All mangoes are cheap. (II) Golden mangoes are not cheap.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both follow', 'Neither follows'],
    correctAnswer: 'Only conclusion II follows',
    solution: 'Since all mangoes are golden, and no golden things are cheap, it logically follows that no mangoes can be cheap (invalidating I). Since golden things are not cheap, golden mangoes are indeed not cheap (validating II).',
    shortcutTip: 'Syllogism: A -> B and B != C implies A != C.'
  },
  {
    id: 'apt-14',
    category: 'Logical Reasoning',
    question: 'If today is Wednesday, what day of the week will it be after 94 days?',
    options: ['Friday', 'Thursday', 'Saturday', 'Sunday'],
    correctAnswer: 'Saturday',
    solution: 'Number of odd days = 94 mod 7 = 3 (since 94 = 13 * 7 + 3).\nWednesday + 3 days = Thursday (1), Friday (2), Saturday (3).\nTherefore, it will be Saturday.',
    shortcutTip: 'Always divide days by 7 and count forward by the remainder.'
  },

  // --- VERBAL ABILITY ---
  {
    id: 'apt-15',
    category: 'Verbal Ability',
    question: 'Select the word that is most nearly OPPOSITE in meaning (Antonym) to "METICULOUS":',
    options: ['Careless', 'Painstaking', 'Detailed', 'Diligent'],
    correctAnswer: 'Careless',
    solution: '"Meticulous" means showing great attention to detail, very careful and precise. The exact antonym is "Careless". Painstaking and diligent are synonyms.',
    shortcutTip: 'Meticulous = extremely careful -> opposite is careless.'
  },
  {
    id: 'apt-16',
    category: 'Verbal Ability',
    question: 'Identify the error in the sentence: "Neither the supervisor nor the engineers (A) / was present (B) / at the meeting yesterday (C) / No error (D)"',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'B',
    solution: 'In "neither... nor" constructions, the verb agrees with the subject closest to it. Here, "the engineers" is plural and adjacent to the verb, so the plural verb "were" should be used instead of "was". Correct sentence: "... nor the engineers were present..."',
    shortcutTip: 'Subject-verb agreement rule: When subjects are joined by "neither... nor", match the nearest subject.'
  },
  {
    id: 'apt-17',
    category: 'Verbal Ability',
    question: 'Fill in the blank with the correct preposition: "The committee agreed ______ the proposal after a lengthy debate."',
    options: ['to', 'with', 'on', 'about'],
    correctAnswer: 'to',
    solution: 'We "agree to" a proposal, plan, or suggestion. We "agree with" a person or opinion. Therefore, "agreed to the proposal" is grammatically correct.',
    shortcutTip: 'Agree WITH a person; agree TO an object/proposal; agree ON a topic.'
  },
  {
    id: 'apt-18',
    category: 'Verbal Ability',
    question: 'Select the correct meaning of the idiom: "To burn the midnight oil"',
    options: [
      'To waste electricity or fuel unnecessarily',
      'To work or study late into the night',
      'To create trouble during the night',
      'To finish work very quickly'
    ],
    correctAnswer: 'To work or study late into the night',
    solution: 'The idiom "burn the midnight oil" originated from historical times when people used oil lamps to read or work late into the night.',
    shortcutTip: 'Commonly asked in TCS NQT and Cognizant verbal assessments.'
  },

  // --- BASIC CODING & PSEUDOCODE ---
  {
    id: 'apt-19',
    category: 'Basic Coding & Pseudocode',
    question: 'What is the output of the following pseudocode?\n\nInteger a = 5, b = 10, c\nc = (a & b) + (a | b) + (a ^ b)\nPrint c',
    options: ['30', '25', '20', '15'],
    correctAnswer: '30',
    solution: 'Binary of a (5) = 0101\nBinary of b (10) = 1010\n1) a & b = 0101 & 1010 = 0000 = 0\n2) a | b = 0101 | 1010 = 1111 = 15\n3) a ^ b = 0101 ^ 1010 = 1111 = 15\nTotal = (a & b) + (a | b) + (a ^ b) = 0 + 15 + 15 = 30.',
    shortcutTip: 'Identity: (a & b) + (a | b) = a + b = 15. Then add (a ^ b) = 15 => 30.'
  },
  {
    id: 'apt-20',
    category: 'Basic Coding & Pseudocode',
    question: 'What will be the output of the following recursive function for fun(4)?\n\nint fun(int n) {\n  if (n <= 1) return 1;\n  return fun(n - 1) + fun(n - 2);\n}',
    options: ['5', '8', '3', '4'],
    correctAnswer: '5',
    solution: 'This is the standard Fibonacci sequence with 1-based base cases:\nfun(1) = 1\nfun(2) = fun(1) + fun(0) = 1 + 1 = 2 (since 0 <= 1 returns 1)\nfun(3) = fun(2) + fun(1) = 2 + 1 = 3\nfun(4) = fun(3) + fun(2) = 3 + 2 = 5.',
    shortcutTip: 'Trace tree from bottom up: fun(0)=1, fun(1)=1, fun(2)=2, fun(3)=3, fun(4)=5.'
  },
  {
    id: 'apt-21',
    category: 'Basic Coding & Pseudocode',
    question: 'What does the expression `x & (x - 1)` do when x is a positive integer?',
    options: [
      'Checks if x is odd',
      'Clears the lowest set bit (rightmost 1) of x',
      'Doubles the value of x',
      'Inverts all bits of x'
    ],
    correctAnswer: 'Clears the lowest set bit (rightmost 1) of x',
    solution: 'Subtracting 1 from x flips all bits from the rightmost set bit to the end. Bitwise ANDing `x & (x - 1)` zeroes out that rightmost set bit. Used in Brian Kernighan’s algorithm to count set bits and to check if a number is a power of 2 (`(x & (x - 1)) == 0`).',
    shortcutTip: 'Critical bit manipulation trick: if `(x & (x - 1)) == 0`, x is a power of 2.'
  },
  {
    id: 'apt-22',
    category: 'Basic Coding & Pseudocode',
    question: 'What is the output of the following C code snippet?\n\nint arr[] = {10, 20, 30, 40};\nint *ptr = arr;\nprintf("%d", *(ptr + 2));',
    options: ['30', '20', '40', 'Garbage Value'],
    correctAnswer: '30',
    solution: '`arr` decays to a pointer pointing to `arr[0]` (value 10). `ptr + 2` increments the pointer by 2 * sizeof(int) memory addresses, pointing to `arr[2]`. Dereferencing `*(ptr + 2)` returns `arr[2]`, which is 30.',
    shortcutTip: 'Pointer arithmetic: `*(ptr + i)` is mathematically identical to `ptr[i]`.'
  },
  {
    id: 'apt-23',
    category: 'Basic Coding & Pseudocode',
    question: 'What is the time complexity of the following code snippet?\n\nfor (int i = 1; i <= n; i *= 2) {\n  for (int j = 1; j <= n; j++) {\n    // O(1) statement\n  }\n}',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctAnswer: 'O(n log n)',
    solution: 'The outer loop multiplies `i` by 2 each iteration (`i = 1, 2, 4, 8, ...`), executing `log2(n)` times. The inner loop executes `n` times for every single iteration of the outer loop. Total operations = log(n) * n = O(n log n).',
    shortcutTip: 'Multiplicative or division loop steps run in O(log n); multiplied by inner O(n) yields O(n log n).'
  },
  {
    id: 'apt-24',
    category: 'Basic Coding & Pseudocode',
    question: 'What will be printed by the following JavaScript snippet?\n\nconsole.log(typeof NaN);\nconsole.log(NaN === NaN);',
    options: ['"number" and false', '"undefined" and true', '"NaN" and true', '"number" and true'],
    correctAnswer: '"number" and false',
    solution: 'In IEEE 754 floating point standard and JavaScript specification, `NaN` is of type `"number"`. Furthermore, `NaN` is the only value in JavaScript that is not equal to itself (`NaN === NaN` evaluates to `false`). Use `Number.isNaN()` to check.',
    shortcutTip: 'Classic interview trick: `typeof NaN === "number"` and `NaN !== NaN`.'
  },
  {
    id: 'apt-25',
    category: 'Basic Coding & Pseudocode',
    question: 'What is the value of `x` after executing:\n\nint x = 7;\nx = x ^ x;\nx = x ^ 10;',
    options: ['10', '0', '7', '17'],
    correctAnswer: '10',
    solution: 'Any number XORed with itself is 0 (`7 ^ 7 = 0`). Then `0 ^ 10 = 10`. Therefore `x = 10`.',
    shortcutTip: 'XOR properties: `A ^ A = 0` and `0 ^ A = A`.'
  },
  {
    id: 'apt-26',
    category: 'Quantitative',
    question: 'A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.',
    options: ['4 hours', '5 hours', '3.5 hours', '4.5 hours'],
    correctAnswer: '4 hours',
    solution: 'Downstream speed = Speed of boat + Speed of stream = 13 + 4 = 17 km/hr.\nDistance = 68 km.\nTime = Distance / Speed = 68 / 17 = 4 hours.',
    shortcutTip: 'Downstream = Boat + Stream (17 km/h). 68 / 17 = 4.'
  },
  {
    id: 'apt-27',
    category: 'Quantitative',
    question: 'Two cards are drawn at random from a pack of 52 cards. What is the probability that both cards are Kings?',
    options: ['1 / 221', '1 / 169', '4 / 663', '2 / 52'],
    correctAnswer: '1 / 221',
    solution: 'Total Kings = 4. Total cards = 52.\nProbability of 1st King = 4 / 52 = 1 / 13.\nProbability of 2nd King = 3 / 51 = 1 / 17.\nCombined probability = (1 / 13) * (1 / 17) = 1 / 221.',
    shortcutTip: 'Formula: (4C2) / (52C2) = 6 / 1326 = 1 / 221.'
  },
  {
    id: 'apt-28',
    category: 'Logical Reasoning',
    question: 'In a row of 40 students facing North, Umesh is 18th from the left end. What is his position from the right end?',
    options: ['23rd', '22nd', '24th', '21st'],
    correctAnswer: '23rd',
    solution: 'Total students = (Position from left) + (Position from right) - 1.\n40 = 18 + R - 1\n40 = 17 + R\nR = 40 - 17 = 23.\nUmesh is 23rd from the right end.',
    shortcutTip: 'Formula: (Total - Position from left) + 1 = (40 - 18) + 1 = 23.'
  },
  {
    id: 'apt-29',
    category: 'Verbal Ability',
    question: 'Choose the correct one-word substitution: "A person who is able to use both hands with equal skill"',
    options: ['Ambidextrous', 'Ambivalent', 'Bilingual', 'Dexterous'],
    correctAnswer: 'Ambidextrous',
    solution: '"Ambidextrous" means able to use the right and left hands equally well (from Latin ambi = both, dexter = right-handed).',
    shortcutTip: 'Ambi = both; dextrous = skillful with hands.'
  },
  {
    id: 'apt-30',
    category: 'Basic Coding & Pseudocode',
    question: 'What is the output of the following code?\n\nlet a = [1, 2, 3];\nlet b = a;\nb.push(4);\nconsole.log(a.length);',
    options: ['4', '3', 'TypeError', 'undefined'],
    correctAnswer: '4',
    solution: 'In JavaScript, arrays are reference types. Variable `b` receives the reference pointer to the same array in memory as `a`. Pushing 4 to `b` modifies the underlying array, so `a.length` is 4.',
    shortcutTip: 'Reference equality: Object and array assignments in JS copy references, not values.'
  }
];
