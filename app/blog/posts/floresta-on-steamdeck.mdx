---
title: 'Running a Floresta Node on a Steam Deck'
description: "I ran a lightweight Bitcoin node on a Steam Deck. Here's what happened."
publishedAt: '2026-04-10'
tags: ['linux', 'floresta', 'bitcoin']
author: 'Yan Fernandes'
summary: 'The whole point of Floresta is sovereignty without expensive hardware. A Utreexo-powered node that can run anywhere. So I looked at the Steam Deck sitting on my desk and thought: why not?'
---

I ran a lightweight Bitcoin node on a Steam Deck.

Here's what happened.

## WTF Why run on a Steam Deck?

The whole point of Floresta is sovereignty without expensive hardware.

A Utreexo-powered node that can run anywhere.

So I looked at the Steam Deck sitting on my desk and thought: **Why not?**

It's a handheld gaming console running SteamOS, an Arch-based Linux distro with an immutable root filesystem. 

Not exactly the first thing that comes to mind when you think "Bitcoin infrastructure." But it has a decent CPU, WiFi, and enough storage.

## The Setup

SteamOS locks down the filesystem by default. 
So the first thing was:

```bash
sudo steamos-readonly disable
```

Then the usual: pacman for build deps, rustup for the Rust toolchain, clone the repo, `cargo build --release`. Everything was pretty simple, in theory.

In practice? Not so much.

### The glibc Headers Problem

The Steam Deck ships with GCC but not the full C library headers.

Building `secp256k1-sys` failed immediately `string.h: No such file or directory`. Same for `aws-lc-sys`.

The fix was:
```bash
sudo pacman-key --init
sudo pacman-key --populate archlinux holo
sudo pacman -S glibc linux-api-headers base-devel cmake clang git boost boost-libs
```

The `pacman-key` move is necessary because SteamOS doesn't initialize the keyring by default. 

Without it, every package install fails with a cryptic "keyring is not writable" error.

### The Sleep Problem

The Deck kept trying to suspend itself every few minutes. Mid-compilation. Mid-sync. Broadcasting "The system will suspend now!" like a passive-aggressive roommate.

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target
```

And the Problem solved.

### SSH Access

I don't have a mouse or keyboard for the Deck. 
The on-screen keyboard works but it's painful. 

SSH was the way to bypass.

```bash
# On the Deck (via touch keyboard)
passwd
sudo systemctl enable --now sshd

# On the MacBook
ssh deck@192.168.0.26
```

One catch: `wlan0` doesn't exist on SteamOS. The WiFi interface is `wlp1s0` or similar. `hostname -I` was enough.

## Building Floresta

After sorting out the headers and deps, `cargo build --release` ran for a while.
The Deck isn't fast, it's a handheld after all, but it got through compilation without issues.

## Running the Node

I went with signet.

```bash
./target/release/florestad --network signet
```

The node came up, found peers through DNS seeds, and started downloading headers. 
Progress was steady, headers synced in a couple minutes, reaching ~299k blocks.

### Syncing

After headers sync, the node had trouble finding Utreexo peers to continue. 

Most signet peers were disconnected for not having the required services, and the few `utreexod` peers that connected returned proof validation errors. The node kept looping on "Not enough utreexo peers."

I didn't dig deep enough to figure out exactly why.

Could be a configuration issue on my end, a protocol version mismatch, or just the reality of signet having very few Utreexo bridge nodes right now.

If you know what's going on here, I'd love to hear about it btw.

Floresta enables `--assume-utreexo` by default, so it starts from a hardcoded accumulator state near the tip and validates forward.

The backfill (validating historical blocks in the background) is what needs the Utreexo peers.

## Findings

**What works:**
- Floresta builds and runs on the Steam Deck
- Headers sync is fast, even on WiFi
- The Electrum server starts and responds to RPC queries
- `--assume-utreexo` (default) gets you to a usable state quickly

**What doesn't (yet):**
- Full historical sync on signet didn't work — Utreexo peers were scarce and proof validation failed for the ones that connected. Not sure if it's a config issue on my end or something else
- Getting a GUI terminal to show logs on the Deck's screen from SSH is a nightmare (Gamescope doesn't play nice with `DISPLAY` forwarding)

**Steam Deck specific quirks:**
- Immutable root filesystem: `steamos-readonly disable` is step zero
- No pacman keyring by default
- Aggressive sleep/suspend behavior
- No `wlan0`interface names are different
- SteamOS updates can wipe pacman-installed packages. For a permanent setup, use `distrobox`
- Desktop Mode uses a mix of X11 (via Gamescope) and KDE, making remote display forwarding unreliable

## Numbers

While the node was running, I checked how much the Deck was actually sweating:

| Metric | Value |
|---|---|
| CPU usage | 2.8% |
| RAM | ~2.1 GB (14.4% of 14.5 GB) |
| Disk (datadir) | 103 MB |
| Connected peers | 10 (IPv4 + IPv6) |
| Sync progress | 99.1% (296,870 / 299,501 blocks) |
| Battery | 43% with ~4h remaining |

103 MB of disk. That's it. A traditional full node eats ~600 GB. Floresta with Utreexo is playing a completely different game.

RAM at 2.1 GB is a bit higher than I expected for a "lightweight" node, but the Deck has 14.5 GB to spare, so it's not a problem.

You could literally run Floresta in the background while gaming and not notice it's there.

## Was It Worth It?

Absolutely.

The whole experiment took about an hour from SSH to running node.

Floresta's resource footprint is genuinely small. The Deck barely noticed it was running a Bitcoin node alongside Steam.

The real takeaway: Floresta run almost everywhere.

A Bitcoin node on a gaming console. Sovereignty is portable (and fun) afterall.
