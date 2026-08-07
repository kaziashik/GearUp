"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg animate-fade-in">
      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">Have questions? We&apos;d love to hear from you.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2"><Label>Name</Label><Input required /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" required /></div>
        <div className="space-y-2"><Label>Message</Label><Textarea required rows={5} /></div>
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </div>
  );
}
