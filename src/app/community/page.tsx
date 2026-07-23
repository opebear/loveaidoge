"use client";

import React, { useState } from "react";

const ANTHEM_VIDEO_ID = "ymb7aLGIEi0";

interface ChannelLink {
  key: string;
  href: string;
  rowClassName: string;
  iconViewBox: string;
  iconPath: string;
  title: string;
  description: string;
}

const CHANNEL_LINKS: ChannelLink[] = [
  {
    key: "x",
    href: "https://x.com/ArbDoge_AI",
    rowClassName: "channel-row x-row",
    iconViewBox: "0 0 24 24",
    iconPath:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    title: "X / Twitter",
    description: "@ArbDoge_AI — live news & official announcements",
  },
  {
    key: "discord",
    href: "https://discord.gg/tBxhg2E2hA",
    rowClassName: "channel-row discord-row",
    iconViewBox: "0 0 127.14 96.36",
    iconPath:
      "M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53a105.73,105.73,0,0,0,32,16.29,77.7,77.7,0,0,0,6.71-11,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.67-2.1a75.22,75.22,0,0,0,94.08,0c.87.73,1.76,1.43,2.67,2.1a68.86,68.86,0,0,1-10.64,5.12,77.53,77.53,0,0,0,6.71,11,105.54,105.54,0,0,0,32-16.29C129.66,48.47,123.39,25.57,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z",
    title: "Discord",
    description:
      "Official hub for the community, mods & contributors, Holders, NEOs!",
  },
];

export default function Community() {
  const [isAnthemPlaying, setIsAnthemPlaying] = useState(false);

  return (
    <>
      <p className="page-intro-label">Join the AIDoge CTO Community</p>
      <div className="box1 community-box" id="community-box">
        <div className="community-layout">
          {/* AIDOGE Anthem Video Card */}
          <div className="anthem-card">
            <div className="anthem-glow-bg"></div>
            <div className="card-icon-wrapper anthem-icon-wrapper">
              <svg
                className="social-svg-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.524A2.994 2.994 0 0 0 .502 6.186 31.35 31.35 0 0 0 0 12a31.35 31.35 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.117c1.886.524 9.391.524 9.391.524s7.505 0 9.391-.524a2.994 2.994 0 0 0 2.107-2.117A31.35 31.35 0 0 0 24 12a31.35 31.35 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
              </svg>
            </div>
            <span className="badge anthem-badge">🎵 COMMUNITY ANTHEM</span>
            <h3 className="anthem-title">THE AIDOGE ANTHEM</h3>
            <p className="anthem-slogan">&quot;To The Moon&quot;🚀</p>
            <div className="anthem-video-wrapper">
              {isAnthemPlaying ? (
                <iframe
                  className="anthem-iframe"
                  src={`https://www.youtube.com/embed/${ANTHEM_VIDEO_ID}?si=nRhfdncSJKBg1I1b&autoplay=1`}
                  title="AIDOGE Community Anthem"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : (
                <button
                  type="button"
                  className="anthem-video-thumb-btn"
                  aria-label="Play AIDOGE Community Anthem video"
                  onClick={() => setIsAnthemPlaying(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="anthem-video-thumb-img"
                    src={`https://i.ytimg.com/vi/${ANTHEM_VIDEO_ID}/hqdefault.jpg`}
                    alt="THE AIDOGE ANTHEM video thumbnail"
                    loading="lazy"
                  />
                  <span className="anthem-play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="community-content">
            <h2>OFFICIAL CHANNELS</h2>
            <div className="glow-divider"></div>
            <p className="community-desc">
              Stay updated and connect with our fast-growing community. These
              are the verified portals of AIDOGE!
            </p>

            <div className="channels-list">
              {CHANNEL_LINKS.map((channel) => (
                <a
                  key={channel.key}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className={channel.rowClassName}
                >
                  <div className="channel-row-glow"></div>
                  <div className="channel-icon-box">
                    <svg
                      className="social-svg-icon"
                      viewBox={channel.iconViewBox}
                      fill="currentColor"
                    >
                      <path d={channel.iconPath} />
                    </svg>
                  </div>
                  <div className="channel-info">
                    <h3>{channel.title}</h3>
                    <p className="channel-desc">{channel.description}</p>
                  </div>
                  <span className="channel-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
