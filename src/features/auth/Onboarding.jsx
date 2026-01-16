import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// Kenyan Universities and Colleges
const KENYAN_INSTITUTIONS = {
  universities: [
    { id: "uni_001", name: "University of Nairobi" },
    { id: "uni_002", name: "Kenyatta University" },
    { id: "uni_003", name: "Moi University" },
    {
      id: "uni_004",
      name: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    },
    { id: "uni_005", name: "Kenya Methodist University (KeMU)" },
    { id: "uni_006", name: "Strathmore University" },
    { id: "uni_007", name: "United States International University (USIU)" },
    { id: "uni_008", name: "Aga Khan University" },
    { id: "uni_009", name: "Multimedia University of Kenya (MMU)" },
    { id: "uni_010", name: "Maseno University" },
    { id: "uni_011", name: "Technical University of Kenya (TUK)" },
    { id: "uni_012", name: "Karatina University" },
    { id: "uni_013", name: "Kisii University" },
    { id: "uni_014", name: "Mount Kenya University" },
    { id: "uni_015", name: "Kabarak University" },
    { id: "uni_016", name: "Laikipia University" },
    { id: "uni_017", name: "Kca University" },
    { id: "uni_018", name: "Nairobi Institute of Business Studies" },
    { id: "uni_019", name: "Africana First University" },
    { id: "uni_020", name: "Pan Africa Christian University" },
  ],
  colleges: [
    {
      id: "col_001",
      name: "Kenya Institute of Banking and Insurance Studies (KIBIS)",
    },
    { id: "col_002", name: "Kenya National Police College" },
    { id: "col_003", name: "East Africa School of Aviation" },
    { id: "col_004", name: "Kenya Tourism Board Training Institute" },
    { id: "col_005", name: "Nairobi Aviation College" },
    { id: "col_006", name: "Kenya National Conservatoire of Music" },
    { id: "col_007", name: "Kenya Polytechnic University College" },
    { id: "col_008", name: "Mombasa Technical Training Institute" },
    { id: "col_009", name: "Kisumu Polytechnic" },
    { id: "col_010", name: "Nakuru Medical Training College" },
  ],
};

