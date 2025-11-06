"use client";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Video,
  User,
  Stethoscope,
  TrendingUp,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import PrescriptionViewModal from "../doctor/PrescriptionViewModal";

const PatientDashboardContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  useEffect(() => {
    if (user?.type === "patient") fetchAppointments("patient", activeTab);
  }, [user, activeTab, fetchAppointments]);

  useEffect(() => {
    const now = new Date();
    const upcomingAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        (aptDate >= now || apt.status === "In Progress") &&
        (apt.status === "Scheduled" || apt.status === "In Progress")
      );
    });
    const pastAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return aptDate < now || apt.status === "Completed" || apt.status === "Cancelled";
    });
    setTabCounts({
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length,
    });
  }, [appointments]);

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const isToday = (dateString: string) =>
    new Date(dateString).toDateString() === new Date().toDateString();

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(dateString).toDateString() === tomorrow.toDateString();
  };

  const canJoinCall = (appointment: any) => {
    const diffMinutes =
      (new Date(appointment.slotStartIso).getTime() - new Date().getTime()) / (1000 * 60);
    return (
      isToday(appointment.slotStartIso) &&
      diffMinutes <= 15 &&
      diffMinutes >= -120 &&
      (appointment.status === "Scheduled" || appointment.status === "In Progress")
    );
  };

  if (!user) return null;

  // --- Appointment Card ---
  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all rounded-2xl border-0 p-6 flex flex-col lg:flex-row gap-4">
      {/* Avatar + Rating */}
      <div className="flex flex-col items-center lg:items-start w-28 flex-shrink-0 gap-3">
        <Avatar className="w-20 h-20 border-4 border-emerald-100 group-hover:border-emerald-200 transition-colors">
          <AvatarImage
            src={appointment.doctorId?.profileImage}
            alt={appointment.doctorId?.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-lg font-semibold">
            {appointment.doctorId?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {appointment.status === "Completed" && (
          <div className="flex items-center space-x-1 bg-emerald-50 px-3 py-1 rounded-full">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{appointment.doctorId?.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              <span>{appointment.doctorId?.specialization}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{appointment.doctorId?.hospitalInfo?.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-start lg:items-end">
            <Badge
              className={`${getStatusColor(appointment.status)} px-3 py-1 rounded-full font-semibold text-sm`}
            >
              {appointment.status}
            </Badge>

            {isToday(appointment.slotStartIso) && (
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="w-3 h-3" /> TODAY
              </div>
            )}
            {isTomorrow(appointment.slotStartIso) && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3 h-3" /> TOMORROW
              </div>
            )}
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(appointment.slotStartIso).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">{formatTime(appointment.slotStartIso)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {appointment.consultationType === "Video Consultation" ? (
                <Video className="w-5 h-5 text-emerald-500" />
              ) : (
                <Phone className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{appointment.consultationType}</p>
                <p className="text-sm text-gray-600">
                  {appointment.consultationType === "Video Consultation" ? "Video Call" : "Phone Call"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
              <span className="text-sm font-semibold text-gray-900">Consultation Fee</span>
              <span className="text-lg font-bold text-emerald-600">Rs.{appointment.doctorId?.fees}</span>
            </div>

            {appointment.symptoms && (
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-1">Symptoms</p>
                <p className="text-sm text-gray-600 line-clamp-2">{appointment.symptoms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between mt-4">
          <div className="flex flex-wrap gap-3">
            {canJoinCall(appointment) && (
              <Link href={`/call/${appointment._id}`}>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-6 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Video className="w-4 h-4" /> Join Call
                </Button>
              </Link>
            )}

            {appointment.status === "Completed" && appointment.prescription && (
              <PrescriptionViewModal
                appointment={appointment}
                userType="patient"
                trigger={
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-2 flex items-center gap-2 shadow-md transition-all">
                    <FileText className="w-4 h-4" /> View Prescription
                  </Button>
                }
              />
            )}

            {appointment.status === "Scheduled" && (
              <Button className="border-emerald-200 text-emerald-700 rounded-xl px-6 py-2 flex items-center gap-2 hover:bg-emerald-50">
                <Calendar className="w-4 h-4" /> Reschedule
              </Button>
            )}
          </div>

          {appointment.status === "Completed" && (
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-6 py-2 flex items-center gap-2 shadow-md transition-all">
              <Download className="w-4 h-4" /> Download Invoice
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  // --- Empty State ---
  const EmptyState = ({ tab }: { tab: string }) => {
    const states = {
      upcoming: {
        icon: Clock,
        title: "No Upcoming Appointments",
        description: "Book your first consultation now to get started.",
        showBookButton: true,
        gradient: "from-emerald-500 to-emerald-600",
      },
      past: {
        icon: FileText,
        title: "No Past Appointments",
        description: "Your completed consultations will appear here.",
        showBookButton: false,
        gradient: "from-green-400 to-emerald-500",
      },
    };
    const state = states[tab as keyof typeof states];
    const Icon = state.icon;

    return (
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-12 text-center">
          <div
            className={`w-20 h-20 bg-gradient-to-r ${state.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{state.title}</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">{state.description}</p>
          {state.showBookButton && (
            <Link href="/doctor-list">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Book Appointment
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Header showDashboardNav />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header + Stats */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
                    Welcome back, <span className="text-emerald-600">{user?.name}</span>!
                  </h1>
                  <p className="text-gray-600 mt-1">Manage your appointments and medical history</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">{tabCounts.upcoming} Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">{tabCounts.past} Past Consultations</span>
                </div>
              </div>
            </div>

            <Link href="/doctor-list">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Book New Appointment
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border-0 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-2xl">
                  <TabsTrigger
                    value="upcoming"
                    className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-600 transition-all"
                  >
                    <Clock className="w-5 h-5" /> Upcoming ({tabCounts.upcoming})
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 transition-all"
                  >
                    <Calendar className="w-5 h-5" /> Past ({tabCounts.past})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6 mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse border-0 rounded-2xl h-40" />
                      ))}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {appointments.map((appointment) => (
                        <AppointmentCard key={appointment._id} appointment={appointment} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState tab="upcoming" />
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6 mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse border-0 rounded-2xl h-40" />
                      ))}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {appointments.map((appointment) => (
                        <AppointmentCard key={appointment._id} appointment={appointment} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState tab="past" />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardContent;
