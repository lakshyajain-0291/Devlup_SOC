import SnowEffect from "../components/SnowEffect";
import { mentors } from "../data/mentors";
import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../components/ThemeProvider";
import { useState } from "react";

const Mentors = () => {
  const { showSnow } = useTheme();
  const [selectedYear, setSelectedYear] = useState("All");

  const years = ["All", ...new Set(mentors.map((m) => m.year))];

  const filteredMentors =
    selectedYear === "All"
      ? mentors
      : mentors.filter((m) => m.year === selectedYear);

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

      {/* FIXED YEAR FILTER (Below Shortcuts) */}
      <div className="fixed top-28 right-6 z-50">
        <div
          className="relative rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: "var(--terminal-window-bg)",
            border: "1px solid var(--terminal-window-border)",
            boxShadow: "var(--window-shadow-5)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 18px var(--accent-glow)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "var(--window-shadow-5)")
          }
        >
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="
              appearance-none
              bg-transparent
              px-6 py-3 pr-10
              rounded-full
              outline-none
              cursor-pointer
              transition-all duration-300
            "
            style={{
              color: "var(--terminal-text)",
              backgroundColor: "var(--terminal-window-bg)",
            }}
            onFocus={(e) =>
              (e.currentTarget.parentElement!.style.boxShadow =
                "0 0 20px var(--accent-glow)")
            }
            onBlur={(e) =>
              (e.currentTarget.parentElement!.style.boxShadow =
                "var(--window-shadow-5)")
            }
          >
            {years.map((year, i) => (
              <option
                key={i}
                value={year}
                style={{
                  background: "var(--terminal-window-bg)",
                  color: "var(--terminal-text)",
                }}
              >
                {year}
              </option>
            ))}
          </select>

          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--terminal-dim)" }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="text-center pt-32 pb-10 px-6 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold">DevLUp Mentors</h1>

        <p className="mt-6 text-[var(--terminal-dim)] max-w-2xl mx-auto">
          Connect with mentors and explore guidance across DevLUp projects.
        </p>
      </section>

      {/* MENTORS GRID */}
      <section
        className="max-w-6xl mx-auto px-6 pb-24 relative z-10
                   grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {filteredMentors.map((mentor, i) => (
          <div
            key={i}
            className="rounded-lg p-6 backdrop-blur-sm transition-all duration-300
                       hover:-translate-y-1 relative"
            style={{
              background: "var(--terminal-window-bg)",
              border: "1px solid var(--terminal-window-border)",
              boxShadow: "var(--window-shadow-5)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 25px var(--accent-glow)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "var(--window-shadow-5)")
            }
          >
            <div className="flex items-center gap-6">
              <img
                src={mentor.image}
                className="w-24 h-24 rounded-full object-cover border"
                style={{
                  borderColor: "var(--terminal-window-border)",
                }}
                alt={mentor.name}
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{mentor.name}</h2>

                <p className="mt-1 text-sm text-[var(--terminal-dim)]">
                  {mentor.role} • {mentor.year}
                </p>

                <p className="mt-3 text-[var(--terminal-dim)]">
                  {mentor.expertise}
                </p>

                <p className="mt-3 text-sm">
                  📧{" "}
                  <span className="text-[var(--terminal-dim)]">
                    {mentor.email}
                  </span>
                </p>

                <div className="flex gap-6 mt-5 text-lg">
                  <a
                    href={mentor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-color)]"
                  >
                    <FaGithub />
                  </a>

                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-color)]"
                  >
                    <FaLinkedinIn />
                  </a>

                  <a
                    href={`mailto:${mentor.email}`}
                    className="hover:text-[var(--accent-color)]"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Mentors;
