import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting wwww82 Cybersecurity database seed...");

  // 1. Admin User
  const passwordHash = await bcrypt.hash("wwww82_admin_pass!2026", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@wwww82.sec" },
    update: {},
    create: {
      email: "admin@wwww82.sec",
      passwordHash,
      name: "wwww82",
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created:", adminUser.email);

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "wwww82",
      title: "Cybersecurity Researcher & Penetration Tester",
      bio: "Cybersecurity enthusiast focused on offensive security research, web application security, penetration testing, and security automation. Dedicated to breaking complex systems ethically to build impenetrable defenses.",
      location: "Bangkok, Thailand",
      email: "contact@wwww82.sec",
      github: "https://github.com/wwww82",
      linkedin: "https://linkedin.com/in/wwww82",
      twitter: "https://x.com/wwww82_sec",
      pgpKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.13
Comment: https://wwww82.sec/pgp

mQGNBF/XXXXBDAC3x9...[wwww82 PGP Key 4096R/0x82C7B9F1]
-----END PGP PUBLIC KEY BLOCK-----`,
      philosophy: "Offense informs defense. True resilience comes from understanding adversarial mental models, scrutinizing edge cases, and automating security verification at every layer.",
      focusAreas: "Web Application Security · Penetration Testing · Cloud IAM Exploitation · Kernel & eBPF Security · Vulnerability Research",
    },
  });
  console.log("✓ Profile initialized");

  // 3. Theme Settings
  await prisma.themeSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      preset: "cyber-green",
      primaryColor: "#39FF88",
      secondaryColor: "#00D9FF",
      backgroundColor: "#090B0F",
      surfaceColor: "#10141A",
      surfaceSecondaryColor: "#151A21",
      textColor: "#E8EDF2",
      mutedColor: "#7D8996",
      borderColor: "#26313A",
      fontSans: "Inter",
      fontMono: "JetBrains Mono",
      borderRadius: "6px",
      glowIntensity: "normal",
    },
  });

  // 4. Navigation Items
  const navItems = [
    { label: "Home", path: "/", order: 0 },
    { label: "About", path: "/about", order: 1 },
    { label: "Projects", path: "/projects", order: 2 },
    { label: "Write-ups", path: "/writeups", order: 3 },
    { label: "Certifications", path: "/certifications", order: 4 },
    { label: "Resume", path: "/resume", order: 5 },
    { label: "Contact", path: "/contact", order: 6 },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.create({
      data: item,
    });
  }
  console.log("✓ Navigation items created");

  // 5. Homepage Sections
  const homeSections = [
    { sectionKey: "hero", title: "Security Researcher", subtitle: "wwww82", order: 0, isEnabled: true },
    { sectionKey: "stats", title: "Live Telemetry", subtitle: "Operational Metrics", order: 1, isEnabled: true },
    { sectionKey: "featured_projects", title: "Featured Security Projects", subtitle: "Exploitation, Tooling & Case Studies", order: 2, isEnabled: true },
    { sectionKey: "latest_writeups", title: "Latest Technical Write-ups", subtitle: "Vulnerability Research & CTF Analysis", order: 3, isEnabled: true },
    { sectionKey: "certifications", title: "Verified Certifications", subtitle: "Industry Accreditations", order: 4, isEnabled: true },
    { sectionKey: "skills", title: "Technical Arsenal", subtitle: "Core Competencies & Security Tooling", order: 5, isEnabled: true },
    { sectionKey: "contact", title: "Secure Communications", subtitle: "Let's Connect", order: 6, isEnabled: true },
  ];

  for (const sec of homeSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: {},
      create: sec,
    });
  }

  // 6. Featured Projects & Findings
  const p1 = await prisma.project.create({
    data: {
      title: "ReconFlow: Automated Attack Surface Discovery & Vulnerability Scanner",
      slug: "recon-flow-security-scanner",
      category: "Web Security",
      tags: JSON.stringify(["Python", "FastAPI", "Go", "Docker", "Nuclei", "Subdomain Takeover"]),
      description: "Distributed reconnaissance framework that maps external attack surfaces, identifies exposed cloud assets, and performs orchestrated vulnerability fuzzing.",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      year: "2026",
      role: "Lead Security Engineer & Creator",
      duration: "4 Months",
      tools: JSON.stringify(["Python 3.12", "Go", "Celery", "Redis", "Docker", "Nuclei Engine", "Amass", "httpx"]),
      technologies: JSON.stringify(["Microservices", "REST API", "PostgreSQL", "Asynchronous Workers"]),
      featured: true,
      order: 0,
      status: "PUBLISHED",
      caseStudyOverview: "Modern corporate attack surfaces grow exponentially across multi-cloud environments. ReconFlow was engineered to continuously monitor DNS mutations, discover rogue HTTP endpoints, and proactively catch critical misconfigurations before malicious adversaries can exploit them.",
      caseStudyProblem: "Manual external penetration tests only provide a point-in-time snapshot. Infrastructure changes deployed by distributed engineering teams frequently introduce dangling DNS records, exposed actuator endpoints, and unauthenticated administrative portals.",
      caseStudyObjective: "Construct a lightweight, horizontally scalable scanning engine capable of orchestrating 50,000+ domain checks per hour while minimizing false positives via recursive verification pipelines.",
      caseStudyApproach: "Developed an asynchronous job queue leveraging Redis and Celery. Subdomain enumeration feeds into an active HTTP probe pipeline which triggers dynamic vulnerability templating.",
      caseStudyArchitecture: "Ingestion Engine -> DNS Resolver Pool -> Active Probing Worker Group -> AST-based Response Analyzer -> Encrypted Alert Dispatcher.",
      caseStudyImplementation: "Written in Python 3.12 with performance-critical network probing routines written in Go. Containerized with Docker Compose and Kubernetes Helm charts for distributed deployment.",
      caseStudySecurityAnalysis: "Conducted extensive black-box and white-box assessments against real-world testbed infrastructure, uncovering multiple zero-day misconfigurations and severe access control oversights.",
      caseStudyResult: "Achieved 99.4% precision on exposed asset detection with an average response time of under 3 minutes from domain registration to vulnerability notification.",
      caseStudyLessons: "Network timeouts and rate limits require intelligent exponential backoff and IP pool rotation to prevent scanner fingerprinting and false negatives.",
      seoTitle: "ReconFlow Security Scanner — wwww82 Case Study",
      seoDescription: "In-depth case study on building an automated attack surface discovery and continuous vulnerability fuzzing engine.",
      findings: {
        create: [
          {
            title: "Critical Insecure Direct Object Reference (IDOR) on GraphQL Endpoint",
            severity: "CRITICAL",
            impact: "Allowed unauthenticated threat actors to enumerate and exfiltrate tenant PII across entire database partition.",
            recommendation: "Enforce strict attribute-based authorization checks at the GraphQL resolver layer prior to data retrieval.",
            order: 0,
          },
          {
            title: "Server-Side Request Forgery (SSRF) in Webhook Dispatcher",
            severity: "HIGH",
            impact: "Permitted attackers to query internal cloud metadata instance (169.254.169.254) and retrieve temporary IAM STS tokens.",
            recommendation: "Implement private CIDR block filtering (RFC 1918) and DNS pinning to prevent DNS rebinding attacks.",
            order: 1,
          },
          {
            title: "Missing Rate Limiting on Authentication API",
            severity: "MEDIUM",
            impact: "Enabled high-speed credential stuffing against enterprise SSO endpoints.",
            recommendation: "Deploy Token Bucket rate limiting via Cloudflare / API Gateway with progressive IP penalties.",
            order: 2,
          },
        ],
      },
    },
  });

  const p2 = await prisma.project.create({
    data: {
      title: "MemSentry: Linux Kernel Driver Vulnerability Analysis & Memory Fuzzer",
      slug: "kernel-memory-fuzzer",
      category: "Security Research",
      tags: JSON.stringify(["C++", "C", "Linux Kernel", "QEMU", "KASAN", "AFL++", "Reverse Engineering"]),
      description: "Kernel-space coverage-guided fuzzing harness designed to uncover Use-After-Free (UAF) and Out-Of-Bounds (OOB) memory corruption flaws in custom device drivers.",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      year: "2025",
      role: "Vulnerability Researcher",
      duration: "3 Months",
      tools: JSON.stringify(["AFL++", "QEMU / KVM", "GDB", "Ghidra", "KASAN", "Kernel Tracepoints"]),
      technologies: JSON.stringify(["C++20", "x86_64 Assembly", "Linux Syscalls", "Kernel Modules"]),
      featured: true,
      order: 1,
      status: "PUBLISHED",
      caseStudyOverview: "Device drivers running in kernel ring 0 represent a massive attack surface. MemSentry integrates coverage-guided mutation engines with QEMU snapshot isolation to discover exploitable kernel memory corruptions.",
      caseStudyProblem: "Proprietary IoT and virtualization kernel modules often lack formal verification, leaving subtle concurrency bugs and race conditions undetected.",
      caseStudyObjective: "Automate syscall payload synthesis to systematically trigger deep driver state transitions with deterministic crash reproducibility.",
      caseStudyApproach: "Instrumented target drivers using GCC sanitizers (KASAN, UBSAN) and connected dynamic AFL++ coverage feedbacks to syscall mutation generators.",
      caseStudyArchitecture: "Driver Hook Interface -> Syscall Sequencer -> QEMU VM Hypervisor -> Crash State Triage Module.",
      caseStudyImplementation: "Developed custom harness in C++ that loads driver snapshots into ephemeral micro-VMs, executing over 8,000 fuzzing iterations per second.",
      caseStudySecurityAnalysis: "Identified 4 distinct memory corruption vectors including a high-severity Use-After-Free vulnerability in IOCTL request handling.",
      caseStudyResult: "Successfully patched all identified vulnerabilities and responsibly disclosed findings to vendor with detailed proof-of-concept exploits.",
      caseStudyLessons: "Locking primitives in asynchronous interrupt handlers must be meticulously analyzed for reentrancy vulnerabilities.",
      seoTitle: "MemSentry Linux Kernel Fuzzer — wwww82",
      seoDescription: "Security research case study on kernel memory corruption fuzzing and vulnerability analysis.",
      findings: {
        create: [
          {
            title: "Kernel Use-After-Free in Character Device IOCTL Handler",
            severity: "CRITICAL",
            impact: "Local Privilege Escalation (LPE) from unprivileged user space to ring 0 root context.",
            recommendation: "Implement atomic reference counting (refcount_t) and eliminate dangling pointer reuse in teardown callback.",
            order: 0,
          },
          {
            title: "Heap Out-Of-Bounds Write via Integer Overflow in Buffer Allocation",
            severity: "HIGH",
            impact: "Kernel panic and potential arbitrary kernel memory write under targeted heap grooming.",
            recommendation: "Validate maximum buffer sizes using overflow-safe arithmetic helpers (check_add_overflow).",
            order: 1,
          },
        ],
      },
    },
  });

  const p3 = await prisma.project.create({
    data: {
      title: "CloudVault: AWS Multi-Account IAM Privilege Escalation Detection Engine",
      slug: "cloud-iam-privesc-audit",
      category: "Cloud Security",
      tags: JSON.stringify(["AWS", "IAM", "Python", "Neo4j", "Graph Theory", "Terraform", "Security Automation"]),
      description: "Graph-based security analysis tool that maps indirect privilege escalation paths across complex multi-account AWS organizations.",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      year: "2025",
      role: "Cloud Security Architect",
      duration: "2 Months",
      tools: JSON.stringify(["Python 3.11", "AWS Boto3", "Neo4j Graph DB", "Cypher Query Language", "Docker"]),
      technologies: JSON.stringify(["Cloud Architecture", "Identity & Access Management", "Graph Algorithms"]),
      featured: true,
      order: 2,
      status: "PUBLISHED",
      caseStudyOverview: "IAM policies in large enterprise AWS setups form intricate dependency graphs where benign permissions can be chained together into full administrative takeover.",
      caseStudyProblem: "Traditional static policy linters fail to evaluate multi-hop authorization chains, such as PassRole -> Lambda CreateFunction -> Admin Role AssumeRole.",
      caseStudyObjective: "Ingest thousands of IAM roles, managed policies, trust relationships, and SCPs into a directed graph to calculate shortest attack vectors to AdministratorAccess.",
      caseStudyApproach: "Utilized AWS Organizations APIs to dump raw policy JSONs, normalized permission statements into unified capability graphs, and executed Cypher traversal queries.",
      caseStudyArchitecture: "AWS Organizations Ingestion Daemon -> Policy Normalizer -> Neo4j Graph Engine -> Graph Traversal CLI & Web Dashboard.",
      caseStudyImplementation: "Constructed algorithmic detection for 28 known AWS IAM privilege escalation methods with automated Terraform remediation script generation.",
      caseStudySecurityAnalysis: "Discovered 14 hidden escalation paths across staging and production accounts during initial audit run.",
      caseStudyResult: "Reduced lateral movement risk surface by 85% across client environment within 48 hours of remediation.",
      caseStudyLessons: "Service control policies (SCPs) should be used as immutable guardrails rather than relying solely on identity-based policies.",
      seoTitle: "CloudVault AWS IAM Escalation Engine — wwww82",
      seoDescription: "Security case study on mapping and mitigating IAM privilege escalation in cloud environments.",
      findings: {
        create: [
          {
            title: "Wildcard iam:PassRole with lambda:CreateFunction Permission",
            severity: "HIGH",
            impact: "Unprivileged developer IAM identity could attach Administrator role to a serverless function and execute arbitrary AWS actions.",
            recommendation: "Constrain iam:PassRole with strict Resource ARNs and Condition keys matching designated execution roles.",
            order: 0,
          },
          {
            title: "Over-permissive S3 Bucket Policy with Write Access to Deployment Pipeline",
            severity: "HIGH",
            impact: "Allowed unauthorized artifact tampering in CI/CD pipeline leading to code execution in production.",
            recommendation: "Enforce aws:PrincipalOrgID conditions and restrict write actions to dedicated deployment roles.",
            order: 1,
          },
        ],
      },
    },
  });

  console.log("✓ Projects & Security Findings created:", p1.title, p2.title, p3.title);

  // 7. Technical Write-ups
  const w1 = await prisma.writeUp.create({
    data: {
      title: "Understanding IDOR: From Authorization Flaws to Mass Data Exfiltration",
      slug: "understanding-and-exploiting-idor-deep-dive",
      excerpt: "A deep technical analysis of Insecure Direct Object References (IDOR), exploring real-world exploitation mechanics, subtle UUID bypasses, and robust defense architecture.",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      category: "Web Security",
      tags: JSON.stringify(["Web Security", "IDOR", "Authorization", "API Security", "Penetration Testing"]),
      difficulty: "Intermediate",
      readingTime: "10 min read",
      featured: true,
      order: 0,
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-15T10:00:00Z"),
      content: JSON.stringify([
        {
          type: "warning",
          data: {
            title: "Ethical Security Research Disclaimer",
            content: "All vulnerability analysis and techniques demonstrated in this technical write-up were executed inside authorized private security labs. Never execute security assessments against systems without explicit written permission.",
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "1. The Deceptive Simplicity of Broken Object Level Authorization" },
        },
        {
          type: "paragraph",
          data: {
            text: "Insecure Direct Object References (IDOR), classified under OWASP API Security Top 10 as API1:2023 Broken Object Level Authorization (BOLA), consistently rank among the most prevalent and damaging web vulnerabilities. At its core, an IDOR occurs when an application utilizes user-supplied input to directly access an object in a backend storage system without validating that the authenticated user possesses the appropriate authorization rights.",
          },
        },
        {
          type: "terminal",
          data: {
            title: "terminal — reconnaissance probe",
            command: "curl -s -H 'Authorization: Bearer <attacker_jwt>' 'https://api.target-lab.internal/v2/invoices/10492'",
            output: `HTTP/1.1 200 OK
Content-Type: application/json
X-Content-Type-Options: nosniff

{
  "invoice_id": "10492",
  "customer_id": "usr_9981",
  "name": "Target Enterprise Corp",
  "billing_email": "finance@targetcorp.internal",
  "amount_due": "$142,500.00",
  "bank_routing": "021000021",
  "account_number": "9921849120"
}`,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Notice that by simply incrementing the `invoice_id` parameter from `10492` to `10493`, the API server returns full financial telemetry belonging to another organization without verifying tenancy boundaries.",
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "2. Real-World Case: The UUID Obfuscation Fallacy" },
        },
        {
          type: "paragraph",
          data: {
            text: "A frequent misconception in modern application architecture is assuming that migrating from sequential integers (e.g. `1, 2, 3`) to Universally Unique Identifiers (UUID v4) eliminates IDOR risk. While UUIDs make brute-force enumeration impractical due to their 128-bit entropy, they do NOT resolve the underlying authorization defect.",
          },
        },
        {
          type: "code",
          data: {
            language: "python",
            filename: "exploit_idor_audit.py",
            code: `# Automated Tenant Boundary Verification PoC
import requests
import sys

BASE_URL = "https://api.target-lab.internal/v2"
VICTIM_INVOICE_UUID = "d4e2a89f-38b1-4b71-92cb-5e60802c6114"

session_attacker = requests.Session()
session_attacker.headers.update({
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "User-Agent": "SecurityAudit-wwww82/1.0"
})

res = session_attacker.get(f"{BASE_URL}/documents/{VICTIM_INVOICE_UUID}/export")

if res.status_code == 200:
    print("[CRITICAL] Authorization bypass verified! Leaked sensitive document payload:")
    print(res.text[:200])
elif res.status_code == 403:
    print("[SECURE] Access correctly denied with 403 Forbidden.")
else:
    print(f"[INFO] Server returned unexpected status: {res.status_code}")`,
          },
        },
        {
          type: "finding",
          data: {
            title: "Unauthenticated Document Exfiltration via Mutable ID Parameter",
            severity: "CRITICAL",
            impact: "Complete breakdown of multi-tenant isolation allowing any authenticated tenant to exfiltrate proprietary contract documents across all organizations.",
            recommendation: "Implement data-layer row-level security (RLS) and enforce contextual session matching: WHERE document_id = :id AND tenant_id = :session_tenant_id.",
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "3. Remediation & Defense-in-Depth Architecture" },
        },
        {
          type: "paragraph",
          data: {
            text: "Proper remediation requires shifting access control from ad-hoc controller logic to deterministic data-access layer guards. Below is the recommended implementation pattern in TypeScript with Prisma and policy middleware:",
          },
        },
        {
          type: "code",
          data: {
            language: "typescript",
            filename: "secure-document-service.ts",
            code: `import { db } from "@/lib/db";
import { ForbiddenError, NotFoundError } from "@/lib/errors";

export async function getTenantDocument(documentId: string, currentUserId: string, currentTenantId: string) {
  // 1. Query with strict compound key binding to the active session tenant
  const document = await db.document.findFirst({
    where: {
      id: documentId,
      tenantId: currentTenantId, // Guaranteed multi-tenant isolation
    },
    include: {
      owner: {
        select: { id: true, email: true },
      },
    },
  });

  if (!document) {
    // Return 404 rather than 403 to prevent object existence enumeration
    throw new NotFoundError("Requested resource not found");
  }

  return document;
}`,
          },
        },
      ]),
    },
  });

  const w2 = await prisma.writeUp.create({
    data: {
      title: "Practical Linux Threat Detection with eBPF and Kernel Tracepoints",
      slug: "ebpf-runtime-security-monitoring-in-practice",
      excerpt: "Deep-dive into writing high-performance, tamper-resistant Linux runtime security probes using eBPF programs, kprobes, and raw tracepoints.",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      category: "Security Research",
      tags: JSON.stringify(["eBPF", "Linux Kernel", "C", "Rust", "Threat Detection", "Runtime Security"]),
      difficulty: "Advanced",
      readingTime: "14 min read",
      featured: true,
      order: 1,
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-01T14:00:00Z"),
      content: JSON.stringify([
        {
          type: "warning",
          data: {
            title: "Kernel Instrumentation Notice",
            content: "eBPF programs require root privileges (CAP_BPF or CAP_SYS_ADMIN) and should be verified on sandbox kernels before staging in production environments.",
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "1. Why eBPF is Revolutionizing Modern Security Observability" },
        },
        {
          type: "paragraph",
          data: {
            text: "Traditional user-space security agents rely on auditing daemons (such as auditd) or LD_PRELOAD hooks. These approaches suffer from severe limitations: performance overhead, high CPU context switching, and vulnerability to evasion by sophisticated attackers who can unhook user-space libraries. eBPF (Extended Berkeley Packet Filter) allows security engineers to execute sandboxed bytecode directly within the Linux kernel at near-native speeds.",
          },
        },
        {
          type: "terminal",
          data: {
            title: "terminal — inspecting bpf bytecode verification",
            command: "sudo bpftool prog list --json | jq '.[0]'",
            output: `{
  "id": 142,
  "type": "tracepoint",
  "name": "trace_sys_execve",
  "tag": "8b2a8d3e9102c911",
  "gpl_compatible": true,
  "loaded_at": 1754050200,
  "bytes_xlated": 384,
  "jited": true,
  "bytes_jited": 248,
  "bytes_memlock": 4096
}`,
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "2. Hooking sys_enter_execve to Detect Process Injections" },
        },
        {
          type: "code",
          data: {
            language: "c",
            filename: "execve_monitor.bpf.c",
            code: `#include <vmlinux.h>
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_tracing.h>
#include <bpf/bpf_core_read.h>

struct event_t {
    u32 pid;
    u32 uid;
    char comm[16];
    char filename[256];
};

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 256 * 1024);
} events SEC(".maps");

