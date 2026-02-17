import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Appointments() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [consultationType, setConsultationType] = useState<
    "initial_consultation" | "follow_up" | "product_recommendation"
  >("initial_consultation");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: appointments = [] } = trpc.appointments.list.useQuery();
  const createAppointmentMutation = trpc.appointments.create.useMutation();

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    setIsLoading(true);
    try {
      await createAppointmentMutation.mutateAsync({
        appointmentTime: selectedTime,
        consultationType,
        notes,
      });

      toast.success("Appointment booked successfully!");
      setSelectedDate(null);
      setSelectedTime(null);
      setNotes("");
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate next 7 days
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Generate time slots
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const time = new Date();
    time.setHours(10 + i, 0, 0, 0);
    return time;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Book a Consultation</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Consultation Type */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Consultation Type</h2>
              <div className="space-y-3">
                {[
                  { value: "initial_consultation", label: "Initial Consultation" },
                  { value: "follow_up", label: "Follow-up Consultation" },
                  { value: "product_recommendation", label: "Product Recommendation" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center p-4 border border-green-500/30 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors"
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value={type.value}
                      checked={consultationType === type.value}
                      onChange={(e) =>
                        setConsultationType(
                          e.target.value as
                            | "initial_consultation"
                            | "follow_up"
                            | "product_recommendation"
                        )
                      }
                      className="mr-4"
                    />
                    <span className="text-white font-semibold">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-400" />
                Select Date
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {nextDays.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-slate-800/50 text-gray-300 border border-green-500/30 hover:border-green-500/50"
                    }`}
                  >
                    <div className="text-sm">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-green-400" />
                  Select Time
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time.toISOString()}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        selectedTime?.getHours() === time.getHours()
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                          : "bg-slate-800/50 text-gray-300 border border-green-500/30 hover:border-green-500/50"
                      }`}
                    >
                      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Additional Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your cannabis experience, preferences, or questions..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={5}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Appointment Summary</h2>

            <div className="space-y-4 mb-8 pb-8 border-b border-green-500/30">
              <div>
                <p className="text-sm text-gray-400 mb-1">Consultation Type</p>
                <p className="text-white font-semibold capitalize">
                  {consultationType.replace(/_/g, " ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white font-semibold">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Time</p>
                <p className="text-white font-semibold">
                  {selectedTime
                    ? selectedTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <p className="text-white font-semibold">30 minutes</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Specialist</p>
                <p className="text-white font-semibold">Dr. Cannabis Specialist</p>
              </div>
            </div>

            <Button
              onClick={handleBookAppointment}
              disabled={isLoading || !selectedTime}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
            >
              {isLoading ? "Booking..." : "Confirm Appointment"}
            </Button>

            <p className="text-xs text-gray-400 text-center mt-4">
              You will receive a confirmation email shortly after booking.
            </p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Your Appointments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{apt.doctorName}</h3>
                      <p className="text-sm text-green-400 capitalize">
                        {apt.consultationType.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        apt.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {new Date(apt.appointmentTime).toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
