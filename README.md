# Auth

Welcome to the Auth repository! This repository dedicated to authentication and authorization for [Databayt](https://github.com/abdout/databayt).

## Getting Started

To get started contributing to Atom, follow these steps:

### Documentation 

To start with ease, you may browse the [Technical Record Document](https://github.com/abdout/atom/blob/main/TRD.md).  

This code inspierd by this [vedio](https://www.youtube.com/watch?v=1MTyCvS05V4).

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

### Contributing

We welcome contributions from the community! To contribute to Atom UI Components, please follow these guidelines:

1. Fork the repository
2. create a new branch for your feature or bug fix.
3. Ensure your code adheres to coding standards in TRD.
4. Test your changes locally.
5. Commit your changes and push them to your fork.
6. Open a pull request, describing the changes you've made and why they should be merged.

## Support

If you have any questions or need assistance, feel free to [open an issue](https://github.com/abdout/atom/issues) in the repository, or reach out to us on [Discord](https://discord.com/invite/uPa4gGG62c).

