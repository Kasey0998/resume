#!/usr/bin/env python3
"""Build the hosted, two-page Krishna Sharma CV.

Requires: python -m pip install reportlab
Run from any directory: python portfolio/scripts/generate_cv.py
Optional output path: python portfolio/scripts/generate_cv.py /path/to/cv.pdf
"""

from pathlib import Path
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else (
    ROOT / "assets" / "documents" / "Krishna_Sharma_CV.pdf"
)
NAVY = colors.HexColor("#193B55")
INK = colors.HexColor("#17212B")
MUTED = colors.HexColor("#4B5964")
LINE = colors.HexColor("#D4DFE7")


STYLES = {
    "name": ParagraphStyle(
        "name", fontName="Helvetica-Bold", fontSize=24, leading=28,
        textColor=NAVY, spaceAfter=3,
    ),
    "role": ParagraphStyle(
        "role", fontName="Helvetica-Bold", fontSize=12, leading=16,
        textColor=INK, spaceAfter=6,
    ),
    "contact": ParagraphStyle(
        "contact", fontName="Helvetica", fontSize=9.5, leading=13,
        textColor=MUTED, spaceAfter=2,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=NAVY, spaceBefore=12, spaceAfter=6, keepWithNext=True,
    ),
    "body": ParagraphStyle(
        "body", fontName="Helvetica", fontSize=10.2, leading=13.5,
        textColor=INK, spaceAfter=3, alignment=TA_LEFT,
    ),
    "skill": ParagraphStyle(
        "skill", fontName="Helvetica", fontSize=9.8, leading=12.8,
        textColor=INK, spaceAfter=3,
    ),
    "job": ParagraphStyle(
        "job", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=INK, spaceAfter=1, keepWithNext=True,
    ),
    "meta": ParagraphStyle(
        "meta", fontName="Helvetica", fontSize=9.5, leading=12.5,
        textColor=MUTED, spaceAfter=5, keepWithNext=True,
    ),
    "bullet": ParagraphStyle(
        "bullet", fontName="Helvetica", fontSize=10.2, leading=13.5,
        textColor=INK, leftIndent=11, firstLineIndent=0,
        bulletIndent=0, bulletFontName="Helvetica", bulletFontSize=10.2,
        spaceAfter=4,
    ),
    "project": ParagraphStyle(
        "project", fontName="Helvetica", fontSize=10.2, leading=13.5,
        textColor=INK, spaceAfter=7,
    ),
}


def p(text, style="body", **kwargs):
    return Paragraph(text, STYLES[style], **kwargs)


def section(title):
    return p(title.upper(), "section")


def job(title, company, location, dates, bullets):
    result = [
        p(title, "job"),
        p(f"{company} | {location} | {dates}", "meta"),
    ]
    result += [p(text, "bullet", bulletText="-") for text in bullets]
    result.append(Spacer(1, 4))
    return result


