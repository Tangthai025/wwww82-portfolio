"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  User,
  Briefcase,
  Cpu,
  Wrench,
  FileText,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

const SKILL_CATEGORIES = [
  "Security",
  "Programming",
  "Networking",
  "Cloud",
  "Tools",
  "Other",
];

export function ProfileClient({
  initialProfile,
  initialExperiences,
  initialSkills,
  initialTools,
}: {
  initialProfile: any;
  initialExperiences: any[];
  initialSkills: any[];
  initialTools: any[];
}) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "skills" | "tools">("profile");

  // Profile Fields
  const [name, setName] = useState(initialProfile?.name || "wwww82");
  const [title, setTitle] = useState(initialProfile?.title || "Cybersecurity Researcher");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [location, setLocation] = useState(initialProfile?.location || "");
  const [email, setEmail] = useState(initialProfile?.email || "contact@wwww82.sec");
  const [github, setGithub] = useState(initialProfile?.github || "https://github.com/wwww82");
  const [linkedin, setLinkedin] = useState(initialProfile?.linkedin || "https://linkedin.com/in/wwww82");
  const [twitter, setTwitter] = useState(initialProfile?.twitter || "https://x.com/wwww82_sec");
  const [pgpKey, setPgpKey] = useState(initialProfile?.pgpKey || "");
  const [resumeUrl, setResumeUrl] = useState(initialProfile?.resumeUrl || "");
  const [philosophy, setPhilosophy] = useState(initialProfile?.philosophy || "");
  const [focusAreas, setFocusAreas] = useState(initialProfile?.focusAreas || "");

  // Experiences List
  const [experiences, setExperiences] = useState(initialExperiences);

  // Skills List
  const [skills, setSkills] = useState(initialSkills);

  // Tools List
  const [tools, setTools] = useState(initialTools);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setResumeUrl(data.url);
        success("Resume PDF uploaded successfully!");
      } else {
        error(data.error || "Failed to upload resume PDF");
      }
    } catch {
      error("Network error during resume upload");
    }
  };

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        role: "Security Analyst",
        company: "Security Lab",
        location: "Bangkok",
        startDate: "2025",
        endDate: "Present",
        current: true,
        description: "Conduct vulnerability assessments and penetration testing...",
        order: prev.length,
      },
    ]);
  };

  const handleRemoveExperience = (idx: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleExpChange = (idx: number, field: string, value: any) => {
    setExperiences((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleAddSkill = () => {
    setSkills((prev) => [
      ...prev,
      {
        id: `skill-${Date.now()}`,
        name: "New Skill",
        category: "Security",
        proficiency: 85,
        order: prev.length,
      },
    ]);
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSkillChange = (idx: number, field: string, value: any) => {
    setSkills((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleAddTool = () => {
    setTools((prev) => [
      ...prev,
      {
        id: `tool-${Date.now()}`,
        name: "New Tool",
        category: "Penetration Testing",
        description: "Vulnerability analysis tool",
        order: prev.length,
      },
    ]);
  };

  const handleRemoveTool = (idx: number) => {
    setTools((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToolChange = (idx: number, field: string, value: any) => {
    setTools((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const payload = {
      profile: {
        name,
        title,
        bio,
        location,
        email,
        github,
        linkedin,
        twitter,
        pgpKey,
        resumeUrl: resumeUrl || null,
        philosophy: philosophy || null,
        focusAreas: focusAreas || null,
      },
      experiences,
      skills,
      tools,
    };

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        success("Profile, Experience, Skills & Tools updated successfully!");
        router.refresh();
      } else {
        error(data.error || "Failed to update profile");
      }
    } catch {
      error("Network error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab bar + Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "experience"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience ({experiences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "skills"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Skills ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tools")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "tools"
                ? "bg-primary text-black font-semibold"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tools ({tools.length})</span>
          </button>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSaveAll}
          isLoading={isSaving}
          className="font-mono"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Tab 1: Profile & Resume */}
      {activeTab === "profile" && (
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
          <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider">
            Operator Bio, Channels & Resume
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Brand / Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Primary Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Biography & Profile Summary *"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Public Contact Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="GitHub URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <Input
              label="Twitter / X URL"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          {/* Resume PDF File */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Resume Document (PDF)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="/uploads/resume.pdf or https://..."
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm font-mono text-text"
              />
              <label className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text hover:border-primary cursor-pointer shrink-0">
                <Upload className="w-4 h-4 mr-1.5 text-primary" />
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Textarea
            label="Security Philosophy"
            rows={3}
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            placeholder="Offense informs defense..."
          />

          <Textarea
            label="PGP Public Key"
            rows={5}
            value={pgpKey}
            onChange={(e) => setPgpKey(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
      )}

      {/* Tab 2: Experience */}
      {activeTab === "experience" && (
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider">
              Experience Timeline
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExperience}
              className="font-mono"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Position
            </Button>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-5 rounded-cyber border border-border bg-surface-secondary/40 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary">
                    Position #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Role *"
                    value={exp.role}
                    onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                  />
                  <Input
                    label="Company / Lab Name *"
                    value={exp.company}
                    onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(e) => handleExpChange(idx, "startDate", e.target.value)}
                  />
                  <Input
                    label="End Date (or leave empty if current)"
                    value={exp.endDate || ""}
                    onChange={(e) => handleExpChange(idx, "endDate", e.target.value)}
                  />
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id={`curr-${idx}`}
                      checked={Boolean(exp.current)}
                      onChange={(e) => handleExpChange(idx, "current", e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <label htmlFor={`curr-${idx}`} className="text-xs font-mono text-text cursor-pointer">
                      Current Position
                    </label>
                  </div>
                </div>

                <Textarea
                  label="Description & Responsibilities"
                  rows={3}
                  value={exp.description}
                  onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === "skills" && (
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold font-mono text-secondary uppercase tracking-wider">
              Technical Skills & Competencies
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
              className="font-mono"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, idx) => (
              <div
                key={skill.id || idx}
                className="p-4 rounded-cyber border border-border bg-surface-secondary/40 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted">Skill #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Input
                  label="Skill Name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
                />

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-mono text-muted uppercase">Category</label>
                  <select
                    value={skill.category}
                    onChange={(e) => handleSkillChange(idx, "category", e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-cyber text-xs font-mono text-text"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted">Proficiency</span>
                    <span className="text-primary font-bold">{skill.proficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={skill.proficiency}
                    onChange={(e) => handleSkillChange(idx, "proficiency", Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tools */}
      {activeTab === "tools" && (
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider">
              Security Tools & Arsenal
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTool}
              className="font-mono"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Tool
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, idx) => (
              <div
                key={tool.id || idx}
                className="p-4 rounded-cyber border border-border bg-surface-secondary/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted">Tool #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Input
                  label="Tool Name"
                  value={tool.name}
                  onChange={(e) => handleToolChange(idx, "name", e.target.value)}
                />

                <Input
                  label="Category / Subsystem"
                  value={tool.category}
                  onChange={(e) => handleToolChange(idx, "category", e.target.value)}
                  placeholder="e.g. Fuzzing or Network Enumeration"
                />

                <Textarea
                  label="Tool Description"
                  rows={2}
                  value={tool.description || ""}
                  onChange={(e) => handleToolChange(idx, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
