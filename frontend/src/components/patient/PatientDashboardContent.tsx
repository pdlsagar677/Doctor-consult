"use client";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Calendar, Clock, FileText, MapPin, Phone, Star, Video, User, Heart, Stethoscope, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import PrescriptionViewModal from "../doctor/PrescriptionViewModal";

const PatientDashboardContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({
    upcoming: 0,
    past: 0,
  });

  useEffect(() => {
    if (user?.type === "patient") {
      fetchAppointments("patient", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  // Update tab counts whenever appointments change
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
      return (
        aptDate < now ||
        apt.status === "Completed" ||
        apt.status === "Cancelled"
      );
    });

    setTabCounts({
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length,
    });
  }, [appointments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(dateString);
    return appointmentDate.toDateString() === tomorrow.toDateString();
  };

  const canJoinCall = (appointment: any) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    const now = new Date();
    const diffMinutes = (appointmentTime.getTime() - now.getTime()) / (1000 * 60);

    return (
      isToday(appointment.slotStartIso) &&
      diffMinutes <= 15 &&
      diffMinutes >= -120 &&
      (appointment.status === "Scheduled" || appointment.status === "In Progress")
    );
  };

  if (!user) {
    return null;
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 rounded-2xl bg-white/80 backdrop-blur-sm group hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
          {/* Doctor Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4 lg:w-32 flex-shrink-0">
            <Avatar className="w-20 h-20 border-4 border-orange-100 group-hover:border-orange-200 transition-colors duration-300">
              <AvatarImage
                src={appointment.doctorId?.profileImage}
                alt={appointment.doctorId?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-lg font-semibold">
                {appointment.doctorId?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Rating for completed appointments */}
            {appointment.status === 'Completed' && (
              <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="flex-1 mt-4 lg:mt-0">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {appointment.doctorId?.name}
                </h3>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mt-1">
                  <Stethoscope className="w-4 h-4 text-orange-500" />
                  <p className="text-gray-600 font-medium">
                    {appointment.doctorId?.specialization}
                  </p>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1 text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.doctorId?.hospitalInfo?.name}</span>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end space-y-2">
                <Badge className={`${getStatusColor(appointment.status)} px-3 py-1 rounded-full font-semibold text-sm`}>
                  {appointment.status}
                </Badge>
                {isToday(appointment.slotStartIso) && (
                  <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>TODAY</span>
                  </div>
                )}
                {isTomorrow(appointment.slotStartIso) && (
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>TOMORROW</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(appointment.slotStartIso).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(appointment.slotStartIso)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  {appointment.consultationType === "Video Consultation" ? (
                    <Video className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Phone className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.consultationType}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.consultationType === "Video Consultation" ? "Video Call" : "Phone Call"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <span className="text-sm font-semibold text-gray-900">Consultation Fee</span>
                  <span className="text-lg font-bold text-orange-600">₹{appointment.doctorId?.fees}</span>
                </div>

                {appointment.symptoms && (
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Symptoms</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {appointment.symptoms}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {canJoinCall(appointment) && (
                  <Link href={`/call/${appointment._id}`} className="flex-1 lg:flex-none">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Call
                    </Button>
                  </Link>
                )}

                {appointment.status === 'Completed' && appointment.prescription && (
                  <PrescriptionViewModal
                    appointment={appointment}
                    userType="patient"
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 font-semibold rounded-xl px-6 transition-all duration-200"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Prescription
                      </Button>
                    }
                  />
                )}

                {appointment.status === 'Scheduled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-700 border-orange-200 hover:bg-orange-50 hover:border-orange-300 font-semibold rounded-xl px-6 transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                )}
              </div>

              {appointment.status === 'Completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ tab }: { tab: string }) => {
    const emptyStates = {
      upcoming: {
        icon: Clock,
        title: "No Upcoming Appointments",
        description: "You have no upcoming appointments scheduled. Book your first consultation to get started.",
        showBookButton: true,
        gradient: "from-orange-500 to-orange-600"
      },
      past: {
        icon: FileText,
        title: "No Past Appointments",
        description: "Your completed consultations will appear here. Start booking appointments to build your medical history.",
        showBookButton: false,
        gradient: "from-blue-500 to-blue-600"
      },
    };

    const state = emptyStates[tab as keyof typeof emptyStates];
    const Icon = state.icon;
    
    return (
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-12 text-center">
          <div className={`w-20 h-20 bg-gradient-to-r ${state.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {state.title}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            {state.description}
          </p>

          {state.showBookButton && (
            <Link href="/doctor-list">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your First Appointment
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Header showDashboardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-2 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
                    Welcome back, <span className="text-orange-600">{user?.name}</span>!
                  </h1>
                  <p className="text-gray-600 text-lg mt-1">
                    Manage your healthcare appointments and medical history
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {tabCounts.upcoming} Upcoming
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {tabCounts.past} Past Consultations
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/doctor-list" className="flex-1 lg:flex-none">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 w-full lg:w-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs Section */}
          <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-2xl">
                  <TabsTrigger
                    value="upcoming"
                    className="flex items-center space-x-3 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-orange-600 transition-all duration-200"
                  >
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Upcoming ({tabCounts.upcoming})</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="past"
                    className="flex items-center space-x-3 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-200"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Past ({tabCounts.past})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6 mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse border-0 rounded-2xl">
                          <CardContent className="p-6">
                            <div className="flex space-x-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {appointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                        />
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
                        <Card key={i} className="animate-pulse border-0 rounded-2xl">
                          <CardContent className="p-6">
                            <div className="flex space-x-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {appointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment?._id}
                          appointment={appointment}
                        />
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