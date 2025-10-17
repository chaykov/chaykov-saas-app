import { useLoaderData } from 'react-router';

import type { loadUserById } from '@/services/loaders';
import { Badge } from '@/components/ui/badge';

export default function UserDetail() {
  const user = useLoaderData<typeof loadUserById>();

  return (
    <div className="h-full border rounded-md p-2 overflow-y-auto">
      <div className="flex gap-2">
        {/* User avatar */}
        <div
          className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md shrink-0 flex items-center justify-center text-white text-4xl font-bold"
          role="img"
          aria-label={`Avatar user ${user.name}`}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name} avatar`}
              className="w-32 h-32 rounded-full object-cover shrink-0"
            />
          ) : (
            <div>{user.name.charAt(0).toUpperCase()}</div>
          )}
        </div>

        {/* User info */}
        <div className="flex-1 text-gray-800 space-y-2">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Age:</span> {user.age}
          </div>
          <div>
            <span className="font-semibold">Country:</span> {user.country}
          </div>
          <div>
            <span className="font-semibold">Bio:</span> {user.bio}
          </div>

          {user.hobbies.length > 0 && (
            <div>
              <span className="font-semibold">Hobbies:</span>
              <ul className="inline-flex flex-wrap gap-1.5 mt-1 ml-1.5">
                {user.hobbies.map((hobby, index) => (
                  <li key={`${hobby}-${index}`}>
                    <Badge variant="secondary">{hobby}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* User info section - additional */}
      {user.description && (
        <div className="mt-4 pt-4 border">
          <h3 className="font-semibold mb-2">Additional information</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {user.description}
          </p>
        </div>
      )}
    </div>
  );
}
