import { z } from "zod";

// Auth Validation
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Profile Validation
export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  location: z.string().optional().default(""),
  email: z.string().email("Invalid contact email"),
  github: z.string().url("Invalid GitHub URL").or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")),
  twitter: z.string().url("Invalid Twitter/X URL").or(z.literal("")),
  pgpKey: z.string().optional().default(""),
  avatarUrl: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  philosophy: z.string().optional().nullable(),
  focusAreas: z.string().optional().nullable(),
});

// Security Finding Validation
export const SecurityFindingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Finding title is required"),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]).default("HIGH"),
  impact: z.string().min(1, "Impact description is required"),
  recommendation: z.string().min(1, "Remediation recommendation is required"),
  order: z.number().int().default(0),
});

// Project Validation
export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and dashes only"),
  category: z.string().default("Web Security"),
  tags: z.array(z.string()).default([]),
  description: z.string().min(1, "Project description is required"),
  coverImage: z.string().optional().nullable(),
  year: z.string().default("2026"),
  role: z.string().default("Security Researcher"),
  duration: z.string().default("Ongoing"),
  tools: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  caseStudyOverview: z.string().optional().nullable(),
  caseStudyProblem: z.string().optional().nullable(),
  caseStudyObjective: z.string().optional().nullable(),
  caseStudyApproach: z.string().optional().nullable(),
  caseStudyArchitecture: z.string().optional().nullable(),
  caseStudyImplementation: z.string().optional().nullable(),
  caseStudySecurityAnalysis: z.string().optional().nullable(),
  caseStudyResult: z.string().optional().nullable(),
  caseStudyLessons: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  findings: z.array(SecurityFindingSchema).optional().default([]),
});

// WriteUp Block Validation
export const WriteUpBlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    "heading",
    "paragraph",
    "code",
    "terminal",
    "finding",
    "warning",
    "image",
    "table",
    "list",
    "quote",
    "divider",
  ]),
  order: z.number().int().default(0),
  data: z.record(z.any()), // JSON payload specific to block type
});

// WriteUp Validation
export const WriteUpSchema = z.object({
  title: z.string().min(1, "Write-up title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and dashes only"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional().nullable(),
  category: z.string().default("Web Security"),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).default("Intermediate"),
  readingTime: z.string().default("8 min read"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  publishedAt: z.string().optional().nullable(),
  content: z.string().default("[]"),
  isMarkdown: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  blocks: z.array(WriteUpBlockSchema).optional().default([]),
});

// Certification Validation
export const CertificationSchema = z.object({
  title: z.string().min(1, "Certification title is required"),
  issuer: z.string().min(1, "Issuer organization is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url("Invalid verification URL").or(z.literal("")).optional().nullable(),
  certificateImage: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

// Experience Validation
export const ExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company / Lab name is required"),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().default(0),
});

// Skill Validation
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.enum(["Security", "Programming", "Networking", "Cloud", "Tools", "Other"]).default("Security"),
  proficiency: z.number().int().min(1).max(100).default(85),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

// Tool Validation
export const ToolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  category: z.string().default("Penetration Testing"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

// Theme Validation
export const ThemeSettingSchema = z.object({
  preset: z.string().default("cyber-green"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  surfaceColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  surfaceSecondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  mutedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  fontSans: z.string().default("Inter"),
  fontMono: z.string().default("JetBrains Mono"),
  borderRadius: z.string().default("6px"),
  glowIntensity: z.enum(["none", "subtle", "normal", "intense"]).default("normal"),
});

// Navigation Item Validation
export const NavigationItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  path: z.string().min(1, "Path is required"),
  order: z.number().int().default(0),
  isEnabled: z.boolean().default(true),
  isExternal: z.boolean().default(false),
});

// Homepage Section Validation
export const HomepageSectionSchema = z.object({
  sectionKey: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  isEnabled: z.boolean().default(true),
  order: z.number().int().default(0),
  configJson: z.string().default("{}"),
});
