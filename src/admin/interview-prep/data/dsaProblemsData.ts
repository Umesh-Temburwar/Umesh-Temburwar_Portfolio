import { DSAProblem } from '../types';

export const dsaProblemsData: DSAProblem[] = [
  // 1. Two Sum
  {
    id: 'dsa-1',
    title: 'Two Sum',
    topic: 'Hashing',
    difficulty: 'Basic',
    problemStatement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    approach:
      'Use a Hash Map to store each element and its index as you iterate through the array. For each number, check if the complement `(target - num)` already exists in the map. If yes, return current index and the complement index. This reduces time from brute-force O(N^2) to linear O(N).',
    timeComplexity: 'O(N) - single pass through the array',
    spaceComplexity: 'O(N) - storing elements in the hash map',
    jsCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    pythonCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    keyTakeaways: [
      'Trading space for time via Hash Table lookup in O(1)',
      'Handles duplicate values naturally since check precedes insertion'
    ]
  },

  // 2. Best Time to Buy and Sell Stock
  {
    id: 'dsa-2',
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Arrays',
    difficulty: 'Basic',
    problemStatement:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    approach:
      'Track the minimum buying price seen so far while iterating through the array. At each day, calculate the potential profit if sold today (`currentPrice - minPrice`) and update the global max profit.',
    timeComplexity: 'O(N) - one pass through array',
    spaceComplexity: 'O(1) - constant auxiliary variables',
    jsCode: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}`,
    pythonCode: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
    keyTakeaways: [
      'Classic one-pass greedy approach',
      'Cannot sell before buying; maintaining min price enforces sequential timeline'
    ]
  },

  // 3. Valid Anagram
  {
    id: 'dsa-3',
    title: 'Valid Anagram',
    topic: 'Strings',
    difficulty: 'Basic',
    problemStatement:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
    approach:
      'If lengths differ, return false. Use a frequency array of size 26 (or hash map) to count character occurrences. Increment counts for string s, decrement for string t. If all counts return to 0, they are anagrams.',
    timeComplexity: 'O(N) where N is string length',
    spaceComplexity: 'O(1) since character set is bounded (26 lowercase English letters)',
    jsCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}`,
    pythonCode: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = {}
    for char in s:
        counts[char] = counts.get(char, 0) + 1
    for char in t:
        if counts.get(char, 0) == 0:
            return False
        counts[char] -= 1
    return True`,
    keyTakeaways: [
      'Character frequency count is much faster than sorting both strings (O(N) vs O(N log N))',
      'Early exit if string lengths do not match'
    ]
  },

  // 4. Valid Palindrome
  {
    id: 'dsa-4',
    title: 'Valid Palindrome',
    topic: 'Two Pointers',
    difficulty: 'Basic',
    problemStatement:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    approach:
      'Use two pointers starting at the beginning (left = 0) and end (right = length - 1). Skip non-alphanumeric characters. Compare lowercased characters; if any pair differs, return false. If pointers meet, return true.',
    timeComplexity: 'O(N) where N is length of string',
    spaceComplexity: 'O(1) in-place without creating filtered string',
    jsCode: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  const isAlphaNum = (ch) => /[a-z0-9]/i.test(ch);

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}`,
    pythonCode: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    keyTakeaways: [
      'Two pointers moving towards center avoid auxiliary memory allocation',
      'Always guard inner while loops with `left < right`'
    ]
  },

  // 5. Maximum Subarray (Kadane's Algorithm)
  {
    id: 'dsa-5',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    topic: 'Arrays',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    approach:
      'Iterate through the array. At each index, decide whether to add current element to existing currentSum or start a fresh subarray at this element: `currentSum = max(num, currentSum + num)`. Keep track of the global maximum sum.',
    timeComplexity: 'O(N) - single linear scan',
    spaceComplexity: 'O(1) - only two variables needed',
    jsCode: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    pythonCode: `def max_sub_array(nums: list[int]) -> int:
    current_sum = nums[0]
    max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    keyTakeaways: [
      'Kadane\'s algorithm is optimal dynamic programming with O(1) space',
      'Negative prefix sums should be discarded immediately'
    ]
  },

  // 6. Contains Duplicate
  {
    id: 'dsa-6',
    title: 'Contains Duplicate',
    topic: 'Hashing',
    difficulty: 'Basic',
    problemStatement:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    approach:
      'Insert elements into a Hash Set. Before inserting each element, check if it already exists in the set. If yes, duplicate found. Alternatively, compare `new Set(nums).size !== nums.length`.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    jsCode: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    pythonCode: `def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    keyTakeaways: [
      'Set lookup provides O(1) average time check',
      'Early termination on the first duplicate found'
    ]
  },

  // 7. Merge Two Sorted Lists
  {
    id: 'dsa-7',
    title: 'Merge Two Sorted Lists',
    topic: 'Linked List',
    difficulty: 'Basic',
    problemStatement:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    approach:
      'Create a dummy pre-head node. Use a pointer `current` to attach whichever list node has the smaller value. Advance the respective list pointer and `current`. When one list is exhausted, attach the remaining tail directly.',
    timeComplexity: 'O(N + M) where N and M are lengths of the lists',
    spaceComplexity: 'O(1) reusing existing node pointers',
    jsCode: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }
  curr.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
    pythonCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 if l1 else l2
    return dummy.next`,
    keyTakeaways: [
      'Dummy head technique eliminates edge cases for initializing the head',
      'Reusing node pointers achieves O(1) auxiliary space'
    ]
  },

  // 8. Reverse Linked List
  {
    id: 'dsa-8',
    title: 'Reverse Linked List',
    topic: 'Linked List',
    difficulty: 'Basic',
    problemStatement:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    approach:
      'Use three pointers: `prev` initialized to null, `curr` initialized to head, and `nextTemp` to store the next node. In each step, redirect `curr.next` to `prev`, then advance `prev` and `curr`. When `curr` is null, `prev` is the new head.',
    timeComplexity: 'O(N) - single pass over N nodes',
    spaceComplexity: 'O(1) iterative in-place modification',
    jsCode: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next; // save next
    curr.next = prev;          // reverse link
    prev = curr;               // advance prev
    curr = nextTemp;           // advance curr
  }
  return prev;
}`,
    pythonCode: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
    keyTakeaways: [
      'Crucial to store nextTemp before breaking the pointer link',
      'Can also be implemented recursively in O(N) space on the call stack'
    ]
  },

  // 9. Linked List Cycle (Floyd\'s Tortoise and Hare)
  {
    id: 'dsa-9',
    title: 'Linked List Cycle',
    topic: 'Linked List',
    difficulty: 'Basic',
    problemStatement:
      'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    approach:
      'Floyd\'s cycle-finding algorithm: Initialize two pointers: `slow` moves 1 step at a time, `fast` moves 2 steps at a time. If there is a cycle, the fast pointer will eventually lap and meet the slow pointer. If `fast` or `fast.next` reaches null, there is no cycle.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) - no hash set needed',
    jsCode: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
}`,
    pythonCode: `def has_cycle(head) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    keyTakeaways: [
      'Two pointers with different speeds detect loops in O(1) space',
      'If asked for start of cycle: reset slow to head, advance both 1 step until they meet'
    ]
  },

  // 10. Valid Parentheses
  {
    id: 'dsa-10',
    title: 'Valid Parentheses',
    topic: 'Stack & Queue',
    difficulty: 'Basic',
    problemStatement:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
    approach:
      'Use a Stack. Iterate over each character. If it is an opening bracket, push it onto the stack. If it is a closing bracket, check if the stack is non-empty and whether the popped element matches. At the end, string is valid only if the stack is completely empty.',
    timeComplexity: 'O(N) where N is length of string',
    spaceComplexity: 'O(N) for the stack',
    jsCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (ch in map) {
      if (stack.length === 0 || stack.pop() !== map[ch]) {
        return false;
      }
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    pythonCode: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`,
    keyTakeaways: [
      'LIFO nature of stack mirrors nested bracket matching',
      'Check `stack.length === 0` at end to catch unclosed opening brackets'
    ]
  },

  // 11. Binary Search
  {
    id: 'dsa-11',
    title: 'Binary Search',
    topic: 'Sorting & Searching',
    difficulty: 'Basic',
    problemStatement:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
    approach:
      'Maintain `left` and `right` boundary pointers. Calculate middle index `mid = left + Math.floor((right - left) / 2)`. If `nums[mid] === target`, return mid. If `nums[mid] < target`, narrow search to right half (`left = mid + 1`). Otherwise narrow to left half (`right = mid - 1`).',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    jsCode: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    pythonCode: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    keyTakeaways: [
      'Calculate mid with `left + (right - left) / 2` to prevent 32-bit integer overflow',
      'Requires array to be pre-sorted'
    ]
  },

  // 12. Search in Rotated Sorted Array
  {
    id: 'dsa-12',
    title: 'Search in Rotated Sorted Array',
    topic: 'Sorting & Searching',
    difficulty: 'Intermediate',
    problemStatement:
      'There is an integer array nums sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index. Given target, return index of target or -1 if not found.',
    approach:
      'Modified binary search: at any mid point, either the left half `[left...mid]` or the right half `[mid...right]` is guaranteed to be normally sorted. Check if target lies within the sorted half. If yes, search there; otherwise search the other half.',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    jsCode: `function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;

    // Check if left half is normally sorted:
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is normally sorted:
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
    pythonCode: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    keyTakeaways: [
      'One half of a rotated sorted array is always cleanly sorted',
      'Boundary equality checks `<= / >=` are crucial'
    ]
  },

  // 13. Maximum Depth of Binary Tree
  {
    id: 'dsa-13',
    title: 'Maximum Depth of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Basic',
    problemStatement:
      'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    approach:
      'Use recursion (DFS). Base case: if root is null, return 0. Otherwise, recursively compute the max depth of the left subtree and right subtree, then return `1 + max(leftDepth, rightDepth)`.',
    timeComplexity: 'O(N) visiting each node once',
    spaceComplexity: 'O(H) where H is tree height (call stack frames)',
    jsCode: `function maxDepth(root) {
  if (!root) return 0;
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  return 1 + Math.max(leftDepth, rightDepth);
}`,
    pythonCode: `def max_depth(root) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    keyTakeaways: [
      'Post-order traversal pattern (solve subproblems first, then combine)',
      'Height of balanced tree is O(log N), skewed tree is O(N)'
    ]
  },

  // 14. Invert / Flip Binary Tree
  {
    id: 'dsa-14',
    title: 'Invert Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Basic',
    problemStatement:
      'Given the root of a binary tree, invert the tree (swap left and right child at every node), and return its root.',
    approach:
      'Base case: if root is null, return null. Swap root.left and root.right. Recursively call invert on both children.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    jsCode: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
    pythonCode: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
    keyTakeaways: [
      'Classic question popularized by Max Howell\'s Homebrew interview tweet',
      'Python allows clean tuple unpacking for swapping pointers'
    ]
  },

  // 15. Level Order Traversal (BFS)
  {
    id: 'dsa-15',
    title: 'Binary Tree Level Order Traversal',
    topic: 'Binary Trees',
    difficulty: 'Intermediate',
    problemStatement:
      'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    approach:
      'Use a Queue (Breadth-First Search). Push root to queue. While queue is not empty, record current queue length (nodes on current level), loop that many times to pop nodes, store their values in a sub-array, and push their children.',
    timeComplexity: 'O(N) visiting each node once',
    spaceComplexity: 'O(N) max queue size for leaf level',
    jsCode: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
    pythonCode: `from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)
    return result`,
    keyTakeaways: [
      'Snapshoting `levelSize = queue.length` is the secret to separating tree levels in BFS',
      'Using `collections.deque` in Python gives O(1) pops vs O(N) list pops'
    ]
  },

  // 16. Longest Substring Without Repeating Characters
  {
    id: 'dsa-16',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    difficulty: 'Intermediate',
    problemStatement:
      'Given a string s, find the length of the longest substring without repeating characters.',
    approach:
      'Sliding Window with a Hash Map. Maintain `left` and `right` window pointers. As `right` expands, if character `s[right]` was seen previously within current window (`map[ch] >= left`), jump `left = map[ch] + 1`. Record character\'s new position and maximize window length.',
    timeComplexity: 'O(N) single pass sliding window',
    spaceComplexity: 'O(min(N, M)) where M is character alphabet size',
    jsCode: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    pythonCode: `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    keyTakeaways: [
      'Sliding window dynamically contracts when condition is violated',
      'Storing latest index allows O(1) jump of left pointer rather than step-by-step shrink'
    ]
  },

  // 17. 3Sum
  {
    id: 'dsa-17',
    title: '3Sum',
    topic: 'Two Pointers',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    approach:
      'Sort the array first. Loop through `nums` with index `i`. For each `i`, use two pointers `left = i + 1` and `right = length - 1`. If sum is 0, add triplet and skip duplicates for both pointers. If sum < 0, advance left; if sum > 0, decrement right. Skip duplicates of `nums[i]` as well.',
    timeComplexity: 'O(N^2) - sorting takes O(N log N) + nested two-pointer search O(N^2)',
    spaceComplexity: 'O(1) or O(N) depending on sorting implementation',
    jsCode: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicate i

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++; // Skip duplicate left
        while (left < right && nums[right] === nums[right - 1]) right--; // Skip duplicate right
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
    pythonCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return res`,
    keyTakeaways: [
      'Pre-sorting enables two pointers to navigate sums systematically',
      'Skipping duplicate elements is essential to avoid repeated triplets'
    ]
  },

  // 18. Product of Array Except Self
  {
    id: 'dsa-18',
    title: 'Product of Array Except Self',
    topic: 'Arrays',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], without using division and in O(n) time.',
    approach:
      'Construct output using prefix and suffix products. In the first pass from left to right, store prefix product in result array. In the second pass from right to left, maintain running suffix product and multiply with existing prefix values in result array.',
    timeComplexity: 'O(N) with two passes',
    spaceComplexity: 'O(1) extra space (output array does not count as auxiliary space)',
    jsCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);

  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] = result[i] * suffix;
    suffix *= nums[i];
  }
  return result;
}`,
    pythonCode: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
    keyTakeaways: [
      'Avoids division by zero edge cases completely',
      'Combines prefix and suffix passes into a single output array'
    ]
  },

  // 19. Climbing Stairs (Fibonacci DP)
  {
    id: 'dsa-19',
    title: 'Climbing Stairs',
    topic: 'Recursion',
    difficulty: 'Basic',
    problemStatement:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    approach:
      'To reach step `n`, you can come from step `n - 1` (1 step) or step `n - 2` (2 steps). Thus `ways(n) = ways(n - 1) + ways(n - 2)`. Compute bottom-up using two variables to achieve O(1) space.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    jsCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let first = 1;
  let second = 2;
  for (let i = 3; i <= n; i++) {
    const third = first + second;
    first = second;
    second = third;
  }
  return second;
}`,
    pythonCode: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second`,
    keyTakeaways: [
      'Canonical example of converting exponential recursion O(2^N) to O(N) iterative DP',
      'Notice similarity to Fibonacci series'
    ]
  },

  // 20. Implement Queue using Stacks
  {
    id: 'dsa-20',
    title: 'Implement Queue using Stacks',
    topic: 'Stack & Queue',
    difficulty: 'Basic',
    problemStatement:
      'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty operations.',
    approach:
      'Use two stacks: `inStack` for enqueue operations and `outStack` for dequeue/peek. Elements pushed are stored in `inStack`. When pop or peek is called, if `outStack` is empty, transfer all elements from `inStack` to `outStack` (reversing their order to FIFO).',
    timeComplexity: 'Push: O(1). Pop/Peek: Amortized O(1).',
    spaceComplexity: 'O(N)',
    jsCode: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) {
    this.inStack.push(x);
  }
  pop() {
    this.peek();
    return this.outStack.pop();
  }
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack[this.outStack.length - 1];
  }
  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}`,
    pythonCode: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def pop(self) -> int:
        self.peek()
        return self.out_stack.pop()

    def peek(self) -> int:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack`,
    keyTakeaways: [
      'Each element is transferred at most once, giving Amortized O(1) time per operation',
      'Fundamental question testing data structure mechanics'
    ]
  },

  // 21. Validate Binary Search Tree
  {
    id: 'dsa-21',
    title: 'Validate Binary Search Tree',
    topic: 'Binary Trees',
    difficulty: 'Intermediate',
    problemStatement:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires that for every node, all nodes in its left subtree are strictly less, and all nodes in its right subtree are strictly greater.',
    approach:
      'Pass valid bounds `(minVal, maxVal)` recursively down the tree. Root can be anything `(-Infinity, Infinity)`. When going left, update upper bound to `node.val`. When going right, update lower bound to `node.val`. If any node violates bounds, return false.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    jsCode: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
    pythonCode: `def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')) -> bool:
    if not root:
        return True
    if not (min_val < root.val < max_val):
        return False
    return is_valid_bst(root.left, min_val, root.val) and is_valid_bst(root.right, root.val, max_val)`,
    keyTakeaways: [
      'Checking only immediate children is incorrect; whole subtree must satisfy condition',
      'In-order traversal of a valid BST also yields strictly ascending sorted values'
    ]
  },

  // 22. Group Anagrams
  {
    id: 'dsa-22',
    title: 'Group Anagrams',
    topic: 'Strings',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    approach:
      'Use a Hash Map where the key is the sorted version of each string (or a character count tuple), and the value is an array of strings matching that key. Return `Object.values(map)`.',
    timeComplexity: 'O(N * K log K) where N is number of words, K is max length of a word',
    spaceComplexity: 'O(N * K) storing strings in map',
    jsCode: `function groupAnagrams(strs) {
  const map = {};
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map[key]) map[key] = [];
    map[key].push(str);
  }
  return Object.values(map);
}`,
    pythonCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
    keyTakeaways: [
      'Canonical representation of an anagram is its sorted character string',
      'Defaultdict in Python simplifies appending to missing keys'
    ]
  },

  // 23. Kth Largest Element in an Array
  {
    id: 'dsa-23',
    title: 'Kth Largest Element in an Array',
    topic: 'Sorting & Searching',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an integer array nums and an integer k, return the kth largest element in the array. Can you solve it without sorting the entire array in O(n log n)?',
    approach:
      'Use a Min-Heap of size `k` (or Quickselect algorithm). Push elements into min-heap. If heap size exceeds k, pop minimum element. At the end, the root of the min-heap holds the kth largest element.',
    timeComplexity: 'O(N log K) using min-heap, or O(N) average using Quickselect',
    spaceComplexity: 'O(K) for the heap',
    jsCode: `// Quickselect algorithm for O(N) average time:
function findKthLargest(nums, k) {
  const targetIdx = nums.length - k;

  function quickSelect(left, right) {
    const pivot = nums[right];
    let p = left;
    for (let i = left; i < right; i++) {
      if (nums[i] <= pivot) {
        [nums[p], nums[i]] = [nums[i], nums[p]];
        p++;
      }
    }
    [nums[p], nums[right]] = [nums[right], nums[p]];

    if (p === targetIdx) return nums[p];
    if (p < targetIdx) return quickSelect(p + 1, right);
    return quickSelect(left, p - 1);
  }

  return quickSelect(0, nums.length - 1);
}`,
    pythonCode: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    # Min-heap of size k
    return heapq.nlargest(k, nums)[-1]`,
    keyTakeaways: [
      'Quickselect partitions around pivot similarly to Quicksort but recurses on only one branch',
      'Python `heapq.nlargest` provides efficient C-level implementation'
    ]
  },

  // 24. Merge Intervals
  {
    id: 'dsa-24',
    title: 'Merge Intervals',
    topic: 'Arrays',
    difficulty: 'Intermediate',
    problemStatement:
      'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    approach:
      'Sort intervals by start time. Initialize `merged = [intervals[0]]`. Iterate through remaining intervals: if current interval starts before or at previous interval\'s end time, merge them by updating `prev.end = max(prev.end, curr.end)`. Otherwise push current interval.',
    timeComplexity: 'O(N log N) dominated by sorting',
    spaceComplexity: 'O(N) for output',
    jsCode: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
    pythonCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
    keyTakeaways: [
      'Sorting by start time guarantees that overlaps can only occur with the most recently merged interval',
      'Always use `max(lastMerged[1], current[1])` to handle completely engulfed intervals'
    ]
  },

  // 25. Trapping Rain Water
  {
    id: 'dsa-25',
    title: 'Trapping Rain Water',
    topic: 'Two Pointers',
    difficulty: 'Advanced',
    problemStatement:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    approach:
      'Two pointers `left = 0`, `right = n - 1` with running `leftMax` and `rightMax`. At each step, process the smaller of `height[left]` and `height[right]` because water depth is constrained by the shorter wall. Add trapped water `max - height[curr]` and advance that pointer.',
    timeComplexity: 'O(N) single pass',
    spaceComplexity: 'O(1) auxiliary space',
    jsCode: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
}`,
    pythonCode: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    total_water = 0
    while left < right:
        if height[left] <= height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                total_water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                total_water += right_max - height[right]
            right -= 1
    return total_water`,
    keyTakeaways: [
      'Eliminates need for two auxiliary arrays `leftMax[]` and `rightMax[]` (saving O(N) space)',
      'Bottleneck is always the smaller boundary wall'
    ]
  }
];

