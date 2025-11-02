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
  const displaySlots = showMoreSlots
    ? availableSlots
    : availableSlots.slice(0, 10);

  const isSlotBooked = (slot: string): boolean => {
    if (!selectedDate) return false;
    const dateString = toLocalYMD(selectedDate);
    const slotDateTime = new Date(`${dateString}T${convertTo24Hour(slot)}`);

    return bookedSlots.some((bookedSlot) => {
      const bookedDateTime = new Date(bookedSlot);
      return bookedDateTime.getTime() === slotDateTime.getTime();
    });
  };

  const isSlotInPast = (slot: string): boolean => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    // Only apply this check for today's date
    if (selectedDay.getTime() === today.getTime()) {
      const [time, modifier] = slot.split(" ");
      let [hour, minutes] = time.split(":");

      if (hour === "12") {
        hour = "00";
      }

      if (modifier === "PM") {
        hour = String(parseInt(hour, 10) + 12);
      }

      const slotDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(hour, 10),
        parseInt(minutes, 10),
        0
      );

      const bufferedCurrentTime = new Date(now.getTime() + 5 * 60 * 1000);
      return slotDateTime.getTime() <= bufferedCurrentTime.getTime();
    }
    return false;
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date());
    const checkedDate = startOfDay(date)

    if (checkedDate < today) return true;

    // Check if date is in available range
    const ymd = toLocalYMD(date);
    if (!availableDates.includes(ymd)) return true;

    // Check weekday exclusion
    const jsWeekday = date.getDay();  // 0 = Sunday
    return excludedWeekdays.includes(jsWeekday)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Select Date & Time
            </h3>
            <p className="text-gray-600 mt-1">Choose your preferred appointment slot</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Choose Date
            </Label>
            <div className="border-2 border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md"
                classNames={{
                  day_selected: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:text-white focus:from-orange-600 focus:to-orange-700 focus:text-white',
                  day_today: 'bg-orange-100 text-orange-700 font-bold border-2 border-orange-300',
                  day_disabled: 'text-gray-300 opacity-50 cursor-not-allowed bg-gray-100',
                  day_range_middle: 'bg-orange-50 text-orange-900',
                  head_cell: 'text-gray-600 font-medium',
                  day: 'hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors duration-200',
                  nav_button: 'hover:bg-orange-50 rounded-lg',
                }}
              />
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Selected: {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Time Slots Section */}
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
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
                          variant={isSelected ? 'default' : 'outline'}
                          disabled={isDisabled}
                          className={`p-4 justify-start transition-all duration-200 rounded-xl font-medium ${
                            isDisabled 
                              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200' 
                              : isSelected 
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700 transform -translate-y-0.5" 
                                : "hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 border-2 border-gray-200"
                          }`}
                          onClick={() => !isDisabled && setSelectedSlot(slot)}
                        >
                          <Clock className={`w-4 h-4 mr-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                          <span className={isSelected ? 'text-white font-semibold' : 'text-gray-700'}>
                            {slot}
                          </span>
                          {isPast && (
                            <span className="text-xs ml-2 opacity-75">
                              (Past)
                            </span>
                          )}
                          {isBooked && !isPast && (
                            <span className="text-xs ml-2 opacity-75">
                              (Booked)
                            </span>
                          )}
                        </Button>
                      )
                    })}
                  </div>

                  {availableSlots.length > 10 && (
                    <Button
                      variant='outline'
                      onClick={() => setShowMoreSlots(!showMoreSlots)}
                      className="w-full border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 font-semibold"
                    >
                      {showMoreSlots ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Show {availableSlots.length - 10} More Slots
                        </>
                      )}
                    </Button>
                  )}

                  {/* Selected Slot Summary */}
                  {selectedSlot && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-green-800">Appointment Scheduled:</span>
                          <p className="text-green-700 text-sm mt-1">
                            {selectedDate.toLocaleDateString()} at {selectedSlot}
                          </p>
                        </div>
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border-2 border-gray-200">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2 text-gray-600">
                    No slots available
                  </h4>
                  <p className="text-gray-500">Please select a different date to see available time slots</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border-2 border-gray-200">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h4 className="text-lg font-medium mb-2 text-gray-600">
                  Select a Date
                </h4>
                <p className="text-gray-500">Please select a date to view available time slots</p>
              </div>
            )}
          </div>
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
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          Continue to Consultation Details
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Help Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <p className="text-blue-800 font-medium">Scheduling Information</p>
            <p className="text-blue-700 text-sm mt-1">
              • All times are shown in your local timezone<br/>
              • Please arrive 5 minutes before your scheduled appointment<br/>
              • You can reschedule up to 2 hours before your appointment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarStep;