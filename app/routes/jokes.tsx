import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';

import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <header>
        <div>
          <h1>
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span>🤪</span>
              <span>J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div>
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit">Logout</button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main>
        <div>
          <div>
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link prefetch="intent" to={id}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new">Add your own</Link>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </main>
      <footer>
        <div>
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
