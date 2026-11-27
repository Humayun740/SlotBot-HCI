import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 580, "SLOTBOT — HEURISTIC USABILITY EVALUATION REPORT (DELIVERABLE D4 PART B)")
            self.drawRightString(756, 580, "EVALUATOR 1 (HUMAYUN)")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 574, 756, 574)

        # Footer
        self.setFont("Helvetica", 8)
        self.drawString(36, 25, "Confidential — Human-Computer Interaction Usability Evaluation")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(756, 25, page_text)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 35, 756, 35)
        self.restoreState()

def build_pdf(filename="SlotBot_Heuristic_Evaluation_Report.pdf"):
    # Landscape orientation for wide heuristic table
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#075e54"),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1e293b")
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0f172a")
    )

    screen_badge = ParagraphStyle(
        'ScreenBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#047857")
    )

    heuristic_style = ParagraphStyle(
        'HeuristicStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1e293b")
    )

    heuristic_sub = ParagraphStyle(
        'HeuristicSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#475569")
    )

    severity_badge_3 = ParagraphStyle(
        'SevBadge3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#b91c1c")
    )

    severity_badge_2 = ParagraphStyle(
        'SevBadge2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#b45309")
    )

    justification_style = ParagraphStyle(
        'JustStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#334155")
    )

    evaluator_style = ParagraphStyle(
        'EvalStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("SlotBot — Heuristic Usability Evaluation Report", title_style))
    story.append(Paragraph(
        "Deliverable D4 Part B | WhatsApp-Inspired Commuter Team Scheduling Tool | Jakob Nielsen Usability Inspection",
        subtitle_style
    ))

    # Metadata Summary Bar
    meta_data = [
        [
            Paragraph("<b>System Evaluated:</b> SlotBot Prototype", body_style),
            Paragraph("<b>Evaluator Tag:</b> Evaluator 1 (Humayun)", body_style),
            Paragraph("<b>Date of Audit:</b> November 2026", body_style),
            Paragraph("<b>Total Issues Logged:</b> 6 Usability Flaws", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[180, 180, 180, 180])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Nielsen Severity Rating Legend (Brief)
    story.append(Paragraph("Nielsen Severity Scale (0–4) Reference Criteria", section_heading))
    legend_data = [
        [
            Paragraph("<b>0 = Not an issue</b>: Not considered a usability problem.", body_style),
            Paragraph("<b>1 = Cosmetic</b>: Low priority, fix only if extra time permits.", body_style),
            Paragraph("<b>2 = Minor</b>: Low/medium priority, causes irritation/friction.", body_style),
            Paragraph("<b>3 = Major</b>: High priority, heavily impairs workflow.", body_style),
            Paragraph("<b>4 = Catastrophe</b>: Imperative fix, halts product use.", body_style),
        ]
    ]
    legend_table = Table(legend_data, colWidths=[144, 144, 144, 144, 144])
    legend_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(legend_table)
    story.append(Spacer(1, 10))

    # HEURISTIC TABLE
    story.append(Paragraph("Evaluator Log: 6 Usability Issues Table", section_heading))

    # Header Row
    headers = [
        Paragraph("<b>#</b>", body_bold),
        Paragraph("<b>Issue Description<br/>(Exact Screen + What Breaks/Confuses)</b>", body_bold),
        Paragraph("<b>Heuristic / Rule<br/>Violated</b>", body_bold),
        Paragraph("<b>Severity (0–4) &amp; Justification<br/>(Frequency, Impact, Persistence)</b>", body_bold),
        Paragraph("<b>Evaluator Tag</b>", body_bold),
    ]

    table_rows = [headers]

    issues = [
        {
            "id": "1",
            "screen": "Screen 1: Chat group [SCREEN 1]",
            "desc": "<b>Asymmetric Cutoff Status Visibility for Non-Commuter Peers</b><br/>"
                    "The group status pill shows <i>'Availability requested · 3 of 4 replies'</i> but provides no indication of <i>why</i> the process is pending on Bilal or what transit constraint is active. Peers (Alex, Priya, Carlos) have zero awareness of Bilal's 3:30 PM transit cutoff until recommendations appear or fail, fostering unnecessary social pressure and repeat pinging.",
            "heuristic": "Visibility of System Status",
            "rule_sub": "Nielsen Heuristic #1<br/>Social Translucence in CSCW",
            "sev": "2 (Minor)",
            "sev_style": severity_badge_2,
            "just": "<b>Frequency:</b> High (every group run).<br/>"
                    "<b>Impact:</b> Moderate (causes peer friction/confusion).<br/>"
                    "<b>Persistence:</b> Low (mitigated once team knows Bilal's schedule).",
            "eval": "Evaluator 1<br/>(Humayun)"
        },
        {
            "id": "2",
            "screen": "Screen 1: Chat group [SCREEN 1]",
            "desc": "<b>Lack of Syntax Discovery and Parameter Affordances in Command Bar</b><br/>"
                    "Invoking <code>@SlotBot meeting today, 1 hour</code> requires pure user recall. There are no autocomplete chips, syntax tooltips, or parameter guidance for alternative meeting durations (e.g., 30m, 45m) or target days. If a user enters non-standard syntax (e.g., <i>'@SlotBot meet this afternoon'</i>), no immediate inline assistance is provided.",
            "heuristic": "Recognition Rather Than Recall &amp; Error Prevention",
            "rule_sub": "Nielsen Heuristics #6 &amp; #5",
            "sev": "3 (Major)",
            "sev_style": severity_badge_3,
            "just": "<b>Frequency:</b> High (every first-time/casual group initiator).<br/>"
                    "<b>Impact:</b> High (stalls scheduling initiation completely).<br/>"
                    "<b>Persistence:</b> High (recurs across all new command invocations).",
            "eval": "Evaluator 1<br/>(Humayun)"
        },
        {
            "id": "3",
            "screen": "Screen 2: Private DM input [SCREEN 2]",
            "desc": "<b>Inflexible Binary Toggles Prevent Nuanced / Conditional Availability</b><br/>"
                    "Availability rows force a binary choice between <b>[Free]</b> and <b>[Busy]</b>. A commuter student who could accommodate a slot conditionally (e.g., <i>'Free if meeting is held near the North Campus bus terminal'</i> or <i>'Soft busy / optional study'</i>) is compelled to mark [Busy], prematurely eliminating viable mutual meeting windows.",
            "heuristic": "Flexibility &amp; Efficiency of Use",
            "rule_sub": "Nielsen Heuristic #7<br/>Match with Real World (#2)",
            "sev": "2 (Minor)",
            "sev_style": severity_badge_2,
            "just": "<b>Frequency:</b> Moderate (frequent in dynamic student schedules).<br/>"
                    "<b>Impact:</b> Moderate (artificially over-constrains solution pool).<br/>"
                    "<b>Persistence:</b> High (limits every DM response submission).",
            "eval": "Evaluator 1<br/>(Humayun)"
        },
        {
            "id": "4",
            "screen": "Screen 2: Private DM input [SCREEN 2]",
            "desc": "<b>Permanently Disabled Cutoff Slots Lack In-Situ Exception Override</b><br/>"
                    "Slots after 3:30 PM (e.g., 3:00–4:00, 4:00–5:00) are hard-disabled with <i>'Pre-blocked: 3:30 PM transit cutoff'</i>. If Bilal has exceptional plans (e.g., carpooling with a friend, staying for an evening review session, or catching a 5:30 PM bus), there is no contextual override button in the DM flow to relax the cutoff for this single meeting.",
            "heuristic": "User Control &amp; Freedom",
            "rule_sub": "Nielsen Heuristic #3<br/>Flexibility of Use (#7)",
            "sev": "3 (Major)",
            "sev_style": severity_badge_3,
            "just": "<b>Frequency:</b> Moderate (whenever transit routine temporarily varies).<br/>"
                    "<b>Impact:</b> Severe (blocks user from expressing genuine availability).<br/>"
                    "<b>Persistence:</b> High (persists until external settings are altered).",
            "eval": "Evaluator 1<br/>(Humayun)"
        },
        {
            "id": "5",
            "screen": "Screen 3: Group recommendation [SCREEN 3]",
            "desc": "<b>Irreversible Single-Click Meeting Confirmation Without Confirmation Step or Undo</b><br/>"
                    "Clicking <b>[Confirm]</b> on the Rank 1 BEST card locks the meeting immediately and permanently pins the banner for all 4 team members with a single tap. There is no verification dialog (<i>'Lock meeting for all 4 members?'</i>), no team consensus poll, and no 10-second undo window to recover from accidental mobile taps.",
            "heuristic": "Error Prevention &amp; User Control and Freedom",
            "rule_sub": "Nielsen Heuristics #5 &amp; #3",
            "sev": "3 (Major)",
            "sev_style": severity_badge_3,
            "just": "<b>Frequency:</b> Moderate (accidental touch on mobile screens).<br/>"
                    "<b>Impact:</b> High (erroneously locks calendars and books rooms).<br/>"
                    "<b>Persistence:</b> Moderate (requires manual group chat rework to cancel).",
            "eval": "Evaluator 1<br/>(Humayun)"
        },
        {
            "id": "6",
            "screen": "Screen 4: Error and fallback [SCREEN 4]",
            "desc": "<b>Actionable Error Card Lacks Predictive Impact Previews for Recovery Buttons</b><br/>"
                    "When no slots meet the 30-min buffer, the error card provides <b>[Suggest Tomorrow]</b> and <b>[Shorten to 30 min]</b>, but provides no advance diagnostic data. Users cannot see which peer schedules caused the conflict or whether shortening to 30 min will actually resolve the blockage before executing the click, leading to blind trial-and-error.",
            "heuristic": "Help Users Recognize, Diagnose, &amp; Recover from Errors",
            "rule_sub": "Nielsen Heuristic #9<br/>Visibility of System Status (#1)",
            "sev": "2 (Minor)",
            "sev_style": severity_badge_2,
            "just": "<b>Frequency:</b> High (every time transit cutoff causes a collision).<br/>"
                    "<b>Impact:</b> Moderate (forces exploratory trial-and-error clicks).<br/>"
                    "<b>Persistence:</b> Low (resolves as soon as the user tries each option).",
            "eval": "Evaluator 1<br/>(Humayun)"
        }
    ]

    for item in issues:
        row = [
            Paragraph(f"<b>#{item['id']}</b>", body_bold),
            Paragraph(f"<font color='#047857'><b>[{item['screen']}]</b></font><br/>{item['desc']}", body_style),
            Paragraph(f"<b>{item['heuristic']}</b><br/><font color='#475569'>{item['rule_sub']}</font>", body_style),
            Paragraph(f"<font color='{item['sev_style'].textColor.hexval()}'><b>Severity {item['sev']}</b></font><br/>{item['just']}", body_style),
            Paragraph(f"<b>{item['eval']}</b>", evaluator_style)
        ]
        table_rows.append(row)

    # Column widths: Total 720 pt (Landscape letter = 792 - 72 = 720)
    col_widths = [26, 260, 140, 214, 80]
    issue_table = Table(table_rows, colWidths=col_widths, repeatRows=1)
    issue_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))

    story.append(issue_table)
    story.append(Spacer(1, 14))

    # Recommended Design Remediations Box
    story.append(Paragraph("Recommended Design Remediations for Deliverable D4 Part B Iteration", section_heading))
    recs_data = [
        [
            Paragraph("<b>Issue #1 &amp; #2 (Group Screen 1):</b> Add an interactive transit badge beside Bilal in the reply pill (<i>'Bilal: 3:30 PM cutoff active'</i>), and add autocomplete suggestion chips directly inside the chat compose bar.", body_style),
            Paragraph("<b>Issue #3 &amp; #4 (DM Screen 2):</b> Introduce a 3-way toggle (<i>Free / Conditional / Busy</i>) and an inline <i>'One-time transit override'</i> toggle allowing Bilal to adjust cutoff for urgent meetings.", body_style)
        ],
        [
            Paragraph("<b>Issue #5 (Group Screen 3):</b> Add a 2-step verification modal (<i>'Lock 2:00–3:00 PM for all 4 members?'</i>) with a 10-second toast notification allowing any member to undo.", body_style),
            Paragraph("<b>Issue #6 (Error Screen 4):</b> Display a mini preview beneath each recovery button (e.g., <i>'Shorten to 30 min: 2 viable slots found'</i>; <i>'Suggest Tomorrow: 3 viable slots found'</i>) to eliminate guesswork.", body_style)
        ]
    ]
    recs_table = Table(recs_data, colWidths=[360, 360])
    recs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#bbf7d0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(recs_table)

    # Build document with custom canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    build_pdf()