def footer(canvas, document):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(42, 35, width - 42, 35)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(42, 23, "Krishna Sharma | Cloud & DevOps Engineer")
    canvas.drawRightString(width - 42, 23, f"{document.page} / 2")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4,
        rightMargin=42, leftMargin=42, topMargin=38, bottomMargin=46,
        title="Krishna Sharma - Cloud & DevOps Engineer CV",
        author="Krishna Sharma",
        subject="AWS, Linux, Terraform, Docker, Jenkins and infrastructure operations",
        keywords="Krishna Sharma, Cloud, DevOps, AWS, Linux, Terraform, Docker, Jenkins, Bash, Grafana",
        pageCompression=1,
    )
    story = [
        p("KRISHNA SHARMA", "name"),
        p("Cloud &amp; DevOps Engineer", "role"),
        p(
            'Dublin, Ireland | <link href="tel:+353877888665" color="#193B55">+353 877 888 665</link>'
            ' | <link href="mailto:kasey.gnr@icloud.com" color="#193B55">kasey.gnr@icloud.com</link>',
            "contact",
        ),
        p(
            'LinkedIn: <link href="https://www.linkedin.com/in/krishna-sharma98" '
            'color="#193B55">www.linkedin.com/in/krishna-sharma98</link>',
            "contact",
        ),
        Spacer(1, 6),
        HRFlowable(width="100%", thickness=1, color=NAVY),
        section("Professional profile"),
        p(
            "Cloud &amp; DevOps engineer with experience operating AWS and Linux infrastructure, "
            "building Jenkins and Docker deployment workflows, and automating provisioning with "
            "Terraform and Bash. Background in monitoring, incident troubleshooting, VMware, "
            "web hosting and application support."
        ),
        section("Technical skills"),
    ]
    skills = [
        ("AWS", "EC2, EBS, S3, VPC, IAM, Security Groups, NACLs, CloudWatch, Cost Explorer"),
        ("CI/CD &amp; infrastructure as code", "Jenkins, Git, Docker, Dockerfiles, Terraform"),
        ("Linux &amp; systems", "Ubuntu, Debian, CentOS, systemd, SSH, patching, Bash, Cron, VMware, Windows Server"),
        ("Monitoring &amp; reliability", "Grafana, log analysis, alerting, incident response, root-cause analysis"),
        ("Networking &amp; hosting", "TCP/IP, DNS, DHCP, firewalls, Nginx, Apache, PHP-FPM, cPanel/WHM, SSL/TLS"),
        ("Development &amp; databases", "SQL, MySQL, MariaDB, PHP; Flask and SQLAlchemy (project experience); Python (basic/working knowledge)"),
        ("Additional knowledge", "Kubernetes fundamentals, Ansible, Prometheus; Azure and GCP fundamentals"),
    ]
    story += [p(f"<b>{label}:</b> {text}", "skill") for label, text in skills]
    story.append(section("Professional experience"))
    story += job(
        "DevOps &amp; Infrastructure Engineer", "AGAMI-TECH", "Mumbai, India",
        "Jul 2024 - Feb 2025", [
            "Built and supported Jenkins CI/CD pipelines with Git and Docker to standardise application builds and deployments.",
            "Containerised FreeSWITCH media-server components into reusable Docker images, reducing host-specific installation steps.",
            "Maintained Terraform-managed AWS configurations for UAT and production; supported EC2, EBS and S3 workloads, migrations and storage.",
            "Configured AWS VPC, IAM and network security controls; monitored workloads with CloudWatch and Grafana and reviewed expenditure in Cost Explorer.",
            "Automated Linux health checks and maintenance with Bash and basic Python scripts; investigated incidents and documented operational procedures.",
        ],
    )
    story += job(
        "Technical Support Engineer", "AGAMI-TECH", "Mumbai, India",
        "Dec 2022 - Jun 2024", [
            "Diagnosed Linux, application, hosting and network issues; analysed logs and reproduced defects for engineering teams.",
            "Supported server access administration, deployments, routine maintenance and incident communications.",
            "Automated recurring support tasks with Bash and created troubleshooting guides and operational handover documentation.",
        ],
    )
    story += [
        PageBreak(),
        p("KRISHNA SHARMA", "job"),
        p("Cloud &amp; DevOps Engineer", "contact"),
        Spacer(1, 5),
        HRFlowable(width="100%", thickness=1, color=NAVY),
        section("Professional experience - continued"),
    ]
    story += job(
        "Linux System Administrator", "REDDUSTTEK", "Nashik, India",
        "Jan 2021 - Aug 2022", [
            "Administered Linux and Windows Server systems, performing patching, access management, service configuration and performance troubleshooting.",
            "Provisioned and maintained VMware virtual machines; supported storage, scheduled backups and recovery operations.",
            "Supported Nginx, Apache and PHP-FPM hosting, including cPanel/WHM, DNS, SSL/TLS and MySQL/MariaDB connectivity.",
            "Diagnosed TCP/IP, DNS and DHCP issues; automated recurring Linux maintenance with Bash and Cron.",
        ],
    )
    story += job(
        "Technical Support Engineer Intern", "TECHNOKRAFT", "Nashik, India",
        "Dec 2018 - Dec 2020", [
            "Provided first-line support for software, workstations, hardware and basic network issues.",
            "Assisted with configuration, user setup, maintenance, escalation and resolution documentation.",
        ],
    )
    story.append(section("Selected engineering & academic projects"))
    projects = [
        (
            "AWS Infrastructure with Terraform",
            "Maintained UAT and production infrastructure configurations, covering AWS compute and storage operations, network/access controls and CloudWatch monitoring.",
        ),
        (
            "FreeSWITCH Containerisation",
            "Packaged Linux media-server components into reusable Docker images for portable installation and container-based release workflows.",
        ),
        (
            "Jenkins &amp; Docker Deployment Automation",
            "Implemented repeatable build and deployment workflows using Jenkins, Git, Docker and Bash to reduce manual release effort.",
        ),
        (
            "Linux Monitoring &amp; Maintenance Automation",
            "Developed Bash scripts, scheduled checks and procedures for Linux health monitoring, log review and recurring maintenance.",
        ),
        (
            "GomataVision CRM",
            "Built a Flask CRM for property developers to manage apartment inventory, client leads, users and sales workflows, using SQLAlchemy, Flask-Login and role-based access.",
        ),
    ]
    story += [p(f"<b>{title}</b><br/>{description}", "project") for title, description in projects]
    story += [
        section("Education"),
        KeepTogether([
            p("<b>MSc Information Systems with Computing</b>"),
            p("Dublin Business School | Ireland", "meta"),
        ]),
        KeepTogether([
            p("<b>Bachelor of Computer Applications</b>"),
            p("Glocal University | June 2018", "meta"),
        ]),
        section("Certification"),
        p("<b>AWS Certified Cloud Practitioner</b> | Earned November 2022"),
    ]
    document.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    build()
