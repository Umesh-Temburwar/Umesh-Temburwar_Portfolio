import { SkillCategoryGroup } from '../types';

export const skillsData: SkillCategoryGroup[] = [
  {
    category: 'Languages',
    skills: [
      {
        id: 'javascript',
        name: 'JavaScript (ES6+)',
        badge: 'Core Frontend & Backend',
        overview:
          'JavaScript is a single-threaded, non-blocking, asynchronous, concurrent runtime language based on the ECMAScript standard. Key interview topics include the call stack, event loop, closures, prototypal inheritance, and ES6+ features.',
        keyConcepts: [
          'Execution Context & Call Stack (Creation vs Execution phase)',
          'Event Loop, Microtask Queue (Promises) vs Macrotask Queue (setTimeout)',
          'Lexical Scoping & Closures (data privacy, currying)',
          'Hoisting behavior with var, let, const, and function declarations',
          'Prototypes & Prototypal Inheritance (__proto__ vs prototype)',
          'The `this` keyword binding (default, implicit, explicit, new, arrow functions)',
          'Debouncing vs Throttling event rate-limiting',
        ],
        commonMistakes: [
          'Confusing undefined with null or undeclared variables.',
          'Assuming setTimeout(fn, 0) runs immediately—it always waits for the call stack and microtask queue to clear.',
          'Mutating arrays directly with methods like sort(), push(), splice() instead of using pure immutable operations.',
          'Using arrow functions as object methods where `this` needs to refer to the object instance.',
          'Creating memory leaks through uncleared intervals, event listeners, or unintended global variables.',
        ],
        questions: [
          {
            id: 'js-1',
            question: 'What is a closure in JavaScript, and what is a practical real-world use case?',
            shortAnswer:
              'A closure is the combination of a function bundled together with references to its surrounding lexical environment. It allows an inner function to remember and access variables from an outer enclosing function even after the outer function has finished executing.',
            detailedAnswer:
              'When a function is declared in JavaScript, it retains an internal reference to its lexical environment. When returning a function from another function, this reference persists in heap memory. Common practical use cases include: 1) Data encapsulation / private variables (e.g. creating private state in modules), 2) Function currying / partial application, 3) Event handlers and debouncing/throttling functions where timer IDs must persist across invocations.',
            codeSnippet: {
              language: 'javascript',
              code: `// Practical closure: Private counter & Debounce implementation
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable enclosed
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11 (count cannot be directly accessed)`
            },
            followUps: [
              'Can closures cause memory leaks in JavaScript?',
              'How does garbage collection (mark-and-sweep) treat variables held in active closures?'
            ],
            level: 'Basic',
            tags: ['JavaScript', 'Closures', 'Scope', 'Memory']
          },
          {
            id: 'js-2',
            question: 'Explain Hoisting and how it differs between var, let, const, and function declarations.',
            shortAnswer:
              'Hoisting is JavaScript\'s compilation phase behavior where variable and function declarations are moved to the top of their containing scope. `var` is hoisted and initialized with `undefined`; `let` and `const` are hoisted into a Temporal Dead Zone (TDZ); function declarations are hoisted with their complete implementation.',
            detailedAnswer:
              'During the Creation Phase of the Execution Context, memory space is allocated for declarations. Function declarations (`function foo() {}`) are fully hoisted and can be called before their definition. Variables declared with `var` are assigned `undefined` until the assignment line executes. Variables declared with `let` and `const` are placed in the Temporal Dead Zone (TDZ)—they exist in scope, but accessing them before initialization throws a `ReferenceError`. Function expressions (e.g., `const f = () => {}`) follow the rules of variable declarations.',
            codeSnippet: {
              language: 'javascript',
              code: `console.log(a); // undefined (hoisted with default initialization)
var a = 5;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 10;

greet(); // Output: "Hello from hoisted function!"
function greet() {
  console.log("Hello from hoisted function!");
}`
            },
            followUps: [
              'What happens if you use `typeof` on a variable in the Temporal Dead Zone?',
              'Why was TDZ introduced in ES6?'
            ],
            level: 'Basic',
            tags: ['JavaScript', 'Hoisting', 'TDZ', 'Execution Context']
          },
          {
            id: 'js-3',
            question: 'How does the JavaScript Event Loop handle microtasks vs macrotasks?',
            shortAnswer:
              'The Event Loop continuously checks if the Call Stack is empty. When empty, it processes ALL queued microtasks (Promises, process.nextTick, queueMicrotask) until the queue is completely drained, before picking the single next macrotask (setTimeout, setInterval, I/O events) from the task queue.',
            detailedAnswer:
              'JavaScript is single-threaded. Synchronous code executes immediately on the Call Stack. Asynchronous callbacks are routed through browser/Node Web APIs to specific queues: 1) Microtask Queue (Promise.then/catch/finally, MutationObserver, queueMicrotask), 2) Macrotask Queue / Callback Queue (setTimeout, setInterval, setImmediate, UI rendering, I/O). After every macrotask or synchronous script completion, the engine drains the microtask queue completely—even if new microtasks are enqueued during that drain—before moving to rendering or the next macrotask.',
            codeSnippet: {
              language: 'javascript',
              code: `console.log('1: Sync Start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask 1 (Promise)');
}).then(() => {
  console.log('4: Microtask 2 (Promise chained)');
});

console.log('5: Sync End');

// Expected Output Order:
// 1: Sync Start
// 5: Sync End
// 3: Microtask 1 (Promise)
// 4: Microtask 2 (Promise chained)
// 2: Macrotask (setTimeout)`
            },
            followUps: [
              'What will happen if a microtask recursively queues another microtask?',
              'How does Node.js process.nextTick priority differ from Promise.then in the microtask phase?'
            ],
            level: 'Intermediate',
            tags: ['JavaScript', 'Event Loop', 'Asynchronous', 'Microtasks']
          },
          {
            id: 'js-4',
            question: 'Explain the difference between Debouncing and Throttling with code implementations.',
            shortAnswer:
              'Debounce delays invoking a function until a specified time has passed since the LAST time it was invoked (ideal for search input). Throttle limits function execution to at most once every specified time interval (ideal for scroll or window resize events).',
            detailedAnswer:
              'Debounce groups sudden bursts of events into a single execution after silence. Throttle guarantees steady execution rate during continuous events. Both functions return a closure that preserves timer variables.',
            codeSnippet: {
              language: 'javascript',
              code: `// Debounce: Executes after 'delay' ms of user inactivity
function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle: Executes at most once every 'limit' ms
function throttle(func, limit = 300) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}`
            },
            followUps: [
              'How would you implement immediate leading-edge execution for debounce?',
              'What are the performance implications if neither is used on an autocomplete input?'
            ],
            level: 'Intermediate',
            tags: ['JavaScript', 'Optimization', 'Performance', 'DOM']
          },
          {
            id: 'js-5',
            question: 'How does prototypal inheritance work, and what is the difference between `__proto__` and `prototype`?',
            shortAnswer:
              '`prototype` is a property on constructor functions used to build `__proto__` on newly instantiated objects. `__proto__` is the actual internal reference pointer on an object instance that points to its prototype in the prototype chain.',
            detailedAnswer:
              'Every JavaScript object has an internal hidden link `[[Prototype]]` (exposed via `__proto__` or `Object.getPrototypeOf()`). When accessing a property on an object, if it is not found on the object itself, JS traverses up the prototype chain until it either finds the property or reaches `Object.prototype.__proto__`, which is `null`. Constructor functions and classes have a `.prototype` object, which is assigned as the `[[Prototype]]` to instances created with the `new` operator.',
            codeSnippet: {
              language: 'javascript',
              code: `function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return \`Hi, I am \${this.name}\`;
};

const umesh = new Person('Umesh');
console.log(umesh.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null (end of chain)`
            },
            followUps: [
              'How does ES6 `class extends` syntax map to prototypal inheritance under the hood?',
              'Why is modifying `__proto__` directly discouraged in modern engines?'
            ],
            level: 'Intermediate',
            tags: ['JavaScript', 'Prototypes', 'OOP', 'Inheritance']
          },
          {
            id: 'js-6',
            question: 'How is the `this` keyword resolved in JavaScript across normal functions, arrow functions, and method calls?',
            shortAnswer:
              '`this` in normal functions depends on HOW the function is called: default (window/undefined in strict mode), implicit (object calling it), or explicit (call/apply/bind). Arrow functions do NOT have their own `this`; they lexically inherit `this` from the enclosing scope where they are defined.',
            detailedAnswer:
              'The four rules of `this` binding: 1) Default Binding: standalone function invocation sets `this` to global (`window`) or `undefined` (in `"use strict"`). 2) Implicit Binding: `obj.method()` binds `this` to `obj`. 3) Explicit Binding: `fn.call(ctx, arg1)`, `fn.apply(ctx, [args])`, or `fn.bind(ctx)`. 4) `new` Binding: binds `this` to the newly allocated instance. Arrow functions ignore these four rules; they resolve `this` strictly lexically at definition time.',
            codeSnippet: {
              language: 'javascript',
              code: `const user = {
  name: 'Umesh',
  regularFn() {
    console.log('Regular:', this.name);
  },
  arrowFn: () => {
    console.log('Arrow:', this?.name); // undefined or window.name
  },
  nestedAsync() {
    setTimeout(() => {
      console.log('Nested Arrow in Method:', this.name); // 'Umesh' (lexical)
    }, 100);
  }
};

user.regularFn();    // "Regular: Umesh"
user.arrowFn();      // "Arrow: undefined"
user.nestedAsync();  // "Nested Arrow in Method: Umesh"`
            },
            followUps: [
              'Can you bind an arrow function using `.bind()`?',
              'What does `new` keyword do step-by-step with `this`?'
            ],
            level: 'Advanced',
            tags: ['JavaScript', 'this', 'Arrow Functions', 'Context']
          },
          {
            id: 'js-7',
            question: 'Explain Promise.all vs Promise.allSettled vs Promise.race vs Promise.any.',
            shortAnswer:
              '`Promise.all` fails fast if any promise rejects; `Promise.allSettled` waits for all to finish and returns their status and results; `Promise.race` settles with the first promise that resolves or rejects; `Promise.any` resolves with the first successful fulfilled promise.',
            detailedAnswer:
              '1) `Promise.all([p1, p2])`: returns array of fulfilled values. If any rejects, it rejects immediately with that error. 2) `Promise.allSettled([p1, p2])`: returns an array of objects `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. Never short-circuits. 3) `Promise.race([p1, p2])`: returns first settled result (resolve or reject). 4) `Promise.any([p1, p2])`: returns first resolved value. Rejects only if all reject with an `AggregateError`.',
            codeSnippet: {
              language: 'javascript',
              code: `const p1 = Promise.resolve('Success');
const p2 = Promise.reject('Network Error');

// Promise.all rejects immediately:
Promise.all([p1, p2]).catch(err => console.log('all failed:', err));

// Promise.allSettled gives complete breakdown:
Promise.allSettled([p1, p2]).then(results => {
  // [ { status: 'fulfilled', value: 'Success' }, { status: 'rejected', reason: 'Network Error' } ]
  console.log('allSettled:', results);
});`
            },
            followUps: [
              'How would you implement Promise.all from scratch using raw Promises?',
              'When would you prefer Promise.allSettled over Promise.all in production dashboards?'
            ],
            level: 'Advanced',
            tags: ['JavaScript', 'Async', 'Promises', 'Concurrency']
          }
        ]
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        badge: 'Typed Scalable JS',
        overview:
          'TypeScript is a statically typed superset of JavaScript that compiles down to clean JavaScript. It offers structural typing, interfaces, generics, union/intersection types, and type inference to catch bugs during development.',
        keyConcepts: [
          'Interface vs Type Alias (declaration merging, unions, primitives)',
          'Generics and Generic Constraints (`<T extends Record<string, unknown>>`)',
          'Utility Types: Partial, Pick, Omit, Record, Readonly, Exclude, ReturnType',
          'Type Narrowing: typeof, instanceof, in operator, and Custom Type Guards (`is`)',
          'Any vs Unknown vs Never (type safety guarantees)',
          'Structural Typing (Duck typing) in TypeScript',
        ],
        commonMistakes: [
          'Using `any` instead of `unknown` or proper generics, completely disabling type safety.',
          'Overusing type assertions (`as Type`) to force code to compile instead of fixing type discrepancies.',
          'Not taking advantage of discriminated unions when handling API response states.',
          'Confusing runtime JavaScript objects with TypeScript compile-time type declarations.',
        ],
        questions: [
          {
            id: 'ts-1',
            question: 'What is the difference between `interface` and `type` in TypeScript?',
            shortAnswer:
              'Interfaces are primarily for defining object shapes and support declaration merging (can reopen interface). Types are more versatile: they can represent primitives, unions (`A | B`), intersections (`A & B`), tuples, and mapped types, but cannot be reopened.',
            detailedAnswer:
              'Use `interface` when writing object contracts, especially in libraries where consumers might need declaration merging. Use `type` for unions, utility types, tuples, or complex mapped types. Performance-wise, modern TypeScript compiler handles both efficiently.',
            codeSnippet: {
              language: 'typescript',
              code: `// Interface supports declaration merging:
interface User {
  id: string;
  name: string;
}
interface User {
  email: string; // Merged with previous User definition!
}

// Type alias supports union & mapped types:
type Status = 'pending' | 'active' | 'archived';
type UserDictionary = Record<string, User>;`
            },
            followUps: [
              'When does declaration merging create unexpected bugs?',
              'Can a class implement a type alias?'
            ],
            level: 'Basic',
            tags: ['TypeScript', 'Interface', 'Type Alias', 'Typing']
          },
          {
            id: 'ts-2',
            question: 'Explain `unknown` vs `any` vs `never` with practical examples.',
            shortAnswer:
              '`any` disables all type-checking and allows any operation without validation. `unknown` is the type-safe counterpart of `any`: you must narrow its type before doing operations on it. `never` represents values that can never occur (e.g. infinite loops or exhaustive switch cases).',
            detailedAnswer:
              '`any` is an escape hatch that turns off the type checker. `unknown` forces developers to verify the type at runtime before calling methods or accessing properties. `never` is used for functions that throw errors or never return, and for exhaustive compile-time checking in discriminated unions.',
            codeSnippet: {
              language: 'typescript',
              code: `function handleData(input: unknown) {
  // input.trim(); // Error: Object is of type 'unknown'
  if (typeof input === 'string') {
    console.log(input.trim()); // Valid: narrowed to string
  }
}

// Exhaustive check with never:
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; size: number };
function getArea(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.size * s.size;
    default: {
      const _exhaustiveCheck: never = s; // Compile error if new Shape is added without a case!
      return _exhaustiveCheck;
    }
  }
}`
            },
            followUps: [
              'Why is `unknown` preferred for API response typing over `any`?',
              'How does TypeScript infer `never` when narrowing impossible unions?'
            ],
            level: 'Intermediate',
            tags: ['TypeScript', 'Type Safety', 'any', 'unknown', 'never']
          },
          {
            id: 'ts-3',
            question: 'What are Generics in TypeScript and how do generic constraints work?',
            shortAnswer:
              'Generics allow creating reusable components and functions that work over a variety of types rather than a single one, while maintaining strict type safety. Generic constraints (`T extends SomeType`) restrict the types that can be passed to the generic parameter.',
            detailedAnswer:
              'Generics act as type parameters passed into functions, interfaces, or classes. By using the `extends` keyword, you ensure the passed type satisfies specific properties, enabling autocompletion and type-safe access inside the function.',
            codeSnippet: {
              language: 'typescript',
              code: `interface HasId {
  id: string | number;
}

// Constrained generic function:
function findById<T extends HasId>(items: T[], targetId: string | number): T | undefined {
  return items.find(item => item.id === targetId);
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [{ id: 1, name: 'Brake Disc', price: 1200 }];
const found = findById(products, 1); // found is strongly typed as Product | undefined`
            },
            followUps: [
              'What is keyof T and how is it used in generic property lookups?',
              'How do default generic values work?'
            ],
            level: 'Intermediate',
            tags: ['TypeScript', 'Generics', 'Type System']
          }
        ]
      },
      {
        id: 'python',
        name: 'Python',
        badge: 'Scripting & FastAPI Backend',
        overview:
          'Python is an interpreted, high-level, dynamically typed language emphasizing readability and developer productivity. In modern full-stack development, Python is widely used with FastAPI and automation scripts.',
        keyConcepts: [
          'List comprehensions, generators, and iterators (yield vs return)',
          'Decorators and `@functools.wraps` (closure-based metaprogramming)',
          'GIL (Global Interpreter Lock) and multithreading vs multiprocessing',
          'Memory management and garbage collection (reference counting + cyclic GC)',
          'Type hints with Pydantic for FastAPI API validation',
          '*args and **kwargs parameter unpacking',
        ],
        commonMistakes: [
          'Using mutable default arguments in functions (e.g. `def append_item(x, lst=[])`).',
          'Assuming multithreading in Python will speed up CPU-bound tasks (blocked by GIL).',
          'Confusing `==` (value equality) with `is` (object identity).',
          'Catching generic `except:` without specifying the exception type.',
        ],
        questions: [
          {
            id: 'py-1',
            question: 'What is the Global Interpreter Lock (GIL) in CPython and how does it affect concurrency?',
            shortAnswer:
              'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once in CPython. This ensures thread-safe memory management (reference counting), but restricts CPU-bound multithreaded programs to a single CPU core.',
            detailedAnswer:
              'Because of the GIL, Python multithreading does not provide true parallelism for CPU-heavy tasks like image processing or matrix multiplication. For I/O-bound tasks (database queries, network requests), threads yield the GIL while waiting for I/O, making `asyncio` or threading effective. For CPU-bound tasks, the `multiprocessing` module is required to spawn separate processes with their own Python interpreter and memory space.',
            codeSnippet: {
              language: 'python',
              code: `# CPU-bound tasks: Use multiprocessing, not threading!
import multiprocessing

def heavy_computation(data):
    return sum(x * x for x in data)

if __name__ == '__main__':
    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())
    results = pool.map(heavy_computation, [[i] * 100000 for i in range(4)])
    pool.close()
    pool.join()`
            },
            followUps: [
              'How does asyncio achieve high concurrency without multithreading?',
              'What changes in Python 3.13 with the experimental free-threaded (no-GIL) build?'
            ],
            level: 'Intermediate',
            tags: ['Python', 'GIL', 'Concurrency', 'Multiprocessing']
          },
          {
            id: 'py-2',
            question: 'How do Python generators work, and why are they memory efficient compared to lists?',
            shortAnswer:
              'Generators produce items one at a time on demand using the `yield` statement instead of computing the entire sequence in memory upfront. This results in O(1) memory usage regardless of dataset size.',
            detailedAnswer:
              'When a generator function contains `yield`, calling it returns a generator object without executing the body immediately. When `next()` is called, the function runs until it encounters `yield`, saves its complete execution state (local variables, instruction pointer), and returns the value. On the next call, it resumes right after the yield statement.',
            codeSnippet: {
              language: 'python',
              code: `# List comprehension loads all 10M records into RAM (~400MB)
# large_list = [x * 2 for x in range(10_000_000)]

# Generator expression yields one item at a time (~128 bytes)
def stream_large_dataset(n):
    for i in range(n):
        yield i * 2

gen = stream_large_dataset(10_000_000)
print(next(gen)) # 0
print(next(gen)) # 2`
            },
            followUps: [
              'What exception is raised when a generator is exhausted?',
              'How do you pass values back into a running generator?'
            ],
            level: 'Intermediate',
            tags: ['Python', 'Generators', 'Iterators', 'Memory']
          }
        ]
      },
      {
        id: 'c-cpp',
        name: 'C / C++',
        badge: 'Systems & Core Fundamentals',
        overview:
          'C and C++ are compiled, statically typed languages with direct memory control. Knowledge of C/C++ builds fundamental understanding of pointers, stack vs heap allocation, computer architecture, and OOP design.',
        keyConcepts: [
          'Pointers, dereferencing, pointer arithmetic, and double pointers (`**`)',
          'Stack vs Heap memory allocation (`malloc`/`free` vs `new`/`delete`)',
          'Object-Oriented Programming in C++: Classes, Encapsulation, Polymorphism, Virtual Functions (vtable)',
          'C++ STL (Standard Template Library): vector, unordered_map, list, stack, queue',
          'Pass by Value vs Pass by Reference (`&`)',
          'RAII (Resource Acquisition Is Initialization) and Smart Pointers (`unique_ptr`, `shared_ptr`)',
        ],
        commonMistakes: [
          'Dangling pointers (referencing memory that has already been deallocated).',
          'Memory leaks (allocating on heap with `new` or `malloc` without matching `delete` or `free`).',
          'Buffer overflow from unbounded array indexing or unsafe functions like `gets()`.',
          'Forgetting virtual destructors in base classes when deleting derived objects through base pointers.',
        ],
        questions: [
          {
            id: 'cpp-1',
            question: 'Explain the difference between Stack and Heap memory in C/C++.',
            shortAnswer:
              'Stack memory is managed automatically by the CPU for local variables and function calls (fast, fixed size, LIFO order). Heap memory is managed manually by the programmer using `malloc`/`free` or `new`/`delete` (flexible size, slower, risk of memory leaks).',
            detailedAnswer:
              'Stack frames are pushed when a function is invoked and popped upon return, making allocation almost instantaneous by simply moving the stack pointer. However, stack size is limited (typically 1-8 MB), and exceeding it causes a stack overflow. Heap memory is allocated dynamically from the operating system pool, requires explicit deallocation, and is prone to fragmentation.',
            codeSnippet: {
              language: 'cpp',
              code: `#include <iostream>

void stackExample() {
    int x = 10; // Allocated on Stack, automatically destroyed when function exits
}

void heapExample() {
    int* ptr = new int(20); // Allocated on Heap
    std::cout << *ptr << std::endl;
    delete ptr; // Explicit free required, otherwise memory leaks!
    ptr = nullptr; // Prevent dangling pointer
}`
            },
            followUps: [
              'What causes a segmentation fault when accessing heap pointers?',
              'How do modern C++ smart pointers like `std::unique_ptr` eliminate memory leaks?'
            ],
            level: 'Basic',
            tags: ['C++', 'Memory', 'Stack', 'Heap', 'Pointers']
          },
          {
            id: 'cpp-2',
            question: 'How do Virtual Functions and the VTABLE achieve runtime polymorphism in C++?',
            shortAnswer:
              'Virtual functions allow a derived class to override a base class method. At runtime, C++ uses a hidden Virtual Method Table (vtable) and a virtual table pointer (vptr) inside each object to dynamically resolve which version of the method to execute.',
            detailedAnswer:
              'When a class contains at least one virtual function, the compiler creates a `vtable` (an array of function pointers) for that class, and adds a hidden pointer `vptr` to instances. When invoking `basePtr->draw()`, the runtime follows `basePtr->vptr` to the correct vtable and invokes the overridden implementation.',
            codeSnippet: {
              language: 'cpp',
              code: `#include <iostream>

class Base {
public:
    virtual void show() { std::cout << "Base show" << std::endl; }
    virtual ~Base() {} // Always make base destructors virtual
};

class Derived : public Base {
public:
    void show() override { std::cout << "Derived show" << std::endl; }
};

int main() {
    Base* b = new Derived();
    b->show(); // Output: "Derived show" (Runtime polymorphism via vtable)
    delete b;
    return 0;
}`
            },
            followUps: [
              'Why is it critical to have a virtual destructor in a polymorphic base class?',
              'What is a pure virtual function and an abstract class?'
            ],
            level: 'Intermediate',
            tags: ['C++', 'Polymorphism', 'OOP', 'Vtable']
          }
        ]
      },
      {
        id: 'csharp',
        name: 'C# / .NET Core',
        badge: 'Enterprise Backend',
        overview:
          'C# is a modern, object-oriented language running on the .NET runtime (CLR). It features strong typing, automatic garbage collection, LINQ, and asynchronous programming (`async`/`await`).',
        keyConcepts: [
          'Common Language Runtime (CLR), IL (Intermediate Language), and JIT compilation',
          'Value Types (struct) vs Reference Types (class)',
          'LINQ (Language Integrated Query) for querying collections and databases',
          'Async/Await with `Task` and `Task<T>`',
          'Dependency Injection (Transient, Scoped, Singleton) in ASP.NET Core',
          'Garbage Collection generations (Gen 0, Gen 1, Gen 2)',
        ],
        commonMistakes: [
          'Registering DbContext as Singleton instead of Scoped in ASP.NET Core DI.',
          'Using `.Result` or `.Wait()` on asynchronous Tasks, which causes thread-pool starvation or deadlocks.',
          'Forgetting to dispose unmanaged resources (use `using` statements / `IDisposable`).',
        ],
        questions: [
          {
            id: 'cs-1',
            question: 'Explain the difference between Value Types and Reference Types in C#.',
            shortAnswer:
              'Value types (int, float, bool, struct, enum) hold their data directly and are typically allocated on the stack. Reference types (class, string, object, array, delegate) store a memory address pointing to the object on the managed heap.',
            detailedAnswer:
              'Copying a value type creates a distinct, independent copy of the value. Copying a reference type copies only the memory pointer; both variables refer to the exact same object on the heap. Value types derive from `System.ValueType` and cannot be `null` unless declared as nullable (`int?`).',
            codeSnippet: {
              language: 'csharp',
              code: `// Value type
int a = 10;
int b = a;
b = 20;
// a is still 10

// Reference type
public class Person { public string Name { get; set; } }
Person p1 = new Person { Name = "Umesh" };
Person p2 = p1;
p2.Name = "Updated";
// p1.Name is now "Updated" because both point to the same heap object`
            },
            followUps: [
              'What is boxing and unboxing in C# and how does it affect memory performance?',
              'When should you create a `struct` instead of a `class`?'
            ],
            level: 'Basic',
            tags: ['C#', 'Types', 'Memory', 'CLR']
          }
        ]
      }
    ]
  },
  {
    category: 'Frontend',
    skills: [
      {
        id: 'react',
        name: 'React.js',
        badge: 'Core UI Framework',
        overview:
          'React is a declarative component-based UI library. Its core mechanics include the Virtual DOM, reconciliation algorithm (React Fiber), one-way data flow, and functional component Hooks for state and lifecycle management.',
        keyConcepts: [
          'Virtual DOM and Fiber Reconciliation (diffing algorithm, heuristic O(n))',
          'Rules of Hooks (call only at top level, only in React functional components)',
          'useEffect pitfalls: stale closures, dependency array omissions, infinite re-render loops',
          'Performance optimization: React.memo, useMemo, useCallback',
          'State management: Prop drilling vs Context API vs Redux Toolkit vs Zustand',
          'Synthetic Event System and event delegation on document root',
          'Controlled vs Uncontrolled Components',
        ],
        commonMistakes: [
          'Using array index as `key` prop when rendering dynamic or reorderable lists.',
          'Mutating state directly (e.g. `state.items.push(x)`) instead of creating new object/array references.',
          'Missing cleanup functions in `useEffect` when setting up timers, subscriptions, or WebSocket listeners.',
          'Wrapping every single variable and function in `useMemo`/`useCallback` indiscriminately, adding unnecessary overhead.',
        ],
        questions: [
          {
            id: 'react-1',
            question: 'How does React Virtual DOM and the Fiber Reconciliation algorithm work?',
            shortAnswer:
              'React maintains an in-memory lightweight representation of the real DOM (Virtual DOM). When state changes, React builds a new virtual tree, computes the minimal difference using Fiber reconciliation, and applies batched updates to the real DOM.',
            detailedAnswer:
              'Standard DOM operations are slow because they trigger style calculation, layout, and repaint. React diffs two VDOM trees using heuristics: 1) Two elements of different types produce different trees, 2) Keys allow React to match children across renders. React 16+ introduced the Fiber reconciler, which breaks rendering work into incremental units, allowing the browser to prioritize user interactions and pause/resume rendering without freezing the main thread.',
            codeSnippet: {
              language: 'jsx',
              code: `// Why keys matter in Reconciliation:
function TodoList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        // Good: unique persistent ID prevents DOM destruction and re-creation
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}`
            },
            followUps: [
              'What happens if you use `Math.random()` as a key in React list rendering?',
              'What is the difference between the Render phase and the Commit phase in React Fiber?'
            ],
            level: 'Basic',
            tags: ['React', 'Virtual DOM', 'Reconciliation', 'Fiber']
          },
          {
            id: 'react-2',
            question: 'What are the rules of Hooks, and why can’t Hooks be called inside loops or conditions?',
            shortAnswer:
              'Hooks must only be called at the top level of React function components and never inside loops, conditions, or nested functions. React relies on the exact invocation order of Hooks across renders to associate internal state to the component.',
            detailedAnswer:
              'Under the hood, React does not track Hooks by name; it maintains a singly linked list of Hook nodes for each component fiber (`memoizedState`). During every re-render, React steps through this linked list sequentially. If a Hook is conditionally skipped or placed in a dynamic loop, the order shifts, causing subsequent Hook calls to read or update the wrong state node.',
            codeSnippet: {
              language: 'jsx',
              code: `// ❌ BAD: Conditional hook call alters Hook linked-list order
function Profile({ userId }) {
  if (!userId) {
    return <p>Select a user</p>; // Hook below will be skipped!
  }
  const [profile, setProfile] = useState(null); // VIOLATION!
  return <div>{profile?.name}</div>;
}

// ✅ GOOD: Call all hooks at top level unconditionally
function ProfileCorrect({ userId }) {
  const [profile, setProfile] = useState(null);
  
  if (!userId) {
    return <p>Select a user</p>;
  }
  return <div>{profile?.name}</div>;
}`
            },
            followUps: [
              'How does ESLint `eslint-plugin-react-hooks` enforce this rule at compile time?',
              'How does React associate state with a specific component instance without passing an instance ID?'
            ],
            level: 'Intermediate',
            tags: ['React', 'Hooks', 'useState', 'Internals']
          },
          {
            id: 'react-3',
            question: 'Compare `useMemo`, `useCallback`, and `React.memo`. When should you actually use them?',
            shortAnswer:
              '`React.memo` memoizes a component to prevent re-rendering when props have not changed. `useMemo` caches the result of an expensive calculation. `useCallback` caches a function definition to preserve referential equality between renders.',
            detailedAnswer:
              'In React, whenever a parent component re-renders, all child components re-render by default, and new function references are created. `React.memo` performs shallow prop comparison. If you pass an inline arrow function as a prop to a memoized child, the prop reference changes every time, breaking `React.memo`. Wrapping the callback in `useCallback` preserves the reference and avoids the child re-render. Premature memoization adds memory and dependency comparison overhead.',
            codeSnippet: {
              language: 'jsx',
              code: `import React, { useState, useMemo, useCallback } from 'react';

// Memoized child component (only re-renders if onItemSelect reference changes)
const ItemList = React.memo(({ onItemSelect }) => {
  console.log('ItemList rendered');
  return <button onClick={() => onItemSelect('Item 1')}>Select</button>;
});

function ParentContainer({ items }) {
  const [query, setQuery] = useState('');

  // 1. useMemo: Caches expensive filter result
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  // 2. useCallback: Preserves function identity across re-renders
  const handleSelect = useCallback((item) => {
    console.log('Selected:', item);
  }, []); // Empty dependencies = stable reference

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ItemList onItemSelect={handleSelect} />
    </div>
  );
}`
            },
            followUps: [
              'What is referential equality and how does it relate to JavaScript object memory addresses?',
              'Does useMemo guarantee that the value will never be recalculated even if memory is scarce?'
            ],
            level: 'Intermediate',
            tags: ['React', 'useMemo', 'useCallback', 'Performance']
          },
          {
            id: 'react-4',
            question: 'What is Stale Closure in React useEffect and how do you resolve it?',
            shortAnswer:
              'A stale closure occurs when an effect or asynchronous callback captures variables from an earlier render and continues to reference that outdated snapshot because it is missing from the dependency array.',
            detailedAnswer:
              'JavaScript functions close over the variables in scope when created. In React, each render has its own props and state. If `useEffect` or `setInterval` has an empty dependency array `[]`, it only captures variables from the initial render. To fix stale state: 1) Include all referenced state in the dependency array, 2) Use the functional state updater form `setCount(prev => prev + 1)`, 3) Use a `useRef` to hold mutable values without triggering re-renders.',
            codeSnippet: {
              language: 'jsx',
              code: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      // ❌ Stale closure if written as: setSeconds(seconds + 1)
      // ✅ Functional updater always gets freshest state value:
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup function!
  }, []); // Safe with functional updater

  return <div>Seconds: {seconds}</div>;
}`
            },
            followUps: [
              'How can `useRef` be used to store the latest callback without forcing useEffect to restart?',
              'Why does React 18 Strict Mode mount, unmount, and remount effects in development?'
            ],
            level: 'Advanced',
            tags: ['React', 'useEffect', 'Stale Closure', 'Async']
          }
        ]
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        badge: 'Production React Framework',
        overview:
          'Next.js is a full-stack React framework providing hybrid rendering strategies (SSR, SSG, ISR), the App Router with React Server Components (RSC), file-based routing, and built-in performance optimizations.',
        keyConcepts: [
          'Rendering Strategies: Client-Side Rendering (CSR), Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR)',
          'App Router vs Pages Router (React Server Components by default vs `getServerSideProps`)',
          'Server Components vs Client Components (`"use client"` boundary)',
          'Data Fetching and Caching (`fetch` cache controls: `force-cache`, `no-store`, `revalidate`)',
          'Next.js SEO: Metadata API, OpenGraph images, and dynamic sitemaps',
          'Next.js Middleware: Edge execution, auth redirects, and route guarding',
        ],
        commonMistakes: [
          'Adding `"use client"` at the top of every file, defeating the performance and bundle size benefits of Server Components.',
          'Trying to use browser APIs like `window`, `localStorage`, or `document` inside Server Components.',
          'Not configuring ISR revalidation correctly, resulting in either stale content or unnecessary origin server load.',
        ],
        questions: [
          {
            id: 'next-1',
            question: 'Explain SSR vs SSG vs ISR in Next.js. When would you choose each?',
            shortAnswer:
              'SSG builds static HTML at build time (fastest, best for blogs/docs). SSR renders HTML on every incoming request (best for highly dynamic, personalized dashboards). ISR updates static pages incrementally in the background without rebuilding the entire website.',
            detailedAnswer:
              '1) SSG (Static Site Generation): HTML generated once at `next build`. Served instantly via CDN with zero database latency. 2) SSR (Server-Side Rendering): HTML generated on each request on the Node.js server. Always up-to-date data, but slower Time to First Byte (TTFB). 3) ISR (Incremental Static Regeneration): Serves cached static page, but triggers a background revalidation after a defined revalidation window (e.g. `revalidate: 60`), updating the CDN cache smoothly.',
            codeSnippet: {
              language: 'typescript',
              code: `// Next.js App Router Data Fetching patterns:

// 1. SSG: Default static caching
async function getStaticData() {
  const res = await fetch('https://api.example.com/posts', { cache: 'force-cache' });
  return res.json();
}

// 2. SSR: Dynamic on every request
async function getDynamicData() {
  const res = await fetch('https://api.example.com/user/dashboard', { cache: 'no-store' });
  return res.json();
}

// 3. ISR: Revalidate in background every 60 seconds
async function getIncrementalData() {
  const res = await fetch('https://api.example.com/products', { next: { revalidate: 60 } });
  return res.json();
}`
            },
            followUps: [
              'What happens to a visitor who requests a page while ISR background revalidation is running?',
              'How does On-Demand Revalidation (`revalidatePath` / `revalidateTag`) work?'
            ],
            level: 'Intermediate',
            tags: ['Next.js', 'SSR', 'SSG', 'ISR', 'Rendering']
          },
          {
            id: 'next-2',
            question: 'What are React Server Components (RSC) and how does `"use client"` work in Next.js App Router?',
            shortAnswer:
              'Server Components render exclusively on the server and send zero JavaScript to the client bundle. The `"use client"` directive does NOT mean the component runs only on the client; it defines the boundary where client-side interactivity, state, and browser APIs are enabled.',
            detailedAnswer:
              'In the App Router, all components inside the `app` directory are Server Components by default. They can directly query databases, access server secrets, and keep heavy npm dependencies off client bundles. When a component requires interactivity (like `useState`, `useEffect`, `onClick`), you place `"use client"` at the top. Everything imported into that file becomes part of the client bundle.',
            codeSnippet: {
              language: 'tsx',
              code: `// app/courses/page.tsx (Server Component - Zero JS shipped to browser)
import db from '@/lib/db';
import EnrollmentButton from './EnrollmentButton'; // Client component

export default async function CoursesPage() {
  // Direct DB query on server:
  const courses = await db.course.findMany();

  return (
    <div>
      <h1>Available Courses</h1>
      {courses.map(course => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <EnrollmentButton courseId={course.id} />
        </div>
      ))}
    </div>
  );
}

// app/courses/EnrollmentButton.tsx
// "use client";
// export default function EnrollmentButton({ courseId }) {
//   return <button onClick={() => alert('Enrolled in ' + courseId)}>Enroll</button>;
// }`
            },
            followUps: [
              'Can you import a Server Component into a Client Component?',
              'How does serialization work when passing props from a Server Component to a Client Component?'
            ],
            level: 'Advanced',
            tags: ['Next.js', 'RSC', 'Server Components', 'Architecture']
          }
        ]
      },
      {
        id: 'html-css-tailwind',
        name: 'HTML5, CSS3 & Tailwind CSS',
        badge: 'Semantic Web & Styling',
        overview:
          'Modern responsive web development relies on semantic HTML5 structure, CSS layout models (Flexbox, CSS Grid), Box Model mechanics, and utility-first styling with Tailwind CSS for high maintainability.',
        keyConcepts: [
          'Semantic HTML elements (`<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`) and accessibility (ARIA)',
          'CSS Box Model: content, padding, border, margin, and `box-sizing: border-box`',
          'Flexbox (1D layouts, axis alignment) vs CSS Grid (2D layouts, grid-template-columns)',
          'CSS Specificity hierarchy (Inline > ID > Class/Attribute/Pseudo > Element > Universal)',
          'Tailwind CSS: JIT compiler, responsive prefixes (`md:`, `lg:`), arbitrary values, `@apply` directive',
          'Core Web Vitals: LCP (Largest Contentful Paint), FID/INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)',
        ],
        commonMistakes: [
          'Overusing `<div>` for everything instead of semantic HTML tags, harming accessibility and SEO.',
          'Not setting `box-sizing: border-box`, causing padding and borders to unexpectedly expand element widths.',
          'Hardcoding fixed pixel widths that break layouts on mobile devices.',
        ],
        questions: [
          {
            id: 'html-1',
            question: 'Explain the CSS Box Model and the difference between `content-box` and `border-box`.',
            shortAnswer:
              'The CSS Box Model consists of content, padding, border, and margin. Under `content-box`, `width` applies only to the content area, so adding padding/border expands total element width. Under `border-box`, `width` includes content, padding, and border.',
            detailedAnswer:
              'With `box-sizing: content-box` (default), setting `width: 200px; padding: 20px; border: 5px solid black;` results in a total rendered width of 250px (200 + 40 + 10). With `box-sizing: border-box`, the rendered width remains exactly 200px; the browser shrinks the content area to 150px to accommodate padding and border. Modern resets apply `* { box-sizing: border-box; }` globally.',
            codeSnippet: {
              language: 'css',
              code: `/* Standard modern CSS box-sizing reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`
            },
            followUps: [
              'What is margin collapsing and under what conditions does it occur?',
              'How does margin collapsing behave between parent and first/last child?'
            ],
            level: 'Basic',
            tags: ['CSS', 'Box Model', 'Layout', 'Basics']
          },
          {
            id: 'css-2',
            question: 'When should you choose Flexbox over CSS Grid, and what are their architectural differences?',
            shortAnswer:
              'Flexbox is designed for 1-dimensional layouts (either in a row or in a column). CSS Grid is designed for 2-dimensional layouts (handling both rows and columns simultaneously).',
            detailedAnswer:
              'Flexbox works from the content outward: items define their size, and the flex container arranges them along a main axis and cross axis. CSS Grid works from the container inward: you define a rigid coordinate grid system (`grid-template-columns`, `grid-template-rows`), and items place themselves into explicit grid cells. Use Flexbox for navbars, toolbars, and card content; use Grid for page-level layouts, photo galleries, and dashboard widgets.',
            codeSnippet: {
              language: 'html',
              code: `<!-- Tailwind Responsive 2D Grid with 1D Flex Card items -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  <div class="flex flex-col justify-between border rounded-lg p-4">
    <h3 class="font-bold">Card Title</h3>
    <p class="text-slate-600">Card content description...</p>
    <div class="flex items-center justify-end mt-4">
      <button class="bg-indigo-600 text-white px-4 py-2 rounded">Action</button>
    </div>
  </div>
</div>`
            },
            followUps: [
              'What is the difference between `justify-content` and `align-items` in Flexbox?',
              'How does `auto-fit` with `minmax()` create responsive grids without media queries?'
            ],
            level: 'Basic',
            tags: ['CSS', 'Flexbox', 'CSS Grid', 'Tailwind']
          }
        ]
      }
    ]
  },
  {
    category: 'Backend',
    skills: [
      {
        id: 'nodejs-express',
        name: 'Node.js & Express.js',
        badge: 'Core Backend Runtime & API Framework',
        overview:
          'Node.js is an asynchronous, event-driven JavaScript runtime built on Chrome\'s V8 engine and libuv. Express.js is a minimalist web framework providing routing, middleware pipelines, and HTTP utilities for REST APIs.',
        keyConcepts: [
          'Node.js Architecture: V8 engine, Libuv thread pool (default 4 threads), Event Loop phases (Timers, Pending I/O, Idle/Prepare, Poll, Check, Close)',
          'Express Middleware pipeline: `(req, res, next) => {}` and error-handling middleware `(err, req, res, next)`',
          'Streams and Buffers (Readable, Writable, Duplex, Transform) for large data transfers',
          'Authentication using JWT (JSON Web Tokens), Refresh tokens, and HTTP-only cookies',
          'Security best practices: Helmet.js, CORS, express-rate-limit, input validation with Joi/Zod',
          'Cluster module and PM2 for multi-core scaling',
        ],
        commonMistakes: [
          'Blocking the Event Loop with heavy synchronous computations (e.g. `JSON.parse` on huge payloads or sync crypto/fs).',
          'Forgetting to call `next(err)` or return after sending a response, triggering `ERR_HTTP_HEADERS_SENT`.',
          'Storing sensitive JWT secrets or plaintext passwords in code instead of environment variables.',
          'Not handling unhandled promise rejections (`process.on("unhandledRejection")`).',
        ],
        questions: [
          {
            id: 'node-1',
            question: 'How does the Node.js Event Loop work with Libuv, and why is it non-blocking?',
            shortAnswer:
              'Node.js delegates asynchronous I/O tasks (file system, DNS, crypto, network requests) to Libuv. Libuv uses OS kernel primitives (epoll/kqueue) or an internal thread pool to process them in the background, firing callbacks onto the event loop when finished.',
            detailedAnswer:
              'The main JavaScript thread executes synchronous code on the call stack. When an async operation is called (e.g. `fs.readFile` or `http.get`), Node hands it over to Libuv. Libuv executes it on a worker thread or kernel poll, and pushes the callback to the Event Loop queues. The Event Loop cycles through phases: 1) Timers (setTimeout), 2) Pending callbacks, 3) Poll (I/O events), 4) Check (setImmediate), 5) Close callbacks. Microtasks (`process.nextTick` and Promises) are processed between every phase.',
            codeSnippet: {
              language: 'javascript',
              code: `// Libuv thread pool in action (Crypto runs in libuv thread pool)
const crypto = require('crypto');

const start = Date.now();
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', () => {
    console.log(\`Task \${i + 1} finished in: \${Date.now() - start}ms\`);
  });
}
// All 4 finish almost together if CPU has 4+ cores (default UV_THREADPOOL_SIZE=4)`
            },
            followUps: [
              'What happens if you run 8 pbkdf2 tasks with default UV_THREADPOOL_SIZE=4?',
              'How does `setImmediate()` differ from `process.nextTick()`?'
            ],
            level: 'Intermediate',
            tags: ['Node.js', 'Libuv', 'Event Loop', 'Threading']
          },
          {
            id: 'node-2',
            question: 'How do Express.js middleware work, and how does error-handling middleware differ from regular middleware?',
            shortAnswer:
              'Middleware functions have access to `req`, `res`, and the `next` function. They execute sequentially in the order registered. Regular middleware takes 3 arguments `(req, res, next)`. Error-handling middleware must take 4 arguments `(err, req, res, next)`.',
            detailedAnswer:
              'Express maintains a middleware routing stack. Calling `next()` passes control to the next middleware in line. Calling `next(err)` with an argument instructs Express to skip all remaining regular middleware and jump directly to the nearest 4-argument error-handling middleware. If the error middleware does not call `next(err)`, it terminates the request-response cycle with an error payload.',
            codeSnippet: {
              language: 'javascript',
              code: `const express = require('express');
const app = express();

app.use(express.json());

// 1. Regular auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error); // Jumps directly to error-handling middleware!
  }
  next();
}

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'Secure data' });
});

// 2. Global Error Handling Middleware (must have 4 arguments!)
app.use((err, req, res, next) => {
  console.error('[Error caught]:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});`
            },
            followUps: [
              'What happens if an asynchronous route throws an error without a try/catch in Express 4 vs Express 5?',
              'Why must the 4-argument error handler be placed at the very end of app.js?'
            ],
            level: 'Intermediate',
            tags: ['Express.js', 'Middleware', 'Error Handling', 'Backend']
          },
          {
            id: 'node-3',
            question: 'What are Node.js Streams, and why should you use them instead of `fs.readFile` for large files?',
            shortAnswer:
              'Streams process data sequentially in chunks rather than buffering the entire file into memory at once. For a 2GB file, `fs.readFile` requires 2GB of RAM and can crash the process; streams consume only a few kilobytes of buffer memory.',
            detailedAnswer:
              'There are 4 types of streams: Readable, Writable, Duplex (e.g. TCP socket), and Transform (e.g. zlib compression). Streams handle "backpressure"—a mechanism where the readable stream pauses producing data if the writable stream\'s internal buffer (`highWaterMark`) is full, preventing memory exhaustion. In Node, `pipeline(readable, transform, writable, callback)` safely pipes streams while handling errors and cleanup.',
            codeSnippet: {
              language: 'javascript',
              code: `const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
  // ❌ BAD: Loads entire 1GB file into RAM before sending
  // fs.readFile('huge-export.csv', (err, data) => res.end(data));

  // ✅ GOOD: Streams chunks to client via HTTP with minimal RAM usage
  const stream = fs.createReadStream('huge-export.csv');
  res.setHeader('Content-Type', 'text/csv');
  stream.pipe(res);
  stream.on('error', (err) => {
    res.statusCode = 500;
    res.end('File read error');
  });
}).listen(3000);`
            },
            followUps: [
              'What is backpressure in streams and how does .pipe() handle it automatically?',
              'How does Node.js `stream/promises` pipeline improve error management?'
            ],
            level: 'Advanced',
            tags: ['Node.js', 'Streams', 'Memory', 'Performance']
          }
        ]
      },
      {
        id: 'fastapi',
        name: 'FastAPI',
        badge: 'High-Performance Python Web API',
        overview:
          'FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints, Starlette for web tooling, and Pydantic for data validation.',
        keyConcepts: [
          'Asynchronous concurrency (`async def` with ASGI servers like Uvicorn)',
          'Automatic request data validation and serialization via Pydantic schemas',
          'Automatic OpenAPI (Swagger UI) documentation generation (`/docs` and `/redoc`)',
          'FastAPI Dependency Injection system (`Depends`) for auth, database sessions, and permissions',
          'Background tasks (`BackgroundTasks`) for non-blocking asynchronous email or logging jobs',
        ],
        commonMistakes: [
          'Using blocking synchronous libraries (e.g. `requests.get` or sync DB drivers) inside `async def` routes, blocking the single event loop thread.',
          'Not using Pydantic models for request bodies, leading to manual error-prone validation.',
        ],
        questions: [
          {
            id: 'fast-1',
            question: 'How does FastAPI achieve high performance, and how does its Dependency Injection system work?',
            shortAnswer:
              'FastAPI is built on Starlette and Pydantic, running on ASGI (Asynchronous Server Gateway Interface) via Uvicorn. Its `Depends()` mechanism allows modular, hierarchical injection of database connections, auth tokens, and business logic into route handlers.',
            detailedAnswer:
              'Because FastAPI leverages Python type hints and the `asyncio` event loop, I/O operations are non-blocking. When a route depends on `current_user = Depends(get_current_user)`, FastAPI automatically resolves dependencies recursively before executing the endpoint, handling database session cleanup using python `yield` statements.',
            codeSnippet: {
              language: 'python',
              code: `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel

app = FastAPI()

class ItemCreate(BaseModel):
    name: str
    price: float

# Dependency for authentication
def verify_token(token: str):
    if token != "secret-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user": "admin"}

@app.post("/items/")
async def create_item(item: ItemCreate, user: dict = Depends(verify_token)):
    # Automatically validated via Pydantic + Dependency satisfied
    return {"message": "Created", "item": item, "by": user["user"]}`
            },
            followUps: [
              'What is the difference between defining a route with `async def` vs regular `def` in FastAPI?',
              'How does `yield` in a FastAPI dependency handle resource teardown (e.g. closing DB connections)?'
            ],
            level: 'Intermediate',
            tags: ['Python', 'FastAPI', 'Pydantic', 'Async']
          }
        ]
      },
      {
        id: 'aspnet-core',
        name: 'ASP.NET Core',
        badge: 'Enterprise C# Web Framework',
        overview:
          'ASP.NET Core is an open-source, cross-platform framework for building modern cloud-based web applications, microservices, and REST APIs with C#.',
        keyConcepts: [
          'Dependency Injection lifetimes: Transient, Scoped, Singleton',
          'Middleware pipeline in `Program.cs` (`app.UseAuthentication()`, `app.UseAuthorization()`)',
          'Entity Framework Core (EF Core): Code-First migrations, DbContext, change tracking',
          'Model validation using Data Annotations (`[Required]`, `[EmailAddress]`)',
        ],
        commonMistakes: [
          'Registering a Scoped service (like `DbContext`) inside a Singleton service.',
          'Overusing client-side evaluation in LINQ queries instead of generating SQL on the database server.',
        ],
        questions: [
          {
            id: 'asp-1',
            question: 'Explain the three service lifetimes in ASP.NET Core Dependency Injection: Transient, Scoped, and Singleton.',
            shortAnswer:
              'Transient services are created each time they are requested. Scoped services are created once per client HTTP request. Singleton services are created once the first time they are requested and stay in memory throughout the lifetime of the application.',
            detailedAnswer:
              '1) Transient (`AddTransient`): Lightweight, stateless services. A new instance is created every time a class requests it via constructor injection. 2) Scoped (`AddScoped`): Ideal for stateful request-scoped operations like Entity Framework\'s `DbContext`. All classes participating in the same HTTP request share the same instance. 3) Singleton (`AddSingleton`): Ideal for caching, application configuration, or connection multiplexers. Beware: injecting a Scoped service into a Singleton creates a captured dependency bug.',
            codeSnippet: {
              language: 'csharp',
              code: `// Program.cs in ASP.NET Core:
var builder = WebApplication.CreateBuilder(args);

// 1. Transient: Created on every injection
builder.Services.AddTransient<IEmailSender, EmailSender>();

// 2. Scoped: Created once per incoming HTTP request
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connString));

// 3. Singleton: Created once for the entire application life
builder.Services.AddSingleton<ICacheManager, MemoryCacheManager>();`
            },
            followUps: [
              'What happens if you inject a Scoped service into a Singleton service?',
              'How does ASP.NET Core validate scopes in development environment?'
            ],
            level: 'Intermediate',
            tags: ['ASP.NET Core', 'C#', 'Dependency Injection', 'Architecture']
          }
        ]
      }
    ]
  },
  {
    category: 'Databases',
    skills: [
      {
        id: 'sql-postgres',
        name: 'SQL & PostgreSQL',
        badge: 'Relational Database Management System',
        overview:
          'PostgreSQL is an advanced, enterprise-grade open-source relational database. Essential topics include relational modeling, ACID guarantees, SQL joins, B-Tree and GIN indexing, transactions, and query optimization using EXPLAIN ANALYZE.',
        keyConcepts: [
          'ACID properties: Atomicity, Consistency, Isolation, Durability',
          'Transaction Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
          'SQL Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS JOIN',
          'Indexing types: B-Tree, Hash, GIN, GiST, Composite Indexes, Partial Indexes',
          'Database Normalization (1NF, 2NF, 3NF, BCNF) vs intentional denormalization',
          'Query optimization: EXPLAIN ANALYZE, sequential scan vs index scan, N+1 query problem',
          'Advanced SQL: Window functions (`ROW_NUMBER()`, `RANK()`, `PARTITION BY`), CTEs (`WITH` clauses)',
        ],
        commonMistakes: [
          'Indexing every column indiscriminately, which degrades INSERT and UPDATE performance.',
          'Suffering from the N+1 query problem by querying foreign keys in application loops instead of JOINing.',
          'Not using transactions (`BEGIN ... COMMIT`) for multi-step monetary or inventory operations.',
          'Using `SELECT *` in production queries instead of selecting only required columns.',
        ],
        questions: [
          {
            id: 'sql-1',
            question: 'Explain ACID properties in relational databases with an everyday banking transaction example.',
            shortAnswer:
              'ACID guarantees reliable database transactions: Atomicity (all or nothing), Consistency (preserves schema constraints and rules), Isolation (concurrent transactions do not interfere with each other), Durability (committed data survives server crashes).',
            detailedAnswer:
              'Consider transferring $100 from Account A to Account B: 1) Atomicity: If debiting A succeeds but crediting B fails due to network error, the entire transaction is rolled back so money doesn\'t vanish. 2) Consistency: Account balance cannot violate foreign keys, check constraints (e.g. balance >= 0). 3) Isolation: If two transfers happen at the same time, intermediate uncommitted balances are hidden according to isolation level. 4) Durability: Once COMMIT is acknowledged, the transaction is written to the Write-Ahead Log (WAL) on disk and remains intact even during a power outage.',
            codeSnippet: {
              language: 'sql',
              code: `BEGIN TRANSACTION;

-- Deduct 100 from Account A
UPDATE accounts 
SET balance = balance - 100 
WHERE id = 1 AND balance >= 100;

-- Credit 100 to Account B
UPDATE accounts 
SET balance = balance + 100 
WHERE id = 2;

-- If any statement fails, issue ROLLBACK;
COMMIT;`
            },
            followUps: [
              'What is Dirty Read, Non-repeatable Read, and Phantom Read?',
              'How does Postgres implement Multi-Version Concurrency Control (MVCC) without table-level read locks?'
            ],
            level: 'Basic',
            tags: ['SQL', 'PostgreSQL', 'ACID', 'Transactions']
          },
          {
            id: 'sql-2',
            question: 'Explain SQL Joins (INNER, LEFT, RIGHT, FULL) and when to use each.',
            shortAnswer:
              'INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right (NULL if no match). RIGHT JOIN is the inverse. FULL OUTER JOIN returns all rows from both tables, filling NULLs where there is no match.',
            detailedAnswer:
              'Joins combine columns from one or more tables based on a related column between them. In e-commerce: 1) `INNER JOIN`: get users who have placed orders (excludes users with zero orders). 2) `LEFT JOIN`: get all users along with their orders (includes users with 0 orders, where order columns appear as NULL). 3) `FULL OUTER JOIN`: get all users and all orders, even orphaned orders with deleted user references.',
            codeSnippet: {
              language: 'sql',
              code: `-- Find all users and their total order count (even users with 0 orders)
SELECT 
    u.id AS user_id, 
    u.name, 
    COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`
            },
            followUps: [
              'What is a CROSS JOIN and what is its computational complexity?',
              'How does Postgres choose between Nested Loop, Hash Join, and Merge Join in query execution plans?'
            ],
            level: 'Basic',
            tags: ['SQL', 'Joins', 'Relational Database']
          },
          {
            id: 'sql-3',
            question: 'How do B-Tree indexes work, and what is the difference between Sequential Scan and Index Scan in EXPLAIN ANALYZE?',
            shortAnswer:
              'A B-Tree index is a balanced tree data structure that allows logarithmic O(log N) search, insertion, and deletion. A Sequential Scan reads the entire table from disk row by row; an Index Scan traverses the B-Tree index to locate matching row pointers directly.',
            detailedAnswer:
              'Without an index, Postgres must perform a Sequential Scan (Seq Scan) reading every page from disk. When an index exists on a queried column (e.g. `WHERE email = ?`), Postgres performs an Index Scan or Bitmap Index Scan, reading only the relevant index pages and fetching matching row tuples. However, if a query returns 80% of table rows, Postgres\'s cost-based query optimizer may intentionally choose a Seq Scan because jumping between index and disk pages is slower than sequential reads.',
            codeSnippet: {
              language: 'sql',
              code: `-- Create a B-Tree index on email column
CREATE INDEX idx_users_email ON users(email);

-- Analyze the query execution plan
EXPLAIN ANALYZE 
SELECT * FROM users WHERE email = 'umeshtemburwar2002@gmail.com';
-- Look for: "Index Scan using idx_users_email on users"`
            },
            followUps: [
              'What is a Composite Index, and how does the Leftmost Prefix Rule apply to it?',
              'Why does using `WHERE LOWER(name) = "umesh"` cause Postgres to ignore a normal index on `name`?'
            ],
            level: 'Intermediate',
            tags: ['SQL', 'PostgreSQL', 'Indexing', 'Optimization']
          },
          {
            id: 'sql-4',
            question: 'What are SQL Window Functions and how do they differ from `GROUP BY`?',
            shortAnswer:
              'Window functions perform calculations across a set of table rows related to the current row, but unlike `GROUP BY`, they do NOT collapse rows into a single summary row. Each original row retains its individual identity.',
            detailedAnswer:
              'Window functions use the `OVER (PARTITION BY ... ORDER BY ...)` clause. Common window functions include `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, and `LAG()`. They are frequently used in analytics, pagination, finding the top N records per department, and calculating running totals.',
            codeSnippet: {
              language: 'sql',
              code: `-- Get the top 2 highest-priced spare parts per category
WITH RankedParts AS (
    SELECT 
        part_name,
        category,
        price,
        DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) as rank_num
    FROM spare_parts
)
SELECT part_name, category, price
FROM RankedParts
WHERE rank_num <= 2;`
            },
            followUps: [
              'What is the difference between `RANK()` and `DENSE_RANK()` when prices are identical?',
              'How can `LEAD()` or `LAG()` be used to detect month-over-month revenue growth in SQL?'
            ],
            level: 'Advanced',
            tags: ['SQL', 'PostgreSQL', 'Window Functions', 'Analytics']
          }
        ]
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        badge: 'NoSQL Document Database',
        overview:
          'MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents. Core concepts include schema design (embedding vs referencing), indexing, and Aggregation Pipelines.',
        keyConcepts: [
          'Document model (BSON format, dynamic schemas, flexible collections)',
          'Data Modeling: Embedding (1:Few, denormalized) vs Referencing (1:Many, 1:Squillions, normalized with ObjectId)',
          'Aggregation Pipeline framework (`$match`, `$group`, `$project`, `$unwind`, `$lookup`, `$sort`)',
          'Indexing strategies (Single field, Compound, Multikey, TTL indexes)',
          'Replica Sets for High Availability (Primary-Secondary failover) and Sharding for horizontal scaling',
        ],
        commonMistakes: [
          'Unbounded array growth (embedding thousands of comments or sub-items inside a single document beyond MongoDB\'s 16MB document limit).',
          'Using MongoDB like a relational database with dozens of `$lookup` (JOIN) operations instead of embracing document modeling.',
          'Performing unindexed queries that result in a `COLLSCAN` (Collection Scan) across millions of documents.',
        ],
        questions: [
          {
            id: 'mongo-1',
            question: 'When should you Embed documents versus Reference documents in MongoDB schema design?',
            shortAnswer:
              'Embed when data has a 1:1 or bounded 1:Few relationship, data is read together, and updates happen atomically (e.g. user address). Reference when data has an unbounded 1:Many relationship, data is queried independently, or to prevent exceeding the 16MB document limit.',
            detailedAnswer:
              'Embedding keeps related data together in one physical BSON document, giving fast single-query reads without JOINs. However, if arrays grow without bound (e.g. logs, messages, or large comment threads), the document risks hitting MongoDB\'s 16MB BSON size limit and causes disk rewriting overhead. Referencing stores separate documents in separate collections linked by `ObjectId`, similar to relational foreign keys.',
            codeSnippet: {
              language: 'javascript',
              code: `// 1. EMBEDDED: Address read whenever User is fetched (1:Few, bounded)
const userSchema = {
  name: "Umesh",
  email: "umeshtemburwar2002@gmail.com",
  address: { street: "Station Road", city: "Ambajogai", pincode: "431517" }
};

// 2. REFERENCED: Orders grow continuously over years (Unbounded 1:Many)
const orderSchema = {
  userId: ObjectId("65123abc456def7890"), // Reference pointer
  orderTotal: 4500,
  createdAt: new Date()
};`
            },
            followUps: [
              'What is the 16MB document size limit in MongoDB and why does it exist?',
              'How does MongoDB handle atomic updates on embedded arrays using `$` positional operators?'
            ],
            level: 'Basic',
            tags: ['MongoDB', 'Schema Design', 'NoSQL', 'Embedding']
          },
          {
            id: 'mongo-2',
            question: 'Explain the MongoDB Aggregation Pipeline and how stages like `$match`, `$group`, and `$lookup` work.',
            shortAnswer:
              'The Aggregation Pipeline processes documents sequentially through a multi-stage pipeline, where each stage transforms the documents and passes the output to the next stage (similar to UNIX pipe commands).',
            detailedAnswer:
              '`$match` filters documents early (uses indexes if placed first). `$group` aggregates documents by an identifier and calculates metrics (e.g. `$sum`, `$avg`). `$lookup` performs an equality join to another collection. `$project` reshapes the output fields. `$sort` and `$limit` paginate the results.',
            codeSnippet: {
              language: 'javascript',
              code: `// Calculate total revenue and units sold per automobile spare part category:
db.inventory.aggregate([
  // Stage 1: Filter only in-stock parts (uses index on stockStatus)
  { $match: { stockStatus: 'IN_STOCK' } },
  
  // Stage 2: Group by category and compute totals
  { 
    $group: {
      _id: '$category',
      totalParts: { $sum: 1 },
      totalInventoryValue: { $sum: { $multiply: ['$price', '$quantity'] } }
    }
  },
  
  // Stage 3: Sort by highest inventory value first
  { $sort: { totalInventoryValue: -1 } }
]);`
            },
            followUps: [
              'Why is it critical to place the `$match` stage at the very beginning of an aggregation pipeline?',
              'What is the 100MB RAM limit per aggregation stage and how does `allowDiskUse: true` help?'
            ],
            level: 'Intermediate',
            tags: ['MongoDB', 'Aggregation', 'Query', 'Analytics']
          }
        ]
      },
      {
        id: 'supabase-firebase',
        name: 'Supabase & Firebase (BaaS)',
        badge: 'Backend-as-a-Service & Realtime DB',
        overview:
          'Supabase is an open-source Firebase alternative powered by PostgreSQL, providing auto-generated REST/GraphQL APIs, Auth, and Storage. Firebase provides NoSQL Firestore, Realtime Database, and Cloud Functions.',
        keyConcepts: [
          'Supabase: Postgres Database with Row-Level Security (RLS) policies for direct client queries',
          'Supabase Auth: JWT-based authentication, OAuth providers, and user management',
          'Supabase Storage: S3-compatible bucket storage for images, documents, and videos',
          'Firebase: Firestore document model, offline persistence, and security rules',
          'Realtime subscriptions: WebSocket-driven updates on table changes',
        ],
        commonMistakes: [
          'Exposing the Supabase `service_role` key in frontend code instead of the public `anon` key.',
          'Enabling Row Level Security (RLS) on a table without creating any policies, which inadvertently blocks all client reads and writes.',
        ],
        questions: [
          {
            id: 'supa-1',
            question: 'What is Supabase Row Level Security (RLS) and how does it secure client-side queries without a backend?',
            shortAnswer:
              'Row Level Security (RLS) is a PostgreSQL feature that evaluates boolean security policies directly in the database engine for every query, restricting which rows a user can SELECT, INSERT, UPDATE, or DELETE based on their authenticated JWT (`auth.uid()`).',
            detailedAnswer:
              'With RLS enabled, frontend applications can query Supabase directly using the `@supabase/supabase-js` client and the public `anon` key. When the user logs in, Supabase issues a signed JWT containing `auth.uid()`. PostgreSQL inspects this JWT on every query and applies the RLS policy automatically. Even if a malicious user inspects the network request and alters the query to `SELECT * FROM courses`, Postgres filters the rows at database level.',
            codeSnippet: {
              language: 'sql',
              code: `-- Enable RLS on the table
ALTER TABLE student_certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Students can only view their OWN certificates
CREATE POLICY "Students can view own certificates"
ON student_certificates
FOR SELECT
USING (auth.uid() = student_id);

-- Policy: Only Admins can insert certificates
CREATE POLICY "Admins can issue certificates"
ON student_certificates
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);`
            },
            followUps: [
              'What is the danger of exposing the Supabase `service_role` key on the client?',
              'How do you write an RLS policy for public read-only access (e.g. course catalogue)?'
            ],
            level: 'Intermediate',
            tags: ['Supabase', 'RLS', 'PostgreSQL', 'Security']
          }
        ]
      }
    ]
  },
  {
    category: 'Auth & Storage',
    skills: [
      {
        id: 'auth-storage',
        name: 'Supabase Auth & Storage',
        badge: 'Identity & Media Infrastructure',
        overview:
          'Modern full-stack applications handle authentication using JSON Web Tokens (JWT) and role-based permissions, paired with cloud object storage for binary assets (certificates, invoices, profile avatars).',
        keyConcepts: [
          'JWT Structure: Header (algorithm), Payload (claims, expiry, user ID), Signature (HMAC/RSA)',
          'Access Token (short-lived, e.g. 15 min) vs Refresh Token (long-lived, stored securely in HTTP-only cookie)',
          'Role-Based Access Control (RBAC): Admin, Instructor, Student, Guest permissions',
          'Supabase Storage Buckets: Public vs Private buckets, MIME type restrictions, and signed URLs',
          'CSRF (Cross-Site Request Forgery) vs XSS (Cross-Site Scripting) attack prevention',
        ],
        commonMistakes: [
          'Storing JWT access tokens in `localStorage`, making them vulnerable to Cross-Site Scripting (XSS) attacks.',
          'Not validating file extensions AND MIME types during file uploads, allowing arbitrary malicious file execution.',
        ],
        questions: [
          {
            id: 'auth-1',
            question: 'How does JSON Web Token (JWT) authentication work, and why should access tokens be short-lived?',
            shortAnswer:
              'A JWT is a stateless, cryptographically signed token containing user claims. Access tokens are kept short-lived (e.g. 15-60 min) so that if a token is intercepted, the attacker\'s window of access is strictly limited before requiring a refresh token rotation.',
            detailedAnswer:
              'A JWT consists of Header.Payload.Signature. The server verifies the signature using a private secret key without making a database lookup (stateless). When the short-lived access token expires, the client uses a secure, HTTP-only refresh token to request a new access token from the auth server. If a user changes their password or is banned, the server invalidates the refresh token in the database, locking the user out once their current access token expires.',
            codeSnippet: {
              language: 'javascript',
              code: `// Supabase client auth sign-in and session retrieval:
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login user:
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'student@example.com',
  password: 'SecurePassword123!',
});

// Access current authenticated user ID:
const userId = data.user?.id;
const accessToken = data.session?.access_token;`
            },
            followUps: [
              'Can a JWT payload be read by anyone if it is not encrypted?',
              'How does Refresh Token Rotation prevent replay attacks?'
            ],
            level: 'Basic',
            tags: ['Auth', 'JWT', 'Security', 'Supabase']
          },
          {
            id: 'auth-2',
            question: 'How do you securely handle file uploads using Supabase Storage or S3 signed URLs?',
            shortAnswer:
              'Instead of proxying multi-megabyte file uploads through your backend server, generate a pre-signed upload URL with strict file type, size, and expiration limits, allowing the client to upload directly to the storage bucket.',
            detailedAnswer:
              'Proxying large file uploads through a Node.js/Express server wastes server memory, bandwidth, and CPU threads. Direct client upload with signed URLs works in three steps: 1) Client requests an upload token/signed URL from the backend or Supabase client, 2) Storage validates permissions via RLS or signed policies, 3) Client uploads the file directly to object storage via HTTP PUT. For private documents like course certificates or invoices, generate signed download URLs that expire after 10-60 minutes.',
            codeSnippet: {
              language: 'typescript',
              code: `// Uploading assignment file to Supabase Storage with size and type checks:
async function uploadAssignment(file: File, studentId: string) {
  // 1. Client-side validation: Max 5MB, PDF only
  if (file.size > 5 * 1024 * 1024) throw new Error('File exceeds 5MB limit');
  if (file.type !== 'application/pdf') throw new Error('Only PDF files allowed');

  const filePath = \`assignments/\${studentId}/\${Date.now()}_\${file.name}\`;

  const { data, error } = await supabase.storage
    .from('course-submissions')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data.path;
}`
            },
            followUps: [
              'Why is it insecure to rely solely on the file extension (`.pdf`) for upload validation?',
              'How do private bucket policies differ from public bucket policies in Supabase Storage?'
            ],
            level: 'Intermediate',
            tags: ['Storage', 'Supabase', 'Uploads', 'Security']
          }
        ]
      }
    ]
  },
  {
    category: 'Tools & Technologies',
    skills: [
      {
        id: 'git-github',
        name: 'Git & GitHub',
        badge: 'Version Control & Collaboration',
        overview:
          'Git is a distributed version control system tracking source code history. GitHub provides cloud repository hosting, pull requests, code reviews, and CI/CD automation via GitHub Actions.',
        keyConcepts: [
          'Git internal object model: Blobs, Trees, Commits, Annotated Tags, HEAD pointer',
          'Merge vs Rebase: preserving commit history vs linear commit history',
          'Git Cherry-Pick: applying specific commits across branches',
          'Resolving merge conflicts and using `git stash` for temporary work',
          'Branching workflows: GitHub Flow (feature branches -> PR -> main) vs GitFlow',
          'Git reset (soft, mixed, hard) vs Git revert (safe commit rollback)',
        ],
        commonMistakes: [
          'Using `git push --force` on shared branches like `main` or `develop`, overwriting teammates\' work.',
          'Committing sensitive credentials, `.env` files, or `node_modules` because of a missing `.gitignore`.',
          'Performing `git reset --hard` without verifying whether uncommitted work can be recovered via `git reflog`.',
        ],
        questions: [
          {
            id: 'git-1',
            question: 'Explain the difference between `git merge` and `git rebase`. When should you use which?',
            shortAnswer:
              '`git merge` creates a new merge commit combining history from two branches, preserving the exact chronological sequence. `git rebase` replays your branch commits on top of the target branch, producing a clean, linear commit history without extra merge commits.',
            detailedAnswer:
              '`git merge feature` preserves true history and context: you can see when a feature was integrated. However, on large teams with dozens of PRs, merge commits clutter the git log. `git rebase main` moves your feature branch commits to begin from the latest commit on `main`. Golden rule: NEVER rebase a public shared branch (like `main`) because it rewrites commit hashes; only rebase local private feature branches before opening a PR.',
            codeSnippet: {
              language: 'bash',
              code: `# Linear history workflow using rebase:
git checkout feature/auth
git fetch origin
git rebase origin/main

# If conflicts occur:
# 1. Edit conflicted files
# 2. git add <resolved-file>
# 3. git rebase --continue

# Push updated linear branch to PR:
git push origin feature/auth --force-with-lease`
            },
            followUps: [
              'Why is `git push --force-with-lease` safer than `git push --force`?',
              'How does `git reflog` help recover lost commits after a bad rebase?'
            ],
            level: 'Basic',
            tags: ['Git', 'Version Control', 'Rebase', 'Merge']
          },
          {
            id: 'git-2',
            question: 'What is the difference between `git reset --soft`, `--mixed`, and `--hard`?',
            shortAnswer:
              '`--soft` moves HEAD only, keeping changes staged in the index. `--mixed` (default) moves HEAD and unstages changes, keeping files in your working directory. `--hard` moves HEAD, clears the staging index, and completely deletes changes in your working directory.',
            detailedAnswer:
              '1) `git reset --soft HEAD~1`: Undoes the last commit but keeps all modified files staged in index. Great for rewording or combining recent commits. 2) `git reset --mixed HEAD~1`: Undoes the commit and un-stages the files; files remain modified in your folder. 3) `git reset --hard HEAD~1`: Discards the commit and resets all tracked files back to the previous commit state. Any uncommitted work is wiped out.',
            codeSnippet: {
              language: 'bash',
              code: `# Example: You committed too early and want to add another file:
git reset --soft HEAD~1
# Your files are still staged!
git add missed-file.ts
git commit -m "feat: complete user profile implementation"`
            },
            followUps: [
              'How does `git revert` differ from `git reset` in a production environment?',
              'What does `git stash pop` do vs `git stash apply`?'
            ],
            level: 'Intermediate',
            tags: ['Git', 'Reset', 'CLI', 'Workflow']
          }
        ]
      },
      {
        id: 'docker',
        name: 'Docker & Containerization',
        badge: 'DevOps & Microservices',
        overview:
          'Docker packages applications and all their dependencies into standardized containers that execute consistently across development, staging, and cloud production environments.',
        keyConcepts: [
          'Docker Image (read-only blueprint) vs Docker Container (running instance of image)',
          'Dockerfile instructions: FROM, WORKDIR, COPY, RUN, CMD vs ENTRYPOINT, EXPOSE',
          'Docker Volumes: persisting data independently of container lifecycle',
          'Docker Compose: defining and running multi-container applications (e.g. Node API + Postgres + Redis)',
          'Multi-stage builds for small, secure production image sizes',
        ],
        commonMistakes: [
          'Running containers as root user in production instead of creating a non-privileged `node` or `appuser`.',
          'Not leveraging Docker layer caching by copying application code before `package.json` and `npm install`.',
          'Storing persistent database data directly in the container writable layer instead of a named volume.',
        ],
        questions: [
          {
            id: 'dock-1',
            question: 'What is the difference between a Docker Image and a Docker Container?',
            shortAnswer:
              'A Docker Image is an immutable, read-only blueprint containing the application code, libraries, and runtime dependencies. A Docker Container is a runnable, isolated instance of an image with a thin read-write layer added on top.',
            detailedAnswer:
              'Images are built from a Dockerfile using stacked read-only layers. When you run `docker run <image>`, the Docker daemon creates a container by adding a writable container layer on top of the image layers using union file systems (overlay2). Multiple containers can run from the exact same image simultaneously without interfering with each other.',
            codeSnippet: {
              language: 'dockerfile',
              code: `# Optimized Multi-Stage Dockerfile for Node.js:
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner (Lean final image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`
            },
            followUps: [
              'What is the benefit of a multi-stage Docker build?',
              'How does Docker layer caching work and why should `COPY package.json` precede `COPY . .`?'
            ],
            level: 'Basic',
            tags: ['Docker', 'Containers', 'DevOps', 'Dockerfile']
          },
          {
            id: 'dock-2',
            question: 'Explain Docker Volumes and why they are necessary for databases like PostgreSQL and MongoDB.',
            shortAnswer:
              'Containers are ephemeral: when a container is stopped and deleted, all data written inside its container layer is destroyed. Docker Volumes store data outside the container on the host filesystem, ensuring database persistence across container restarts and updates.',
            detailedAnswer:
              'Docker provides three storage options: 1) Volumes: managed completely by Docker in `/var/lib/docker/volumes/`, isolated from host OS specifics, best for production databases. 2) Bind Mounts: maps an exact host folder to a container directory, great for hot-reloading code in development. 3) tmpfs: in-memory non-persistent storage. Volumes persist even if the container crashes, allowing you to upgrade your database image version seamlessly.',
            codeSnippet: {
              language: 'yaml',
              code: `# docker-compose.yml with named persistent volume
version: '3.8'
services:
  postgres-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: umesh
      POSTGRES_PASSWORD: securepassword
      POSTGRES_DB: edtech_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data # Persistent volume!

volumes:
  pgdata: # Survives 'docker compose down'`
            },
            followUps: [
              'What is the difference between `docker compose down` and `docker compose down -v`?',
              'How do you back up data stored inside a Docker named volume?'
            ],
            level: 'Intermediate',
            tags: ['Docker', 'Volumes', 'Docker Compose', 'Databases']
          }
        ]
      },
      {
        id: 'linux',
        name: 'Linux & Terminal',
        badge: 'Operating System & Server Administration',
        overview:
          'Linux powers the vast majority of cloud production servers. Understanding basic Linux commands, file permissions, process management, and shell scripting is essential for deploying and debugging web applications.',
        keyConcepts: [
          'File system navigation and inspection: `ls -la`, `cd`, `grep`, `find`, `cat`, `less`, `tail -f`',
          'File permissions and ownership: `chmod` (rwx octal 755/644), `chown`, user groups',
          'Process management: `ps aux`, `top`, `htop`, `kill -9`, `nohup`, backgrounding with `&`',
          'Systemd services: `systemctl start/stop/restart/status`, viewing logs with `journalctl -u`',
          'Networking tools: `curl`, `netstat`/`ss -tulpn`, `ping`, SSH key-pair authentication (`ssh-keygen`, `~/.ssh/authorized_keys`)',
        ],
        commonMistakes: [
          'Using `chmod 777` to fix permission errors, creating severe security vulnerabilities.',
          'Killing processes blindly with `kill -9` without allowing them to gracefully close database connections and finish active transactions.',
        ],
        questions: [
          {
            id: 'linux-1',
            question: 'How do Linux file permissions work (e.g. `chmod 755` vs `644`)?',
            shortAnswer:
              'Linux permissions are divided into User (owner), Group, and Others. The numbers represent the sum of octal values: Read (4), Write (2), and Execute (1). `755` means Owner has Read/Write/Execute (7), while Group and Others have Read/Execute (5).',
            detailedAnswer:
              'Each file or directory displays 10 characters in `ls -l` (e.g., `-rwxr-xr-x`). The first character is `-` for file or `d` for directory. The remaining 9 characters are 3 groups of 3: User (`rwx`), Group (`r-x`), Others (`r-x`). `644` (`rw-r--r--`) is standard for regular files (owner can read/write; others can only read). `755` (`rwxr-xr-x`) is standard for directories and executable binaries/scripts.',
            codeSnippet: {
              language: 'bash',
              code: `# Calculation breakdown:
# 4 (read) + 2 (write) + 1 (execute) = 7
# 4 (read) + 0 (no write) + 1 (execute) = 5
# 4 (read) + 0 (no write) + 0 (no execute) = 4

chmod 755 deploy.sh  # Make script executable
chmod 600 ~/.ssh/id_rsa # Secure private SSH key (read/write only for owner)`
            },
            followUps: [
              'Why does SSH refuse to connect if your private key has 777 permissions?',
              'What does `chown www-data:www-data /var/www/html` do?'
            ],
            level: 'Basic',
            tags: ['Linux', 'Permissions', 'Security', 'Bash']
          }
        ]
      }
    ]
  },
  {
    category: 'API Development',
    skills: [
      {
        id: 'rest-apis',
        name: 'RESTful API Architecture',
        badge: 'API Design & Communication Standards',
        overview:
          'REST (Representational State Transfer) is an architectural style for networked hypermedia applications. Core concepts include HTTP verbs, idempotent status codes, resource-oriented URIs, pagination, rate limiting, and API versioning.',
        keyConcepts: [
          'HTTP Verbs: GET (safe/read), POST (create), PUT (complete replacement), PATCH (partial update), DELETE',
          'Idempotency: GET, PUT, DELETE, HEAD are idempotent; POST and PATCH are typically non-idempotent',
          'HTTP Status Codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests, 500 Internal Server Error',
          'Pagination strategies: Offset/Limit vs Cursor-based (Keyset) pagination',
          'API Versioning: URI path (`/api/v1/`), Query parameter (`?v=1`), Custom Headers',
          'Rate Limiting algorithms: Token Bucket, Leaky Bucket, Sliding Window Log',
        ],
        commonMistakes: [
          'Returning 200 OK with an error message `{ success: false, error: "..." }` in the response body instead of proper 4xx/5xx HTTP status codes.',
          'Confusing 401 Unauthorized (identity not provided or invalid) with 403 Forbidden (authenticated, but lacking permissions for this resource).',
          'Using verbs in REST endpoints (e.g. `/api/deleteUser/1`) instead of nouns and HTTP methods (`DELETE /api/users/1`).',
        ],
        questions: [
          {
            id: 'rest-1',
            question: 'What is Idempotency in REST APIs, and which HTTP methods are idempotent?',
            shortAnswer:
              'An HTTP method is idempotent if making the same request multiple times produces the exact same outcome on the server state as making it once. GET, PUT, DELETE, and HEAD are idempotent; POST is NOT idempotent.',
            detailedAnswer:
              'If you send `GET /api/users/5` ten times, the server state does not change. If you send `PUT /api/users/5` with `{ name: "Umesh" }` ten times, the user record is updated to "Umesh" each time—the resulting database state is identical. If you send `DELETE /api/users/5`, after the first call the record is gone; subsequent calls leave the database in the same state (user does not exist). In contrast, sending `POST /api/orders` five times creates five duplicate orders in the database unless an Idempotency-Key header is used.',
            codeSnippet: {
              language: 'http',
              code: `# Safe & Idempotent:
GET /api/v1/courses/101

# Idempotent (Replaces resource state completely):
PUT /api/v1/courses/101
Content-Type: application/json
{ "title": "Full Stack Mastery", "price": 499 }

# Non-Idempotent (Creates new record each time):
POST /api/v1/courses
Content-Type: application/json
{ "title": "New Course", "price": 299 }`
            },
            followUps: [
              'Why is PATCH technically non-idempotent in certain specifications?',
              'How do payment gateways (like Stripe) use `Idempotency-Key` headers on POST requests?'
            ],
            level: 'Basic',
            tags: ['REST', 'HTTP', 'Idempotency', 'API Design']
          },
          {
            id: 'rest-2',
            question: 'Explain Offset/Limit vs Cursor-Based Pagination. Why is cursor pagination preferred for large datasets?',
            shortAnswer:
              'Offset/Limit skips N rows (`OFFSET 100000 LIMIT 20`), which causes the database to read and discard 100,000 rows, degrading performance. Cursor-based pagination uses an indexed sequential pointer (`WHERE id > last_seen_id LIMIT 20`), achieving consistent O(1) index-seek performance and preventing duplicate items during live feed updates.',
            detailedAnswer:
              'With Offset pagination, if new records are inserted while a user is browsing page 2, records shift, causing the user to see duplicate items on page 3. For deep pagination (e.g. page 5000), disk I/O spikes because PostgreSQL must scan all skipped rows. Cursor pagination uses a unique indexed column (such as `created_at` or `id`). The client passes `?cursor=eyJpZCI6MTB9`, and the server performs a fast B-Tree index lookup `WHERE id < cursor ORDER BY id DESC LIMIT 20`.',
            codeSnippet: {
              language: 'sql',
              code: `-- ❌ Offset Pagination (Slow on page 5000):
SELECT * FROM spare_parts 
ORDER BY id ASC 
LIMIT 20 OFFSET 100000; -- Scans 100,020 rows!

-- ✅ Cursor-Based Pagination (Lightning fast regardless of depth):
SELECT * FROM spare_parts 
WHERE id > 100000 -- Index Seek!
ORDER BY id ASC 
LIMIT 20;`
            },
            followUps: [
              'When is Offset pagination still acceptable or preferred over Cursor pagination?',
              'How do you encode and decode cursor tokens in REST API responses?'
            ],
            level: 'Intermediate',
            tags: ['REST', 'Pagination', 'Database', 'Performance']
          },
          {
            id: 'rest-3',
            question: 'What is API Rate Limiting, and how does the Token Bucket algorithm work?',
            shortAnswer:
              'Rate limiting restricts the number of requests a client can make in a given timeframe (e.g. 100 req/min) to prevent abuse, DDoS attacks, and server overload. The Token Bucket algorithm holds tokens that refill at a steady rate; each request consumes a token, allowing controlled bursts while capping sustained throughput.',
            detailedAnswer:
              'In Token Bucket: 1) A bucket has a maximum capacity $B$ (e.g. 10 tokens), 2) Tokens are added at a constant refill rate $R$ (e.g. 2 tokens/sec), 3) When a request arrives, if a token is present, it is consumed and the request proceeds. If the bucket is empty, the server returns HTTP `429 Too Many Requests` with `Retry-After: seconds` headers. This allows clients to make occasional fast bursts of requests without being prematurely throttled, unlike fixed window counters.',
            codeSnippet: {
              language: 'javascript',
              code: `// Express rate limiter middleware example:
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in \`RateLimit-*\` headers
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests, please try again after 15 minutes.'
  }
});

app.use('/api/', apiLimiter);`
            },
            followUps: [
              'How does Leaky Bucket differ from Token Bucket?',
              'How is distributed rate limiting implemented across multiple server instances using Redis?'
            ],
            level: 'Advanced',
            tags: ['REST', 'Rate Limiting', 'Security', 'Algorithms']
          }
        ]
      }
    ]
  }
];

