// src/pages/Onboarding.jsx
import { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../utils/uploadImage";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    idNumber: "",
    county: "",
    area: "",
    lat: null,
    lng: null,
    selfie: null, // File object
    selfiePreview: null, // URL for preview
  });
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Helper to handle input changes
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData((prev) => ({
        ...prev,
        selfie: file,
        selfiePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle Geolocation
  const handleLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setData((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
        setLocationStatus("success");
      },
      (err) => {
        console.error(err);
        setLocationStatus("error");
      }
    );
  };

  // Submit Data
  const submit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      let photoURL = "";

      // ✅ Upload Selfie using Cloudinary helper
      if (data.selfie) {
        photoURL = await uploadImage(
          data.selfie,
          auth.currentUser.uid,
          "selfie"
        );
      }

      // ✅ Update Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        idNumber: data.idNumber,
        county: data.county,
        area: data.area,
        location: {
          lat: data.lat,
          lng: data.lng,
        },
        photoURL,
        onboardingComplete: true,
        updatedAt: Date.now(),
      });

      navigate("/app/home");
    } catch (error) {
      console.error("Onboarding Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (step === 1) return data.idNumber && data.selfie;
    if (step === 2) return data.county && data.area;
    return true;
  };

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Progress Header */}
        <div className="px-8 pt-8 pb-4 bg-slate-50/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Setup Profile</h1>
            <span className="text-xs font-semibold text-muted bg-slate-200 px-2 py-1 rounded">
              Step {step} of 3
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-2">
                <h2 className="text-xl font-semibold text-primary">
                  Verify Identity
                </h2>
                <p className="text-sm text-muted">
                  We need your ID and a selfie to verify who you are.
                </p>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={data.idNumber}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                    placeholder="e.g. 12345678"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Custom File Upload */}
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
                    ${
                      data.selfie
                        ? "border-accent bg-accent/5"
                        : "border-slate-300 hover:border-accent hover:bg-slate-50"
                    }
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {data.selfiePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={data.selfiePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-full shadow-md border-2 border-white mb-2"
                      />
                      <p className="text-sm font-semibold text-accent">
                        Photo Selected
                      </p>
                      <p className="text-xs text-muted">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        Tap to upload Selfie
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-2">
                <h2 className="text-xl font-semibold text-primary">
                  Where do you live?
                </h2>
                <p className="text-sm text-muted">
                  This helps us customize loan offers for your region.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">
                      County
                    </label>
                    <input
                      type="text"
                      placeholder="Nairobi"
                      value={data.county}
                      onChange={(e) => handleChange("county", e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">
                      Area / Street
                    </label>
                    <input
                      type="text"
                      placeholder="Westlands"
                      value={data.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* GPS Button */}
                <button
                  onClick={handleLocation}
                  disabled={
                    locationStatus === "success" || locationStatus === "loading"
                  }
                  className={`
                    w-full flex items-center justify-center p-4 rounded-xl border transition-all duration-300
                    ${
                      locationStatus === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : locationStatus === "error"
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                    }
                  `}
                >
                  {locationStatus === "loading" && (
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}

                  {locationStatus === "success" && (
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}

                  <span className="font-medium text-sm">
                    {locationStatus === "idle" && "Use My Current Location"}
                    {locationStatus === "loading" && "Detecting..."}
                    {locationStatus === "success" && "Location Pinned"}
                    {locationStatus === "error" && "Location Access Denied"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINISH */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary">All Set!</h2>
                <p className="text-muted mt-2 max-w-xs mx-auto">
                  Your details have been captured. Click complete to finish
                  setting up your account.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">ID Number:</span>
                  <span className="font-semibold text-primary">
                    {data.idNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Region:</span>
                  <span className="font-semibold text-primary">
                    {data.county}, {data.area}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">GPS:</span>
                  <span className="font-semibold text-primary">
                    {data.lat ? "Captured" : "Skipped"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-8 pb-8 pt-4">
          <div className="flex justify-between items-center gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}

            <button
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else submit();
              }}
              disabled={!isStepValid() || loading}
              className={`
                flex-1 py-3 px-6 rounded-xl shadow-lg text-sm font-bold text-white transition-all duration-300
                ${
                  !isStepValid() || loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-slate-800 hover:to-slate-900 hover:scale-[1.02] active:scale-[0.98]"
                }
              `}
            >
              {loading
                ? "Finalizing..."
                : step === 3
                ? "Complete Setup"
                : "Next Step"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
