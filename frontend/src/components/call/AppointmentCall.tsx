"use client";

import { Appointment } from "@/store/appointmentStore";
import React, { useCallback, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { X, Video, Mic } from "lucide-react";

interface AppointmentCallInterface {
  appointment: Appointment;
  currentUser: {
    id: string;
    name: string;
    role: "doctor" | "patient";
  };
  onCallEnd: () => void;
  joinConsultation: (appointmentId: string) => Promise<void>;
}

const AppointmentCall = ({
  appointment,
  currentUser,
  onCallEnd,
  joinConsultation,
}: AppointmentCallInterface) => {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const isComponentMountedRef = useRef(true);

  const memoizedJoinConsultation = useCallback(
    async (appointmentId: string) => {
      await joinConsultation(appointmentId);
    },
    [joinConsultation]
  );

  const initializeCall = useCallback(
    async (container: HTMLDivElement) => {
      if (
        initializationRef.current ||
        zpRef.current ||
        !isComponentMountedRef.current
      )
        return;
      if (!container || !container.isConnected) return;

      try {
        initializationRef.current = true;

        const appId = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;

        if (!appId || !serverSecret)
          throw new Error("Zegocloud credentials not configured");

        const numericAppId = Number.parseInt(appId);
        if (isNaN(numericAppId)) throw new Error("Invalid Zegocloud App Id");

        try {
          await memoizedJoinConsultation(appointment?._id);
        } catch (error) {
          console.warn("Failed to update appointment", error);
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          numericAppId,
          serverSecret,
          appointment.zegoRoomId,
          currentUser.id,
          currentUser.name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        const isVideoCall = appointment.consultationType === "Video Consultation";

        zp.joinRoom({
          container,
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
          turnOnMicrophoneWhenJoining: true,
          showMyMicrophoneToggleButton: true,
          turnOnCameraWhenJoining: isVideoCall,
          showMyCameraToggleButton: isVideoCall,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          showRemoveUserButton: true,
          maxUsers: 2,
          layout: "Auto",
          showLayoutButton: false,
          showLeavingView: true,
          onReturnToHomeScreenClicked: () => {
            if (zpRef.current) {
              try {
                zpRef.current.mutePublishStreamAudio(true);
                zpRef.current.mutePublishStreamVideo(true);
              } catch (error) {
                console.warn("Error turning off camera/microphone");
              }
            }
            onCallEnd();
          },
        });
      } catch (error) {
        console.error("Call Initialization failed", error);
        initializationRef.current = false;
        if (isComponentMountedRef.current) {
          zpRef.current = null;
          onCallEnd();
        }
      }
    },
    [
      appointment?._id,
      appointment.zegoRoomId,
      appointment.consultationType,
      currentUser.id,
      currentUser.name,
      memoizedJoinConsultation,
      onCallEnd,
    ]
  );

  useEffect(() => {
    if (
      containerRef.current &&
      !initializationRef.current &&
      currentUser.id &&
      currentUser.name &&
      isComponentMountedRef.current
    ) {
      initializeCall(containerRef.current);
    }

    return () => {
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (error) {
          console.warn("Error during cleanup", error);
        } finally {
          zpRef.current = null;
        }
      }
    };
  }, [currentUser.id, currentUser.name, initializeCall]);

  const isVideoCall = appointment.consultationType === "Video Consultation";

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-indigo-100">
      {/* Top Bar */}
      <div className="bg-white shadow-md border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isVideoCall ? "Video Consultation" : "Voice Consultation"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentUser.role === "doctor"
              ? `Patient: ${appointment.patientId.name}`
              : `Dr. ${appointment.doctorId.name}`}
          </p>
        </div>
        <button
          onClick={onCallEnd}
          className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Call Container */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          id="appointment-call-container"
          className="w-full h-full rounded-b-2xl shadow-inner bg-gray-900"
          style={{ height: "100%" }}
        />
        {/* Overlay Controls for small screens */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
            <Mic className="w-5 h-5 text-gray-700" />
          </button>
          {isVideoCall && (
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
              <Video className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <button
            onClick={onCallEnd}
            className="p-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white shadow-t p-4 text-center text-sm text-gray-500">
        <p>All consultations are securely encrypted end-to-end</p>
      </div>
    </div>
  );
};

export default AppointmentCall;
