# stream-dom

## Summary

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Running](#running)
- [Another scripts](#another-scripts)

## Introduction

A simple and intuitive DOM streamer to watch a tetris game.
The main objective of this project is to practice some development skills through some technologies and concepts:

- ReactJS
- React Hooks
- TypeScript
- CSS-in-JS (emotion.js)
- Nest.js
- Turborepo
- Caching

## Features

- [X] The product manager should be able to see the list of all current and recent (<1 day old) sessions (just showing session id’s is fine)
- [X] The product manager should be able to watch any active session in real-time. Or rewind to a previous point in the active session
- [X] The product manager should be able to replay any old session
- [X] For realtime streaming active sessions, latency is important! We suggest websockets

## Installation

- Make sure that you have nodejs installed in you computer. Preference: node 18.2.0 (use NVM to easily achieve that).
- Run `npm install`.

## Running

- `npm run dev`
- Open [http://localhost:5173](http://localhost:5173) and [http://localhost:5174](http://localhost:5174) to see the client and the admin pages.

## Another scripts

- Typescript type check: `yarn type-check`
- Prettier formating: `yarn format`
- Linting code: `yarn lint`
- Build: `yarn build`
