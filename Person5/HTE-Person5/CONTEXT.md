{\rtf1\ansi\ansicpg1252\cocoartf2759
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red219\green63\blue57;\red255\green255\blue255;\red42\green44\blue51;
\red133\green85\blue4;\red42\green44\blue51;}
{\*\expandedcolortbl;;\cssrgb\c89412\c33725\c28627;\cssrgb\c100000\c100000\c100000;\cssrgb\c21961\c22745\c25882;
\cssrgb\c59608\c40784\c392;\cssrgb\c21961\c22745\c25882;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # \uc0\u55356 \u57263  Project Context: FocusFlow 3D (HACKTHEEAST 2026)\cf4 \cb1 \strokec4 \
\
\cf2 \cb3 \strokec2 ## Mission\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 AI-powered adaptive learning platform for \cf5 \strokec5 **neurodivergent students**\cf4 \strokec4  (ADHD, autism, dyslexia). Transforms lecture materials into interactive environments with real-time personalization.\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## My Role: Person 5 (UX, Design & Accessibility Lead)\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - Own design system, accessibility compliance, neurodivergent-friendly UI.\cb1 \
\cb3 - Build: Energy Check-in, Progress Dashboard, Session Summary, Accessibility Toolbar.\cb1 \
\cb3 - Audit: All components for WCAG AA compliance.\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55357 \u57056  Tech Stack\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - \cf5 \strokec5 **Framework:**\cf4 \strokec4  Next.js 14 (App Router)\cb1 \
\cb3 - \cf5 \strokec5 **Styling:**\cf4 \strokec4  Tailwind CSS\cb1 \
\cb3 - \cf5 \strokec5 **3D:**\cf4 \strokec4  Blender models (GLTF/GLB) - Person 1 handles this. I build UI overlays.\cb1 \
\cb3 - \cf5 \strokec5 **Animations:**\cf4 \strokec4  Framer Motion (respect prefers-reduced-motion)\cb1 \
\cb3 - \cf5 \strokec5 **UI Primitives:**\cf4 \strokec4  Radix UI (Dialog, Switch, RadioGroup, etc.)\cb1 \
\cb3 - \cf5 \strokec5 **State:**\cf4 \strokec4  Zustand\cb1 \
\cb3 - \cf5 \strokec5 **Theme:**\cf4 \strokec4  next-themes\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55356 \u57256  Design Tokens (STRICT)\cf4 \cb1 \strokec4 \
\cf2 \cb3 \strokec2 ### Colors\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 -\cf6 \cb3 \outl0\strokewidth0  WCAG AA compliance.\
\pard\pardeftab720\partightenfactor0
\cf4 \cb1 \outl0\strokewidth0 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ### Typography\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - Font: Comic Neue (default), OpenDyslexic (toggle)\cb1 \
\cb3 - Min Size: 16px\cb1 \
\cb3 - Line Height: 1.5-1.6\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ### Spacing\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - Scale: 4px, 8px, 16px, 24px, 32px\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u9855  Accessibility Rules (NON-NEGOTIABLE)\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 1. \cf5 \strokec5 **Contrast:**\cf4 \strokec4  All text \uc0\u8805  4.5:1 ratio (WCAG AA).\cb1 \
\cb3 2. \cf5 \strokec5 **Keyboard:**\cf4 \strokec4  Full tab navigation, visible focus rings (ring-2).\cb1 \
\cb3 3. \cf5 \strokec5 **Screen Reader:**\cf4 \strokec4  ARIA labels on all icon buttons.\cb1 \
\cb3 4. \cf5 \strokec5 **Motion:**\cf4 \strokec4  Respect `prefers-reduced-motion`.\cb1 \
\cb3 5. \cf5 \strokec5 **Click Targets:**\cf4 \strokec4  Minimum 44x44px.\cb1 \
\cb3 6. \cf5 \strokec5 **Color:**\cf4 \strokec4  Never rely on color alone (use icons + text).\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55357 \u56538  Subjects Supported\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 1. Art\cb1 \
\cb3 2. History\cb1 \
\cb3 3. Science\cb1 \
\cb3 4. Language\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55358 \u56809  Components I Build\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 1. \cf5 \strokec5 **Core:**\cf4 \strokec4  Button, Input, Card, Badge, ProgressBar\cb1 \
\cb3 2. \cf5 \strokec5 **Features:**\cf4 \strokec4  EnergyCheckIn, ProgressDashboard, SessionSummary, AccessibilityToolbar\cb1 \
\cb3 3. \cf5 \strokec5 **Themes:**\cf4 \strokec4  Light Mode, High Contrast Mode, Dyslexia Font Mode\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55358 \u56605  Team Integration\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - \cf5 \strokec5 **Person 1 (3D):**\cf4 \strokec4  I overlay UI on top of their Blender renders.\cb1 \
\cb3 - \cf5 \strokec5 **Person 4 (Frontend):**\cf4 \strokec4  We share design tokens; I audit their components.\cb1 \
\cb3 - \cf5 \strokec5 **Person 6 (Engine):**\cf4 \strokec4  My accessibility settings store in global Zustand state.\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 ## \uc0\u55357 \u56960  Coding Standards\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3 - Use Tailwind utility classes.\cb1 \
\cb3 - Use Radix UI for interactive components.\cb1 \
\cb3 - Use Framer Motion for animations.\cb1 \
\cb3 - ALWAYS test keyboard navigation before committing.\cb1 \
}