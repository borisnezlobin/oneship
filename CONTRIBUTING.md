Contributing is easy!<br />
## 1. Clone the repo
```
git clone https://github.com/borisnezlobin/oneship.git
```
## 2. Run whatever you want to run
For the backend, run the following in the root directory
```
vercel dev
```
For the web version, run
```
npm start
```
in the `/website` directory. For the mobile app (which uses Expo), run
```
npx expo start
```
in `/app` and open the app in the Expo Go app

# Live refactor
Turns out writing poorly-structured JavaScript code gets out of hand pretty quickly... that's why we are transitioning to TypeScript where possible. Rewriting this entire codebase isn't fun, and most of it works -- for these reasons, if you make changes, try to use TypeScript.

## Use branches for contributing
Except me, I get to push to master hehe

## Publishing
To publish a new version of the website, contact me - I'll add you to the Firebase project and actually bother writing it down.
For the app, there is a `commands.txt` file with some instructions.
The backend is automatically re-deployed on every commit to `master` via... Vercel blackmagic or something.

Have fun!!1!
