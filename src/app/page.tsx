"use client";

import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <p>Never Go Back To My Old Life!</p>
      <div className="box1-home" id="memorial-board">
        <div className="memorial-overlay">
          {/* Memorial Title */}
          <div className="memorial-header-title">
            <div className="header-logo-group">
              <Image
                src="/img/AIDOGE_Logo.png"
                alt="AIDOGE"
                width={80}
                height={80}
                className="memorial-logo-spin"
              />
              <h2>ARBDOGE AI ECOSYSTEM PORTAL</h2>
            </div>
            <div className="memorial-time-tag">
              <span className="pulse-dot"></span>
              <span className="tag-label font-mono">
                ARCHIVED STATUS: IN MEMORIAM (2023 - 2024)
              </span>
            </div>
          </div>

          <div className="memorial-grid">
            {/* Left Column: Holographic Archive Viewer */}
            <div className="archive-viewer">
              <div className="viewer-screen">
                <div className="scanlines"></div>
                <div className="viewer-header">
                  <span className="font-mono">MEMORY_LOG_RETRIEVAL.EXE</span>
                  <span className="font-mono" id="retrieval-indicator">
                    READY
                  </span>
                </div>
                <div className="viewer-body">
                  <div className="viewer-display">
                    <div
                      className="ascii-art font-mono"
                      id="viewer-ascii"
                    ></div>
                    <h3 id="archive-title">
                      RETRIEVING ARBDOGE AI PLATFORM MEMORIES...
                    </h3>
                    <p className="archive-date font-mono" id="archive-date">
                      LOG_DATE: 2023-04-15
                    </p>
                    <div className="archive-desc-container">
                      <p className="archive-desc" id="archive-desc">
                        Select an archived system block on the right of this
                        monitor to power up the holographic recall system. Hear
                        the audio streams and view old protocols of the ArbDoge
                        AI ecosystem.
                      </p>
                    </div>
                    <div className="archive-stats" id="archive-stats">
                      <div className="stat-box">
                        <span className="stat-box-lbl font-mono">STATUS</span>
                        <span className="stat-box-val" id="stat-val-1">
                          ARCHIVED
                        </span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-box-lbl font-mono">IMPACT</span>
                        <span
                          className="stat-box-val text-pink"
                          id="stat-val-2"
                        >
                          LEGENDARY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Buttons under the viewer, designed like futuristic system chips */}
              <div className="chip-tabs">
                <button className="chip-btn" data-archive="genesis">
                  <span className="chip-num font-mono">01</span>
                  <span className="chip-name">GENESIS AIRDROP</span>
                </button>
                <button className="chip-btn" data-archive="lucky">
                  <span className="chip-num font-mono">02</span>
                  <span className="chip-name">LUCKY DROP</span>
                </button>
                <button className="chip-btn" data-archive="aicode">
                  <span className="chip-num font-mono">03</span>
                  <span className="chip-name">AICODE ENGINE</span>
                </button>
                <button className="chip-btn" data-archive="nfts">
                  <span className="chip-num font-mono">04</span>
                  <span className="chip-name">TRUTH NFTS</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Memorial Altar & Token Burner */}
            <div className="memorial-altar">
              <div className="altar-card">
                <div className="altar-header">
                  <div className="altar-glowing-candle">
                    <div className="candle-base">
                      <div className="candle-flame"></div>
                      <div className="candle-glow"></div>
                    </div>
                  </div>
                  <div className="altar-header-text">
                    <h3>COMMUNITY TRIBUTE ALTAR</h3>
                    <span className="candle-text">MEMORIAL FLAME</span>
                  </div>
                </div>

                <p className="altar-tagline">
                  The original arbdoge.ai contract remains immortal on Arbitrum,
                  but the web interface has passed. Let&apos;s keep the memory
                  alive. Burn a{" "}
                  <span className="glow-warning-text">VIRTUAL $AIDOGE</span> to
                  pay your respects.
                </p>

                {/* Virtual Simulation Safety Info Badge */}
                <div className="virtual-simulation-badge">
                  <span className="warning-icon">&nbsp;</span>
                  <span className="warning-text font-mono">
                    SIMULATION ONLY: NO WALLET CONNECTION OR SIGNATURE IS
                    REQUESTED. COIN BURNS ARE 100% VIRTUAL AND COST ZERO GAS
                    FEES.
                  </span>
                </div>

                {/* Burner Stats */}
                <div className="burn-stats-board">
                  <div className="burn-lbl font-mono">
                    TOTAL TRIBUTARY BURN COUNT
                  </div>
                  <div className="burn-val font-mono" id="tribute-burn-val">
                    22,974,464,256,141,700
                  </div>
                  <div className="burn-msg font-mono" id="burn-ticker">
                    PRESS BURN TO INCINERATE $AIDOGE
                  </div>
                </div>

                {/* Interactive Buttons */}
                <div className="altar-actions">
                  <button
                    className="glow-btn tribute-burn-btn"
                    id="burn-respects-btn"
                  >
                    <span className="btn-label">
                      🔥 VIRTUAL BURN $AIDOGE (PRESS F)
                    </span>
                  </button>
                </div>

                {/* Luminous Burning Analytics Widget */}
                <div className="luminous-analytics-widget">
                  <div className="analytics-header font-mono">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="pulse-dot-cyan"></span>
                      <span>LUMINOUS BURNING ANALYTICS</span>
                    </div>
                    <span
                      className="analytics-live-pulse blink-text"
                      style={{ color: "#ff2a5f" }}
                    >
                      ● DEFLATING_LIVE
                    </span>
                  </div>

                  {/* Dynamic HUD Stats Row */}
                  <div className="analytics-hud-row font-mono">
                    <div className="hud-item text-left">
                      <span className="hud-label">BURN INDEX:</span>
                      <span className="hud-val text-cyan">LIVE_DEFLATION</span>
                    </div>
                    <div className="hud-item text-right">
                      <span className="hud-label">TOTAL BURNED:</span>
                      <span
                        className="hud-val text-white"
                        id="live-chart-burned-val"
                      >
                        22.974464Q
                      </span>{" "}
                      <span
                        className="hud-val text-pink"
                        id="live-chart-burned-pct"
                      >
                        (10.940221%)
                      </span>
                    </div>
                  </div>

                  <div className="analytics-chart-container">
                    <canvas id="luminous-burn-chart"></canvas>
                  </div>
                  <div className="analytics-footer font-mono">
                    <span>X: CHRONO TIME LOGS</span>
                    <span className="text-pink">
                      Y: $AIDOGE COIN BURN INDEX
                    </span>
                  </div>
                </div>

                <div className="canvas-burner-wrapper">
                  <canvas id="burner-ashes"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Memory Chrono-Timeline Section */}
      <div
        className="box1-home timeline-section-container"
        id="memory-timeline-section"
      >
        <div className="memorial-overlay">
          <div className="memorial-header-title">
            <div className="header-logo-group">
              <span className="timeline-radar-signal"></span>
              <h2>HOLOGRAPHIC CHRONO-TIMELINE</h2>
            </div>
            <div className="memorial-time-tag">
              <span className="pulse-dot"></span>
              <span className="tag-label font-mono">
                TEMPORAL LOG DECODER ENGINE
              </span>
            </div>
          </div>

          <p className="timeline-intro text-center max-w-2xl mx-auto">
            Scroll through the vertical temporal dimension to decode the
            historical memory protocols of ArbDoge AI. Time-nodes emit
            holographic waves community-synced in real-time.
          </p>

          <div className="holographic-timeline-wrapper">
            <div className="timeline-glowing-axis"></div>

            <div
              className="timeline-node-item scroll-reveal-node"
              data-date="2023-04-15"
              data-title="THE GENESIS DISTRIBUTOR"
            >
              <div className="node-bullet-glow">
                <div className="node-ripple"></div>
              </div>
              <div className="node-card">
                <div className="node-glitch-header font-mono">
                  LOG_CODE: GENESIS_AIRDROP
                </div>
                <h4 className="node-title">The Miracle Genesis (Airdrop)</h4>
                <p
                  className="node-desc"
                  data-text="April 2023. Launched with a 100% fair and free distribution model. Over 400,000 eligible Arbitrum wallet addresses successfully claimed their rewards, triggering an unprecedented wave of hyper-growth across the ecosystem."
                >
                  April 2023. Launched with a 100% fair and free distribution
                  model. Over 400,000 eligible Arbitrum wallet addresses
                  successfully claimed their rewards, triggering an
                  unprecedented wave of hyper-growth across the ecosystem.
                </p>
                <div className="node-meta font-mono">
                  ALLOCATION: 100% COMMUNITYDROP | RECIPIENTS: 400K+ WALLETS
                </div>
              </div>
            </div>

            <div
              className="timeline-node-item scroll-reveal-node"
              data-date="2023-05-01"
              data-title="LUCKY DROP DEPLOYMENT"
            >
              <div className="node-bullet-glow">
                <div className="node-ripple"></div>
              </div>
              <div className="node-card">
                <div className="node-glitch-header font-mono">
                  LOG_CODE: LUCKY_DROP
                </div>
                <h4 className="node-title">Lucky Drop Incentive Protocol</h4>
                <p
                  className="node-desc"
                  data-text="May 2023. The protocol automatically routing a 3% transaction tax directly into an on-chain randomized reward pool, distributing over 38.2 million ARB tokens as community rewards."
                >
                  May 2023. The protocol automatically routing a 3% transaction
                  tax directly into an on-chain randomized reward pool,
                  distributing over 38.2 million ARB tokens as community
                  rewards.
                </p>
                <div className="node-meta font-mono">
                  REWARDS: 38.2M+ ARB | ON-CHAIN RNG
                </div>
              </div>
            </div>

            <div
              className="timeline-node-item scroll-reveal-node"
              data-date="2023-05-18"
              data-title="AICODE DEFLATION PROTOCOL"
            >
              <div className="node-bullet-glow">
                <div className="node-ripple"></div>
              </div>
              <div className="node-card">
                <div className="node-glitch-header font-mono">
                  LOG_CODE: AICODE_BURN
                </div>
                <h4 className="node-title">AICODE Hyper-Deflation</h4>
                <p
                  className="node-desc"
                  data-text="May 2023. Integrated the utility token AICODE. Users can acquire it exclusively by burning or locking $AIDOGE, initiating a massive hyper-deflationary loop that permanently destroyed over 22.97T AIDOGE."
                >
                  May 2023. Integrated the utility token AICODE. Users can
                  acquire it exclusively by burning or locking $AIDOGE,
                  initiating a massive hyper-deflationary loop that permanently
                  destroyed over 22.97T AIDOGE.
                </p>
                <div className="node-meta font-mono">
                  BURNED: 22.97T+ | SCARCITY: EXTREME
                </div>
              </div>
            </div>

            <div
              className="timeline-node-item scroll-reveal-node"
              data-date="2023-06-10"
              data-title="TRUTH NFT SERIES"
            >
              <div className="node-bullet-glow">
                <div className="node-ripple"></div>
              </div>
              <div className="node-card">
                <div className="node-glitch-header font-mono">
                  LOG_CODE: TRUTH_NFTS
                </div>
                <h4 className="node-title">Truth NFT Series Launch</h4>
                <p
                  className="node-desc"
                  data-text="June 2023. Released a premium collection of 10,000 unique cybernetic Doge artworks. The entire series sold out in seconds, unlocking exclusive early-access privileges and strategic staking rewards."
                >
                  June 2023. Released a premium collection of 10,000 unique
                  cybernetic Doge artworks. The entire series sold out in
                  seconds, unlocking exclusive early-access privileges and
                  strategic staking rewards.
                </p>
                <div className="node-meta font-mono">
                  ITEMS: 10,000 | STATUS: SOLD OUT
                </div>
              </div>
            </div>

            <div
              className="timeline-node-item scroll-reveal-node"
              data-date="2024-11-24"
              data-title="COMMUNITY TAKEOVER ERA"
            >
              <div className="node-bullet-glow">
                <div className="node-ripple"></div>
              </div>
              <div className="node-card">
                <div className="node-glitch-header font-mono">
                  LOG_CODE: COMMUNITY_CTO
                </div>
                <h4 className="node-title">Community Takeover Era</h4>
                <p
                  className="node-desc"
                  data-text="Year 2026. The original founding team fully transferred governance authority to the community. Loyal holders took direct charge, restructuring AIDOGE into an immortal, decentralized cultural monument on Arbitrum."
                >
                  Year 2026. The original founding team fully transferred
                  governance authority to the community. Loyal holders took
                  direct charge, restructuring AIDOGE into an immortal,
                  decentralized cultural monument on Arbitrum.
                </p>
                <div className="node-meta font-mono">
                  CTO PHASE: ACTIVE | NETWORK: IMMUTABLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-container" id="token-terminal">
        <div className="terminal-header">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
          <span className="terminal-title">AIDOGE TOKEN TERMINAL</span>
        </div>

        <div className="terminal-content">
          {/* Contract Section */}
          <div className="contract-section">
            <div className="contract-label">CONTRACT ADDRESS (ARBITRUM)</div>
            <div className="contract-row">
              <div className="token-info-col">
                <Image
                  src="/img/AIDOGE_Logo.png"
                  alt="AIDOGE"
                  width={80}
                  height={80}
                  className="token-logo-img"
                />
                <span className="token-name-text">$AIDOGE:</span>
              </div>
              <div className="address-col">
                <code id="contract-address">
                  0x09E18590E8f76b6Cf471b3cd75fE1A1a9D2B2c2b
                </code>
                <button id="copy-btn" className="glow-btn small">
                  <span className="btn-label">COPY</span>
                </button>
              </div>
            </div>
          </div>

          {/* Markets Segment */}
          <div className="markets-container">
            <div className="markets-header">
              <h3>ArbDoge AI Markets</h3>
              <div className="tabs">
                <button className="tab-btn active" data-tab="cex">
                  CEX Listings
                </button>
                <button className="tab-btn" data-tab="dex">
                  Arbitrum DEX Pools
                </button>
              </div>
            </div>

            {/* Tab Content: CEX */}
            <div className="tab-content active" id="tab-cex">
              <div className="table-wrapper">
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>EXCHANGE</th>
                      <th>PAIR</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody id="cex-table-body">
                    <tr>
                      <td
                        className="font-bold text-pink"
                        style={{ color: "#ff2a5f", fontWeight: 700 }}
                      >
                        Gate.io
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/USDT
                      </td>
                      <td>
                        <a
                          href="https://www.gate.io/trade/AIDOGE_USDT"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn"
                        >
                          TRADE ↗
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-bold text-pink"
                        style={{ color: "#ff2a5f", fontWeight: 700 }}
                      >
                        MEXC
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/USDT
                      </td>
                      <td>
                        <a
                          href="https://www.mexc.com/exchange/AIDOGE_USDT"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn"
                        >
                          TRADE ↗
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-bold text-pink"
                        style={{ color: "#ff2a5f", fontWeight: 700 }}
                      >
                        BitMart
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/USDT
                      </td>
                      <td>
                        <a
                          href="https://www.bitmart.com/trade/en-US?symbol=AIDOGE_USDT"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn"
                        >
                          TRADE ↗
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-bold text-pink"
                        style={{ color: "#ff2a5f", fontWeight: 700 }}
                      >
                        CoinEx
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/USDT
                      </td>
                      <td>
                        <a
                          href="https://www.coinex.com/en/exchange/aidoge-usdt"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn"
                        >
                          TRADE ↗
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tab Content: DEX */}
            <div className="tab-content" id="tab-dex">
              <div className="table-wrapper">
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>DEX PROTOCOL</th>
                      <th>POOL PAIR</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody id="dex-table-body">
                    <tr>
                      <td
                        className="font-bold text-cyan"
                        style={{ color: "#00f0ff", fontWeight: 700 }}
                      >
                        CAMELOT V3
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/WETH
                      </td>
                      <td>
                        <a
                          href="https://app.camelot.exchange/"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn dex-action"
                        >
                          SWAP ↗
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-bold text-cyan"
                        style={{ color: "#00f0ff", fontWeight: 700 }}
                      >
                        CAMELOT V2
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/USDT
                      </td>
                      <td>
                        <a
                          href="https://app.camelot.exchange/"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn dex-action"
                        >
                          SWAP ↗
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-bold text-cyan"
                        style={{ color: "#00f0ff", fontWeight: 700 }}
                      >
                        UNISWAP V3
                      </td>
                      <td
                        className="font-mono text-gray-400"
                        style={{ color: "#a1a1aa" }}
                      >
                        AIDOGE/WETH
                      </td>
                      <td>
                        <a
                          href="https://app.uniswap.org/"
                          target="_blank"
                          rel="noreferrer"
                          className="table-action-btn dex-action"
                        >
                          SWAP ↗
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Live Status Footer */}
          <div className="terminal-footer">
            <div className="live-status">
              <span className="status-indicator live"></span>
              <span className="status-text font-mono" id="connection-status">
                ACTIVE — ARBITRUM MAINNET DEPLOYED
              </span>
            </div>
            <div className="api-branding">
              <span>AIDOGE CTO COMMUNITY</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8% Tax Burn Interactive Chamber */}
      <div className="tax-dashboard-container" id="tax-dashboard">
        <div className="tax-dashboard-header">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
          <span className="tax-dashboard-title">
            AIDOGE ECOSYSTEM PROTOCOL: 8% TRANSACTION TAX DESTRUCT ENGINE
          </span>
        </div>

        <div className="tax-dashboard-content">
          <div className="tax-intro-section">
            <div className="tax-badge font-mono">PROTOCOL SPECS</div>
            <h2>8% TRANSACTION TAX BREAKDOWN</h2>
            <p className="tax-subheading">
              Every transaction of $AIDOGE on Arbitrum (Just DEX, no Tax for
              CEX!) is subject to an algorithmic 8% tax burn. This system fuels
              the continuous deflationary engine and rewards the
              ecosystem&apos;s pillars. Hover over the modules of the ring to
              view holographic metrics.
            </p>
          </div>

          <div className="tax-grid">
            {/* Left Panel: Holographic Ring Visualizer */}
            <div className="tax-visualizer-panel">
              <div className="ring-container">
                {/* Glow behind the SVG */}
                <div
                  className="ring-background-glow"
                  id="ring-glow-effect"
                ></div>

                <svg
                  id="tax-donut-svg"
                  viewBox="0 0 460 460"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    {/* Glowing filter for the ring segments */}
                    <filter
                      id="neon-glow"
                      filterUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="460"
                      height="460"
                    >
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    {/* Cyber Gradients for the segments */}
                    <linearGradient
                      id="grad-dev"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#0052d4" />
                      <stop offset="100%" stopColor="#4364f7" />
                    </linearGradient>
                    <linearGradient
                      id="grad-flex"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#11998e" />
                      <stop offset="100%" stopColor="#38ef7d" />
                    </linearGradient>
                    <linearGradient
                      id="grad-lp"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="100%" stopColor="#4facfe" />
                    </linearGradient>
                    <linearGradient
                      id="grad-lucky"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#fffb00" />
                      <stop offset="100%" stopColor="#ffcc00" />
                    </linearGradient>
                    <linearGradient
                      id="grad-purple"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7f00ff" />
                      <stop offset="100%" stopColor="#e100ff" />
                    </linearGradient>
                    <linearGradient
                      id="grad-gold"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ff9900" />
                      <stop offset="100%" stopColor="#ff5f1f" />
                    </linearGradient>
                  </defs>
                  {/* SVG Segments will be drawn dynamically via JavaScript for absolute mathematical perfection */}
                  <g id="donut-segments-group"></g>
                </svg>

                {/* Center Display Console inside the donut hole */}
                <div className="ring-core-display" id="ring-core">
                  <div className="core-logo-wrapper">
                    <Image
                      src="/img/AIDOGE_Logo.png"
                      alt="AIDOGE"
                      width={80}
                      height={80}
                      className="core-spinning-logo"
                    />
                  </div>
                  <div className="core-text font-mono">
                    <span className="core-value" id="core-center-pct">
                      8.0%
                    </span>
                    <span className="core-label" id="core-center-lbl">
                      TOTAL TAX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: High-End Interactive Telemetry Panel */}
            <div className="tax-telemetry-panel">
              <div className="telemetry-screen">
                <div className="telemetry-header">
                  <span className="font-mono">MODULE_TELEMETRY.LOG</span>
                  <span
                    className="font-mono blink-text"
                    style={{ color: "#00f0ff" }}
                  >
                    SYSTEMS_NOMINAL
                  </span>
                </div>
                <div className="telemetry-body">
                  <div className="telemetry-row">
                    <div
                      className="telemetry-icon-box"
                      id="telemetry-badge-color"
                    ></div>
                    <div className="telemetry-title-group">
                      <span
                        className="telemetry-caption font-mono"
                        id="telemetry-item-caption"
                      >
                        SELECTED PROTOCOL
                      </span>
                      <h3
                        className="telemetry-heading"
                        id="telemetry-item-title"
                      >
                        Ecosystem Deflation Core
                      </h3>
                    </div>
                  </div>

                  <div className="telemetry-pct-section">
                    <div className="pct-bar-wrapper">
                      <span
                        className="font-mono"
                        style={{ fontSize: "11px", color: "#a1a1aa" }}
                      >
                        TAX SHARE OF 8.0%
                      </span>
                      <div className="pct-numeric" id="telemetry-item-pct">
                        8.0%
                      </div>
                    </div>
                    {/* Futuristic dynamic indicator line */}
                    <div className="futuristic-progress">
                      <div
                        className="progress-bar-fill"
                        id="telemetry-item-bar"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="telemetry-details-container">
                    <p className="telemetry-desc" id="telemetry-item-desc">
                      Hover over any colored segment of the cybernetic tax ring
                      to inspect and decode its operational profile, ecosystem
                      allocation parameters, and economic impact.
                    </p>
                  </div>

                  {/* Custom Stats parameters block inside panel */}
                  <div className="telemetry-parameters">
                    <div className="param-row">
                      <span className="param-lbl font-mono">
                        DISTRIBUTION VELOCITY
                      </span>
                      <span
                        className="param-val font-mono"
                        id="param-val-velocity"
                      >
                        REAL-TIME
                      </span>
                    </div>
                    <div className="param-row">
                      <span className="param-lbl font-mono">
                        SHARE OF TAX POOL
                      </span>
                      <span
                        className="param-val font-mono text-cyan"
                        id="param-val-multiplier"
                      >
                        100%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Premium Grid Cards (Legend) */}
              <div className="legend-grid">
                <div
                  className="legend-card"
                  data-index="0"
                  style={{ "--accent-color": "#ff5f1f" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#ff5f1f",
                      boxShadow: "0 0 10px #ff5f1f",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">System Burn</span>
                    <span className="legend-val font-mono">1.0%</span>
                  </div>
                </div>
                <div
                  className="legend-card"
                  data-index="1"
                  style={{ "--accent-color": "#9933ff" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#9933ff",
                      boxShadow: "0 0 10px #9933ff",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">AIDOGE Stakers</span>
                    <span className="legend-val font-mono">0.7%</span>
                  </div>
                </div>
                <div
                  className="legend-card"
                  data-index="2"
                  style={{ "--accent-color": "#ffcc00" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#ffcc00",
                      boxShadow: "0 0 10px #ffcc00",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">Lucky Drop</span>
                    <span className="legend-val font-mono">3.0%</span>
                  </div>
                </div>
                <div
                  className="legend-card"
                  data-index="3"
                  style={{ "--accent-color": "#00ffff" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#00ffff",
                      boxShadow: "0 0 10px #00ffff",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">Camelot LP</span>
                    <span className="legend-val font-mono">1.0%</span>
                  </div>
                </div>
                <div
                  className="legend-card"
                  data-index="4"
                  style={{ "--accent-color": "#00cc44" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#00cc44",
                      boxShadow: "0 0 10px #00cc44",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">Flexible Funds</span>
                    <span className="legend-val font-mono">0.8%</span>
                  </div>
                </div>
                <div
                  className="legend-card"
                  data-index="5"
                  style={{ "--accent-color": "#0066ff" } as React.CSSProperties}
                >
                  <div
                    className="legend-indicator"
                    style={{
                      backgroundColor: "#0066ff",
                      boxShadow: "0 0 10px #0066ff",
                    }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">Development</span>
                    <span className="legend-val font-mono">1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
