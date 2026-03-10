import SnowEffect from "../components/SnowEffect";
import { useTheme } from "../components/ThemeProvider";
import ApplyFormCard from "../components/ApplyFormCard";

const ApplyFormPage = () => {
  const { showSnow } = useTheme();

  return (
    <div
      className="min-h-screen font-mono flex justify-center items-start pt-32"
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
      <ApplyFormCard />
    </div>
  );
};

export default ApplyFormPage;
