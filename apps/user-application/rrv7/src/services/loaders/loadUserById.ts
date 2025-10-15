import { getUser } from '@/data/api';
import type { LoaderFunctionArgs } from 'react-router';

export async function loadUserById({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);

  if (isNaN(id)) {
    throw new Response('Error format ID:', { status: 400 });
  }

  const user = await getUser(id);

  if (!user) {
    throw new Response('User not found ID:', { status: 404 });
  }

  return user;
}
