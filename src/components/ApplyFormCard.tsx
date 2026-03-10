import { useState } from "react";

const bgImage = "/avatars/bg_web.jpg";

const ApplyFormCard = () => {
  const [form, setForm] = useState({
    mentee_name: "",
    mentee_roll_number: "",
    mentee_github_id: "",
    mentee_email_id: "",

    mentee_project_1: "",
    mentee_proposal_1: "",
    mentee_project_interest_1: "",

    mentee_project_2: "",
    mentee_proposal_2: "",
    mentee_project_interest_2: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
  };

  const glowOn = (e: any) =>
    (e.currentTarget.style.boxShadow = "0 0 12px var(--accent-glow)");
  const glowOff = (e: any) => (e.currentTarget.style.boxShadow = "none");

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-10 relative">
      <div
        className="rounded-lg p-10 transition-all duration-300 relative overflow-hidden"
        style={{
          border: "1px solid var(--terminal-window-border)",
          boxShadow: "var(--window-shadow-5)",
        }}
      >
        {/* BLURRED BACKGROUND */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(5px)",
          }}
        />

        {/* DARK OVERLAY */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />

        <div className="relative">
          <h1 className="text-3xl font-bold mb-6">
            Contributor Application
          </h1>

          {submitted ? (
            <p className="text-center text-[var(--accent-color)]">
              Application submitted successfully.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* BASIC INFO */}
              {[
                ["mentee_name", "Full Name"],
                ["mentee_roll_number", "Roll Number"],
                ["mentee_github_id", "GitHub ID"],
                ["mentee_email_id", "Email ID"],
                ["mentee_project_1", "Project 1"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  required
                  onChange={handleChange}
                  className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--terminal-window-border)",
                    color: "var(--terminal-text)",
                  }}
                  onFocus={glowOn}
                  onBlur={glowOff}
                />
              ))}

              {/* PROJECT 1 */}
              <textarea
                name="mentee_proposal_1"
                rows={3}
                placeholder="Proposal 1"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--terminal-window-border)",
                  color: "var(--terminal-text)",
                }}
                onFocus={glowOn}
                onBlur={glowOff}
              />

              <textarea
                name="mentee_project_interest_1"
                rows={2}
                placeholder="Project Interest 1"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--terminal-window-border)",
                  color: "var(--terminal-text)",
                }}
                onFocus={glowOn}
                onBlur={glowOff}
              />

              {/* PROJECT 2 */}
              <input
                name="mentee_project_2"
                placeholder="Project 2"
                onChange={handleChange}
                className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--terminal-window-border)",
                  color: "var(--terminal-text)",
                }}
                onFocus={glowOn}
                onBlur={glowOff}
              />

              <textarea
                name="mentee_proposal_2"
                rows={3}
                placeholder="Proposal 2"
                onChange={handleChange}
                className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--terminal-window-border)",
                  color: "var(--terminal-text)",
                }}
                onFocus={glowOn}
                onBlur={glowOff}
              />

              <textarea
                name="mentee_project_interest_2"
                rows={2}
                placeholder="Project Interest 2"
                onChange={handleChange}
                className="w-full p-3 rounded-md outline-none transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--terminal-window-border)",
                  color: "var(--terminal-text)",
                }}
                onFocus={glowOn}
                onBlur={glowOff}
              />

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105"
                  style={{
                    background: "var(--accent-color)",
                    color: "black",
                    boxShadow: "0 0 10px var(--accent-glow)",
                  }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyFormCard;
