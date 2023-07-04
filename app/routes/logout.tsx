import type { ActionArgs, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { logout } from '~/utils/session.server';

export const action = async ({ request }: ActionArgs) => {
  console.log('action');

  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log('loader');

  return logout(request);
};
