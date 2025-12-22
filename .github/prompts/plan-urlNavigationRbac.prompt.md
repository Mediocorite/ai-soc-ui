## Plan: Add URL Routing & RBAC

TL;DR: Add `tanstack-router` routing, a centralized route config with role restrictions, a `RequireAuth` protected-route wrapper using the existing `AuthContext`, update navigation to use router links, and add Vitest + Testing Library unit tests for skeleton pages and auth guards.

### Steps

1. Install router and wrap app: update `src/app/App.tsx` to use `BrowserRouter` and `Routes`.
2. Add centralized route map: create `src/app/routes.tsx` with `RouteRecord` entries (path, element, roles).
3. Implement auth guard: add `RequireAuth` / `ProtectedRoute` that uses `useAuth()` from `src/app/contexts/AuthContext.tsx`.
4. Normalize role types: export canonical `Role` type/enum from `AuthContext` and use in route config and checks.
5. Update navigation: change `Sidebar`/menu links to `NavLink` / `useNavigate` in `src/app/components/Sidebar.tsx`.
6. Add tests: add `vitest` + `@testing-library/react` and write tests under `src/__tests__` for routing, `RequireAuth`, and `LoginPage` → `Dashboard` flows.

### Further Considerations

1. Auth behavior: redirect to `/login` with `?next=` vs storing attempted path — choose preferred UX.
2. Role granularity: pick roles-only or permissions-based model (map roles → permissions if needed).
3. Tests: include `jsdom` environment and mock `useNavigate`/`AuthContext` for isolation.

### Questions for you

- Which redirect UX do you prefer when unauthenticated: query `?next=` redirect, or storing attempted path in memory?
- Do you want a roles-only model or roles → permissions mapping for RBAC?

(End of plan)
