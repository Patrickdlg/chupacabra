# Chupacabra
[Matrix](https://matrix.org/) powered content sharing and discussion.

## Overview

Chupacabra enables users to archive and discuss web content free of surveilance and commercial influence. It can be used for personal research, micro-blogging, or discussing dank memes.

### Chupa Posts
Chupa Posts are your copy of the web. They are standalone archives of web content (a single HTML file with images embedded and scripts removed) and a corresponding Matrix message pointing to the `mxc://` URI where the archive can be fetched.

### Discussing Posts
Posts can be discussed in real-time in the channel that they were shared. Behind the scenes, all post discussion is composed of replies to the post's Matrix message.

### Federated
Built to be self-hosted, Chupacabra is non-commercial software that empowers users to take ownership of their digital existence by providing a viable alternative to existing social media platforms. Everyone is free to launch their own version of Chupacabra or use a deployment they trust. Ever wanted a personal social media site?

## Stack
- **Front-End**: You can find the code + installation in the `ui` directory.
  - **Ionic React App**: The user inteface is powered by the [Ionic Framework](https://ionicframework.com/), allowing for cross-platform deployment (mobile + web). We use [Typescript](https://www.typescriptlang.org/), functional React components, and hooks.
  - **Recoiljs**: To the greatest extent possible, we keep state synced and managed by [Recoiljs](https://recoiljs.org/). All external synchronizatoin flows through this layer so that we can keep a clean "engine" for powering front-end interactions.
- **Back-End**
  - **Matrix**: The application is primarily powered by [Matrix](https://matrix.org/docs/spec/), and works against any Matrix server. Anyone with a matrix account can log in and give Chupacabra a try!
  - **Bot**: You can find the code + installation in the `chupabot` directory. Listens for messages from the client instructing it to fetch content to be archived with SingleFile and submitted to its resident home server. Can be invoked from any Matrix client.

## Contributing
Please see CONTRIBUTING.md

## LICENSE / WARRANTY
Please see LICENSE
