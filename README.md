# Reddit Time Machine

Check it out: [reddit-time-machine.com](https://reddit-time-machine.com/)

### See what the internet was talking about on a random day in the past decade.

> This is the sequel to 'Reddit Time Capsule', this time using NextJS and deployed with Vercel.

To see how I built this website, read [the blog post](https://www.dannyhines.io/blog/reddit-time-machine) on building the Reddit Time Machine.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running locally

This is a NextJS project. First install dependencies with `yarn install` then run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. It'll update as you make changes.

## Acknowledgements

Originally I used Jason Baumgartner's free API on ([pushshift.io](https://pushshift.io/)) for fetching Reddit history. Unfortunately, the project died in 2023 in the wake of Reddit's changes to their API pricing.

I instead found [this archive](https://academictorrents.com/details/c398a571976c78d346c325bd75c47b82edf6124e) of Reddit posts by subreddit, did a little ETL and put the most popular posts in a database which I can query via an API (also hosted on Vercel).

I appreciate feedback! Please leave an issue if there are any enhancements you'd like to see.
