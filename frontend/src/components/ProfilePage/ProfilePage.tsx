"use client";
import { healthcareCategories, specializations } from "@/lib/constant";
import { userAuthStore } from "@/store/authStore";
import {
  Clock,
  FileText,
  MapPin,
  Phone,
  Plus,
  Stethoscope,
  User,
  X,
  Heart,
  Shield,
  Sparkles,
  Calendar,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Header from "../landing/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface ProfileProps {
  userType: "doctor" | "patient";
}

const ProfilePage = ({ userType }: ProfileProps) => {
  const { user, fetchProfile, updateProfile, loading } = userAuthStore();
  const [activeSection, setActiveSection] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    about: "",
    specialization: "",
    category: [],
    qualification: "",
    experience: 0,
    fees: 0,
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [],
    slotDurationMinutes: 30,
  });

  // Available slot durations in minutes
  const slotDurations = [5, 10, 15, 20, 30, 45, 60, 90, 120];

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        about: user.about || "",
        specialization: user.specialization || "",
        category: user.category || [],
        qualification: user.qualification || "",
        experience: user.experience || 0,
        fees: user.fees || 0,
        hospitalInfo: {
          name: user.hospitalInfo?.name || "",
          address: user.hospitalInfo?.address || "",
          city: user.hospitalInfo?.city || "",
        },
        medicalHistory: {
          allergies: user.medicalHistory?.allergies || "",
          currentMedications: user.medicalHistory?.currentMedications || "",
          chronicConditions: user.medicalHistory?.chronicConditions || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
          relationship: user.emergencyContact?.relationship || "",
        },
        availabilityRange: {
          startDate: user.availabilityRange?.startDate || "",
          endDate: user.availabilityRange?.endDate || "",
          excludedWeekdays: user.availabilityRange?.excludedWeekdays || [],
        },
        dailyTimeRanges: user.dailyTimeRanges || [],
        slotDurationMinutes: user.slotDurationMinutes || 30,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (
    field: string,
    index: number,
    subField: string,
    value: any
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const handleCategorySelect = (category: any): void => {
    if (!formData.category.includes(category.title)) {
      handleInputChange("category", [...formData.category, category.title]);
    }
  };

  const handleCategoryDelete = (indexToDelete: number) => {
    const currentCategories = [...formData.category];
    const newCategories = currentCategories.filter(
      (_: any, i: number) => i !== indexToDelete
    );
    setFormData((prev: any) => ({
      ...prev,
      category: newCategories,
    }));
  };

  const getAvailableCategories = () => {
    return healthcareCategories.filter(
      (cat) => !formData.category.includes(cat.title)
    );
  };

  const addTimeRange = () => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: [
        ...prev.dailyTimeRanges,
        { start: "09:00", end: "17:00" },
      ],
    }));
  };

  const removeTimeRange = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: prev.dailyTimeRanges.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  const handleWeekdayToggle = (weekday: number) => {
    const excludedWeekdays = [...formData.availabilityRange.excludedWeekdays];
    const index = excludedWeekdays.indexOf(weekday);

    if (index > -1) {
      excludedWeekdays.splice(index, 1);
    } else {
      excludedWeekdays.push(weekday);
    }

    handleInputChange("availabilityRange.excludedWeekdays", excludedWeekdays);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const sidebarItems =
    userType === "doctor"
      ? [
          { id: "about", label: "About", icon: User },
          { id: "professional", label: "Professional Info", icon: Stethoscope },
          { id: "hospital", label: "Hospital Information", icon: MapPin },
          { id: "availability", label: "Availability", icon: Clock },
        ]
      : [
          { id: "about", label: "About", icon: User },
          { id: "contact", label: "Contact Information", icon: Phone },
          { id: "medical", label: "Medical History", icon: FileText },
          { id: "emergency", label: "Emergency Contact", icon: Phone },
        ];

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-gray-700">Legal first name</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!isEditing}
            className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          />
        </div>
      </div>

      {userType === "patient" && (
        <>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700">Official date of birth</Label>
            <Input
              type="date"
              value={
                formData.dob
                  ? new Date(formData.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange(
                  "dob",
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : ""
                )
              }
              disabled={!isEditing}
              className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700">Gender</Label>
            <RadioGroup
              value={formData.gender || ""}
              onValueChange={(value) => handleInputChange("gender", value)}
              disabled={!isEditing}
              className="flex space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="text-orange-600" />
                <Label htmlFor="male" className="text-gray-700">Male</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="text-orange-600" />
                <Label htmlFor="female" className="text-gray-700">Female</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" className="text-orange-600" />
                <Label htmlFor="other" className="text-gray-700">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700">Blood Group</Label>
            <Select
              value={formData.bloodGroup || ""}
              onValueChange={(value) => handleInputChange("bloodGroup", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                <SelectValue placeholder="Select a blood group" />
              </SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {userType === "doctor" && (
        <div>
          <Label className="text-sm font-semibold text-gray-700">About</Label>
          <Textarea
            value={formData.about || ""}
            onChange={(e) => handleInputChange("about", e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          />
        </div>
      )}
    </div>
  );

  const renderProfessionalSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Specialization</Label>
        <Select
          value={formData.specialization || ""}
          onValueChange={(value) => handleInputChange("specialization", value)}
          disabled={!isEditing}
        >
          <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Category</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.category?.map((cat: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center space-x-1 bg-orange-100 text-orange-700 border-orange-200"
            >
              <span>{cat}</span>
              {isEditing && (
                <button
                  type="button"
                  className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:bg-orange-200 rounded-full transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCategoryDelete(index);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}

          {isEditing && getAvailableCategories().length > 0 && (
            <Select
              onValueChange={(value) => {
                const selectedCategory = getAvailableCategories().find(
                  (cate) => cate.id === value
                );
                if (selectedCategory) {
                  handleCategorySelect(selectedCategory);
                }
              }}
            >
              <SelectTrigger className="w-48 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                <SelectValue placeholder="Add Category" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color}`}
                      ></div>
                      <span>{category.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isEditing && getAvailableCategories().length === 0 && (
            <span className="text-sm text-gray-500">
              All categories have been selected
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Qualification</Label>
        <Input
          value={formData.qualification || ""}
          onChange={(e) => handleInputChange("qualification", e.target.value)}
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Experience (years)</Label>
        <Input
          type="number"
          value={formData.experience || ""}
          onChange={(e) =>
            handleInputChange("experience", parseInt(e.target.value) || 0)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Consultation Fee(₹)</Label>
        <Input
          type="number"
          value={formData.fees || ""}
          onChange={(e) =>
            handleInputChange("fees", parseInt(e.target.value) || 0)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>
    </div>
  );

  const renderHospitalSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Hospital/Clinic Name</Label>
        <Input
          value={formData.hospitalInfo?.name || ""}
          onChange={(e) =>
            handleInputChange("hospitalInfo.name", e.target.value)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Address</Label>
        <Textarea
          value={formData.hospitalInfo?.address || ""}
          onChange={(e) =>
            handleInputChange("hospitalInfo.address", e.target.value)
          }
          disabled={!isEditing}
          rows={3}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">City</Label>
        <Input
          value={formData.hospitalInfo?.city || ""}
          onChange={(e) =>
            handleInputChange("hospitalInfo.city", e.target.value)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>
    </div>
  );

  const renderAvailabilitySection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-gray-700">Available From Date</Label>
          <Input
            type="date"
            value={formatDateForInput(formData.availabilityRange?.startDate)}
            onChange={(e) =>
              handleInputChange("availabilityRange.startDate", e.target.value)
            }
            disabled={!isEditing}
            className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-gray-700">Available Until Date</Label>
          <Input
            type="date"
            value={formatDateForInput(formData.availabilityRange?.endDate)}
            onChange={(e) =>
              handleInputChange("availabilityRange.endDate", e.target.value)
            }
            disabled={!isEditing}
            className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Excluded Weekdays</Label>
        <div className="flex flex-wrap gap-4">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day, index) => (
            <label key={index} className="flex items-center space-x-2">
              <Checkbox
                checked={
                  formData.availabilityRange?.excludedWeekdays?.includes(
                    index
                  ) || false
                }
                onCheckedChange={() => handleWeekdayToggle(index)}
                disabled={!isEditing}
                className="text-orange-600 border-2 border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
              />
              <span className="text-sm text-gray-700">{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Daily Time Range</Label>
        <div className="space-y-3">
          {formData.dailyTimeRanges?.map((timeRange: any, index: number) => (
            <div className="flex items-center space-x-2" key={index}>
              <Input
                type="time"
                value={timeRange.start || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "dailyTimeRanges",
                    index,
                    "start",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
              <span className="text-gray-600">to</span>
              <Input
                type="time"
                value={timeRange.end || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "dailyTimeRanges",
                    index,
                    "end",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />

              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeRange(index)}
                  className="border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addTimeRange}
              className="border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Range
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Slot Duration</Label>
        <Select
          value={formData.slotDurationMinutes?.toString() || "30"}
          onValueChange={(value) =>
            handleInputChange("slotDurationMinutes", parseInt(value))
          }
          disabled={!isEditing}
        >
          <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
            <SelectValue placeholder="Select slot duration" />
          </SelectTrigger>
          <SelectContent>
            {slotDurations.map((duration) => (
              <SelectItem key={duration} value={duration.toString()}>
                {duration} minutes
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
        <Input
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
        <Input 
          value={formData.email || ""} 
          disabled={true} 
          className="border-2 border-gray-200 rounded-xl bg-gray-50"
        />
      </div>
    </div>
  );

  const renderMedicalSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Allergies</Label>
        <Textarea
          value={formData.medicalHistory.allergies || ""}
          onChange={(e) =>
            handleInputChange("medicalHistory.allergies", e.target.value)
          }
          disabled={!isEditing}
          rows={3}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Current Medications</Label>
        <Textarea
          value={formData.medicalHistory.currentMedications || ""}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.currentMedications",
              e.target.value
            )
          }
          disabled={!isEditing}
          rows={3}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Chronic Conditions</Label>
        <Textarea
          value={formData.medicalHistory.chronicConditions || ""}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.chronicConditions",
              e.target.value
            )
          }
          disabled={!isEditing}
          rows={3}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>
    </div>
  );

  const renderEmergencySection = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Emergency Contact Name</Label>
        <Input
          value={formData.emergencyContact?.name || ""}
          onChange={(e) =>
            handleInputChange("emergencyContact.name", e.target.value)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
        <Input
          value={formData.emergencyContact?.phone || ""}
          onChange={(e) =>
            handleInputChange("emergencyContact.phone", e.target.value)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-700">Relationship</Label>
        <Input
          value={formData.emergencyContact?.relationship || ""}
          onChange={(e) =>
            handleInputChange("emergencyContact.relationship", e.target.value)
          }
          disabled={!isEditing}
          className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return renderAboutSection();
      case "professional":
        return renderProfessionalSection();
      case "hospital":
        return renderHospitalSection();
      case "availability":
        return renderAvailabilitySection();
      case "contact":
        return renderContactSection();
      case "medical":
        return renderMedicalSection();
      case "emergency":
        return renderEmergencySection();
      default:
        return renderAboutSection();
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Header showDashboardNav={true} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your personal and professional information</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-4 border-orange-200">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="mt-2 text-lg font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 font-semibold border border-orange-200 shadow-sm"
                            : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
                <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 capitalize">
                        {
                          sidebarItems.find((item) => item.id === activeSection)
                            ?.label
                        }
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Manage your {sidebarItems.find((item) => item.id === activeSection)?.label.toLowerCase()} information
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            {loading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                              </div>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  {renderContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;