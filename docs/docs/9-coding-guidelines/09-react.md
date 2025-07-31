---
title: React
sidebar_position: -5
---

## General

- Prefer Function Components over Class Components.
- Create one file per "logical component." Multiple Function Components per file are allowed for structuring, styling, etc.
- Always use JSX (use React.createElement only for app initialization).
- Use `React.PropsWithChildren` instead of defining children manually.
- Inject dependencies to services/APIs via Context.
- How to structure folders? "Move files around until it feels right"
  Recommendation: Separate by modules instead of by type ([File Structure – React](https://legacy.reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)).

## Naming

- Use PascalCase for React components and camelCase for instances

:::warning Bad

```tsx
import carCard from "./CarCard";
const CarItem = <CarCard />;
```

:::

:::tip Good

```tsx
import CarCard from "./CarCard";
const carItem = <CarCard />;
```

:::

- Use filename as component name

:::warning Bad

```tsx
import Footer from "./Nav";
```

:::

:::tip Good

```tsx
import Footer from "./Footer";
```

:::

- Speaking component filename  
  Include the component name in the filename.

:::warning Bad

```tsx
clients / Table.tsx;

clients / Table.sc.ts;

clients / Table.gql.ts;
```

:::

:::tip Good

```tsx
clients / ClientsTable.tsx;

clients / ClientsTable.sc.ts;

clients / ClientsTable.gql.ts;
```

:::

Do not use DOM props as component props unless they are intended for that purpose.

:::warning Bad

```tsx
<MyComponent className="fancy" />
```

:::

:::tip Good

```tsx
<MyComponent variant="fancy" />
```

:::

- Always use camelCase for prop names.

:::warning Bad

```tsx
<Foo UserName="hello" phone_number={12345678} />
```

:::

:::tip Good

```tsx
<Foo userName="hello" phoneNumber={12345678} />
```

:::

- Always name React.useState like this: const [variable, setVariable] = React.useState()

## Conventions

- If the property is true, then do not pass the value

:::warning Bad

```tsx
<Foo hidden={true} />
```

:::

:::tip Good

```tsx
<Foo hidden />
```

:::

- Boolean props should always be optional

:::warning Bad

```tsx
type Props = {
    hidden: boolean;
};

<Foo hidden={false} />;
```

:::

:::tip Good

```tsx
type Props = {
    visible?: boolean;
};

<Foo />;
```

:::

Use `parameter?: type` instead of `parameter: type | undefined`, otherwise `parameter = undefined` must be explicitly set.

### Recommendations

- If a component becomes too complex:
    - Move GraphQL and styled components into separate files with `.gql.ts` and `.sc.ts` extensions.  
      :::caution  
      These files should be treated as **private** and must **not** be imported from other files.  
      :::
    - Split the component into smaller sub-components.

### Working with SVGs

If possible, use SVGs inline with `<use>`.

It is important that the SVG file contains an `id`, which is then referenced via the hash parameter in the path.

**You can use it like this:**

:::tip Good

```tsx
<svg>
    <use xlinkHref="/icon.svg#custom-id"></use>
</svg>
```

:::

**SVG File:**
:::tip Good

```tsx
<svg viewBox="0 0 24 24" id="custom-id" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>icon</title>
    <polygon
        fill="currentColor"
        points="12.661 11.954 17.904 6.707 17.198 6 11.954 11.247 6.707 6.003 6 6.71 11.247 11.954 6.003 17.2 6.71 17.907 11.954 12.661 17.2 17.904 17.907 17.198"
    ></polygon>
</svg>
```

:::

:::warning Bad

```tsx
import Icon from "../assets/icon.svg"

...

<Icon />
```

:::

:::warning Bad

```tsx
<img src="/icon.svg" />
```

:::

**Background:** SVGs imported as modules end up in the JS bundle, which increases download and compile time. Additionally, when used as `<img>` tags, they cannot be manipulated (e.g., changing path color).

### Common Bugs

:::info
These are common pitfalls, not strict rules that must always be followed.
:::

- **Do not use array index as `key`** (Explanation: [Index as a key is considered an anti-pattern](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318))

:::warning Bad

```tsx
{
    todos.map((todo, index) => <Todo {...todo} key={index} />);
}
```

:::

:::tip Good

```tsx
{
    todos.map((todo) => <Todo {...todo} key={todo.id} />);
}
```

:::

- **Use `&&` with `0` or `""`**

:::warning Bad

```tsx
export default function PostList({ posts }) {
    return (
        <div>
            <ul>{posts.length && posts.map((post) => <PostItem key={post.id} post={post} />)}</ul>
        </div>
    );
}
```

:::

- **Renders `0` instead of `null` for an empty list!**

:::tip Good

```tsx
export default function PostList({ posts }) {
    return (
        <div>
            <ul>
                {posts.length ? posts.map((post) => <PostItem key={post.id} post={post} />) : null}
            </ul>
        </div>
    );
}
```

:::

### Common Anti-Patterns

Constant components or functions that have no dependencies are created on every render.
:::warning Bad

```tsx
const Foo: React:FC = (jobs) => {
  const sortJobs = (a: Job, b: Job) => {
    return a.createdAt - b.createdAt;
  }

  const Wrapper = styled.div`...`;

  return <Wrapper>...</Wrapper>;
}
```

:::

**Explanation**: Created on every render and can lead to performance issues. (See also [Hooks API Reference – React](https://legacy.reactjs.org/docs/hooks-reference.html#usecallback))

:::tip Good

```tsx
const sortJobs = (a: Job, b: Job) => {
  return a.createdAt - b.createdAt;
}

const Wrapper = styled.div`...`;

const Foo: React:FC = (jobs) => {
  return <Wrapper>...</Wrapper>;
}
```

:::

### GraphQL

Use fragment to define required data of a component (see [Colocating Fragments](https://www.apollographql.com/docs/react/data/fragments#colocating-fragments))

:::warning Bad

```tsx
// DisplayName.tsx

function DisplayName({
  user: { firstName, lastName }: GQLUserDetailQuery
}): JSX.Element {
  return <>{firstName} {lastName}</>
}



// UserDetail.tsx

const userDetailQuery = gql`
  query UserDetail($id: ID!) {
    user(id: $id) {
      firstName
      lastName
    }
  }
`

function UserDetail({ id }: { id: string}): JSX.Element {
  const user = useQuery(userDetailQuery);

  ...

  return (
    <>
      <DisplayName user={user} />
      ...
    </>
  )
}
```

:::

:::tip Good

```tsx
// DisplayName.tsx

export const displayNameFragment = gql`
  fragment DisplayName on User {
    firstName
    lastName
  }
`;

function DisplayName({
  user: { firstName, lastName }: { user: GQLDisplayNameFragment }
}): JSX.Element {
  return <>{firstName} {lastName}</>
}



// UserDetail.tsx

const userDetailQuery = gql`
  query UserDetail($id: ID!) {
    user(id: $id) {
      ...DisplayName
    }
  }

  ${displayNameFragment}
`

function UserDetail({ id }: { id: string}): JSX.Element {
  const user = useQuery(userDetailQuery);

  ...

  return (
    <>
      <DisplayName user={user} />
      ...
    </>
  )
}
```

:::

**Explanation:** The child component should define for itself which fields of a GraphQL object it needs (and not rely on the parent component’s query!). This way,
the child component is not directly affected by changes in the parent query, for example if a field is no longer queried.

### Further reading / sources:

- [Hello World - React](https://legacy.reactjs.org/docs/hello-world.html)
- [TypeScript and React](https://fettblog.eu/typescript-react/)