SEC("tracepoint/syscalls/sys_enter_execve")
int tracepoint__syscalls__sys_enter_execve(struct trace_event_raw_sys_enter *ctx) {
    struct event_t *event;
    
    event = bpf_ringbuf_reserve(&events, sizeof(*event), 0);
    if (!event) return 0;

    event->pid = bpf_get_current_pid_tgid() >> 32;
    event->uid = bpf_get_current_uid_gid();
    bpf_get_current_comm(&event->comm, sizeof(event->comm));

    const char *filename_ptr = (const char *)ctx->args[0];
    bpf_probe_read_user_str(&event->filename, sizeof(event->filename), filename_ptr);

    bpf_ringbuf_submit(event, 0);
    return 0;
}

char LICENSE[] SEC("license") = "GPL";`,
          },
        },
      ]),
    },
  });

  const w3 = await prisma.writeUp.create({
    data: {
      title: "HTB Sherlocks: Advanced Memory Forensics & Incident Response",
      slug: "htb-sherlocks-dfir-memory-forensics",
      excerpt: "Step-by-step walkthrough analyzing a compromised domain controller memory dump using Volatility 3, YARA signatures, and timeline reconstruction.",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      category: "CTF",
      tags: JSON.stringify(["CTF", "DFIR", "Volatility", "Memory Forensics", "Malware Analysis", "HackTheBox"]),
      difficulty: "Intermediate",
      readingTime: "12 min read",
      featured: true,
      order: 2,
      status: "PUBLISHED",
      publishedAt: new Date("2026-07-20T08:00:00Z"),
      content: JSON.stringify([
        {
          type: "heading",
          data: { level: 2, text: "1. Scenario Overview & Initial Artifact Triage" },
        },
        {
          type: "paragraph",
          data: {
            text: "During an alert triage at Acme Corp, an EDR signal detected anomalous PowerShell activity originating from a critical Active Directory Domain Controller. We were provided with a 16GB raw memory dump (`dc01.raw`) to extract the adversary's initial access vector, credential harvesting mechanisms, and persistence hooks.",
          },
        },
        {
          type: "terminal",
          data: {
            title: "terminal — volatility3 profile & process tree analysis",
            command: "python3 vol.py -f dc01.raw windows.pstree.PsTree",
            output: `PID     PPID    ImageFileName           Offset(V)          Threads  Handles  CreateTime
