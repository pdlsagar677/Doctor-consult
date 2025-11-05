import { convertTo24Hour, startOfDay, toLocalYMD } from "@/lib/dateUtils";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon, Clock, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface CalendarStepProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  availableSlots: string[];
  availableDates: string[];
  excludedWeekdays: number[];
  onContinue: () => void;
  bookedSlots: string[];
}

const CalendarStep = ({
  selectedDate,
  selectedSlot,
  setSelectedDate,
  setSelectedSlot,
  availableDates,
  availableSlots,
  onContinue,
  bookedSlots,
  excludedWeekdays,
}: CalendarStepProps) => {
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const displaySlots = showMoreSlots ? availableSlots : availableSlots.slice(0, 10);

  const isSlotBooked = (slot: string) => {
    if (!selectedDate) return false;
    const dateString = toLocalYMD(selectedDate);
    const slotDateTime = new Date(`${dateString}T${convertTo24Hour(slot)}`);
    return bookedSlots.some((bookedSlot) => new Date(bookedSlot).getTime() === slotDateTime.getTime());
  };

  const isSlotInPast = (slot: string) => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = startOfDay(now);
    const selectedDay = startOfDay(selectedDate);

    if (selectedDay.getTime() === today.getTime()) {
      const [time, modifier] = slot.split(" ");
      let [hour, minutes] = time.split(":");
      if (hour === "12") hour = "00";
      if (modifier === "PM") hour = String(parseInt(hour, 10) + 12);

      const slotDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(hour),
        parseInt(minutes),
        0
      );

      return slotDateTime.getTime() <= now.getTime() + 5 * 60 * 1000;
    }
    return false;
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const checkedDate = startOfDay(date);
    if (checkedDate < today) return true;

    const ymd = toLocalYMD(date);
    if (!availableDates.includes(ymd)) return true;

    return excludedWeekdays.includes(date.getDay());
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md">
          <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Select Date & Time</h3>
          <p className="text-gray-600 mt-1">Pick your preferred appointment slot</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Calendar Section */}
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-3">Choose Date</Label>
          <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-lg"
              classNames={{
                day_selected:
                  "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700",
                day_today: "bg-indigo-100 text-indigo-700 font-bold border border-indigo-300",
                day_disabled: "text-gray-300 opacity-50 cursor-not-allowed bg-gray-100",
                day: "hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200",
                nav_button: "hover:bg-indigo-50 rounded-md",
                head_cell: "text-gray-600 font-medium",
              }}
            />
          </div>

          {selectedDate && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-indigo-800">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Time Slots Section */}
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-3">
            Available Time Slots
            {availableSlots.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({availableSlots.length} slots available)
              </span>
            )}
          </Label>

          {selectedDate ? (
            availableSlots.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                  {displaySlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    const isBooked = isSlotBooked(slot);
                    const isPast = isSlotInPast(slot);
                    const isDisabled = isBooked || isPast;

                    return (
                      <Button
                        key={slot}
                        variant={isSelected ? "default" : "outline"}
                        disabled={isDisabled}
                        className={`p-4 justify-start rounded-xl font-medium transition-all duration-200 ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                            : isSelected
                            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform -translate-y-0.5"
                            : "hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 border-2 border-gray-200"
                        }`}
                        onClick={() => !isDisabled && setSelectedSlot(slot)}
                      >
                        <Clock className={`w-4 h-4 mr-2 ${isSelected ? "text-white" : "text-gray-600"}`} />
                        <span className={isSelected ? "text-white font-semibold" : "text-gray-700"}>
                          {slot}
                        </span>
                        {isPast && <span className="text-xs ml-2 opacity-75">(Past)</span>}
                        {isBooked && !isPast && <span className="text-xs ml-2 opacity-75">(Booked)</span>}
                      </Button>
                    );
                  })}
                </div>

                {availableSlots.length > 10 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowMoreSlots(!showMoreSlots)}
                    className="w-full border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 font-semibold"
                  >
                    {showMoreSlots ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show {availableSlots.length - 10} More Slots
                      </>
                    )}
                  </Button>
                )}

                {selectedSlot && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-purple-800">Appointment Scheduled:</span>
                        <p className="text-purple-700 text-sm mt-1">
                          {selectedDate.toLocaleDateString()} at {selectedSlot}
                        </p>
                      </div>
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border-2 border-gray-200">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h4 className="text-lg font-medium mb-2 text-gray-600">No slots available</h4>
                <p className="text-gray-500">Please select a different date to see available time slots</p>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border-2 border-gray-200">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h4 className="text-lg font-medium mb-2 text-gray-600">Select a Date</h4>
              <p className="text-gray-500">Please select a date to view available time slots</p>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={onContinue}
          disabled={!selectedDate || !selectedSlot}
          className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
            !selectedDate || !selectedSlot
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          Continue to Consultation Details <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Help Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <p className="text-indigo-800 font-medium">Scheduling Information</p>
            <p className="text-indigo-700 text-sm mt-1">
              • All times are shown in your local timezone<br />
              • Please arrive 5 minutes before your scheduled appointment<br />
              • You can reschedule up to 2 hours before your appointment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarStep;
