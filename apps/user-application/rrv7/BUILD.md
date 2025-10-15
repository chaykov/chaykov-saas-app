Full paths in Polytalko before creating new components for matching paths.


- Components as page
Empty: "/" <Public> - Showing landing page or welcome page for new users (not registered and registered when they are not logged in). When you are logged in and want to see "/" then automatically redirect to the main page "/app".
App: "/app" <Private for authorized user> - The main page with implemented Navbar and a Sidebar menu left with hull height.
Settings: "/app/settings" <Private for authorized user>
Users: "/app/users" <Private for authorized user> - Showing all users with [10-20] users in first page (pagination).
User by id: "/app/users/:id" <Private for authorized user> - Show a user by id
Profile: "/app/profile" <Private for authorized user> - Show myself profile (no another users).

[Users] Suggestion: When we are in "/app/users" as a probably Outlet component and we would like to see an single user with information like for example country, language, age, name, nickname, and more more, but we don't want to redirect to a new site "/app/users/:id", just showing actaully in this same component "/app/users". "Users" in the left and "User by id" in the right

- Components as component
Navbar: (Links to: App, Settings, Profile (logged in showing button to log out))
Sidebar: (it is gonna be permanented component probably, when you are in "/app")


- Auth
Error: "/not-found" <Public> - No page, show error or automatically redirect to the main page like "/app".
Login: "/login" <Public for non-users, logged in users automatically redirected to path "/app", not logged in may see this page login>
Register: "/register" <Public for non-users, logged in users automatically redirected to path "/app", not logged in may see this page register>