export default function Onboarding() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    university_id: userData?.university_id || "",
    university_name: userData?.university_name || "",
    department_id: userData?.department_id || "",
    level_id: userData?.level_id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "university_id") {
      // Find the university name
      const allInstitutions = [
        ...KENYAN_INSTITUTIONS.universities,
        ...KENYAN_INSTITUTIONS.colleges,
      ];
      const institution = allInstitutions.find((inst) => inst.id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        university_name: institution?.name || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Check if current step is complete
  const isStepComplete = () => {
    if (step === 1) return !!formData.university_id;
    if (step === 2) return !!formData.department_id;
    if (step === 3) return !!formData.level_id;
    return false;
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile with onboarding data
      await updateDoc(doc(db, "users", user.uid), {
        university_id: formData.university_id,
        university_name: formData.university_name,
        department_id: formData.department_id,
        level_id: formData.level_id,
        onboarding_completed: true,
      });

      // Redirect to dashboard based on role
      const role = userData?.role || "student";
      if (role === "admin" || role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error completing onboarding:", err);
      alert("Error completing onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Complete Your Profile</h2>
      <p style={styles.subtitle}>
        Step {step} of 3 - Let us get to know you better
      </p>

      <form onSubmit={handleComplete} style={styles.form}>
        {step === 1 && (
          <div style={styles.step}>
            <h3>Select Your University or College</h3>
            <select
              name="university_id"
              value={formData.university_id}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Choose Institution...</option>
              <optgroup label="Public Universities">
                {KENYAN_INSTITUTIONS.universities.slice(0, 7).map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Private Universities">
                {KENYAN_INSTITUTIONS.universities.slice(7).map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Colleges">
                {KENYAN_INSTITUTIONS.colleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

        {step === 2 && (
          <div style={styles.step}>
            <h3>Select Your Department</h3>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Choose Department...</option>

              {/* Computing & Technology */}
              <option value="dept_001">Computer Science</option>
              <option value="dept_002">Information Technology</option>
              <option value="dept_003">Software Engineering</option>
              <option value="dept_004">Data Science</option>
              <option value="dept_005">Cyber Security</option>
              <option value="dept_006">Information Systems</option>

              {/* Engineering */}
              <option value="dept_010">Civil Engineering</option>
              <option value="dept_011">
                Electrical & Electronic Engineering
              </option>
              <option value="dept_012">Mechanical Engineering</option>
              <option value="dept_013">Mechatronics Engineering</option>
              <option value="dept_014">Chemical Engineering</option>
              <option value="dept_015">Telecommunication Engineering</option>
              <option value="dept_016">Industrial Engineering</option>

              {/* Health & Medical Sciences */}
              <option value="dept_020">Medicine & Surgery</option>
              <option value="dept_021">Nursing</option>
              <option value="dept_022">Clinical Medicine</option>
              <option value="dept_023">Public Health</option>
              <option value="dept_024">Pharmacy</option>
              <option value="dept_025">Medical Laboratory Sciences</option>
              <option value="dept_026">Radiography & Imaging</option>
              <option value="dept_027">Dental Technology</option>

              {/* Business & Economics */}
              <option value="dept_030">Business Administration</option>
              <option value="dept_031">Commerce</option>
              <option value="dept_032">Accounting</option>
              <option value="dept_033">Finance</option>
              <option value="dept_034">Economics</option>
              <option value="dept_035">
                Procurement & Supply Chain Management
              </option>
              <option value="dept_036">Human Resource Management</option>
              <option value="dept_037">Entrepreneurship</option>

              {/* Law & Governance */}
              <option value="dept_040">Law</option>
              <option value="dept_041">Criminology & Security Studies</option>
              <option value="dept_042">International Relations</option>
              <option value="dept_043">Public Administration</option>
              <option value="dept_044">Political Science</option>

              {/* Education */}
              <option value="dept_050">Education (Arts)</option>
              <option value="dept_051">Education (Science)</option>
              <option value="dept_052">
                Early Childhood Development Education
              </option>
              <option value="dept_053">Special Needs Education</option>
              <option value="dept_054">Educational Management</option>

              {/* Agriculture & Environmental Studies */}
              <option value="dept_060">Agriculture</option>
              <option value="dept_061">Agribusiness Management</option>
              <option value="dept_062">Animal Science</option>
              <option value="dept_063">Horticulture</option>
              <option value="dept_064">Environmental Science</option>
              <option value="dept_065">Forestry</option>
              <option value="dept_066">Food Science & Technology</option>

              {/* Arts, Media & Humanities */}
              <option value="dept_070">Journalism & Mass Communication</option>
              <option value="dept_071">Film & Theatre Arts</option>
              <option value="dept_072">Communication & Media Studies</option>
              <option value="dept_073">Fine Art & Design</option>
              <option value="dept_074">Music</option>
              <option value="dept_075">Linguistics</option>

              {/* Social Sciences */}
              <option value="dept_080">Sociology</option>
              <option value="dept_081">Psychology</option>
              <option value="dept_082">Social Work</option>
              <option value="dept_083">Community Development</option>
              <option value="dept_084">Development Studies</option>

              {/* Hospitality, Tourism & Sports */}
              <option value="dept_090">Hospitality Management</option>
              <option value="dept_091">Tourism Management</option>
              <option value="dept_092">Hotel & Catering Management</option>
              <option value="dept_093">Sports Science</option>

              {/* TVET & Technical */}
              <option value="dept_100">Building Construction</option>
              <option value="dept_101">Automotive Engineering</option>
              <option value="dept_102">Electrical Installation</option>
              <option value="dept_103">Plumbing & Pipe Fitting</option>
              <option value="dept_104">Welding & Fabrication</option>
              <option value="dept_105">Fashion Design</option>
            </select>
          </div>
        )}

        {step === 3 && (
          <div style={styles.step}>
            <h3>Select Your Academic Level</h3>
            <select
              name="level_id"
              value={formData.level_id}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Choose Level...</option>

              {/* TVET & College Levels */}
              <option value="level_cert">Certificate</option>
              <option value="level_adv_cert">Advanced Certificate</option>
              <option value="level_dip">Diploma</option>
              <option value="level_high_dip">Higher Diploma</option>

              {/* Undergraduate */}
              <option value="level_deg_yr1">Bachelor’s Degree – Year 1</option>
              <option value="level_deg_yr2">Bachelor’s Degree – Year 2</option>
              <option value="level_deg_yr3">Bachelor’s Degree – Year 3</option>
              <option value="level_deg_yr4">Bachelor’s Degree – Year 4</option>
              <option value="level_deg_yr5">
                Bachelor’s Degree – Year 5 (where applicable)
              </option>

              {/* Postgraduate */}
              <option value="level_pg_dip">Postgraduate Diploma</option>
              <option value="level_masters">Master’s Degree</option>
              <option value="level_phd">Doctor of Philosophy (PhD)</option>
            </select>
          </div>
        )}

        <div style={styles.buttonGroup}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              style={styles.secondaryButton}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!isStepComplete()}
              style={styles.button}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !isStepComplete()}
              style={styles.button}
            >
              {loading ? "Completing..." : "Complete Onboarding"}
            </button>
          )}
        </div>
      </form>

      <div style={styles.progress}>
        <div
          style={{ ...styles.progressBar, width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  progress: {
    width: "100%",
    height: "4px",
    backgroundColor: "#e9ecef",
    borderRadius: "2px",
    marginTop: "20px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007bff",
    transition: "width 0.3s ease",
  },
};
