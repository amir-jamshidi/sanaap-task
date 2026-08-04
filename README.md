# Technical Notes

This document explains some of the technical decisions behind the implementation.
It is not meant to describe the whole project, but to clarify why a few choices
were made.

## Feature-based structure

The registration flow is organized as a feature instead of spreading all files
across generic folders. The form UI, API calls, hooks, schema, and types live
close to each other under `agent-registration`.

This keeps the main page thin and makes the flow easier to review. If another
feature is added later, it can follow the same pattern without mixing unrelated
business logic.

## React Query for server state

Province, city, branch, agency-code check, and submit requests are handled with
TanStack React Query. These values come from the server, so keeping them in local
component state would add extra loading, error, and cache handling manually.

React Query also helps avoid unnecessary repeated requests. For example,
province data does not need to be fetched again every time the form re-renders.
Cities and branches are cached by their query keys, so the code stays simple
while still being efficient enough for this flow.

## Axios wrapper

Axios is wrapped in a small `httpClient` instead of being used directly inside
components. This gives the project one place for the base URL, timeout, headers,
response parsing, and common error handling.

The form code only deals with typed service functions such as `getCities` or
`registerAgent`, not raw HTTP details. That separation makes the UI easier to
read and keeps network behavior consistent.

## React Hook Form and Zod

The form has several fields, conditional validation, async checks, and dependent
selects. React Hook Form keeps input state and validation efficient without
making every field fully controlled.

Zod is used as the validation source of truth. It keeps required fields,
numeric-string rules, and conditional company-name validation in one place
instead of spreading validation logic across the JSX.

## Virtualized branch list

The insurance branch list can become large, especially when searching or when
the API returns many items. Rendering every option at once would be unnecessary
work for the browser.

The virtualized list only renders the visible rows and a small overscan area.
This keeps the combobox responsive without changing the user-facing behavior.

## UI primitives

The UI is built on reusable primitives for inputs, selects, dialogs, radio
groups, and buttons. This avoids repeating styling and behavior in the form
itself.

The goal was not to build a large design system, but to keep the form consistent
and maintainable. Shared components also make small states like loading, error,
disabled, and success easier to reuse.

## State dependencies inside the form

Some fields depend on previous choices. For example, changing the province
invalidates the selected city and branch. Resetting dependent fields prevents
submitting a city or branch that no longer belongs to the selected province.

This is handled in the form hook instead of the JSX so the component can stay
focused on rendering.

## Tradeoffs

The implementation intentionally stays small. There is no routing setup, global
state manager, or large abstraction layer because the current task is a single
registration flow.

If the app grows, the same structure can be extended with more feature folders,
better shared error utilities, and focused tests around the form behavior and API
states.
