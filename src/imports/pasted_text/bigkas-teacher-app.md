# BIGKAS Teacher Mobile App — IBM BOB Application Prompt

Build a fully interactive Android-first educational application called BIGKAS.

IMPORTANT:

* Generate a functional multi-screen application.
* Do NOT generate a static HTML mockup.
* All buttons and navigation must work.
* Use screen navigation and application state.
* Use mock student data.
* Simulate AI results.
* Generate a clickable prototype.

---

# Application Goal

BIGKAS is an AI-powered bilingual reading assessment application for elementary teachers in the Philippines.

The application helps teachers:

* Assess reading fluency.
* Assess reading comprehension.
* Identify weak reading skills.
* Recommend interventions.
* Group students.
* Generate reports.

---

# User Role

Primary user:

* Teacher

Secondary user:

* Student

---

# Navigation Structure

Splash Screen
→ Login
→ Dashboard
→ Class Selection
→ Student Selection
→ Language Selection
→ Passage Screen
→ Recording Screen
→ Processing Screen
→ Comprehension Questions
→ Results Screen
→ Intervention Screen
→ Student Report
→ Parent Message
→ Dashboard

---

# Bottom Navigation

Dashboard
Classes
Assessments
Reports
Profile

---

# Login Screen

Fields:

* Email
* Password

Buttons:

* Login

Action:
Login button → Dashboard.

---

# Dashboard

Show:

* Total Students
* Assessed Students
* Green Students
* Yellow Students
* Red Students

Buttons:

Start Assessment
→ Class Screen

Reports
→ Reports Screen

Profile
→ Profile Screen

---

# Class Screen

Display:

Grade 1-A
Grade 2-B
Grade 3-C

Tap class:
→ Student List

---

# Student List

Display:

* Juan Dela Cruz
* Maria Santos
* Ana Reyes

Selecting student:
→ Language Selection

---

# Language Selection

Buttons:

Filipino
English

Selecting language:
→ Passage Screen

---

# Passage Screen

Display:

Grade-level reading passage.

Word count:
80–120 words.

Button:

Start Reading

Action:
→ Recording Screen

---

# Recording Screen

Display:

* Microphone animation
* Timer
* Waveform

Buttons:

Start Recording
Pause
Stop

When Stop is pressed:
→ Processing Screen

---

# Offline Logic

Check internet connection.

If internet available:
→ Upload audio.

If internet unavailable:
→ Save locally.
→ Queue for sync.

Display:
"Assessment saved offline."

---

# Processing Screen

Display loading animation.

Steps:

1. Transcribe audio.
2. Align text.
3. Score fluency.
4. Generate comprehension.

After 3 seconds:
→ Comprehension Screen

---

# Comprehension Screen

Display 4 questions.

Question categories:

* Literal Recall
* Vocabulary
* Inference
* Sequencing

Question types:

* Multiple choice
* Tap answer

Next Question button:
→ Next question.

Submit:
→ Results Screen.

---

# Reading Ladder Engine

Evaluate:

Fluency:

* Decoding
* Blending
* Sight Words
* Pacing

Comprehension:

* Literal
* Vocabulary
* Inference
* Sequencing

Find the lowest broken reading skill.

Assign severity:

* Severe
* Moderate
* Mild
* Solid

---

# Tier Assignment

Green:
Strong fluency and comprehension.

Yellow-Fluency:
Weak fluency.

Yellow-Comprehension:
Weak comprehension.

Red:
Severe foundational problem.

Display large colored tier card.

---

# Results Screen

Display:

Words Correct Per Minute

Accuracy

Fluency score

Comprehension score

Weak skills

Primary skill gap

Button:
View Intervention

Action:
→ Intervention Screen

---

# Intervention Screen

Display:

Primary Problem

Examples:

* Decoding
* Vocabulary
* Inference

Recommended Activities:

Decoding:

* Phonics drills

Blending:

* Syllable exercises

Vocabulary:

* Word cards

Inference:

* Prediction exercises

Sequencing:

* Story ordering

Buttons:

Save Intervention

View Report

→ Report Screen

---

# Student Report Screen

Display:

Student Profile

Language

Fluency Results

Comprehension Results

Tier

Primary Weak Skill

Recommended Drill

Reassessment Date

Buttons:

Save Report

Send Parent Message

→ Parent Message Screen

---

# Parent Message Screen

Generate:

"Your child needs additional support in reading comprehension. Please practice reading together for 15 minutes daily."

Buttons:

Send

Copy

Finish Assessment

Action:
→ Ask "Assess another student?"

---

# Next Student Decision

YES:
→ Student List

NO:
→ Dashboard

---

# Reports Screen

Display:

* Assessment History
* Student Reports
* Tier Distribution

Charts:

* Green students
* Yellow students
* Red students

---

# Profile Screen

Display:

Teacher information.

School.

Assigned classes.

Logout button.

---

# Sample Data

Generate:

3 classes.

30 students.

Assessment scores.

Reading tiers.

Mock AI results.

---

# User Interface

Style:

Educational.

Modern.

Friendly.

Rounded cards.

Large buttons.

Blue primary color.

Green, Yellow, and Red reading tiers.

Design inspiration:

Google Classroom.
Duolingo.
Khan Academy.

---

# Important Requirements

All buttons must function.

All screens must navigate.

Use local application state.

Use simulated assessment data.

Use loading states.

Use offline state.

Do not generate disconnected pages.

Generate a working multi-screen application.

Generate a clickable prototype.

The core assessment flow must work from beginning to end.

Teacher Dashboard
→ Assessment
→ Comprehension
→ Tier Assignment
→ Intervention
→ Report
→ Next Student
→ Dashboard

This assessment workflow is the most important feature of BIGKAS.
