import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { createRoot } from 'react-dom/client';
import 'graphiql/graphiql.css';
import './index.css';

const fetcher = createGraphiQLFetcher({ url: 'http://localhost:4000/api/graphql' });

const root = createRoot(document.getElementById('root')!);
root.render(<GraphiQL fetcher={fetcher} />);