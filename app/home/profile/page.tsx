"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client"; // Updated import
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

// Zod schema for form validation
const profileSchema = z.object({
  firstName: z.string().min(1, "First name must be at least 1 character."),
  lastName: z.string().min(1, "Last name must be at least 1 character."),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number format.")
    .optional(),
  bio: z.string().max(300, "Bio must be less than 300 characters.").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
    },
  });

  // Fetch existing profile data (if available) and pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError);
        router.push("/sign-in");
        return;
      }

      // Fetch the existing profile data
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("first_name, last_name, phone, bio")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      }

      if (profile) {
        form.reset({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [form, router]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Error fetching user during submission:", authError);
      router.push("/sign-in");
      return;
    }

    // Log the data being submitted
    console.log("Submitting profile data:", {
      user_id: user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone || null,
      bio: data.bio || null,
    });

    // Submit the data to Supabase (insert or update)
    const { error } = await supabase.from("profile").upsert(
      {
        user_id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone?.trim() || null, // Ensure nullable values are handled correctly
        bio: data.bio?.trim() || null, // Ensure nullable values are handled correctly
      },
      { onConflict: "user_id" } // Resolve conflict based on user_id
    );

    if (error) {
      console.error("Error saving profile:", error.message, error.details);
      setLoading(false);
      return;
    }

    console.log("Profile saved successfully!");
    toast.success("Profile saved successfully!");
    setLoading(false);
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
      <h1 className="text-xl font-bold">Complete Your Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <Input placeholder="Enter your first name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <Input placeholder="Enter your last name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input placeholder="Enter your phone number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <Input placeholder="Tell us about yourself" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
