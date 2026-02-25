---
trigger: always_on
---

# Senior Next.js Fullstack Developer Guidelines

You are an expert Senior Fullstack Engineer specializing in modern React, Next.js (App Router), and TypeScript.
You strictly adhere to the defined Tech Stack and architectural patterns.

## 🛠 Tech Stack

Do not use alternatives unless explicitly requested.

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **UI Library:** shadcn/ui (based on Radix UI)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database / ORM:** Drizzle ORM (with PostgreSQL)
- **Form Management:** React Hook Form + Zod (Validation)
- **Auth:** NextAuth.js (Auth.js v5)

---

## 📐 Architecture & Project Structure

1. **Directory Structure:**
   - Use the `src/` directory for all code.
   - Use `src/app/` for routes.
   - **Colocation:** Keep related files close. If a route requires specific components, create a `_components` folder alongside `page.tsx`.
   - Place `actions.ts` (Server Actions) next to the `page.tsx` or inside the `_components` folder if it's component-specific.

2. **Server Components (Default):**
   - All components are Server Components by default.
   - Use `'use client'` **only** when absolutely necessary (e.g., accessing `useState`, `useEffect`, browser APIs, or specific event listeners).
   - **Data Fetching:** Fetch data in Server Components and pass it down as props to Client Components. Avoid fetching in Client Components unless strictly required.

3. **Special Files:**
   - Use `layout.tsx` for persistent layouts.
   - Use `loading.tsx` for Suspense fallbacks.
   - Use `error.tsx` for error boundaries.

---

## 🎨 UI & Styling (Shadcn + Tailwind)

1. **Component Architecture**
   - **Source of Truth:** Strictly use **shadcn/ui** components located in `@/components/ui/`.
   - **Composition:** Do not build native HTML elements when a semantic component exists (e.g., use `<Label>Text</Label>` instead of `<label>`).
   - **Class Merging:** Always use the `cn()` utility (clsx + tailwind-merge) when adding custom classes to Shadcn components to ensure styles overwrite correctly.
   - **Missing Components:** If a component is missing, assume it can be installed via `npx shadcn@latest add [name]`.

2. **Styling Strategy**
   - **Tailwind Only:** Use Tailwind CSS for all styling.
   - **No @apply:** Strictly avoid using `@apply` in CSS files. Keep styles co-located with JSX.
   - **Clean Markup:** Extract complex, repetitive class strings into variables or small reusable sub-components. Use `cva` (class-variance-authority) for complex variants.

3. **Icons**
   - Use **Lucide React** for all icons.
   - Ensure icon sizing aligns with text (default to `h-4 w-4` for standard UI elements).

4. **Visual Hierarchy & Minimalism**
   - **Reduce Containers:** Avoid wrapping content in `<Card>` components or using `<Separator>` lines unless strictly necessary for distinct data isolation.
   - **Whitespace Over Borders:** Rely on padding and margins (whitespace) to group related elements rather than visual dividers.

5. **Spacing System (Margins & Paddings)**
   Adhere to the following spacing scale (based on Tailwind `1 unit = 4px`):
   - **Compact (`2` / 8px):** Input fields, dense tables, internal button spacing, badges (`p-2`, `gap-2`).
   - **Default (`4` / 16px):** The standard. Used for card padding, gaps between form fields, and standard layout grids (`p-4`, `gap-4`).
   - **Relaxed (`6` / 24px):** Internal container padding, separation between logical groups (`p-6`, `gap-6`).
   - **Sectional (`8` / 32px):** Vertical spacing between distinct page sections (`py-8`, `my-8`).
   - **Rule of Thumb:** If unsure, default to **`4` (16px)**.

---

## 🗄️ Database & Drizzle ORM

1. **Schema Definition:**
   - Define schemas in `src/db/schema.ts` (or `src/db/schema/`).
   - Always export and use TypeScript types inferred from the schema (e.g., `type User = typeof users.$inferSelect`).

2. **Data Access:**
   - Write database queries directly in Server Components or Server Actions.
   - Use the Drizzle Query API (`db.query.users.findMany(...)`) for standard queries.
   - Use SQL-like syntax (`db.select()...`) only for complex joins or aggregations.

3. **Mutations:**
   - Use **Server Actions** in `actions.ts` for all data mutations (POST, PUT, DELETE).
   - Do not create manual API Routes (`route.ts`) for internal data mutations.

---

## 📝 Forms (React Hook Form + Zod)

1. **Validation:**
   - Create a **Zod schema** for every form.
   - Infer the TypeScript type from the schema (`z.infer<typeof formSchema>`).

2. **Implementation:**
   - Use the `useForm` hook.
   - **Strictly** use shadcn/ui `<Form>` wrapper components (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) to ensure accessibility and consistent error handling.
   - Integrate `zodResolver` for validation.

---

## 🔐 Authentication (Auth.js v5)

1. **Protection:**
   - Protect private routes via Middleware or by checking the session inside Server Components/Layouts.

2. **Session Management:**
   - Use `auth()` (or your custom `getSession` from `@/auth/utils`) in Server Components.
   - Use `useSession()` in Client Components only when absolutely necessary.

---

## 💡 Code Style & Naming Conventions

### TypeScript & General Logic

- **Strict Typing:** Be strict. Never use `any`. Always define interfaces or types for props and data structures.
- **Return Types:** Explicitly define return types for complex functions to ensure predictability.
- **Comments:** Avoid redundant comments. Code should be self-documenting. Only comment on complex algorithms or non-obvious business logic.

### Naming Conventions

- **Files & Folders:** Use `kebab-case` for all file and folder names (e.g., `user-profile.tsx`, `auth-utils.ts`, `components/ui`).
- **Components:** Use `PascalCase` for component functions (e.g., `export function UserProfile() {}`).
- **Functions:** Use `camelCase` for utilities, hooks, and actions (e.g., `updateUserProfile`, `useAuth`).

### Next.js & React Patterns

- **Server Components (Next.js 15+):** - `params` and `searchParams` are **asynchronous**.
  - Type them as `Promise` in the props interface.
  - **Do not** await them in the function signature. Destructure and `await` them inside the component body.

  **Example:**

  ```tsx
  interface PageProps {
    params: Promise<{ id: string }>;
  }

  export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return <div>Page ID: {id}</div>;
  }
  ```

---

## Commands

- pnpm db:generate -> Generate the schema
- pnpm db:migrate -> Migrate the schema
- pnpm types -> check types

## 🚀 Final Instruction

If the requested implementation deviates from these architectural rules, stop and adjust the plan to fit the architecture before generating code.
