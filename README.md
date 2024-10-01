# Auth

Welcome to the Auth repository! A reuseable block for authentication and authorization, built using Authjs, Nextjs, React, Typescript, Tailwind css, Shadch, mongoDB, and Prisma

<!-- ### The code inspierd by this [video](https://www.youtube.com/watch?v=1MTyCvS05V4).
### Credit goes to [Antonio Erdeljac](https://github.com/AntonioErdeljac)


**The code inspired by this [video](https://www.youtube.com/watch?v=1MTyCvS05V4).**  
**Thanks to the Code With Antonio YouTube channel**

Key Features:
- 🔐 Next-auth v5 (Auth.js)
- 🚀 Next.js 14 with server actions
- 🔑 Credentials Provider
- 🌐 OAuth Provider (Social login with Google & GitHub)
- 🔒 Forgot password functionality
- ✉️ Email verification
- 📱 Two factor verification
- 👥 User roles (Admin & User)
- 🔓 Login component (Opens in redirect or modal)
- 📝 Register component
- 🤔 Forgot password component
- ✅ Verification component
- ⚠️ Error component
- 🔘 Login button
- 🚪 Logout button
- 🚧 Role Gate
- 🔍 Exploring next.js middleware
- 📈 Extending & Exploring next-auth session
- 🔄 Exploring next-auth callbacks
- 👤 useCurrentUser hook
- 🛂 useRole hook
- 🧑 currentUser utility
- 👮 currentRole utility
- 🖥️ Example with server component
- 💻 Example with client component
- 👑 Render content for admins using RoleGate component
- 🛡️ Protect API Routes for admins only
- 🔐 Protect Server Actions for admins only
- 📧 Change email with new verification in Settings page
- 🔑 Change password with old password confirmation in Settings page
- 🔔 Enable/disable two-factor auth in Settings page
- 🔄 Change user role in Settings page (for development purposes only)

### Prerequisites

**Node version 18.7.x**

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/abdout/auth.git
    ```

2. Navigate to the project directory:

    ```bash
    cd auth
    ```

3. Install dependencies:

    ```bash
    npm install
    ```
4. Setup .env file


```js
MONOGDB_URI=
DIRECT_URL=
AUTH_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
DOMAIN=
```

5. Setup Prisma
```shell
npx prisma generate
npx prisma db push
```

6. Run the development server:

    ```bash
    npm run dev
    ```

- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the components.

### Documentation 

To start with ease, you may browse the [Technical Record Document](https://github.com/abdout/auth/blob/main/TRD.md).  

# Support

If you have any questions or need assistance, feel free to [open an issue](https://github.com/abdout/auth/issues) in the repository, or reach out to us on [Discord](https://discord.com/invite/uPa4gGG62c).
