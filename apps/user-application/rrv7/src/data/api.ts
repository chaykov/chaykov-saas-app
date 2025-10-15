import db from './db.json';

export async function getUsers() {
  await new Promise(resolve => setTimeout(resolve, 300));

  return db.users;
};

export async function getUser(id: number) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const user = db.users.find(u => u.id === id);

  if (!user) {
    throw new Response("No found user by ID", { status: 404 })
  };

  return user;
}