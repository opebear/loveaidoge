"use client";

import React, { useEffect } from "react";
import { initApp } from "../main";

export default function Community() {
  useEffect(() => {
    initApp();
  }, []);

  return (
    <>
      <p>Join the AIDoge CTO Community</p>
      <div className="box1 community-box" id="community-box">
        <div className="community-content">
          <h2>OFFICIAL CHANNELS</h2>
          <div className="glow-divider"></div>
          <p className="community-desc">
            Stay updated and connect with our fast-growing community. These are
            the verified portals of AIDoge!
          </p>

          <div className="social-cards-grid">
            {/* X (Twitter) Card */}
            <div className="social-card x-card">
              <div className="card-glow-bg"></div>
              <div className="card-icon-wrapper">
                <svg
                  className="social-svg-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <h3>X / TWITTER</h3>
              <span className="badge official-badge">OFFICIAL</span>
              <p className="card-desc">
                Follow @ArbDoge_AI for live ecosystem news, official
                announcements, and community takeovers.
              </p>
              <a
                href="https://x.com/ArbDoge_AI"
                target="_blank"
                rel="noreferrer"
                className="social-card-btn x-btn"
              >
                <span className="btn-text-content">VISIT PROFILE</span>
              </a>
            </div>

            {/* Discord Card */}
            <div className="social-card discord-card">
              <div className="card-glow-bg"></div>
              <div className="card-icon-wrapper">
                <svg
                  className="social-svg-icon"
                  viewBox="0 0 127.14 96.36"
                  fill="currentColor"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53a105.73,105.73,0,0,0,32,16.29,77.7,77.7,0,0,0,6.71-11,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.67-2.1a75.22,75.22,0,0,0,94.08,0c.87.73,1.76,1.43,2.67,2.1a68.86,68.86,0,0,1-10.64,5.12,77.53,77.53,0,0,0,6.71,11,105.54,105.54,0,0,0,32-16.29C129.66,48.47,123.39,25.57,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                </svg>
              </div>
              <h3>DISCORD</h3>
              <span className="badge community-badge">COMMUNITY</span>
              <p className="card-desc">
                Join our official Discord server to connect directly with the
                community, moderators, and active contributors.
              </p>
              <a
                href="https://discord.gg/tBxhg2E2hA"
                target="_blank"
                rel="noreferrer"
                className="social-card-btn discord-btn"
              >
                <span className="btn-text-content">JOIN SERVER</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
