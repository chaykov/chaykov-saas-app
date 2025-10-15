import { getUsers } from '@/data/api';

export async function loadAllUsers() {
  const users = await getUsers();

  if (!users) {
    throw new Response('Users not found', { status: 404 });
  }

  return users;
}