------------------------------------------------------------------------------------------------------
* 4     0       System                  0xfa8003666040     118      0        2026-07-18 04:11:02
** 628  4       smss.exe                0xfa8004b2b060     3        29       2026-07-18 04:11:03
*** 744 628     csrss.exe               0xfa8004f7b060     11       532      2026-07-18 04:11:04
*** 816 628     wininit.exe             0xfa800508a060     4        88       2026-07-18 04:11:04
**** 884 816    lsass.exe               0xfa80051cf060     10       1420     2026-07-18 04:11:04
**** 3840 816   svchost.exe             0xfa80062f8060     24       610      2026-07-18 04:11:05
***** 5124 3840 powershell.exe          0xfa8007a3c060     8        342      2026-07-18 04:32:15  [SUSPICIOUS]`,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Examining PID `5124` (`powershell.exe`) revealed an encoded base64 payload spawning hidden threads into `svchost.exe` memory space via reflective DLL injection.",
          },
        },
      ]),
    },
  });

  console.log("✓ Technical Write-ups created:", w1.title, w2.title, w3.title);

  // 8. Certifications
  const certs = [
    {
      title: "OSCP — Offensive Security Certified Professional",
      issuer: "OffSec",
      issueDate: "2025",
      credentialId: "OS-101-88492",
      credentialUrl: "https://www.offsec.com/verify",
      certificateImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
      description: "Rigorous 24-hour hands-on penetration testing examination demonstrating advanced proficiency in network reconnaissance, web exploitation, privilege escalation, and lateral movement.",
      order: 0,
    },
    {
      title: "CRTE — Certified Red Team Expert",
      issuer: "Altered Security",
      issueDate: "2025",
      credentialId: "CRTE-2025-9941",
      credentialUrl: "https://www.alteredsecurity.com/verify",
      certificateImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      description: "Hands-on certification assessing offensive capabilities against mature enterprise Active Directory environments with modern defensive controls.",
      order: 1,
    },
    {
      title: "eWPTXv2 — Web Application Penetration Tester eXtreme",
      issuer: "INE Security",
      issueDate: "2024",
      credentialId: "INE-EWPTX-49102",
      credentialUrl: "https://ine.com/verify",
      certificateImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      description: "Elite web penetration testing accreditation covering custom exploit development, advanced WAF bypasses, deserialization, and complex authorization chains.",
      order: 2,
    },
    {
      title: "CISSP — Certified Information Systems Security Professional",
      issuer: "(ISC)²",
      issueDate: "2026",
      credentialId: "CISSP-982144",
      credentialUrl: "https://www.isc2.org/verify",
      certificateImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      description: "Globally recognized standard in enterprise security architecture, risk management, and secure software development lifecycles.",
      order: 3,
    },
    {
      title: "AWS Certified Security — Specialty",
      issuer: "Amazon Web Services",
      issueDate: "2025",
      credentialId: "AWS-SEC-550129",
      credentialUrl: "https://aws.amazon.com/verification",
      certificateImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      description: "Validation of advanced cloud security engineering, encryption mechanisms, IAM governance, and automated incident response in AWS.",
      order: 4,
    },
    {
      title: "BSCP — Burp Suite Certified Practitioner",
      issuer: "PortSwigger",
      issueDate: "2024",
      credentialId: "PORT-BSCP-8841",
      credentialUrl: "https://portswigger.net/web-security/certification",
      certificateImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      description: "Demonstrated master-level execution with Burp Suite Professional on breaking web and API protocols against live hardened targets.",
      order: 5,
    },
  ];

  for (const cert of certs) {
    await prisma.certification.create({ data: cert });
  }
  console.log("✓ Certifications created");

  // 9. Experiences
  const experiences = [
    {
      role: "Lead Security Researcher & Penetration Tester",
      company: "SecOps Research Labs",
      location: "Bangkok / Remote",
      startDate: "2024",
      endDate: "Present",
      current: true,
      description: "Spearhead red team engagements, web application security assessments, and kernel vulnerability research. Develop automated attack surface mapping tooling and conduct responsible vulnerability disclosures.",
      order: 0,
    },
    {
      role: "Application Security Engineer",
      company: "CloudDefense Technologies",
      location: "Bangkok",
      startDate: "2022",
      endDate: "2024",
      current: false,
      description: "Integrated automated SAST/DAST pipelines into CI/CD workflows, conducted secure code reviews for microservice architectures, and led internal threat modeling sessions.",
      order: 1,
    },
    {
      role: "Security Operations Center (SOC) Analyst",
      company: "CyberShield Global",
      location: "Bangkok",
      startDate: "2021",
      endDate: "2022",
      current: false,
      description: "Monitored SIEM telemetry, conducted digital forensics and incident response investigations, and authored custom Sigma and YARA threat detection rules.",
      order: 2,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log("✓ Experience entries created");

  // 10. Skills
  const skills = [
    // Security
    { name: "Web Application Security", category: "Security", proficiency: 95, order: 0 },
    { name: "Penetration Testing", category: "Security", proficiency: 94, order: 1 },
    { name: "API & GraphQL Security", category: "Security", proficiency: 92, order: 2 },
    { name: "Threat Modeling & Code Audit", category: "Security", proficiency: 88, order: 3 },
    { name: "Reverse Engineering", category: "Security", proficiency: 82, order: 4 },
    { name: "eBPF & Kernel Security", category: "Security", proficiency: 80, order: 5 },
    // Programming
    { name: "Python", category: "Programming", proficiency: 95, order: 6 },
    { name: "TypeScript / JavaScript", category: "Programming", proficiency: 90, order: 7 },
    { name: "Go", category: "Programming", proficiency: 85, order: 8 },
    { name: "C / C++", category: "Programming", proficiency: 80, order: 9 },
    { name: "Rust", category: "Programming", proficiency: 75, order: 10 },
    { name: "Bash / PowerShell", category: "Programming", proficiency: 90, order: 11 },
    // Networking & Cloud
    { name: "AWS Cloud Security & IAM", category: "Cloud", proficiency: 88, order: 12 },
    { name: "Docker & Container Hardening", category: "Cloud", proficiency: 90, order: 13 },
    { name: "Kubernetes Security", category: "Cloud", proficiency: 82, order: 14 },
    { name: "TCP/IP & Network Protocols", category: "Networking", proficiency: 92, order: 15 },
    { name: "Linux System Internals", category: "Networking", proficiency: 94, order: 16 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log("✓ Skills created");

  // 11. Security Tools
  const tools = [
    { name: "Burp Suite Professional", category: "Penetration Testing", description: "Web and API vulnerability inspection proxy", order: 0 },
    { name: "Nmap & Masscan", category: "Network Enumeration", description: "Network discovery and port scanning suite", order: 1 },
    { name: "Wireshark", category: "Traffic Analysis", description: "Packet inspection and protocol dissector", order: 2 },
    { name: "Ghidra", category: "Reverse Engineering", description: "NSA software reverse engineering framework", order: 3 },
    { name: "AFL++ & QEMU", category: "Fuzzing", description: "Coverage-guided security fuzzer for binaries & kernel drivers", order: 4 },
    { name: "Nuclei", category: "Security Automation", description: "Fast and customizable vulnerability scanner based on YAML templates", order: 5 },
    { name: "BloodHound", category: "Active Directory", description: "Graph visualization for Active Directory attack paths", order: 6 },
    { name: "Volatility 3", category: "Digital Forensics", description: "Memory artifact analysis and malware forensics engine", order: 7 },
  ];

  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }
  console.log("✓ Tools created");

  console.log("🚀 wwww82 Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
