# Reddit Time Machine

Check it out: [reddit-time-machine.com](https://reddit-time-machine.com/)

### See what the internet was talking about on a random day in the past decade.

> This is the sequel to 'Reddit Time Capsule', this time using NextJS and deployed with Vercel.

To see how I built this website, read [the blog post](https://www.dannyhines.io/blog/reddit-time-machine) on building the Reddit Time Machine.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running locally

This project runs on Next.js 16 and requires Node.js 20.9 or newer. The production runtime should use an actively supported Node.js LTS release that satisfies that requirement. Install dependencies with Yarn 1, then run the development server:

```bash
yarn dev
```

Before opening a pull request, run the local validation commands:

```bash
yarn lint
yarn typecheck
yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. It'll update as you make changes.

## Database maintenance

Schema changes and materialized-view refresh instructions live in
[`database/README.md`](database/README.md). Database migrations are applied
manually and are not part of the Vercel build.

## Acknowledgements

Originally I used Jason Baumgartner's free API on ([pushshift.io](https://pushshift.io/)) for fetching Reddit history. Unfortunately, the project died in 2023 in the wake of Reddit's changes to their API pricing.

I instead found [this archive](https://academictorrents.com/details/c398a571976c78d346c325bd75c47b82edf6124e) of Reddit posts by subreddit, did a little ETL and put the most popular posts in a database which I can query via an API (also hosted on Vercel).

I appreciate feedback! Please leave an issue if there are any enhancements you'd like to see.
