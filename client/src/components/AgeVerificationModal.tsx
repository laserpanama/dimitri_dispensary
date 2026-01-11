import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AgeVerificationModalProps {
  onVerified: () => void;
}

export default function AgeVerificationModal({ onVerified }: AgeVerificationModalProps) {
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const verifyMutation = trpc.ageVerification.verify.useMutation();

  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - 100;
  const maxBirthYear = currentYear - 21;

  const handleVerify = async () => {
    setError("");

    if (!birthYear) {
      setError("Please enter your birth year");
      return;
    }

    const year = parseInt(birthYear, 10);

    if (isNaN(year) || year < minBirthYear || year > maxBirthYear) {
      setError("You must be at least 21 years old to access this site");
      return;
    }

    setIsLoading(true);
    try {
      await verifyMutation.mutateAsync({});
      localStorage.setItem("ageVerified", "true");
      localStorage.setItem("ageVerifiedAt", new Date().toISOString());
      onVerified();
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Verification</h1>
          <p className="text-gray-600">
            You must be at least 21 years old to access this site
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <label htmlFor="birthYear" className="block text-sm font-semibold text-gray-700 mb-3">
              What year were you born?
            </label>
            <input
              id="birthYear"
              type="number"
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder={`${currentYear - 21}`}
              min={minBirthYear}
              max={maxBirthYear}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {isLoading ? "Verifying..." : "I Confirm I'm 21+"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This site is intended for adults 21 and older. By clicking the button above, you confirm
            that you are of legal age to purchase cannabis products.
          </p>
        </div>
      </div>
    </div>
  );
}
