import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import ApplyFormCard from "../components/ApplyFormCard";

export interface ContributorData {
  name: string;
  email: string;
  profile: string;
  projectId: string;
  note: string;
  proposal?: string;
}

interface ContributorFormProps {
  projects: { id: string; name: string }[];
  onSubmit: (data: ContributorData) => Promise<void>;
  initialProjectId?: string;
}

const ContributorForm: React.FC<ContributorFormProps> = ({
  projects,
  initialProjectId = "",
}) => {
  const [showPopup, setShowPopup] = useState(false);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  return (
    <>
      {/* CONTENT */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-terminal-dim/20 p-3 sm:p-4 rounded-md">
          <h3 className="text-sm sm:text-base md:text-lg text-terminal-accent font-medium mb-2 sm:mb-3">
            Application Process
          </h3>

          <p className="text-xs sm:text-sm md:text-base text-terminal-text mb-2 sm:mb-3">
            Apply directly using our internal application form. Your submission
            will be stored securely in our database.
          </p>

          <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-terminal-dim mb-3 sm:mb-4 space-y-1">
            <li>Provide your contact information</li>
            <li>Share your GitHub / LinkedIn profile</li>
            <li>Submit your proposal</li>
            <li>Tell us why you're interested in this project</li>
          </ul>
        </div>

        {/* OPEN POPUP BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowPopup(true)}
            className="
              bg-terminal-accent hover:bg-terminal-accent/80
              text-black font-semibold
              px-4 sm:px-6 py-2 sm:py-3
              rounded-md transition-all shadow-lg
              text-sm sm:text-base
              hover:scale-105 flex items-center gap-2
            "
          >
            <span>Open Application Form</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-terminal-dim text-xs sm:text-sm text-center px-2">
          Application form opens in a popup window.
        </p>
      </div>

      {/* FULLSCREEN MODAL */}
      {showPopup &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm modal-backdrop"
              onClick={() => setShowPopup(false)}
            />

            {/* MODAL CONTENT */}
            <div
              className="
                relative z-10
                w-full max-w-2xl max-h-[90vh]
                overflow-y-auto modal-scroll
                modal-content
              "
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowPopup(false)}
                className="
                  absolute -top-10 right-2
                  text-white text-xl
                  hover:text-red-400 transition
                "
              >
                ✕
              </button>

              {/* APPLY FORM */}
              <ApplyFormCard />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ContributorForm;
