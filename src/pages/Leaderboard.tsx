import SnowEffect from "../components/SnowEffect";
import { contributors } from "../data/leaderboard";
import { FaGithub, FaUsers, FaChartLine } from "react-icons/fa";
import { useTheme } from "../components/ThemeProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const medals = ["🥈", "🥇", "🥉"];
const podiumHeights = [150, 200, 140]; // silver, gold, bronze

const Leaderboard = () => {
  const { showSnow } = useTheme();
  const navigate = useNavigate();

  const sorted = [...contributors].sort(
    (a, b) => b.contributions - a.contributions
  );

  // Order: 2nd, 1st, 3rd
  const podium = [sorted[1], sorted[0], sorted[2]];

  return (
    <div
      className="min-h-screen font-mono relative text-[var(--terminal-text)]"
      style={{
        background: `
          radial-gradient(circle at center,
            var(--bg-gradient-start),
            var(--bg-gradient-mid1),
            var(--bg-gradient-mid2),
            var(--bg-gradient-mid3),
            var(--bg-gradient-end)
          )
        `,
      }}
    >
      {showSnow && <SnowEffect />}

      {/* HERO */}
      <section className="pt-32 pb-12 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold"
        >
          Our Amazing Contributors
        </motion.h1>

        <p className="mt-3 text-[var(--terminal-dim)]">
          Celebrating the people who make DevLUp amazing
        </p>

        {/* START CONTRIBUTING → PROJECTS */}
        <button
          onClick={() => navigate("/projects")}
          className="mt-8 px-6 py-2 rounded-md text-black font-semibold hover:scale-105 transition"
          style={{ background: "var(--accent-color)" }}
        >
          Start Contributing
        </button>

        <div className="flex justify-center gap-10 mt-10">
          <div className="flex items-center gap-2">
            <FaUsers />
            <span>{contributors.length} Contributors</span>
          </div>

          <div className="flex items-center gap-2">
            <FaChartLine />
            <span>
              {contributors.reduce((a, b) => a + b.contributions, 0)} Contributions
            </span>
          </div>
        </div>
      </section>

      {/* PODIUM */}
      <section className="flex justify-center items-end gap-14 mb-12 relative z-10">
        {podium.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: podiumHeights[i], opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-44 rounded-xl flex items-end justify-center"
            style={{
              background: "var(--terminal-window-bg)",
              border: "1px solid var(--terminal-window-border)",
            }}
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-12 flex flex-col items-center"
            >
              <img
                src={c.avatar}
                className="w-20 h-20 rounded-full border-4 border-yellow-400"
              />

              <span className="text-2xl mt-2">{medals[i]}</span>
            </motion.div>

            {/* Text content */}
            <div className="text-center px-2 w-full min-h-[80px] flex flex-col justify-end pb-4">
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-sm text-[var(--terminal-dim)]">
                {c.contributions} contributions
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ALL CONTRIBUTORS */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {sorted.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center gap-5 p-5 rounded-lg"
            style={{
              background: "var(--terminal-window-bg)",
              border: "1px solid var(--terminal-window-border)",
              boxShadow: "var(--window-shadow-5)",
            }}
          >
            {/* Rank */}
            <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-[var(--accent-color)] text-black font-bold">
              #{index + 1}
            </div>

            <img src={c.avatar} className="w-14 h-14 rounded-full" />

            <div className="flex-1">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-[var(--terminal-dim)]">
                {c.contributions} contributions
              </p>
            </div>

            <a
              href={c.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-color)]"
            >
              <FaGithub />
            </a>

            {/* Glow */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition pointer-events-none"
              style={{
                boxShadow: "0 0 25px var(--accent-glow)",
              }}
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Leaderboard;
