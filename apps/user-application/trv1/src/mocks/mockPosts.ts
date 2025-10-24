import type { Post } from "./types";

export const mockPosts: Post[] = [
  {
    id: "post_1",
    title: "Jak zacząć z React Hooks",
    content: `React Hooks to rewolucja w sposobie pisania komponentów. Zamiast klasowych komponentów, możemy używać funkcyjnych z hokami takimi jak useState, useEffect i useContext.

Główne korzyści:
- Prostszy kod
- Łatwiejsze zarządzanie state'em
- Mniejsza ilość boilerplate'u
- Lepsze testowanie

Przykład:
\`\`\`typescript
const [count, setCount] = useState(0)

useEffect(() => {
  console.log('Component mounted or count changed')
}, [count])
\`\`\`

Haki ułatwiają logikę komponentów i robią kod bardziej czytelnym. Polecam eksperymentować!`,
    authorId: "user_1",
    createdAt: "2025-10-22T10:30:00Z",
    updatedAt: "2025-10-22T10:30:00Z",
    likesCount: 156,
    commentsCount: 23,
  },
  {
    id: "post_2",
    title: "Design System w praktyce",
    content: `Opowiem Wam jak budujemy design system dla naszego projektu. To ogromna wymiana czasu, ale warta inwestycji.

Etapy budowy:
1. Inventory komponentów (co już mamy)
2. Normalizacja (ujednolicenie)
3. Dokumentacja
4. Automatyzacja

Nasze doświadczenia:
- Zaczyliśmy od Figmy
- Potem Storybook
- Teraz CI/CD pipeline

Rezultat? Konsystencja i szybkość development'u wzrosły x3!`,
    authorId: "user_2",
    createdAt: "2025-10-21T14:15:00Z",
    updatedAt: "2025-10-21T14:15:00Z",
    likesCount: 234,
    commentsCount: 45,
  },
  {
    id: "post_3",
    title: "TypeScript generics - zaawansowane techniki",
    content: `Generics w TypeScript'cie to jedno z najmocniejszych narzędzi do tworzenia reusable kodu. Dzisiaj pokażę Wam zaawansowane wzory.

Conditional Types:
type IsString<T> = T extends string ? true : false

Mapped Types:
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

Constraints:
function merge<T extends object>(obj1: T, obj2: T): T {
  return { ...obj1, ...obj2 }
}

Te techniki pozwalają na tworzenie ultra-flexibilnego kodu.`,
    authorId: "user_3",
    createdAt: "2025-10-20T09:45:00Z",
    updatedAt: "2025-10-20T09:45:00Z",
    likesCount: 89,
    commentsCount: 12,
  },
  {
    id: "post_4",
    title: "Performance optimization w React aplikacjach",
    content: `Ostatnio optymalizowaliśmy aplikację i zaobserwowaliśmy 60% poprawę performance'u. Oto co robiliśmy:

1. Code splitting
- React.lazy() dla routes
- Suspense boundaries

2. Memoization
- useMemo() dla expensive computations
- useCallback() dla funkcji
- React.memo() dla komponentów

3. Bundle optimization
- Tree shaking
- Minification
- Lazy loading images

4. Database queries
- Batching requests
- Caching strategy
- Pagination

Tools które nam pomogły:
- React DevTools Profiler
- Lighthouse
- Bundle Analyzer

Efekty? Ładowanie z 8s → 3.2s!`,
    authorId: "user_4",
    createdAt: "2025-10-19T16:20:00Z",
    updatedAt: "2025-10-19T16:20:00Z",
    likesCount: 412,
    commentsCount: 67,
  },
  {
    id: "post_5",
    title: "UI Accessibility - dlaczego to ważne?",
    content: `Accessibility nie jest opcją, to obowiązek. Każdy powinien móc korzystać z Twojej aplikacji, niezależnie od swoich możliwości.

WCAG 2.1 standards:
- Perceivable - treść musi być widoczna
- Operable - można sterować klawiaturą
- Understandable - logiczna struktura
- Robust - kompatybilne ze screen readers

Praktyczne kroki:
✓ Semantic HTML (nav, main, section)
✓ Alt text dla obrazów
✓ ARIA labels
✓ Keyboard navigation
✓ Color contrast (min 4.5:1)
✓ Focus indicators

Tools:
- axe DevTools
- WAVE
- Lighthouse

Pamiętaj: accessibility = better UX for everyone!`,
    authorId: "user_5",
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
    likesCount: 267,
    commentsCount: 34,
  },
  {
    id: "post_6",
    title: "Moja pierwsza strona w React'e",
    content: `Zdecydowałem się nauczyć React'a i napisałem swoją pierwszą aplikację - todo list! Cieszę się z postępów.

Co nauczyłem się:
- JSX syntax
- Components
- Props i State
- Hooks (useState, useEffect)
- Event handling

Wyzwania:
- Renderowanie - kiedy się dzieje
- State management - gdzie przechowywać dane
- Re-renders - kiedy się zdarzają

Następnie planuję:
- React Router dla nawigacji
- API integration
- Styling (Tailwind)

Jeśli ktoś chce porady, jestem otwarty! Uczymy się razem 🚀`,
    authorId: "user_6",
    createdAt: "2025-10-22T08:00:00Z",
    updatedAt: "2025-10-22T08:00:00Z",
    likesCount: 45,
    commentsCount: 8,
  },
  {
    id: "post_7",
    title: "Tanstack Router - czyli co po React Router?",
    content: `Przeszliśmy z React Router na Tanstack Router i nie żałujemy. Oto dlaczego:

Zalety Tanstack Router:
✓ Lepszy TypeScript support
✓ Loader functions (pre-fetch data)
✓ File-based routing (automatyczne)
✓ Smaller bundle size
✓ Better DX

Porównanie:
React Router - bardziej tradycyjne, bardziej popularne
Tanstack Router - nowocześniejsze, bardziej powerful

Migracja była bezbolesna, choć wymagała nauki nowego API.

Rekomendacja? Dla nowych projektów bierz Tanstack Router!`,
    authorId: "user_1",
    createdAt: "2025-10-21T13:30:00Z",
    updatedAt: "2025-10-21T13:30:00Z",
    likesCount: 178,
    commentsCount: 29,
  },
  {
    id: "post_8",
    title: "Testing React komponenty - best practices",
    content: `Testing to nie opcja, to standard. Oto jak radzimy sobie z testowaniem React komponentów.

Setup:
- Vitest (zamiast Jest)
- React Testing Library
- MSW (Mock Service Worker)

Test pyramid:
- Unit tests (70%)
- Integration tests (20%)
- E2E tests (10%)

Przykład testu:
\`\`\`typescript
test('button should increment counter', () => {
  render(<Counter />)
  const button = screen.getByRole('button')
  fireEvent.click(button)
  expect(screen.getByText('1')).toBeInTheDocument()
})
\`\`\`

Praktyka: Testuj behavior, nie implementacji!

Coverage goal: >80%

Wiecej informacji? Zapytaj!`,
    authorId: "user_4",
    createdAt: "2025-10-20T15:45:00Z",
    updatedAt: "2025-10-20T15:45:00Z",
    likesCount: 123,
    commentsCount: 19,
  },
];
