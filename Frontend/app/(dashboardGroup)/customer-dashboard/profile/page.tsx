"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Calendar, Loader2, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { compressImage, validateImageFile, formatFileSize } from "@/lib/imageUtils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          image: data.data.image || "",
        });
        setImagePreview(data.data.image || "");
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file, 5);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    // Compress and preview
    toast.loading("Compressing image...");
    compressImage(file, 800, 800, 0.8)
      .then((compressed) => {
        setImagePreview(compressed);
        setFormData({ ...formData, image: compressed });
        toast.dismiss();
        toast.success(`Image ready! Original: ${formatFileSize(file.size)}`);
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Failed to process image");
        console.error(error);
        e.target.value = "";
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("Profile updated successfully");
        setProfile(data.data);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Profile Info Card */}
      <div className="rounded-xl border p-6 space-y-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary">
            {imagePreview ? (
              <img src={imagePreview} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{profile.role.toLowerCase()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-sm font-medium">
              {profile.status}
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-xs text-muted-foreground">Member Since</p>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-6 bg-card">
        <h3 className="text-lg font-semibold">Edit Profile</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors inline-flex">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </div>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB (will be compressed automatically)</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              <User className="inline h-4 w-4 mr-2" />
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline h-4 w-4 mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="inline h-4 w-4 mr-2" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              <MapPin className="inline h-4 w-4 mr-2" />
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
