import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SUPPORT_EMAIL = "layerlabscustomerservice@gmail.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Layer Lab" },
      {
        name: "description",
        content:
          "Get in touch with Layer Lab customer service. Send us your question or issue and we'll get back to you.",
      },
      { property: "og:title", content: "Contact — Layer Lab" },
      {
        property: "og:description",
        content: "Reach Layer Lab customer service for any question or issue.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }

    const finalSubject = subject.trim() || `Support request from ${name.trim()}`;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      finalSubject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    toast.success("Opening your email app to send the ticket…");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Contact <span className="text-gradient">us</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Got a question, issue, or feedback? Submit a ticket and our team will get back to you.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customer service email</div>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium transition-smooth hover:text-gradient"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy email"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              maxLength={100}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={255}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            maxLength={150}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Describe your problem</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's going on…"
            rows={7}
            maxLength={2000}
            required
          />
          <p className="text-xs text-muted-foreground">{message.length}/2000</p>
        </div>

        <Button type="submit" className="w-full sm:w-auto">
          <Send className="h-4 w-4" />
          Submit ticket
        </Button>

        <p className="text-xs text-muted-foreground">
          Submitting opens your email app with the ticket pre-filled and addressed to{" "}
          <span className="font-medium text-foreground">{SUPPORT_EMAIL}</span>. Just hit send.
        </p>
      </form>
    </div>
  );
}
